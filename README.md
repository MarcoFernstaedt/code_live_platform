# CodeLive — Real-Time Collaborative Coding Platform

A full-stack web application for live technical interview practice. Pair up with another developer, solve LeetCode-style problems side-by-side in a shared code editor, and communicate over live video and chat — all in the browser.

---

## Features

- **Live Video & Chat** — Stream-powered video calls and real-time messaging during sessions
- **Collaborative Code Editor** — Monaco Editor (the engine behind VS Code) with syntax highlighting for JavaScript, Python, and Java
- **In-Browser Code Execution** — Run code instantly via the Piston API with console output displayed inline
- **Session Lifecycle Management** — Create, join, and complete sessions; track active and recent sessions on a personal dashboard
- **Curated Problem Set** — LeetCode-style problems (Easy/Medium) with problem descriptions, examples, and constraints
- **Secure Authentication** — Clerk handles sign-up, sign-in, and session management; all API routes are protected
- **Background User Sync** — Clerk webhook events are processed by Inngest jobs to keep MongoDB and Stream Chat in sync reliably

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 22 |
| Framework | Express.js 5 |
| Language | TypeScript 5 (strict mode) |
| Database | MongoDB + Mongoose 8 |
| Auth | Clerk (`@clerk/express`) |
| Real-time | Stream Chat + Stream Video (`@stream-io/node-sdk`) |
| Background Jobs | Inngest 3 |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + React Router 7 |
| Build Tool | Vite 7 |
| Language | TypeScript 5 (strict mode) |
| Data Fetching | TanStack Query (React Query) v5 |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| UI | Tailwind CSS 4 + DaisyUI 5 |
| Real-time | Stream Video React SDK + Stream Chat React |
| Auth | Clerk (`@clerk/clerk-react`) |
| HTTP Client | Axios |
| Code Execution | Piston API (public) |

---

## Project Structure

```
code_live_platform/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── api/               # Typed API client functions
│       ├── components/        # Reusable UI components
│       ├── data/              # Problem definitions and language config
│       ├── hooks/             # React Query hooks and Stream client hooks
│       ├── lib/               # Axios instance, Piston client, Stream init
│       ├── pages/             # Route-level page components
│       └── types/             # Shared TypeScript types
│
└── server/                    # Express backend
    └── src/
        ├── controllers/       # Route handler logic
        ├── lib/               # DB connection, env validation, Stream client, Inngest
        ├── middleware/        # Auth (Clerk + DB sync), global error handler
        ├── models/            # Mongoose schemas (User, Session)
        ├── routes/            # Express routers
        └── types/             # Express type augmentation
```

---

## Prerequisites

- **Node.js** ≥ 22.0.0
- **MongoDB** instance (local or Atlas)
- **Clerk** account — [clerk.com](https://clerk.com)
- **Stream** account (Chat + Video enabled) — [getstream.io](https://getstream.io)
- **Inngest** account (for webhook processing) — [inngest.com](https://inngest.com)

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/MarcoFernstaedt/code_live_platform.git
cd code_live_platform
```

### 2. Configure environment variables

**Server** — create `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB
DATABASE_URI=mongodb://localhost:27017/code_live_platform

# Clerk
# Found in Clerk Dashboard → API Keys
CLERK_SECRET_KEY=sk_test_...

# Stream
# Found in Stream Dashboard → your app → API Credentials
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Inngest
# Found in Inngest Dashboard → your app
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# CORS — URL of the running frontend
CLIENT_URL=http://localhost:5173
```

**Client** — create `client/.env`:

```env
VITE_NODE_ENV=development

# Clerk
# Found in Clerk Dashboard → API Keys → Publishable key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Stream
# Same API key as above (safe to expose on the client)
VITE_STREAM_API_KEY=your_stream_api_key
```

### 3. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Start development servers

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

### 5. Configure Clerk webhooks (for user sync)

In your Clerk Dashboard, add a webhook pointing to your Inngest endpoint. For local development, use the Inngest Dev Server to receive events:

```bash
npx inngest-cli@latest dev
```

Configure Clerk to send `user.created` and `user.deleted` events to `http://localhost:8288/e/your-event-key`.

---

## Production Build

```bash
# From the project root — installs deps and builds both client and server
npm run build

# Start the production server (serves the built client as static files)
npm start
```

---

## API Reference

All routes are prefixed with `/api` and protected by Clerk authentication unless noted.

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sessions` | Create a new session |
| `GET` | `/api/sessions/active` | List all active sessions |
| `GET` | `/api/sessions/my` | List the current user's sessions |
| `GET` | `/api/sessions/:id` | Get a single session by ID |
| `POST` | `/api/sessions/:id/join` | Join a session as participant |
| `POST` | `/api/sessions/:id/complete` | Mark a session as completed |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat/token` | Get a Stream Chat user token |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `*` | `/api/inngest` | Inngest event handler (Clerk webhooks) |

---

## Available Problems

| Problem | Difficulty | Category |
|---------|-----------|----------|
| Two Sum | Easy | Array, Hash Table |
| Reverse String | Easy | String, Two Pointers |
| Valid Palindrome | Easy | String, Two Pointers |
| Maximum Subarray | Medium | Array, Dynamic Programming |
| Container With Most Water | Medium | Array, Two Pointers |

Each problem includes a description, examples, constraints, and starter code in JavaScript, Python, and Java.

---

## License

ISC
