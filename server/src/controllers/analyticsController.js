import { Feedback } from "../models/Feedback.js";
import { KnowledgeBase } from "../models/KnowledgeBase.js";
import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function countBy(field) {
  return Ticket.aggregate([{ $group: { _id: `$${field}`, count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
}

export const overview = asyncHandler(async (_req, res) => {
  const [totalTickets, openTickets, resolvedTickets, highPriorityTickets, kbCount, aiResolved, feedbackAgg] =
    await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: { $in: ["open", "in_progress", "waiting_on_customer"] } }),
      Ticket.countDocuments({ status: { $in: ["resolved", "closed"] } }),
      Ticket.countDocuments({ priority: { $in: ["high", "urgent"] } }),
      KnowledgeBase.countDocuments(),
      Ticket.countDocuments({ status: { $in: ["resolved", "closed"] }, aiConfidence: { $gte: 0.8 } }),
      Feedback.aggregate([{ $group: { _id: null, averageRating: { $avg: "$rating" } } }])
    ]);

  const resolvedWithTimes = await Ticket.find({ resolvedAt: { $ne: null } }).select("createdAt resolvedAt").lean();
  const averageResponseTimeHours = resolvedWithTimes.length
    ? resolvedWithTimes.reduce((sum, ticket) => sum + (ticket.resolvedAt - ticket.createdAt) / 36e5, 0) /
      resolvedWithTimes.length
    : 0;

  return sendSuccess(res, {
    totalTickets,
    openTickets,
    resolvedTickets,
    highPriorityTickets,
    averageResponseTimeHours,
    aiResolved,
    humanResolved: Math.max(resolvedTickets - aiResolved, 0),
    knowledgeBaseHealthScore: Math.min(100, kbCount * 20),
    averageRating: feedbackAgg[0]?.averageRating ?? 0
  });
});

export const categoryWise = asyncHandler(async (_req, res) => {
  const [categories, sentiments, priorities, statuses] = await Promise.all([
    countBy("category"),
    Ticket.aggregate([{ $group: { _id: "$sentiment.label", count: { $sum: 1 } } }]),
    countBy("priority"),
    countBy("status")
  ]);

  return sendSuccess(res, { categories, sentiments, priorities, statuses });
});

export const agentPerformance = asyncHandler(async (_req, res) => {
  const agents = await User.find({ role: "agent" }).select("name email team").lean();
  const performance = await Promise.all(
    agents.map(async (agent) => {
      const [assigned, resolved] = await Promise.all([
        Ticket.countDocuments({ assignedAgent: agent._id }),
        Ticket.countDocuments({ assignedAgent: agent._id, status: { $in: ["resolved", "closed"] } })
      ]);

      return {
        agent,
        assigned,
        resolved,
        open: Math.max(assigned - resolved, 0)
      };
    })
  );

  return sendSuccess(res, { performance });
});
