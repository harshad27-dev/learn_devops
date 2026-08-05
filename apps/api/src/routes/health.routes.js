import { Router } from "express";
import mongoose from "mongoose";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
