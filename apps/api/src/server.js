import { createServer } from "node:http";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = createServer(app);

  server.listen(env.port, () => {
    console.log(`Todo API running on http://localhost:${env.port}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
