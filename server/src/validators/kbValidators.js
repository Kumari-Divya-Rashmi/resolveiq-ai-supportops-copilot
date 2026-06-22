import { z } from "zod";
import { objectIdSchema } from "./commonValidators.js";

export const kbUploadSchema = z.object({
  body: z.object({
    title: z.string().trim().min(4).max(160),
    content: z.string().trim().min(10).max(20000).optional(),
    sourceType: z.enum(["manual", "faq", "policy", "runbook", "upload"]).optional().default("manual"),
    tags: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      })
  })
});

export const kbIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});
