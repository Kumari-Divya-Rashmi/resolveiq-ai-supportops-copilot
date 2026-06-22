import {
  addTicketMessage,
  assignTicket,
  createFeedback,
  createSmartTicket,
  getTicketCopilot,
  getTicketForUser,
  listTicketsForUser,
  reopenTicket,
  updateTicketStatus
} from "../services/ticketService.js";
import { mapUploadedFiles } from "../middleware/uploadMiddleware.js";
import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTickets = asyncHandler(async (req, res) => {
  const result = await listTicketsForUser(req.user, req.query);
  return sendSuccess(res, result, "Tickets fetched");
});

export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await getTicketForUser(req.params.id, req.user);
  return sendSuccess(res, { ticket }, "Ticket fetched");
});

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await createSmartTicket({
    user: req.user,
    title: req.body.title,
    description: req.body.description,
    attachments: mapUploadedFiles(req.files)
  });

  return sendCreated(res, { ticket }, "Ticket created");
});

export const patchTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await updateTicketStatus(req.params.id, req.user, req.body.status);
  return sendSuccess(res, { ticket }, "Ticket status updated");
});

export const patchTicketReopen = asyncHandler(async (req, res) => {
  const ticket = await reopenTicket(req.params.id, req.user, req.body.reason);
  return sendSuccess(res, { ticket }, "Ticket reopened");
});

export const patchTicketAssign = asyncHandler(async (req, res) => {
  const ticket = await assignTicket(req.params.id, req.body);
  return sendSuccess(res, { ticket }, "Ticket assignment updated");
});

export const postTicketMessage = asyncHandler(async (req, res) => {
  const ticket = await addTicketMessage(req.params.id, req.user, req.body.body);
  return sendCreated(res, { ticket }, "Message added");
});

export const getCopilot = asyncHandler(async (req, res) => {
  const copilot = await getTicketCopilot(req.params.id, req.user);
  return sendSuccess(res, copilot, "Copilot data fetched");
});

export const postFeedback = asyncHandler(async (req, res) => {
  const feedback = await createFeedback({
    ticketId: req.params.id,
    rating: req.body.rating,
    comment: req.body.comment,
    user: req.user
  });

  return sendCreated(res, { feedback }, "Feedback recorded");
});
