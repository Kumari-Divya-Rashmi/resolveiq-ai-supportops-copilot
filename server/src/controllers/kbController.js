import fs from "node:fs/promises";
import { KnowledgeBase } from "../models/KnowledgeBase.js";
import { createEmbedding } from "../services/aiService.js";
import { AppError } from "../utils/AppError.js";
import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function readUploadedText(file) {
  if (!file) return "";
  if (!file.mimetype.startsWith("text/") && file.mimetype !== "application/json") {
    return "";
  }
  return fs.readFile(file.path, "utf8");
}

export const uploadKnowledgeBase = asyncHandler(async (req, res) => {
  const fileContent = await readUploadedText(req.file);
  const content = req.body.content || fileContent;

  if (!content) {
    throw new AppError("Knowledge base content is required", 400);
  }

  const article = await KnowledgeBase.create({
    title: req.body.title,
    content,
    sourceType: req.body.sourceType,
    tags: req.body.tags,
    uploadedBy: req.user._id,
    embedding: await createEmbedding(`${req.body.title}\n${content}`)
  });

  return sendCreated(res, { article }, "Knowledge base article uploaded");
});

export const listKnowledgeBase = asyncHandler(async (_req, res) => {
  const articles = await KnowledgeBase.find()
    .sort({ updatedAt: -1 })
    .populate("uploadedBy", "name email role");

  return sendSuccess(res, { articles }, "Knowledge base fetched");
});

export const deleteKnowledgeBase = asyncHandler(async (req, res) => {
  const article = await KnowledgeBase.findByIdAndDelete(req.params.id);
  if (!article) {
    throw new AppError("Knowledge base article not found", 404);
  }

  return sendSuccess(res, { id: req.params.id }, "Knowledge base article deleted");
});
