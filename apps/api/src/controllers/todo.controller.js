import * as todoService from "../services/todo.service.js";

export async function getTodos(_req, res) {
  const todos = await todoService.listTodos();
  res.status(200).json({ data: todos });
}

export async function postTodo(req, res) {
  const todo = await todoService.createTodo(req.body);
  res.status(201).json({ data: todo });
}

export async function patchTodo(req, res) {
  const todo = await todoService.updateTodo(req.params.id, req.body);
  res.status(200).json({ data: todo });
}

export async function removeTodo(req, res) {
  await todoService.deleteTodo(req.params.id);
  res.status(204).send();
}
