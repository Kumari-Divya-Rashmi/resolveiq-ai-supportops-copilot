import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().default(5000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),

  MONGODB_URI: z.string().optional(),
  USE_MEMORY_DB: z.coerce.boolean().default(false),
  AUTO_SEED: z.coerce.boolean().default(false),

  JWT_SECRET: z.string().min(24, "JWT_SECRET must be at least 24 characters").optional(),
  JWT_EXPIRES_IN: z.string().default("7d"),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5.4-mini"),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  AI_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.74),

  UPLOAD_DIR: z.string().default("src/uploads"),

  DEMO_USER_PASSWORD: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional()
});

const parsed = envSchema.safeParse(process.env);

if (parsed.success && parsed.data.NODE_ENV === "production") {
  const missing = [];

  if (!parsed.data.MONGODB_URI) missing.push("MONGODB_URI");
  if (!parsed.data.JWT_SECRET) missing.push("JWT_SECRET");

  if (missing.length) {
    throw new Error(
      `Invalid production environment configuration: ${missing.join(", ")} required`
    );
  }
}

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  if (process.env.NODE_ENV === "test") {
    console.warn(`Environment validation warning: ${formatted}`);
  } else {
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }
}

export const env = parsed.success
  ? {
      ...parsed.data,

      USE_MEMORY_DB:
        parsed.data.USE_MEMORY_DB ||
        (!parsed.data.MONGODB_URI && parsed.data.NODE_ENV !== "production"),

      AUTO_SEED:
        parsed.data.AUTO_SEED ||
        (!parsed.data.MONGODB_URI && parsed.data.NODE_ENV !== "production"),

      JWT_SECRET:
        parsed.data.JWT_SECRET ||
        "resolveiq-local-demo-secret-change-before-production"
    }
  : {
      NODE_ENV: "test",

      PORT: 5000,
      CLIENT_ORIGIN: "http://localhost:5173",

      MONGODB_URI: undefined,
      USE_MEMORY_DB: true,
      AUTO_SEED: false,

      JWT_SECRET: "test-secret-value-with-enough-length",
      JWT_EXPIRES_IN: "7d",

      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: "gpt-5.4-mini",
      OPENAI_EMBEDDING_MODEL: "text-embedding-3-small",
      AI_CONFIDENCE_THRESHOLD: 0.74,

      UPLOAD_DIR: "src/uploads",

      DEMO_USER_PASSWORD: process.env.DEMO_USER_PASSWORD,

      SMTP_HOST: undefined,
      SMTP_PORT: undefined,
      SMTP_USER: undefined,
      SMTP_PASS: undefined,
      EMAIL_FROM: undefined
    };