# ToDo App

A modernized full-stack ToDo application — **React 19 + Vite + TypeScript** on the frontend, **Express + TypeScript** on the backend, with **Supabase (PostgreSQL)** as the database and JWT-based authentication.

## Features

- Email/password authentication (register, login, logout, refresh, change password) with JWTs stored in an httpOnly cookie
- Full CRUD for todos, scoped per authenticated user
- Input validation with Zod on both client and server
- Rate limiting, Helmet security headers, and CORS configured for cookie-based auth
- React Query for data fetching/caching, Zustand for client state, React Hook Form for forms
- UI built with Tailwind CSS and Radix UI primitives

## Tech Stack

**Client**
- React 19, TypeScript, Vite
- React Router, TanStack Query, Zustand
- React Hook Form + Zod
- Tailwind CSS, Radix UI, lucide-react

**Server**
- Express + TypeScript (ESM), tsx for dev
- Supabase JS client (service-role key) against PostgreSQL
- JWT auth (jsonwebtoken), bcryptjs for password hashing
- Zod validation, Helmet, express-rate-limit, cors, cookie-parser

## Project Structure

```
todoapp/
├── client/                # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── pages/         # Login, Signup, Todo list, New todo, Profile, 404
│       ├── router/
│       ├── schemas/       # Zod schemas
│       ├── stores/        # Zustand stores
│       └── types/
├── server/                # Express + TypeScript backend
│   ├── db/
│   │   └── schema.sql     # Supabase/PostgreSQL schema (users, tasks)
│   └── src/
│       ├── config/        # env + Supabase client
│       ├── controllers/
│       ├── middleware/    # auth, validation, rate limiting, error handling
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validators/
├── package.json            # root workspace scripts
└── README.md
```

## Prerequisites

- Node.js >= 20
- A [Supabase](https://supabase.com) project (URL + service role key)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/basseladel136/todoapp.git
cd todoapp
```

### 2. Install dependencies

```bash
npm run install:all
```

This installs dependencies for both `server` and `client`.

### 3. Set up the database

Open the Supabase SQL Editor for your project and run the contents of `server/db/schema.sql`. This creates the `users` and `tasks` tables, indexes, and row-level security policies.

> **Note:** This app does not use Supabase Auth. It manages its own `users` table with bcrypt-hashed passwords and issues its own JWTs. The backend connects with the Supabase **service role** key, which bypasses RLS; per-user access control is enforced in the API layer.

### 4. Configure environment variables

**Server** — copy `server/.env.example` to `server/.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

JWT_SECRET=your-long-random-secret   # e.g. `openssl rand -base64 48`
JWT_EXPIRES_IN=7d
COOKIE_NAME=todo_token
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=/api/v1
VITE_DEV_PROXY_TARGET=http://localhost:5000
```

### 5. Run in development

In two terminals (or use the root scripts):

```bash
npm run dev:server   # starts the API on PORT (default 5000)
npm run dev:client   # starts the Vite dev server on http://localhost:5173
```

The client dev server proxies `/api` requests to the backend, so `VITE_DEV_PROXY_TARGET` must match the server's `PORT`.

## Available Scripts (root)

| Script | Description |
| --- | --- |
| `npm run install:all` | Install dependencies for both `server` and `client` |
| `npm run dev:server` | Run the backend in watch mode |
| `npm run dev:client` | Run the frontend dev server |
| `npm run build` | Build both server and client for production |
| `npm run typecheck` | Type-check both server and client |
| `npm run lint` | Lint both server and client |

## API Overview

All routes are prefixed with `/api/v1`.

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Health check | No |
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in | No |
| POST | `/auth/logout` | Log out | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/refresh` | Refresh JWT | Yes |
| PATCH | `/auth/change-password` | Change password | Yes |
| GET | `/todos` | List current user's todos | Yes |
| POST | `/todos` | Create a todo | Yes |
| GET | `/todos/:id` | Get a single todo | Yes |
| PUT/PATCH | `/todos/:id` | Update a todo | Yes |
| DELETE | `/todos/:id` | Delete a todo | Yes |

Authentication is handled via an httpOnly JWT cookie set on login/register; the frontend sends credentials automatically via Axios/`fetch` with `credentials: "include"`.

## Building for Production

```bash
npm run build
```

This builds the server (`server/dist`) and the client (`client/dist`). Serve the built client as static files and run the server with:

```bash
npm --prefix server run start
```



