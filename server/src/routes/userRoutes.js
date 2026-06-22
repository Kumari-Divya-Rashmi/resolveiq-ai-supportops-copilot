import { Router } from "express";
import { listUsers, updateUserRole } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { listUsersSchema, updateUserRoleSchema } from "../validators/userValidators.js";

export const userRoutes = Router();

userRoutes.use(requireAuth, requireRole("admin"));

userRoutes.get("/", validateRequest(listUsersSchema), listUsers);
userRoutes.patch("/:id/role", validateRequest(updateUserRoleSchema), updateUserRole);