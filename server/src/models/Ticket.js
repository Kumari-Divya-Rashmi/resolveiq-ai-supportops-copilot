import mongoose from "mongoose";

export const TICKET_STATUSES = ["open", "in_progress", "waiting_on_customer", "resolved", "closed"];
export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"];
export const TICKET_CATEGORIES = [
  "billing",
  "technical",
  "account",
  "shipping",
  "bug",
  "feature_request",
  "general"
];

const messageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    role: {
      type: String,
      enum: ["user", "agent", "system", "ai"],
      required: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    path: String,
    mimeType: String,
    size: Number
  },
  { _id: true }
);

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: TICKET_CATEGORIES,
      default: "general",
      index: true
    },
    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      default: "medium",
      index: true
    },
    sentiment: {
      label: {
        type: String,
        enum: ["negative", "neutral", "positive"],
        default: "neutral"
      },
      score: {
        type: Number,
        min: -1,
        max: 1,
        default: 0
      }
    },
    urgencyScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.4
    },
    slaRisk: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: "open",
      index: true
    },
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    aiSummary: {
      type: String,
      default: ""
    },
    aiSuggestedReply: {
      type: String,
      default: ""
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    embedding: {
      type: [Number],
      default: []
    },
    messages: [messageSchema],
    attachments: [attachmentSchema],
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ status: 1, category: 1, priority: 1 });
ticketSchema.index({ title: "text", description: "text", aiSummary: "text" });

export const Ticket = mongoose.model("Ticket", ticketSchema);
