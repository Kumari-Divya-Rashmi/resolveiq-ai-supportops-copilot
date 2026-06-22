import { Router } from "express";
import {
  createTicket,
  getCopilot,
  getTicket,
  listTickets,
  patchTicketAssign,
  patchTicketReopen,
  patchTicketStatus,
  postFeedback,
  postTicketMessage
} from "../controllers/ticketController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  assignSchema,
  createTicketSchema,
  feedbackSchema,
  listTicketQuerySchema,
  messageSchema,
  reopenSchema,
  statusSchema,
  ticketIdParamSchema
} from "../validators/ticketValidators.js";

export const ticketRoutes = Router();

ticketRoutes.use(requireAuth);

ticketRoutes.get("/", validateRequest(listTicketQuerySchema), listTickets);

ticketRoutes.post(
  "/",
  upload.array("attachments", 3),
  validateRequest(createTicketSchema),
  createTicket
);

ticketRoutes.get("/:id", validateRequest(ticketIdParamSchema), getTicket);

ticketRoutes.get(
  "/:id/copilot",
  validateRequest(ticketIdParamSchema),
  requireRole("agent", "admin"),
  getCopilot
);

ticketRoutes.post("/:id/messages", validateRequest(messageSchema), postTicketMessage);

ticketRoutes.post("/:id/feedback", validateRequest(feedbackSchema), postFeedback);

ticketRoutes.patch("/:id/status", validateRequest(statusSchema), patchTicketStatus);

ticketRoutes.patch("/:id/reopen", validateRequest(reopenSchema), patchTicketReopen);

ticketRoutes.patch(
  "/:id/assign",
  requireRole("admin"),
  validateRequest(assignSchema),
  patchTicketAssign
);