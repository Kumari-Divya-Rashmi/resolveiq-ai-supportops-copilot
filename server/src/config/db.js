import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let memoryServer;

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  if (env.USE_MEMORY_DB) {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "resolveiq-demo"
      }
    });
  }

  const uri = env.USE_MEMORY_DB ? memoryServer.getUri() : env.MONGODB_URI;

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}${env.USE_MEMORY_DB ? " (local memory demo)" : ""}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
