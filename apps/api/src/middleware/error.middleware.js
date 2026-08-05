import mongoose from "mongoose";
import { env } from "../config/env.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode ?? 500;
  let message = error.message ?? "Internal server error.";

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(" ");
  }

  if (error instanceof SyntaxError && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON body.";
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(env.nodeEnv === "production" ? {} : { stack: error.stack }),
    },
  });
}
