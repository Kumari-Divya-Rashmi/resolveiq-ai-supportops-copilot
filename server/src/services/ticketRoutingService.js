import { Team } from "../models/Team.js";

export function calculateSlaRisk(priority, urgencyScore = 0.4, sentimentScore = 0) {
  if (priority === "urgent" || urgencyScore >= 0.85 || sentimentScore <= -0.75) {
    return "high";
  }

  if (priority === "high" || urgencyScore >= 0.6 || sentimentScore <= -0.45) {
    return "medium";
  }

  return "low";
}

export async function routeTicket(category) {
  const team = await Team.findOne({ categoriesHandled: category }).populate("agents", "name email role team");
  if (!team) {
    return { assignedTeam: null, assignedAgent: null };
  }

  return {
    assignedTeam: team._id,
    assignedAgent: team.agents?.[0]?._id ?? null
  };
}
