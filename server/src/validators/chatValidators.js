import { z } from "zod";

export const askSchema = z.object({
  body: z.object({
    message: z.string().trim().min(3).max(4000)
  })
});

export const chatTicketSchema = z.object({
  body: z.object({
    message: z.string().trim().min(10).max(6000),
    title: z.string().trim().min(4).max(160).optional()
  })
});
