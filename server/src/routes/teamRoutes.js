import { Router } from "express";
import { listAgents, listTeams } from "../controllers/teamController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

export const teamRoutes = Router();

teamRoutes.use(requireAuth, requireRole("agent", "admin"));
teamRoutes.get("/", listTeams);
teamRoutes.get("/agents", listAgents);
