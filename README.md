# LTI — AI-Powered Applicant Tracking System

Full-stack ATS built with React 19 + Express 5 + Prisma + PostgreSQL. The core UI is a Kanban board where recruiters move candidates through configurable interview stages.

> **The most important part of this repo is [`frontend/.claude/`](./frontend/.claude/) and [`WORKFLOW.md`](./WORKFLOW.md).** This is where the Claude Code-powered development workflow lives — agents, commands, and skills that drive a Figma → Spec → Implement → Review → Test pipeline for building frontend features with AI. The ATS application itself is a working substrate to practice and demonstrate that workflow.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Tailwind CSS 3, React Router v7 |
| Backend | Express 5, TypeScript, Prisma ORM |
| Database | PostgreSQL (Docker) |
| Testing | Jest (unit), Playwright (E2E) |

## Getting started

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Set up the database

```bash
cd backend
npx prisma generate
npx prisma migrate dev
ts-node prisma/seed.ts
```

### 4. Run the stack

```bash
# Terminal 1 — backend (port 3010)
cd backend && npm run dev

# Terminal 2 — frontend (port 3000)
cd frontend && npm start
```

## Environment

Backend reads from `backend/.env`:

```
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=mydatabase
DB_PORT=5432
```

## API

Base URL: `http://localhost:3010`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/candidates` | Create candidate with educations, work experience, CV |
| GET | `/candidates/:id` | Get candidate with all relations |
| PUT | `/candidates/:id` | Update candidate stage |
| POST | `/upload` | Multipart file upload |
| GET | `/position` | List all positions |
| GET | `/position/:id/candidates` | Candidates for a position |
| GET | `/position/:id/interviewflow` | Interview flow and ordered stages |

Full API spec: [`backend/api-spec.yaml`](./backend/api-spec.yaml)  
Data model: [`backend/ModeloDatos.md`](./backend/ModeloDatos.md)

## Development workflow

Frontend features are built through a Figma → Spec → Implement → Review → Test pipeline driven by Claude Code slash commands. See [`WORKFLOW.md`](./WORKFLOW.md) for the full guide.

Key commands (run from `frontend/`):

| Command | Purpose |
|---------|---------|
| `/spec <figma-url>` | Pull Figma design, write implementation spec |
| `/implement [spec]` | Implement from spec |
| `/review [spec]` | Review code against spec and conventions |
| `/test [spec]` | Run Playwright tests |
| `/audit` | Lighthouse performance and accessibility audit |
| `/pr` | Create GitHub PR with auto-generated description |

## Project structure

```
LTI/
├── backend/
│   ├── prisma/              Schema and migrations
│   └── src/
│       ├── routes/          Thin route definitions
│       ├── presentation/    Controllers
│       ├── application/     Services and validators
│       └── domain/          Prisma models
├── frontend/
│   ├── .claude/             Claude Code agents, commands, skills
│   ├── specs/               Feature specs (Figma → code handoff)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── tests/           Playwright specs
│   ├── design.md            Design system — tokens, typography, spacing
│   └── CLAUDE.md            React conventions and code style
├── WORKFLOW.md              Feature development guide
└── docker-compose.yml
```
