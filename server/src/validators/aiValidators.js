import { z } from "zod";

export const aiTextSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(160).optional().default("Support request"),
    text: z.string().trim().min(3).max(6000)
  })
});
