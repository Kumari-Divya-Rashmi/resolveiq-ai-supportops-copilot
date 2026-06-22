import { ZodError } from "zod";
import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || (error.name === "CastError" ? 404 : 500);
  const validationDetails =
    error instanceof ZodError
      ? error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      : error.details;

  const payload = {
    message: error instanceof ZodError ? "Validation failed" : error.message || "Server error",
    details: validationDetails || undefined
  };

  if (env.NODE_ENV !== "production") {
    payload.stack = error.stack;
  }

  return sendError(res, payload, error instanceof ZodError ? 400 : statusCode);
}
