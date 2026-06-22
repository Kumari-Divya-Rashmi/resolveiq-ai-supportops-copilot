import OpenAI from "openai";
import { env } from "../config/env.js";
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from "../models/Ticket.js";
import { sanitizeForPrompt } from "./promptGuardService.js";
import { getHeuristicSentiment, normalizeSentiment } from "./sentimentService.js";

let client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;
let openAIWarningShown = false;

function fallbackCategory(text = "") {
  const lower = text.toLowerCase();
  if (/refund|invoice|card|charge|billing|payment/.test(lower)) return "billing";
  if (/password|login|account|email|profile/.test(lower)) return "account";
  if (/bug|error|crash|broken|not working|outage/.test(lower)) return "bug";
  if (/ship|delivery|tracking|order/.test(lower)) return "shipping";
  if (/feature|request|idea/.test(lower)) return "feature_request";
  if (/api|server|technical|integration/.test(lower)) return "technical";
  return "general";
}

function fallbackPriority(text = "") {
  const lower = text.toLowerCase();
  if (/urgent|outage|blocked|cannot login|production|data loss|payment failed/.test(lower)) return "urgent";
  if (/angry|asap|immediately|critical|twice/.test(lower)) return "high";
  if (/soon|issue|problem|failed/.test(lower)) return "medium";
  return "low";
}

function extractTextFromResponse(response) {
  if (response.output_text) {
    return response.output_text;
  }

  return response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function handleOpenAIError(error) {
  if (!openAIWarningShown && env.NODE_ENV !== "test") {
    console.warn(
      `OpenAI request failed (${error.code || error.status || "unknown"}). ResolveIQ is using local demo AI fallbacks.`
    );
    openAIWarningShown = true;
  }

  if (error.status === 401 || error.code === "invalid_api_key") {
    client = null;
  }
}

function fallbackGroundedAnswer(articles) {
  const topArticle = articles[0];
  return {
    answer: topArticle
      ? `${topArticle.content.slice(0, 420)}${topArticle.content.length > 420 ? "..." : ""}`
      : "I could not find a reliable answer in the knowledge base.",
    confidence: topArticle?.score ?? 0,
    sources: topArticle ? [topArticle.title] : []
  };
}

export async function createEmbedding(input) {
  if (!client) {
    return [];
  }

  try {
    const response = await client.embeddings.create({
      model: env.OPENAI_EMBEDDING_MODEL,
      input: input.slice(0, 8000),
      encoding_format: "float"
    });

    return response.data[0].embedding;
  } catch (error) {
    handleOpenAIError(error);
    return [];
  }
}

export async function generateGroundedAnswer({ question, articles }) {
  if (!client) {
    return fallbackGroundedAnswer(articles);
  }

  const context = articles
    .map((article, index) => `Source ${index + 1}: ${article.title}\n${sanitizeForPrompt(article.content)}`)
    .join("\n\n");

  let response;
  try {
    response = await client.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You are ResolveIQ, a support assistant. Answer only from the provided knowledge base context. If the answer is not present, say that support should create a ticket. Return compact JSON with keys answer, confidence, sources."
        },
        {
          role: "user",
          content: `Knowledge base context:\n${context}\n\nCustomer question:\n${sanitizeForPrompt(question)}`
        }
      ]
    });
  } catch (error) {
    handleOpenAIError(error);
    return fallbackGroundedAnswer(articles);
  }

  const parsed = safeJsonParse(extractTextFromResponse(response), null);
  if (!parsed) {
    return {
      answer: extractTextFromResponse(response) || "I could not find a reliable answer in the knowledge base.",
      confidence: articles[0]?.score ?? 0,
      sources: articles.map((article) => article.title)
    };
  }

  return {
    answer: parsed.answer,
    confidence: Number(parsed.confidence ?? articles[0]?.score ?? 0),
    sources: Array.isArray(parsed.sources) ? parsed.sources : articles.map((article) => article.title)
  };
}

export async function analyzeTicketText({ title, description }) {
  const combined = `${title}\n\n${description}`;
  const fallback = {
    category: fallbackCategory(combined),
    priority: fallbackPriority(combined),
    sentiment: getHeuristicSentiment(combined),
    urgencyScore: fallbackPriority(combined) === "urgent" ? 0.92 : fallbackPriority(combined) === "high" ? 0.78 : 0.45,
    summary: description.length > 180 ? `${description.slice(0, 177)}...` : description,
    suggestedReply:
      "Thanks for sharing the details. I am reviewing this with the right team and will update you with the next step shortly.",
    confidence: 0.65
  };

  if (!client) {
    return fallback;
  }

  let response;
  try {
    response = await client.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: `Analyze a support ticket. Return only JSON with category, priority, sentiment {label, score}, urgencyScore, summary, suggestedReply, confidence. Categories: ${TICKET_CATEGORIES.join(", ")}. Priorities: ${TICKET_PRIORITIES.join(", ")}.`
        },
        {
          role: "user",
          content: sanitizeForPrompt(combined)
        }
      ]
    });
  } catch (error) {
    handleOpenAIError(error);
    return fallback;
  }

  const parsed = safeJsonParse(extractTextFromResponse(response), fallback);
  return {
    ...fallback,
    ...parsed,
    category: TICKET_CATEGORIES.includes(parsed.category) ? parsed.category : fallback.category,
    priority: TICKET_PRIORITIES.includes(parsed.priority) ? parsed.priority : fallback.priority,
    sentiment: normalizeSentiment(parsed.sentiment),
    confidence: Number(parsed.confidence ?? fallback.confidence)
  };
}
