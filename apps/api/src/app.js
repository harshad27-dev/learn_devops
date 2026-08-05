import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { healthRouter } from "./routes/health.routes.js";
import { todoRouter } from "./routes/todo.routes.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestLogger);
  app.use(
    cors({
      origin: env.corsOrigin,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    }),
  );
  app.use(express.json({ limit: "20kb" }));

  app.use("/health", healthRouter);
  app.use("/api/todos", todoRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
