import { answerFromKnowledgeBase } from "../services/ragService.js";
import { createSmartTicket } from "../services/ticketService.js";
import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const askChat = asyncHandler(async (req, res) => {
  const result = await answerFromKnowledgeBase(req.body.message);
  return sendSuccess(res, result, result.shouldCreateTicket ? "Ticket recommended" : "Answer generated");
});

export const createTicketFromChat = asyncHandler(async (req, res) => {
  const ticket = await createSmartTicket({
    user: req.user,
    title: req.body.title || req.body.message.slice(0, 100),
    description: req.body.message
  });

  return sendCreated(res, { ticket }, "Ticket created from chat");
});
