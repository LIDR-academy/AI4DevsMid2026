# LTI — Development Workflow

How to build features in this repo using Claude Code.

---

## Repo structure

```
LTI/
├── backend/                     Express 5 + Prisma API  →  port 3010
├── frontend/                    React 19 + Tailwind      →  port 3000
│   ├── .claude/
│   │   ├── agents/              Sub-agent personas (spawned by commands)
│   │   ├── commands/            Slash commands (/spec, /implement, /test, /frontend-workflow)
│   │   ├── skills/              Reusable skills (figma-spec, spec-implement, playwright-test, design-to-code)
│   │   └── settings.json        Pre-approved MCP tool permissions
│   ├── specs/                   Feature specs — git-tracked, source of truth between design and code
│   ├── design.md                Visual guidelines — typography, color tokens, spacing, component rules
│   └── CLAUDE.md                React conventions, code style, Tailwind tokens
├── CLAUDE.md                    Full-stack architecture, API reference, backend patterns
└── WORKFLOW.md                  This file
```

---

## Starting the stack

```bash
# Terminal 1 — database
docker-compose up -d

# Terminal 2 — backend
cd backend && npm run dev

# Terminal 3 — frontend
cd frontend && npm start
```

Backend on `:3010`, frontend on `:3000`. Both must be running for Playwright tests to work.

---

## How a feature gets built

Every feature follows the same path regardless of size:

```
Figma design
     │
     ▼
  /spec  ──────────────────────────────────────────────┐
     │  reads: Figma MCP + design.md + CLAUDE.md        │
     │  writes: specs/<feature>.spec.md                 │
     ▼                                                  │
 review & edit spec                                     │  /frontend-workflow
     │                                                  │  runs all phases
     ▼                                                  │  automatically
 /implement ─────────────────────────────────────────── │
     │  reads: spec + design.md + CLAUDE.md             │
     │  writes: src/ components, types, services         │
     ▼                                                  │
  /review ────────────────────────────────────────────── │
     │  checks: spec compliance, conventions, tokens    │
     │  output: PASS/FAIL checklist + fixes             │
     ▼                                                  │
  /test ─────────────────────────────────────────────── ┘
     │  drives: Playwright against localhost:3000
     │  checks: golden path, edge cases, regressions, design compliance
     ▼
  PASS / FAIL report
```

---

## Frontend commands

### Feature pipeline

These run in sequence when building a feature. `/frontend-workflow` chains them automatically; use them individually for more control.

#### `/frontend-workflow <figma-url> [feature-name]`

Runs all phases end-to-end: Figma → spec → implement → review → test. Use when the Figma design is final and you want working code in one shot.

```
/frontend-workflow https://www.figma.com/design/XXXXX/position-board
```

#### `/spec <figma-url> [feature-name]`

Pulls the Figma design and writes `specs/<name>.spec.md`. Stops there — edit the spec before implementing.

```
/spec https://www.figma.com/design/XXXXX/candidate-profile
# edit specs/candidate-profile.spec.md if needed
/implement specs/candidate-profile.spec.md
```

#### `/implement [spec-path]`

Builds the feature bottom-up: types → API services → leaf components → container. Runs `npm run build` and fixes TypeScript errors before finishing.

#### `/review [spec-path]`

Reads changed files, runs `npm run build`, and checks against spec compliance, TypeScript rules, design tokens, state patterns, event handler naming, and accessibility. PASS/FAIL report with exact `file:line` fixes. Does not modify code.

#### `/test [spec-path]`

Drives Playwright through the golden path, edge cases, design compliance, and a regression pass over all routes. Produces a structured PASS/FAIL checklist.

```
The score shows 0 instead of — when averageScore is null. Fix it.
/test specs/candidate-profile.spec.md
```

---

### On-demand commands

Run these independently — they are not part of the feature pipeline.

#### `/audit [mobile|desktop]`

Runs a Lighthouse audit (performance, accessibility, best-practices, SEO) against the live dev server. Audits the root and key routes. Reports scores per route and lists actionable fixes for anything below 90. Default device: desktop.

```
/audit
/audit mobile
```

#### `/pr [base-branch]`

Inspects `git log` and `git diff` against the base branch (default: `main`), reads modified spec files for context, generates a title (<70 chars) and bullet-point description (<1000 chars), then runs `gh pr create`. Outputs the PR URL.

```
/pr
/pr develop
```

---

## Frontend skills

Skills are loaded automatically and work in any frontend project with a `CLAUDE.md` and `design.md`. Use them instead of commands when working outside the `frontend/` directory or when you want a more conversational invocation.

| Skill | Invoke | Does |
|-------|--------|------|
| `figma-spec` | `/figma-spec` | Figma → spec only |
| `spec-implement` | `/spec-implement` | Spec → code |
| `playwright-test` | `/playwright-test` | Browser test suite |
| `code-review` | `/code-review` | Convention + design token review |
| `design-to-code` | `/design-to-code` | Full pipeline |

---

## Design source of truth

Two files define how the UI should look and behave:

**`frontend/design.md`** — the written design system: color tokens, typography scale, spacing units, component shapes, interaction patterns. All agents read this before writing or testing any UI. Edit it when the design system changes.

**Figma** — the visual source. The spec agent reads Figma frames and cross-references `design.md` token names with Figma variable definitions. If they conflict, update `design.md` to match Figma.

---

## Backend: adding a new endpoint

Give Claude the route prompt and describe what you need:

```
Following the pattern in backend/src/prompts/CreateNewRoute.md,
add GET /position/:id/stats returning applicant count and avg days-to-hire.
```

Layer order: `routes/` → `presentation/controllers/` → `application/services/` → `application/validator.ts` (if input) → Prisma query.

Rules:
- `PrismaClient` is on `req.prisma` — never instantiate a new one
- Services throw `Error`; controllers catch and respond with the right HTTP status
- Run `cd backend && npm test` after every new route

---

## Adding a new frontend feature (step by step)

1. **Design in Figma** — finish the design, ensure variables match `design.md` tokens
2. **Generate the spec** — `/spec <figma-url> <feature-name>`
3. **Review the spec** — read `specs/<name>.spec.md`, edit anything that's wrong or missing
4. **Implement** — `/implement specs/<name>.spec.md`
5. **Review code** — `/review specs/<name>.spec.md` — fix any FAIL items before testing
6. **Test** — start the dev server if not running, then `/test specs/<name>.spec.md`
7. **Fix & re-test** — describe bugs conversationally, re-run `/test`
8. **Commit** — spec + implementation together so design intent is preserved

When ready to ship, use the on-demand commands: `/audit` to check quality, `/pr` to open the pull request.

---

## Reference files

| File | Purpose |
|------|---------|
| `frontend/CLAUDE.md` | React patterns, Tailwind tokens, TypeScript conventions |
| `frontend/design.md` | Visual design system — tokens, typography, spacing, component rules |
| `CLAUDE.md` | Backend architecture, API endpoints, data model |
| `backend/src/prompts/CreateNewRoute.md` | Step-by-step guide for adding a backend route |
| `frontend/specs/` | Generated feature specs — commit alongside code |
| `frontend/.claude/agents/` | Sub-agent instruction files — edit to change pipeline behavior |
| `frontend/.claude/commands/` | Slash commands: `/spec`, `/implement`, `/review`, `/test`, `/pr`, `/frontend-workflow` |
| `frontend/.claude/skills/` | Reusable skills: `figma-spec`, `spec-implement`, `code-review`, `playwright-test`, `design-to-code` |
