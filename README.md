# Todo App Monorepo

This repository is an npm workspaces monorepo with a Next.js frontend and an Express/MongoDB backend API.

## Apps

- `apps/web` - Next.js frontend
- `apps/api` - Express API using MongoDB through Mongoose

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create local env files from the examples:

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

Start MongoDB locally with Docker:

```bash
docker compose up -d mongo
```

Then start both apps:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4100
- MongoDB: mongodb://127.0.0.1:27017/todo_app

## Commands

```bash
npm run dev
npm run dev:web
npm run dev:api
npm run build
npm run lint
npm run start
```

## API Structure

```text
apps/api/src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
```

## API Routes

- `GET /health`
- `GET /api/todos`
- `POST /api/todos`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`

Todos are persisted in MongoDB.
