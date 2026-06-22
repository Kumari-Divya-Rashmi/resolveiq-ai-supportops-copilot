import { env } from "../config/env.js";
import { KnowledgeBase } from "../models/KnowledgeBase.js";
import { Ticket } from "../models/Ticket.js";
import { cosineSimilarity } from "../utils/vector.js";
import { createEmbedding, generateGroundedAnswer } from "./aiService.js";
import { detectSupportIntent } from "./intentService.js";
import { detectPromptInjection } from "./promptGuardService.js";

function keywordScore(query, article) {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2);
  const haystack = `${article.title} ${article.content} ${(article.tags ?? []).join(" ")}`.toLowerCase();
  const hits = terms.filter((term) => haystack.includes(term)).length;
  return terms.length ? hits / terms.length : 0;
}

export async function searchKnowledgeBase(query, limit = 4) {
  const articles = await KnowledgeBase.find().lean();
  const queryEmbedding = await createEmbedding(query);

  const scored = articles
    .map((article) => {
      const vectorScore =
        queryEmbedding.length && article.embedding?.length
          ? cosineSimilarity(queryEmbedding, article.embedding)
          : 0;
      const score = Math.max(vectorScore, keywordScore(query, article));
      return { ...article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

export async function answerFromKnowledgeBase(question) {
  const intent = detectSupportIntent(question);

  if (detectPromptInjection(question)) {
    return {
      intent,
      answer:
        "I can help with support questions, but I cannot follow instructions that try to bypass support safety rules.",
      confidence: 0,
      shouldCreateTicket: true,
      sources: [],
      matches: []
    };
  }

  const matches = await searchKnowledgeBase(question);
  const answer = await generateGroundedAnswer({ question, articles: matches });
  const confidence = Math.min(1, Math.max(answer.confidence, matches[0]?.score ?? 0));

  return {
    intent,
    ...answer,
    confidence,
    shouldCreateTicket: intent.intent === "create_ticket" || confidence < env.AI_CONFIDENCE_THRESHOLD,
    matches: matches.map((match) => ({
      id: match._id,
      title: match.title,
      score: match.score
    }))
  };
}

export async function findSimilarTickets(text, limit = 5) {
  const tickets = await Ticket.find({ embedding: { $exists: true, $ne: [] } })
    .select("title description status category priority aiSummary embedding")
    .lean();
  const queryEmbedding = await createEmbedding(text);

  if (!queryEmbedding.length) {
    return Ticket.find({
      $text: { $search: text }
    })
      .limit(limit)
      .select("title status category priority aiSummary")
      .lean()
      .catch(() => []);
  }

  return tickets
    .map((ticket) => ({
      ...ticket,
      score: cosineSimilarity(queryEmbedding, ticket.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function refreshKnowledgeBaseEmbeddings() {
  const articles = await KnowledgeBase.find();

  for (const article of articles) {
    if (!article.embedding.length) {
      article.embedding = await createEmbedding(`${article.title}\n${article.content}`);
      await article.save();
    }
  }
}
