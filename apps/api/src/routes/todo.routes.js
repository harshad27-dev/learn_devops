import { Router } from "express";
import {
  getTodos,
  patchTodo,
  postTodo,
  removeTodo,
} from "../controllers/todo.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const todoRouter = Router();

todoRouter.get("/", asyncHandler(getTodos));
todoRouter.post("/", asyncHandler(postTodo));
todoRouter.patch("/:id", asyncHandler(patchTodo));
todoRouter.delete("/:id", asyncHandler(removeTodo));
