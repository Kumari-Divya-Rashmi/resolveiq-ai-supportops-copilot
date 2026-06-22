import { Feedback } from "../models/Feedback.js";
import { Ticket } from "../models/Ticket.js";
import { AppError } from "../utils/AppError.js";
import { analyzeTicketText, createEmbedding } from "./aiService.js";
import {
  notifyTicketCreated,
  notifyTicketReopened,
  notifyTicketStatusChanged
} from "./emailService.js";
import { findSimilarTickets } from "./ragService.js";
import { calculateSlaRisk, routeTicket } from "./ticketRoutingService.js";

const priorityWeight = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4
};

const prioritySlaHours = {
  low: 72,
  medium: 48,
  high: 24,
  urgent: 6
};

function getSlaDueDate(priority) {
  const hours = prioritySlaHours[priority] || 48;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function shouldUpgradePriority(ticket) {
  if (["resolved", "closed"].includes(ticket.status)) return false;
  if (!ticket.slaDueAt) return false;
  if (ticket.priority === "urgent") return false;

  const now = new Date();
  const remainingMs = ticket.slaDueAt.getTime() - now.getTime();
  const remainingHours = remainingMs / 36e5;

  return remainingHours <= 3 || ticket.slaRisk === "high";
}

function getNextPriority(priority) {
  if (priority === "low") return "medium";
  if (priority === "medium") return "high";
  if (priority === "high") return "urgent";
  return "urgent";
}

async function applyPriorityAutoUpgrade(ticket) {
  if (!shouldUpgradePriority(ticket)) return false;

  const oldPriority = ticket.priority;
  const newPriority = getNextPriority(ticket.priority);

  if (priorityWeight[newPriority] > priorityWeight[oldPriority]) {
    ticket.priority = newPriority;

    ticket.messages.push({
      role: "system",
      author: null,
      body: `Priority auto-upgraded from ${oldPriority} to ${newPriority} due to SLA risk.`
    });

    return true;
  }

  return false;
}

export function canAccessTicket(user, ticket) {
  if (user.role === "admin") return true;

  if (ticket.userId?.toString() === user._id.toString()) return true;

  if (ticket.assignedAgent?.toString() === user._id.toString()) return true;

  if (user.role === "agent" && ticket.assignedTeam?.toString() === user.team?.toString()) {
    return true;
  }

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
    slaDueAt: getSlaDueDate(analysis.priority),

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

  const upgraded = await applyPriorityAutoUpgrade(ticket);

  if (upgraded) {
    await ticket.save();
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

  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.priority) query.priority = filters.priority;
  if (filters.slaRisk) query.slaRisk = filters.slaRisk;
  if (filters.sentiment) query["sentiment.label"] = filters.sentiment;
  if (filters.assignedAgent && user.role === "admin") query.assignedAgent = filters.assignedAgent;

  if (filters.q) {
    query.$text = { $search: filters.q };
  }

  const sortBy = filters.sortBy || "updatedAt";
  const sortOrder = filters.sortOrder === "asc" ? 1 : -1;

  const sort = filters.q
    ? { score: { $meta: "textScore" }, [sortBy]: sortOrder }
    : { [sortBy]: sortOrder };

  const findQuery = Ticket.find(query);

  if (filters.q) {
    findQuery.select({ score: { $meta: "textScore" } });
  }

  const [tickets, total] = await Promise.all([
    findQuery
      .sort(sort)
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

  if (ticket.status === "closed" && status !== "open") {
    throw new AppError("Closed tickets must be reopened before status can be changed", 400);
  }

  ticket.status = status;

  if (status === "in_progress" && !ticket.firstResponseAt && user.role !== "user") {
    ticket.firstResponseAt = new Date();
  }

  if (["resolved", "closed"].includes(status)) {
    ticket.resolvedAt = new Date();
  }

  if (status === "open") {
    ticket.resolvedAt = null;
    ticket.slaDueAt = getSlaDueDate(ticket.priority);
  }

  ticket.messages.push({
    role: "system",
    author: user._id,
    body: `Status changed to ${status.replaceAll("_", " ")}`
  });

  await applyPriorityAutoUpgrade(ticket);
  await ticket.save();

  await notifyTicketStatusChanged(ticket);

  return getTicketForUser(ticket._id, user);
}

export async function reopenTicket(ticketId, user, reason = "") {
  const ticket = await getTicketForUser(ticketId, user);

  if (!["resolved", "closed"].includes(ticket.status)) {
    throw new AppError("Only resolved or closed tickets can be reopened", 400);
  }

  ticket.status = "open";
  ticket.resolvedAt = null;
  ticket.slaDueAt = getSlaDueDate(ticket.priority);
  ticket.reopenedCount += 1;

  ticket.messages.push({
    role: "system",
    author: user._id,
    body: reason
      ? `Ticket reopened. Reason: ${reason}`
      : "Ticket reopened by user."
  });

  await applyPriorityAutoUpgrade(ticket);
  await ticket.save();

  await notifyTicketReopened(ticket);

  return getTicketForUser(ticket._id, user);
}

export async function assignTicket(ticketId, { assignedTeam, assignedAgent }) {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new AppError("Ticket not found", 404);
  }

  ticket.assignedTeam = assignedTeam || ticket.assignedTeam;
  ticket.assignedAgent = assignedAgent || ticket.assignedAgent;

  ticket.messages.push({
    role: "system",
    author: null,
    body: "Ticket assignment updated."
  });

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

  if (!ticket.firstResponseAt && user.role !== "user") {
    ticket.firstResponseAt = new Date();
  }

  await applyPriorityAutoUpgrade(ticket);
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
    slaDueAt: ticket.slaDueAt,
    firstResponseAt: ticket.firstResponseAt,
    reopenedCount: ticket.reopenedCount,
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
