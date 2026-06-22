import mongoose from "mongoose";
import { env } from "../config/env.js";
import { sendSuccess } from "../utils/apiResponse.js";

export function getHealth(_req, res) {
  return sendSuccess(res, {
    service: "ResolveIQ API",
    status: "ok",
    environment: env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
}
