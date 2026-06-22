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

export const listTicketQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),

    q: z.string().trim().max(120).optional(),

    status: z
      .enum(["open", "in_progress", "waiting_on_customer", "resolved", "closed"])
      .optional(),

    category: z
      .enum(["billing", "technical", "account", "shipping", "bug", "feature_request", "general"])
      .optional(),

    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

    slaRisk: z.enum(["low", "medium", "high"]).optional(),

    sentiment: z.enum(["negative", "neutral", "positive"]).optional(),

    assignedAgent: objectIdSchema.optional(),

    sortBy: z
      .enum(["updatedAt", "createdAt", "priority", "slaDueAt", "urgencyScore"])
      .optional(),

    sortOrder: z.enum(["asc", "desc"]).optional()
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

export const reopenSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    reason: z.string().trim().min(5).max(1000).optional()
  })
});