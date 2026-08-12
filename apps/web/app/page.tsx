"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100/api";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  );

  async function loadTodos() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error("Could not load todos.");
      }
      const payload = await response.json();
      setTodos(payload.data);
    } catch {
      setError("Start the API server, then refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCurrent = true;

    async function fetchInitialTodos() {
      try {
        const response = await fetch(`${API_URL}/todos`);
        if (!response.ok) {
          throw new Error("Could not load todos.");
        }

        const payload = await response.json();
        const nextTodos = payload.data;
        if (isCurrent) {
          setTodos(nextTodos);
        }
      } catch {
        if (isCurrent) {
          setError("Start the API server, then refresh the page.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialTodos();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDarkMode = savedTheme ? savedTheme === "dark" : prefersDark;

    const frameId = window.requestAnimationFrame(() => {
      setIsDarkMode(shouldUseDarkMode);
      document.documentElement.classList.toggle("dark", shouldUseDarkMode);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  function toggleTheme() {
    setIsDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }

  async function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });

      if (!response.ok) {
        throw new Error("Could not create todo.");
      }

      const payload = await response.json();
      const todo = payload.data;
      setTodos((current) => [todo, ...current]);
      setTitle("");
    } catch {
      setError("Could not add that todo. Check the API server.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleTodo(todo: Todo) {
    setTodos((current) =>
      current.map((item) =>
        item.id === todo.id ? { ...item, completed: !item.completed } : item,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error("Could not update todo.");
      }
    } catch {
      setError("Could not update that todo. Refresh to sync again.");
      setTodos((current) =>
        current.map((item) => (item.id === todo.id ? todo : item)),
      );
    }
  }

  async function deleteTodo(id: string) {
    const previousTodos = todos;
    setTodos((current) => current.filter((todo) => todo.id !== id));
    setError("");

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete todo.");
      }
    } catch {
      setError("Could not delete that todo. Refresh to sync again.");
      setTodos(previousTodos);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2] px-4 py-6 text-[#20231f] transition-colors dark:bg-[#11140f] dark:text-[#f4f7f0] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col justify-center gap-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#667085] dark:text-[#a8b3a1]">
              Full-stack demo
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">
              Todo App
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#566052] dark:text-[#c3cebc]">
              Add tasks, mark them complete, and remove the ones you no longer need.
            </p>
          </div>

          <button
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#cbd5c2] bg-white px-4 text-sm font-semibold text-[#20231f] shadow-sm transition hover:bg-[#eef2e8] dark:border-[#34402f] dark:bg-[#1b2118] dark:text-[#f4f7f0] dark:hover:bg-[#243020]"
            onClick={toggleTheme}
            type="button"
          >
            {isDarkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>

        <div className="rounded-lg border border-[#d8ded2] bg-white p-4 shadow-sm transition-colors dark:border-[#34402f] dark:bg-[#1b2118] sm:p-5">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={addTodo}>
            <label className="sr-only" htmlFor="todo-title">
              Todo title
            </label>
            <input
              id="todo-title"
              className="min-h-12 flex-1 rounded-md border border-[#cbd5c2] bg-white px-4 text-base outline-none transition placeholder:text-[#858f80] focus:border-[#2f7d57] focus:ring-4 focus:ring-[#2f7d57]/15 dark:border-[#3f4c39] dark:bg-[#11140f] dark:text-[#f4f7f0] dark:placeholder:text-[#828f7b] dark:focus:border-[#74bd91] dark:focus:ring-[#74bd91]/20"
              placeholder="Add a new todo"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              className="min-h-12 rounded-md bg-[#2f7d57] px-5 text-base font-semibold text-white transition hover:bg-[#276b4b] disabled:cursor-not-allowed disabled:bg-[#95b3a4] dark:bg-[#74bd91] dark:text-[#0e130c] dark:hover:bg-[#8bd0a5] dark:disabled:bg-[#516352]"
              disabled={isSaving || !title.trim()}
              type="submit"
            >
              {isSaving ? "Adding" : "Add todo"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between border-b border-[#e2e7dc] pb-3 text-sm text-[#566052] dark:border-[#34402f] dark:text-[#c3cebc]">
            <span>{remainingCount} remaining</span>
            <button
              className="font-semibold text-[#2f7d57] transition hover:text-[#276b4b] dark:text-[#8bd0a5] dark:hover:text-[#a6e1bb]"
              onClick={loadTodos}
            >
              Refresh
            </button>
          </div>

          {error ? (
            <p className="mt-4 rounded-md border border-[#f0c7b8] bg-[#fff3ef] px-3 py-2 text-sm text-[#9a3412] dark:border-[#7f3f2c] dark:bg-[#301b15] dark:text-[#ffb49a]">
              {error}
            </p>
          ) : null}

          <div className="mt-4 min-h-48">
            {isLoading ? (
              <p className="py-10 text-center text-sm text-[#667085] dark:text-[#a8b3a1]">
                Loading todos...
              </p>
            ) : todos.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#667085] dark:text-[#a8b3a1]">
                No todos yet. Add your first one above.
              </p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    className="flex min-h-14 items-center gap-3 rounded-md border border-[#e2e7dc] bg-[#fbfcf8] px-3 py-2 transition-colors dark:border-[#34402f] dark:bg-[#151a12]"
                    key={todo.id}
                  >
                    <input
                      aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
                      checked={todo.completed}
                      className="h-5 w-5 accent-[#2f7d57] dark:accent-[#74bd91]"
                      onChange={() => toggleTodo(todo)}
                      type="checkbox"
                    />
                    <span
                      className={`min-w-0 flex-1 text-base ${
                        todo.completed
                          ? "text-[#7d8679] line-through dark:text-[#87927f]"
                          : "text-[#20231f] dark:text-[#f4f7f0]"
                      }`}
                    >
                      {todo.title}
                    </span>
                    <button
                      className="rounded-md px-3 py-2 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff3ef] dark:text-[#ff9a86] dark:hover:bg-[#301b15]"
                      onClick={() => deleteTodo(todo.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
