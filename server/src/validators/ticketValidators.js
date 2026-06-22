import { z } from "zod";
import { objectIdSchema } from "./commonValidators.js";

export const createTicketSchema = z.object({
  body: z.object({
    title: z.string().trim().min(4).max(160),
    description: z.string().trim().min(10).max(6000)
  })
});

export const ticketIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const statusSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.enum(["open", "in_progress", "waiting_on_customer", "resolved", "closed"])
  })
});

export const assignSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    assignedTeam: objectIdSchema.optional(),
    assignedAgent: objectIdSchema.optional()
  })
});

export const messageSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    body: z.string().trim().min(1).max(3000)
  })
});

export const feedbackSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).optional().default("")
  })
});
