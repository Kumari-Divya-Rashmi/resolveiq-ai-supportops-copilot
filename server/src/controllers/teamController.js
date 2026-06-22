import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTeams = asyncHandler(async (_req, res) => {
  const teams = await Team.find().sort({ name: 1 }).populate("agents", "name email role");
  return sendSuccess(res, { teams }, "Teams fetched");
});

export const listAgents = asyncHandler(async (_req, res) => {
  const agents = await User.find({ role: "agent" }).select("name email role team").populate("team", "name");
  return sendSuccess(res, { agents }, "Agents fetched");
});
