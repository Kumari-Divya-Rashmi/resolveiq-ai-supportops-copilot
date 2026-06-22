import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post("/register", authLimiter, validateRequest(registerSchema), register);
authRoutes.post("/login", authLimiter, validateRequest(loginSchema), login);
authRoutes.get("/me", requireAuth, me);
