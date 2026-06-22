import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { seedDatabase } from "./scripts/seed.js";

async function bootstrap() {
  await connectDatabase();
  if (env.AUTO_SEED) {
    await seedDatabase({ manageConnection: false });
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`ResolveIQ API listening on http://localhost:${env.PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${env.PORT} is already in use. Stop the old server or set PORT to another value.`);
      process.exit(1);
    }

    throw error;
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start ResolveIQ API");
  console.error(error);
  process.exit(1);
});
