import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    sourceType: {
      type: String,
      enum: ["manual", "faq", "policy", "runbook", "upload"],
      default: "manual"
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    embedding: {
      type: [Number],
      default: []
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

knowledgeBaseSchema.index({ title: "text", content: "text", tags: "text" });

export const KnowledgeBase = mongoose.model("KnowledgeBase", knowledgeBaseSchema);
