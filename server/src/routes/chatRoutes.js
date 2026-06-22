import { Router } from "express";
import { askChat, createTicketFromChat } from "../controllers/chatController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { chatLimiter } from "../middleware/rateLimiters.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { askSchema, chatTicketSchema } from "../validators/chatValidators.js";

export const chatRoutes = Router();

chatRoutes.post("/ask", requireAuth, chatLimiter, validateRequest(askSchema), askChat);
chatRoutes.post("/create-ticket", requireAuth, validateRequest(chatTicketSchema), createTicketFromChat);
