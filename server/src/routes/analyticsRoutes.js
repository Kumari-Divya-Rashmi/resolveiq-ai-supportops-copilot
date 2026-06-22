import { Router } from "express";
import { agentPerformance, categoryWise, overview } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

export const analyticsRoutes = Router();

analyticsRoutes.use(requireAuth, requireRole("admin"));
analyticsRoutes.get("/overview", overview);
analyticsRoutes.get("/category-wise", categoryWise);
analyticsRoutes.get("/agent-performance", agentPerformance);
