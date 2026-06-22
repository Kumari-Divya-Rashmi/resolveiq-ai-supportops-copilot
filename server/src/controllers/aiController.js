import { analyzeTicketText } from "../services/aiService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const classifyTicket = asyncHandler(async (req, res) => {
  const analysis = await analyzeTicketText({
    title: req.body.title,
    description: req.body.text
  });
  return sendSuccess(res, {
    category: analysis.category,
    priority: analysis.priority,
    confidence: analysis.confidence
  });
});

export const summarizeTicket = asyncHandler(async (req, res) => {
  const analysis = await analyzeTicketText({
    title: req.body.title,
    description: req.body.text
  });
  return sendSuccess(res, { summary: analysis.summary });
});

export const suggestReply = asyncHandler(async (req, res) => {
  const analysis = await analyzeTicketText({
    title: req.body.title,
    description: req.body.text
  });
  return sendSuccess(res, { suggestedReply: analysis.suggestedReply });
});

export const sentimentScore = asyncHandler(async (req, res) => {
  const analysis = await analyzeTicketText({
    title: req.body.title,
    description: req.body.text
  });
  return sendSuccess(res, { sentiment: analysis.sentiment, urgencyScore: analysis.urgencyScore });
});
