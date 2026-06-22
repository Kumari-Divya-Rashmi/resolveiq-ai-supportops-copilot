import { Feedback } from "../models/Feedback.js";
import { Ticket } from "../models/Ticket.js";
import { AppError } from "../utils/AppError.js";
import { analyzeTicketText, createEmbedding } from "./aiService.js";
import { notifyTicketCreated, notifyTicketStatusChanged } from "./emailService.js";
import { findSimilarTickets } from "./ragService.js";
import { calculateSlaRisk, routeTicket } from "./ticketRoutingService.js";

export function canAccessTicket(user, ticket) {
  if (user.role === "admin") return true;
  if (ticket.userId?.toString() === user._id.toString()) return true;
  if (ticket.assignedAgent?.toString() === user._id.toString()) return true;
  if (user.role === "agent" && ticket.assignedTeam?.toString() === user.team?.toString()) return true;
  return false;
}

export async function createSmartTicket({ user, title, description, attachments = [] }) {
  const analysis = await analyzeTicketText({ title, description });
  const routing = await routeTicket(analysis.category);
  const slaRisk = calculateSlaRisk(
    analysis.priority,
    Number(analysis.urgencyScore ?? 0.4),
    Number(analysis.sentiment?.score ?? 0)
  );
  const embedding = await createEmbedding(`${title}\n${description}`);

  const ticket = await Ticket.create({
    userId: user._id,
    title,
    description,
    category: analysis.category,
    priority: analysis.priority,
    sentiment: analysis.sentiment,
    urgencyScore: Number(analysis.urgencyScore ?? 0.4),
    slaRisk,
    assignedTeam: routing.assignedTeam,
    assignedAgent: routing.assignedAgent,
    aiSummary: analysis.summary,
    aiSuggestedReply: analysis.suggestedReply,
    aiConfidence: analysis.confidence,
    embedding,
    attachments,
    messages: [
      {
        role: "user",
        author: user._id,
        body: description
      }
    ]
  });

  await notifyTicketCreated(ticket);

  return Ticket.findById(ticket._id)
    .populate("userId", "name email")
    .populate("assignedTeam", "name")
    .populate("assignedAgent", "name email");
}

export async function getTicketForUser(ticketId, user) {
  const ticket = await Ticket.findById(ticketId)
    .populate("userId", "name email")
    .populate("assignedTeam", "name categoriesHandled")
    .populate("assignedAgent", "name email")
    .populate("messages.author", "name email role");

  if (!ticket) {
    throw new AppError("Ticket not found", 404);
  }

  if (!canAccessTicket(user, ticket)) {
    throw new AppError("You do not have permission to access this ticket", 403);
  }

  return ticket;
}

export async function listTicketsForUser(user, filters = {}) {
  const query = {};
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 25, 1), 100);
  const skip = (page - 1) * limit;

  if (user.role === "user") {
    query.userId = user._id;
  } else if (user.role === "agent") {
    query.$or = [{ assignedAgent: user._id }];
    if (user.team) {
      query.$or.push({ assignedTeam: user.team });
    }
  }

  for (const field of ["status", "category", "priority"]) {
    if (filters[field]) query[field] = filters[field];
  }

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .populate("assignedTeam", "name")
      .populate("assignedAgent", "name email"),
    Ticket.countDocuments(query)
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1)
    }
  };
}

export async function updateTicketStatus(ticketId, user, status) {
  const ticket = await getTicketForUser(ticketId, user);
  ticket.status = status;
  if (["resolved", "closed"].includes(status)) {
    ticket.resolvedAt = new Date();
  }
  ticket.messages.push({
    role: "system",
    author: user._id,
    body: `Status changed to ${status.replaceAll("_", " ")}`
  });

  await ticket.save();
  await notifyTicketStatusChanged(ticket);
  return getTicketForUser(ticket._id, user);
}

export async function assignTicket(ticketId, { assignedTeam, assignedAgent }) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new AppError("Ticket not found", 404);
  }

  ticket.assignedTeam = assignedTeam || ticket.assignedTeam;
  ticket.assignedAgent = assignedAgent || ticket.assignedAgent;
  await ticket.save();

  return Ticket.findById(ticket._id)
    .populate("userId", "name email")
    .populate("assignedTeam", "name")
    .populate("assignedAgent", "name email");
}

export async function addTicketMessage(ticketId, user, body) {
  const ticket = await getTicketForUser(ticketId, user);
  ticket.messages.push({
    role: user.role === "user" ? "user" : "agent",
    author: user._id,
    body
  });
  await ticket.save();
  return getTicketForUser(ticket._id, user);
}

export async function getTicketCopilot(ticketId, user) {
  const ticket = await getTicketForUser(ticketId, user);
  const similarTickets = await findSimilarTickets(`${ticket.title}\n${ticket.description}`);

  return {
    summary: ticket.aiSummary,
    suggestedReply: ticket.aiSuggestedReply,
    priority: ticket.priority,
    sentiment: ticket.sentiment,
    slaRisk: ticket.slaRisk,
    similarTickets
  };
}

export async function createFeedback({ ticketId, rating, comment, user }) {
  const ticket = await getTicketForUser(ticketId, user);
  const feedback = await Feedback.create({
    ticketId: ticket._id,
    rating,
    comment
  });

  return feedback;
}
