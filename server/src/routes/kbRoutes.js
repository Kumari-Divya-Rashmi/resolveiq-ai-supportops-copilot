import { Router } from "express";
import { deleteKnowledgeBase, listKnowledgeBase, uploadKnowledgeBase } from "../controllers/kbController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { kbIdSchema, kbUploadSchema } from "../validators/kbValidators.js";

export const kbRoutes = Router();

kbRoutes.use(requireAuth);
kbRoutes.get("/", requireRole("agent", "admin"), listKnowledgeBase);
kbRoutes.post("/upload", requireRole("admin"), upload.single("file"), validateRequest(kbUploadSchema), uploadKnowledgeBase);
kbRoutes.delete("/:id", requireRole("admin"), validateRequest(kbIdSchema), deleteKnowledgeBase);
