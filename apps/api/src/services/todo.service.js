import mongoose from "mongoose";
import { Todo } from "../models/todo.model.js";

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid todo id.");
    error.statusCode = 400;
    throw error;
  }
}

function notFoundError() {
  const error = new Error("Todo not found.");
  error.statusCode = 404;
  return error;
}

export async function listTodos() {
  return Todo.find().sort({ createdAt: -1 });
}

export async function createTodo(input) {
  const title = String(input.title ?? "").trim();

  if (!title) {
    const error = new Error("Todo title is required.");
    error.statusCode = 400;
    throw error;
  }

  return Todo.create({ title });
}

export async function updateTodo(id, input) {
  assertValidObjectId(id);

  const updates = {};

  if (Object.hasOwn(input, "title")) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      const error = new Error("Todo title cannot be empty.");
      error.statusCode = 400;
      throw error;
    }
    updates.title = title;
  }

  if (Object.hasOwn(input, "completed")) {
    if (typeof input.completed !== "boolean") {
      const error = new Error("Completed must be a boolean.");
      error.statusCode = 400;
      throw error;
    }
    updates.completed = input.completed;
  }

  const todo = await Todo.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!todo) {
    throw notFoundError();
  }

  return todo;
}

export async function deleteTodo(id) {
  assertValidObjectId(id);

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    throw notFoundError();
  }

  return todo;
}
