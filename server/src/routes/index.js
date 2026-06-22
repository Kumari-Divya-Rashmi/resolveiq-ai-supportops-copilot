import { Router } from "express";
import { aiRoutes } from "./aiRoutes.js";
import { analyticsRoutes } from "./analyticsRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { chatRoutes } from "./chatRoutes.js";
import { healthRoutes } from "./healthRoutes.js";
import { kbRoutes } from "./kbRoutes.js";
import { teamRoutes } from "./teamRoutes.js";
import { ticketRoutes } from "./ticketRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/chat", chatRoutes);
apiRoutes.use("/tickets", ticketRoutes);
apiRoutes.use("/ai", aiRoutes);
apiRoutes.use("/kb", kbRoutes);
apiRoutes.use("/analytics", analyticsRoutes);
apiRoutes.use("/teams", teamRoutes);
