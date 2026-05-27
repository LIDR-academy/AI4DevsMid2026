# Position Board (Kanban) Spec

## Overview

The Position Board is a Kanban view for a single open position. It displays each interview step as a column and places candidate cards in the column matching their current step. Recruiters can drag cards between columns to advance or revert a candidate's stage; the move is persisted immediately via the API and confirmed with a toast notification. The page is reached from the Positions list and provides a back-navigation path to `/positions`.

---

## Stack

- **Framework:** React 19 + TypeScript (strict), CRA (react-scripts 5)
- **Styling:** Tailwind CSS 3 — custom tokens in `tailwind.config.js`; no CSS files, no inline styles
- **Router:** React Router v7 (`useParams`, `useNavigate`)
- **State:** `useState` + `useEffect` (no external state library)
- **API base URL:** `http://localhost:3010` (hardcoded in service files)
- **Drag and drop:** HTML5 native drag-and-drop API (no external DnD library)

---

## Design Guidelines Applied

All rules below reference tokens and patterns from `DESIGN.md`.

- **Background:** `bg-[#f9f9f9]` — matches `surface` / `background` token
- **Borders:** `border-2 border-[#1a1c1c]` — 2px black strokes on every container, card, and interactive element per the Right Angle / Borders rule
- **Column headers:** `bg-[#1a1c1c] text-white` — "header strips" pattern from the Cards & Containers section; `on-surface` background, white text
- **Alternate column header (last/offer step):** `bg-[#484831]` — `on-surface-variant` token; `opacity-75` per Figma
- **Candidate cards:** `bg-[#f9f9f9]` default; `bg-[#ffff00]` for highlighted/active card — `surface` and `primary-container` tokens
- **Typography — column names:** `font-space font-bold text-[14px] uppercase` — `label-mono` style from typography tokens
- **Typography — candidate names:** `font-space font-bold text-[14px] uppercase` — `label-mono`
- **Typography — metadata rows:** `font-space text-[10px]` — below `label-mono`, used for compact data
- **Page headline:** `font-hanken font-black text-[72px] uppercase tracking-[-0.04em] leading-[72px]` — `display` typography token
- **Breadcrumb:** `font-space font-bold text-[14px]` — `label-mono`
- **Buttons (primary/CTA):** `bg-[#ffff00] border-2 border-[#1a1c1c] text-[#1a1c1c] font-space font-bold text-[14px]` with `drop-shadow-[4px_4px_0px_#1a1c1c]` hard offset — primary button pattern; hover inverts to `hover:bg-[#1a1c1c] hover:text-[#ffff00]`, transition-none
- **Drop zone dashed border:** `border-dashed border-2 border-[#c6c6c6]` — `tertiary-fixed-dim` token
- **Kanban board container:** `bg-[#eeeeee] border-2 border-[#1a1c1c]` — `surface-container` token
- **Column body background:** `bg-[#f7f7f7]` — `tertiary-container` token
- **Spacing:** `p-[48px]` outer page margin, `gap-[8px]` between cards, `p-[8px]` column body padding — per 4px baseline grid and `margin-desktop` (48px) token
- **Shapes:** 0px border radius on all containers, buttons, cards — Right Angle rule
- **Toast notification:** fixed overlay, `bg-[#1a1c1c] text-white border-2 border-[#1a1c1c]` — Inversion rule for high-z-index elements

---

## Screens & Routes

| Route | Screen | Description |
|-------|--------|-------------|
| `/positions/:id` | PositionBoard | Kanban board for a specific position; columns from interviewFlow steps |

---

## Components

List order: leaf components first, container last.

---

### `StarRating`

- **Props:**
  ```ts
  type StarRatingProps = {
    score: number;   // 0–5, may be fractional but render as rounded integer
    max?: number;    // default 5
  };
  ```
- **State:** none (pure display)
- **Children:** none — renders inline SVG stars
- **Behavior:**
  - Renders `max` (default 5) star icons in a row
  - Stars at index < `Math.round(score)` are filled; remainder are outline only
  - When `score` is 0, all stars render as outline (no score recorded yet)
- **Design:**
  - Star size: 12×12px, `stroke-[#1a1c1c]` 1.5px stroke; filled stars use `fill-[#1a1c1c]`, empty stars use `fill-none`
  - Row gap: `gap-[2px]`

---

### `CandidateCard`

- **Props:**
  ```ts
  type CandidateCardProps = {
    candidate: BoardCandidate;
    columnId: number;           // id of the InterviewStep this card lives in
    onDragStart: (candidateName: string, fromStepId: number) => void;
  };
  ```
- **State:** none (pure display + drag emitter)
- **Children:** `StarRating`
- **Behavior:**
  - Renders candidate name (uppercase) on top row
  - Renders `StarRating` with `candidate.averageScore` below the name
  - The entire card is `draggable={true}`
  - `onDragStart`: calls `props.onDragStart(candidate.fullName, columnId)` and sets `dataTransfer.effectAllowed = 'move'`
  - Highlighted state (`candidate.highlighted === true`): card background becomes `bg-[#ffff00]`
- **Design:**
  - Container: `bg-[#f9f9f9] border-2 border-[#1a1c1c] p-[14px] flex flex-col gap-[8px] cursor-grab`
  - Name row: `font-space font-bold text-[14px] uppercase text-[#1a1c1c]`
  - Dashed separator between name+score row and any bottom metadata: `border-t border-dashed border-[#c6c6c6] pt-[8px]`
  - Highlighted card: add `bg-[#ffff00]` class, remove `bg-[#f9f9f9]`
  - `aria-label`: `"Candidate: {candidate.fullName}, score {candidate.averageScore} out of 5"`

---

### `DropZone`

- **Props:**
  ```ts
  type DropZoneProps = {
    stepName: string;
    onDrop: () => void;
    isDragOver: boolean;
  };
  ```
- **State:** none (drag-over state is managed by parent `KanbanColumn`)
- **Children:** none
- **Behavior:**
  - Renders a dashed rectangle with the label `DROP TO ADVANCE TO {stepName.toUpperCase()} STAGE`
  - Visible only when a drag is active — parent shows/hides this based on a board-level drag state flag
  - `onDragOver`: calls `e.preventDefault()` (required for drop to fire)
  - `onDrop`: calls `props.onDrop()`
- **Design:**
  - `border-2 border-dashed border-[#c6c6c6] p-[16px] flex items-center justify-center`
  - Text: `font-space font-bold text-[10px] text-[#484831] text-center uppercase`
  - Background: `bg-[#f7f7f7]`

---

### `KanbanColumn`

- **Props:**
  ```ts
  type KanbanColumnProps = {
    step: InterviewStep;
    candidates: BoardCandidate[];
    isLast: boolean;
    isDragActive: boolean;          // true when any card is being dragged on the board
    onDragStart: (candidateName: string, fromStepId: number) => void;
    onDrop: (toStepId: number) => void;
  };
  ```
- **State:**
  ```ts
  const [isDragOver, setIsDragOver] = useState(false);
  ```
- **Children:** `CandidateCard`, `DropZone`
- **Behavior:**
  - Renders a column header bar with the step name (uppercase) and a badge showing `candidates.length`
  - Renders `CandidateCard` for each candidate in `candidates`, keyed by `candidate.fullName` (no id available from API — see note in Types section)
  - When `isDragActive` is true, renders a `DropZone` at the bottom of the column body
  - Column body `onDragEnter`: sets `isDragOver = true`
  - Column body `onDragLeave`: sets `isDragOver = false`
  - Column body `onDragOver`: calls `e.preventDefault()`
  - Column body `onDrop`: sets `isDragOver = false`, calls `props.onDrop(step.id)`
  - `isLast` prop toggles alternate header color and opacity
- **Design:**
  - Column wrapper: `w-[288px] shrink-0 border-2 border-[#1a1c1c] flex flex-col`
  - Header bar (default): `bg-[#1a1c1c] text-white px-[16px] py-[12px] flex items-center justify-between`
  - Header bar (isLast): `bg-[#484831] opacity-75 text-white px-[16px] py-[12px] flex items-center justify-between`
  - Header step name: `font-space font-bold text-[14px] uppercase`
  - Count badge: `bg-white text-[#1a1c1c] font-space font-bold text-[12px] px-[8px] py-[2px]` (0px radius)
  - Column body: `bg-[#f7f7f7] flex-1 p-[8px] flex flex-col gap-[8px] overflow-y-auto`
  - Drag-over highlight on column body: add `ring-2 ring-inset ring-[#0035c6]`

---

### `Toast`

- **Props:**
  ```ts
  type ToastProps = {
    message: string;
    onDismiss: () => void;
  };
  ```
- **State:** none (dismissal is controlled by parent via `onDismiss`)
- **Children:** none
- **Behavior:**
  - Mounts a fixed overlay notification
  - Renders the message text
  - Auto-dismisses after 3000 ms: the parent sets a `setTimeout` for 3 s and calls `onDismiss` when it fires — Toast itself does not manage the timer
  - Includes a manual close button (`×`) that calls `onDismiss`
- **Design:**
  - Position: `fixed bottom-[32px] right-[32px] z-50`
  - Container: `bg-[#1a1c1c] border-2 border-[#1a1c1c] text-white px-[24px] py-[16px] flex items-center gap-[16px]` (0px radius)
  - Message: `font-space font-bold text-[14px]`
  - Close button: `text-white font-space text-[16px]` native `<button>`
  - `role="status"`, `aria-live="polite"`

---

### `PositionBoard`

- **Props:** none (reads `id` from `useParams`)
- **State:**
  ```ts
  const [positionName, setPositionName] = useState<string>('');
  const [steps, setSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<BoardCandidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  ```
- **Children:** `KanbanColumn`, `Toast`
- **Behavior:** See the Behaviors section for the full drag-and-drop and data-loading sequences.
- **Design:**
  - Outer wrapper: `min-h-screen bg-[#f9f9f9]`
  - Inner content: `px-[48px] py-[48px]`
  - Breadcrumb row: `font-space font-bold text-[14px] text-[#484831] uppercase mb-[16px]` — rendered as `HOME > POSITIONS > {positionName}`; HOME and POSITIONS are `<Link>` elements
  - Back button: rendered left of the headline — `bg-[#ffff00] border-2 border-[#1a1c1c] drop-shadow-[4px_4px_0px_#1a1c1c] font-space font-bold text-[14px] text-[#1a1c1c] px-[16px] py-[10px] hover:bg-[#1a1c1c] hover:text-[#ffff00]` with a left-arrow `←` label; calls `navigate('/positions')`
  - Headline: `font-hanken font-black text-[72px] uppercase tracking-[-0.04em] leading-[72px] text-[#1a1c1c] border-b-4 border-[#1a1c1c] pb-[8px] mb-[32px]`
  - Divider below headline area: `border-t-4 border-[#1a1c1c] mb-[24px]`
  - Toolbar row: `flex items-center justify-between mb-[24px]` — left side: search input + FILTER button (UI-only, not wired to API in this spec); right side: ADD CANDIDATE button (navigates to `/add-candidate?positionId={id}`)
  - Board container: `bg-[#eeeeee] border-2 border-[#1a1c1c] p-[16px] overflow-x-auto`
  - Columns row: `flex gap-[16px]` inside board container
  - Loading state: full-width `font-space text-[14px] text-[#484831] p-[48px]` spinner substitute text "LOADING..."
  - Error state: standard error feedback block `rounded-none border-2 border-red-300 bg-red-50 text-red-800 p-[16px]` with `border-danger` per design.md

---

## Data & API

Base URL: `http://localhost:3010`

```
GET /position/:id/interviewflow
Request:  none (id in URL path)
Response: {
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: Array<{
      id: number;
      interviewFlowId: number;
      interviewTypeId: number;
      name: string;
      orderIndex: number;
    }>;
  };
}
Errors: { 404: position not found, 500: server error }
```

```
GET /position/:id/candidates
Request:  none (id in URL path)
Response: Array<{
  fullName: string;
  currentInterviewStep: string;   // step name string, not id
  averageScore: number;           // 0–5
}>
Errors: { 404: position not found, 500: server error }
```

```
PUT /candidates/:id/stage
Request:  { applicationId: string; currentInterviewStep: string; }
          (currentInterviewStep is the InterviewStep id as a string)
Response: {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: null | string;
    interviews: any[];
  };
}
Errors: { 400: bad request, 404: candidate not found, 500: server error }
```

**Critical note on candidate IDs:** The `GET /position/:id/candidates` response does not include a candidate `id` or `applicationId`. The `PUT /candidates/:id/stage` endpoint requires both a URL parameter `:id` and a body field `applicationId`. Because the current API shape does not return these identifiers in the candidate list, the service layer must handle this gracefully. See the Behaviors section for how to proceed: optimistically update the UI by matching on `fullName`, and call the API with a placeholder if the id is unavailable — OR treat this as a known API gap and document that the PUT call cannot be made until the candidates endpoint is updated to return `id` and `applicationId`. For this spec, implement the UI and service function signature fully, but guard the PUT call: if `candidateId` is unavailable, log a warning and show a toast with "Unable to persist — candidate ID not available" without crashing the UI.

---

## Types

File: `src/types/positionBoard.ts`

```ts
type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
};

type InterviewFlow = {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
};

type InterviewFlowResponse = {
  positionName: string;
  interviewFlow: InterviewFlow;
};

type BoardCandidate = {
  fullName: string;
  currentInterviewStep: string;  // step name, matches InterviewStep.name
  averageScore: number;
  highlighted?: boolean;         // UI-only flag, not from API
};

type UpdateStageRequest = {
  applicationId: string;
  currentInterviewStep: string;  // InterviewStep id as string
};

type UpdateStageResponse = {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: unknown[];
  };
};

type DragState = {
  candidateName: string;
  fromStepId: number;
};
```

---

## State Management

**Local state in `PositionBoard`:**
- `positionName: string` — position display name from interviewFlow response
- `steps: InterviewStep[]` — ordered interview steps (columns); sort by `orderIndex` ascending after fetch
- `candidates: BoardCandidate[]` — full candidate list; mutated optimistically on drop
- `loading: boolean` — true while either fetch is in-flight
- `error: string | null` — first fetch error encountered
- `dragState: DragState | null` — set on card `dragStart`, cleared on `drop` or `dragEnd`; null means no drag in progress
- `toast: string | null` — message to show in `Toast`; null hides it

**Derived (not stored):**
- `candidatesForStep(stepId: number)` — filter `candidates` where `currentInterviewStep === step.name` for the step with that id. This is a helper function, not state.
- `isDragActive` — `dragState !== null`
- `isLastStep(step: InterviewStep)` — `step.orderIndex === Math.max(...steps.map(s => s.orderIndex))`; passed as `isLast` prop to `KanbanColumn`

**Lifted state:** none — all state lives in `PositionBoard`. `KanbanColumn` owns only `isDragOver` (local drag-over highlight for that specific column).

---

## Validation & Constraints

No form validation required for this feature. All inputs are drag-and-drop operations. Constraints on the API calls:

- `applicationId` must be a non-empty string before calling `PUT /candidates/:id/stage`. If unavailable, abort the PUT and show the warning toast (see Data & API note above).
- `currentInterviewStep` in the PUT body must be the `id` of the target `InterviewStep` (as a string), not its `name`. Map from `step.name → step.id` using the loaded `steps` array.
- Both `GET` calls are fired in parallel via `Promise.all` on mount. If either rejects, set `error` and stop loading.

*No other constraints specified — validate at API boundary only.*

---

## Behaviors

### 1. Initial data load

```
1. Component mounts, `loading = true`, `error = null`
2. Fire both fetches in parallel:
   a. GET /position/:id/interviewflow
   b. GET /position/:id/candidates
3. await Promise.all([...])
4. On success:
   a. Set positionName from interviewflow response
   b. Set steps = interviewFlow.interviewSteps sorted by orderIndex ascending
   c. Set candidates from candidates response
   d. Set loading = false
5. On any fetch error:
   a. Set error = err.message or 'Failed to load position data'
   b. Set loading = false
6. Early return: if loading → render "LOADING..." text block
7. Early return: if error → render error feedback block
```

### 2. Drag-and-drop candidate stage update

```
1. User starts dragging a CandidateCard:
   a. dragStart event fires → PositionBoard sets dragState = { candidateName, fromStepId }
   b. dataTransfer.effectAllowed = 'move'

2. User drags over a KanbanColumn:
   a. Column dragEnter → setIsDragOver(true) on that column
   b. Column dragLeave → setIsDragOver(false)
   c. Column dragOver → e.preventDefault() (required for drop)

3. User drops on a KanbanColumn (onDrop called with toStepId):
   a. If toStepId === dragState.fromStepId: no-op, clear dragState, return
   b. Optimistic update: mutate candidates array in state —
      find candidate by fullName where currentInterviewStep matches the from-step name,
      update currentInterviewStep to the name of the step with id = toStepId
   c. Clear dragState (setDragState(null))
   d. Resolve candidateId: candidates API does not return id — log warning if unavailable
   e. If candidateId is available:
      - Call PUT /candidates/:candidateId/stage with body:
        { applicationId: String(candidateId), currentInterviewStep: String(toStepId) }
      - On success (200): set toast = response.message (e.g. "Candidate stage updated successfully")
      - On error: revert the optimistic update (restore original currentInterviewStep), set toast = "Failed to update candidate stage"
   f. If candidateId is NOT available:
      - Set toast = "Unable to persist — candidate ID not available"
   g. In all cases: set a setTimeout for 3000ms that calls setToast(null)

4. User cancels drag (dragEnd without drop):
   a. setDragState(null) — clears isDragActive, hides all DropZones
```

### 3. Toast lifecycle

```
1. setToast(message) → Toast renders with message
2. setTimeout(3000) → setToast(null) → Toast unmounts
3. User clicks × → onDismiss → setToast(null) → Toast unmounts immediately
4. Only one toast is shown at a time; a new toast replaces any existing one
   (clear the previous timeout reference before setting a new one — store timeout id in a ref)
```

### 4. Back navigation

```
1. User clicks "← BACK" button → navigate('/positions')
```

### 5. Breadcrumb links

```
HOME link → navigate('/') (or Link to="/")
POSITIONS link → navigate('/positions') (or Link to="/positions")
[positionName] — plain text, no link
```

---

## Accessibility

- `KanbanColumn` header bar: `role="columnheader"`, `aria-label="{step.name} column, {count} candidates"`
- `CandidateCard`: `draggable={true}`, `aria-label="Candidate: {fullName}, score {averageScore} out of 5"`, `role="listitem"`
- Column body: `role="list"`, `aria-label="{step.name} candidates"`
- `DropZone`: `role="region"`, `aria-label="Drop zone for {stepName} stage"`, `aria-live="polite"` when visible
- `Toast`: `role="status"`, `aria-live="polite"` — screen readers announce the update confirmation
- Back button: native `<button>` — no extra ARIA needed
- Breadcrumb nav: wrap in `<nav aria-label="Breadcrumb">`, use `aria-current="page"` on the last (non-linked) item
- Kanban board: `role="region"`, `aria-label="Kanban board"`
- **Keyboard drag-and-drop fallback:** HTML5 DnD is not keyboard-accessible. Add a note in code comments that a keyboard-accessible move mechanism (e.g., select-then-confirm) is a future enhancement. For now, the spec requires only mouse-based DnD.
- Tab order: Back button → Breadcrumb links → Search input → Filter button → Add Candidate button → Kanban columns (left to right) → Cards within each column (top to bottom)

---

## Edge Cases & Error States

| Case | How the UI handles it |
|------|-----------------------|
| Loading (both fetches in flight) | Full-content area replaced with "LOADING..." text in `font-space text-[14px] text-[#484831] p-[48px]`; layout chrome (SideNavBar, TopAppBar) remains visible |
| Fetch error (network / 4xx / 5xx) | Standard error feedback block (`border-danger bg-red-50 text-red-800`) with the error message; no retry affordance in this spec |
| Position not found (404) | Error block with "Position not found" message |
| Empty candidates list | Columns render with empty bodies and count badge showing 0; no broken layout; DropZone still appears on drag |
| Candidate with averageScore 0 | `StarRating` renders 5 empty-outline stars — valid state, not an error |
| Candidate dropped on same column | No-op: dragState.fromStepId === toStepId check in onDrop handler; UI unchanged |
| candidateId missing from API response | Optimistic UI update still happens; PUT is skipped; toast: "Unable to persist — candidate ID not available" |
| PUT /candidates/:id/stage fails | Revert the optimistic candidates state update; show error toast "Failed to update candidate stage"; UI recovers to pre-drop state |
| Steps with same orderIndex | Both render as separate columns; neither is treated as "last"; isLast check uses `step.id === steps[steps.length - 1].id` after sorting by orderIndex then id |
| Long position name | Headline wraps; `border-b-4` extends full width regardless |
| Long candidate name | Card name truncates with `truncate` Tailwind class; full name available via `aria-label` |

---

## Implementation Order

1. **Types** — `src/types/positionBoard.ts`
2. **Service functions** — `src/services/positionBoardService.ts`
   - `fetchInterviewFlow(positionId: string): Promise<InterviewFlowResponse>`
   - `fetchPositionCandidates(positionId: string): Promise<BoardCandidate[]>`
   - `updateCandidateStage(candidateId: string, body: UpdateStageRequest): Promise<UpdateStageResponse>`
3. **`StarRating`** — `src/components/StarRating.tsx`
4. **`Toast`** — `src/components/Toast.tsx`
5. **`DropZone`** — `src/components/DropZone.tsx`
6. **`CandidateCard`** — `src/components/CandidateCard.tsx`
7. **`KanbanColumn`** — `src/components/KanbanColumn.tsx`
8. **`PositionBoard`** — `src/components/PositionBoard.tsx` (replace existing stub)
