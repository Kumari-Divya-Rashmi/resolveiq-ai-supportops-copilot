import { Router } from "express";
import { classifyTicket, sentimentScore, summarizeTicket, suggestReply } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { aiTextSchema } from "../validators/aiValidators.js";

export const aiRoutes = Router();

aiRoutes.use(requireAuth, requireRole("agent", "admin"));
aiRoutes.post("/classify-ticket", validateRequest(aiTextSchema), classifyTicket);
aiRoutes.post("/summarize-ticket", validateRequest(aiTextSchema), summarizeTicket);
aiRoutes.post("/suggest-reply", validateRequest(aiTextSchema), suggestReply);
aiRoutes.post("/sentiment-score", validateRequest(aiTextSchema), sentimentScore);
