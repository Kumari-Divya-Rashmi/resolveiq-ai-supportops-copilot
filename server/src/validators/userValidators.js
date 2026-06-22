import { z } from "zod";
import { objectIdSchema } from "./commonValidators.js";

export const listUsersSchema = z.object({
  query: z.object({
    q: z.string().trim().max(100).optional(),
    role: z.enum(["user", "agent", "admin"]).optional()
  })
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    role: z.enum(["user", "agent", "admin"]),
    team: objectIdSchema.nullable().optional()
  })
});