# Dashboard Layout Spec

## Overview

This feature establishes the main dashboard shell for the LTI ATS: a fixed sidebar navigation + fixed top app bar that wraps all internal pages. The Positions page and Add Candidate page move inside this dashboard as nested routes. The primary new UI is the dashboard chrome (sidebar + topbar) and a redesigned Positions page that matches the Figma neo-brutalist design with stats cards, a filter row, and a data table.

## Stack

- **Framework:** React 19, TypeScript (strict), CRA (react-scripts 5)
- **Styling:** Tailwind CSS 3 only — no CSS files, no inline styles
- **Router:** React Router v7 (`react-router-dom`) with nested routes
- **State:** `useState` for local state, lifted to dashboard shell where siblings share it
- **API base URL:** `http://localhost:3010`
- **Fonts:** Hanken Grotesk (headlines), Arimo (body), Space Mono (labels/mono)

## Design Guidelines Applied

From `DESIGN.md` — Neo-Brutalism / "Printed UI" aesthetic:

- **All borders:** 2px solid `#1a1c1c` on all containers, inputs, cards, buttons. 0px border-radius everywhere (pure right angles).
- **Hard offset shadows:** Buttons and prominent cards use `drop-shadow: 4px 4px 0 #1a1c1c` (no blur). Stat cards use `2px 2px 0 #1a1c1c`.
- **Primary action buttons:** `bg-[#ffff00]` (Safety Yellow), 2px black border, black text, hover: invert to `bg-[#1a1c1c]` text-yellow. 0ms transition.
- **Active nav item:** `bg-[#ffff00]`, 2px black top + bottom borders, extends 4px past the left container edge.
- **Inactive nav items:** no background, text `#484831` (on-surface-variant).
- **Table headers:** `bg-[#1a1c1c]` with white uppercase `label-mono` text, `tracking-[0.7px]`.
- **Status chips:** Rectangular. OPEN → `bg-[#ffff00]` 1px black border black text. PAUSED → `bg-[#e2e2e2]` 1px black border text `#484831`.
- **Typography scale:**
  - Page headline: Hanken Grotesk, 72px, font-black, `tracking-[-3.6px]`
  - Section labels: Space Mono Bold, 14px, uppercase, `tracking-[0.7px]`
  - Stat numbers: Hanken Grotesk, 48px, font-extrabold, `tracking-[-0.96px]`
  - Body data: Arimo, 16px
  - Sub-labels: Arimo Bold, 12px, color `#484831`
  - Breadcrumb: Space Mono Bold, 14px

## Screens & Routes

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | `DashboardLayout` (outlet) | Shell with sidebar + topbar; redirects to `/positions` |
| `/positions` | `PositionsPage` | Positions list with stats strip, filters, data table |
| `/positions/:id` | `PositionBoard` | Existing Kanban board (no redesign in this spec) |
| `/add-candidate` | `AddCandidateForm` | Existing add candidate form (wrapped in new layout) |

## Components

### `StatCard`
- **Props:**
  ```ts
  type StatCardProps = {
    label: string;
    value: string;
    suffix?: string; // e.g. "days" shown smaller beside the value
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:** Purely presentational.
- **Design:**
  - `bg-white border-2 border-[#1a1c1c]` container
  - Drop shadow: `drop-shadow-[2px_2px_0px_#1a1c1c]`
  - Padding: `px-[26px] pt-[26px] pb-[46px]`
  - Label: Space Mono Bold 14px uppercase `text-[#484831]`
  - Value: Hanken Grotesk 48px font-extrabold `text-[#1a1c1c]` `tracking-[-0.96px]`
  - Suffix (if present): Hanken Grotesk 32px font-bold `text-[#484831]` `tracking-[-0.96px]` inline beside value, baseline-aligned

---

### `StatusChip`
- **Props:**
  ```ts
  type StatusChipProps = {
    status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:** Maps status to colors.
- **Design:**
  - All chips: `border border-[#1a1c1c] border-solid px-[9px] py-[5px]` uppercase Space Mono Bold 12px
  - OPEN: `bg-[#ffff00] text-[#1a1c1c]`
  - PAUSED: `bg-[#e2e2e2] text-[#484831]`
  - CLOSED: `bg-[#1a1c1c] text-white`
  - DRAFT: `bg-white text-[#484831]`

---

### `PipelineBar`
- **Props:**
  ```ts
  type PipelineBarProps = {
    total: number;        // total stages in the flow
    activeCount: number;  // candidates who have started (any stage)
    // Display label below the bars, e.g. "42 Active"
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:** Renders 4 fixed-width bar segments aligned to bottom. Bar heights are proportional (tallest = full 24px, others scaled). Leftmost bar uses `bg-[#ffff00]` (screened/first stage). Middle filled bars use `bg-[#1a1c1c]`. Empty bars use `border border-[#1a1c1c] border-dashed`. Label below: Arimo Bold 12px `text-[#484831]` centered.
- **Design:** 4 bars, each `w-[21px]`, `gap-[4px]`, `h-[24px]` container, bars grow from bottom (`items-end`).

---

### `ManagerCell`
- **Props:**
  ```ts
  type ManagerCellProps = {
    name: string;
    avatarUrl?: string;    // if present, show photo; else show initials
    initials?: string;
  };
  ```
- **State:** none
- **Children:** none
- **Behavior:** Shows circular avatar (30-32px diameter) with 1px black border. Photo if `avatarUrl`, else initials in `bg-[#5e5e5e]` with white Space Mono 12px text. Name beside avatar in Arimo 16px.
- **Design:** `rounded-full border border-[#1a1c1c]` avatar, `gap-[12px]` between avatar and name.

---

### `PositionRow`
- **Props:**
  ```ts
  type PositionRowProps = {
    position: Position;
    onView: (id: number) => void;
  };
  ```
- **State:** none
- **Children:** `StatusChip`, `PipelineBar`, `ManagerCell`
- **Behavior:** Clicking "VIEW" button calls `onView(position.id)`. "..." overflow button is rendered but its menu is out of scope for this spec (render as inert icon).
- **Design:**
  - Row height: ~77px, `border-b border-[#1a1c1c]`
  - Cells separated by `border-r border-[#1a1c1c]` vertical dividers
  - Column widths (fixed): Role 231px | Dept/Location 166px | Hiring Manager 174px | Pipeline 128px | Status 95px | Actions 130px
  - Role cell: role title Arimo Bold 16px + REQ code Arimo Bold 12px `#484831`
  - Dept/Location cell: dept Arimo Regular 16px + location Arimo Bold 12px `#484831`
  - Actions cell: `VIEW` button `bg-white border border-[#1a1c1c] px-[13px] py-[5px]` Space Mono Bold 12px; `...` icon button borderless

---

### `PositionsTable`
- **Props:**
  ```ts
  type PositionsTableProps = {
    positions: Position[];
    onView: (id: number) => void;
  };
  ```
- **State:** none
- **Children:** `PositionRow` (one per position)
- **Behavior:** Renders header row then body rows. Empty state: single row spanning all columns with "No positions found" text.
- **Design:**
  - Outer container: `bg-white border-2 border-[#1a1c1c] shadow-[4px_4px_0px_0px_#1a1c1c] overflow-auto p-[2px] w-full`
  - Header row: `bg-[#1a1c1c]` — cells have white uppercase Space Mono Bold 14px `tracking-[0.7px]`; last cell (ACTIONS) right-aligned
  - Table is `width: 100%`, min-width enforced by fixed column widths

---

### `FiltersRow`
- **Props:**
  ```ts
  type FiltersRowProps = {
    search: string;
    department: string;
    location: string;
    status: string;
    departments: string[];
    locations: string[];
    onSearchChange: (v: string) => void;
    onDepartmentChange: (v: string) => void;
    onLocationChange: (v: string) => void;
    onStatusChange: (v: string) => void;
  };
  ```
- **State:** none (all controlled, state lives in `PositionsPage`)
- **Children:** none
- **Behavior:** Search is a text input (controlled). Department, Location, Status are `<select>` elements styled to look like the Figma dropdowns (native select used for simplicity, styled as shown). Filtering is client-side — no API calls on filter change.
- **Design:**
  - Container: `bg-[#f3f3f3] border-2 border-[#1a1c1c] flex gap-[16px] items-center p-[18px] w-full`
  - Search input: `bg-white border-2 border-[#1a1c1c] flex-1 min-w-[200px] px-[14px] py-[10px]` Arimo 16px `text-[#484831]` placeholder `Search roles...`; search icon (16×16) at left
  - Select dropdowns: `bg-white border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] px-[18px] py-[10px] shrink-0` Space Mono Bold 14px; label prefix shows current value e.g. "Department: All", "Location: All", "Status: Open"

---

### `PositionsPage`
- **Props:** none
- **State:**
  ```ts
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [location, setLocation] = useState('All');
  const [status, setStatus] = useState('Open');
  ```
- **Children:** `StatCard` ×4, `FiltersRow`, `PositionsTable`
- **Behavior:**
  1. On mount, `GET http://localhost:3010/position` — populate `positions`.
  2. Derive stats from loaded positions: `openCount` = positions where `status === 'Open'` (or `'open'` — check actual API shape). `totalApplicants`, `interviewsThisWeek`, and `avgTimeToFill` are not available from the positions endpoint; show `–` as placeholder unless the API returns them.
  3. Filtering is client-side: apply `search` (case-insensitive substring on position title), `department`, `location`, `status` against loaded positions.
  4. "New position" button: navigates to `/add-candidate` (repurposed as create flow, or can be a no-op with a TODO comment — depends on AddCandidateForm scope; link to `/add-candidate` for now).
  5. "VIEW" on a row: `navigate('/positions/:id')`.
- **Design:**
  - Outer: `bg-[#f9f9f9] flex flex-col gap-[32px] p-[48px] min-h-[960px] w-full`
  - Page header: breadcrumb + title + "New position" button in a `flex items-end justify-between`
  - Breadcrumb: `Home /` in `#484831` then `Positions` in `#1a1c1c`, Space Mono Bold 14px
  - Title: Hanken Grotesk 72px font-black `tracking-[-3.6px]`
  - "New position" button: `bg-[#ffff00] border-2 border-[#1a1c1c] drop-shadow-[4px_4px_0px_#1a1c1c] px-[26px] py-[14px] flex gap-[8px] items-center` — `+` icon + "New position" Space Mono Bold 14px. Hover: `bg-[#1a1c1c] text-[#ffff00]`
  - Stats strip: `grid grid-cols-4 gap-[24px]`
  - Loading: centered spinner (see Edge Cases)
  - Error: error banner

---

### `SideNavBar`
- **Props:** none
- **State:** none (active route derived from `useLocation()`)
- **Children:** none (renders nav links directly)
- **Behavior:**
  - Uses `useLocation()` to determine active link. Active link = path starts with the nav item's path.
  - "New Opening" black CTA button: navigates to `/add-candidate`.
  - Nav links: Dashboard (`/`), Positions (`/positions`), Applicants (no-op/future), Interviews (no-op/future), Teams (no-op/future), Analytics (no-op/future), Settings (no-op/future, pinned at bottom).
- **Design:**
  - Outer: `bg-[#eeeeee] border-r-2 border-[#1a1c1c] flex flex-col w-[256px] h-screen fixed left-0 top-0 z-20 overflow-auto`
  - Header section: `border-b-2 border-[#1a1c1c] px-[24px] pt-[24px] pb-[26px]`
    - "LTI" text: Hanken Grotesk 32px font-black uppercase `tracking-[-1.6px]`
    - "HR Management": Space Mono Bold 14px `text-[#484831]`
  - CTA section: `border-b-2 border-[#1a1c1c] px-[16px] py-[16px]`
    - "New Opening" button: `bg-[#1a1c1c] border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] w-full py-[14px]` white text `+` icon
  - Nav links section: `flex-1 relative pt-[16px]`
    - Inactive link: `flex gap-[12px] items-center px-[16px] py-[12px]` text `#484831` Space Mono Bold 14px
    - Active link: `bg-[#ffff00] border-t-2 border-b-2 border-[#1a1c1c] ml-[-4px] mr-[-4px] px-[16px] py-[14px]` text `#757500` Space Mono Bold 14px
  - Settings link: `border-t-2 border-[#1a1c1c] mt-auto px-[16px] pb-[12px] pt-[14px]` — pinned at bottom
  - Icons: 18-24px line icons, black (use a simple icon library or SVGs; lucide-react preferred if already in project, otherwise use text/placeholder)

---

### `TopAppBar`
- **Props:** none
- **State:**
  ```ts
  const [globalSearch, setGlobalSearch] = useState('');
  ```
- **Children:** none
- **Behavior:**
  - Search input: controlled, currently cosmetic (no global search logic needed in this spec).
  - "Dashboard" and "Recruitment" are the two main top nav tabs. Active tab ("Recruitment") shows `bg-[#626200]` with `border-b-2 border-[#0035c6]`.
  - "Add Employee" link: navigates to `/add-candidate`.
  - Notification and help icons: inert (no behavior in this spec).
  - User avatar: inert.
- **Design:**
  - Outer: `bg-[#f9f9f9] border-b-2 border-[#1a1c1c] fixed top-0 left-[256px] right-0 h-[64px] z-10 flex items-center justify-between px-[48px]`
  - Left section: `flex gap-[32px] items-center h-full`
    - Search: icon + `w-[192px]` Arimo 16px placeholder `Search...`
    - Nav tabs in `flex h-full items-start`
      - Inactive tab: `flex h-full items-center px-[16px]` Space Mono Bold 14px `#484831`
      - Active tab (Recruitment): `bg-[#626200] border-b-2 border-[#0035c6] flex h-full items-center px-[16px]` Space Mono Bold 14px `#1a1c1c`
  - Right section: `flex gap-[24px] items-center`
    - "Add Employee": Space Mono Bold 14px `text-[#626200]` underline
    - Icon buttons: 20px icons, black
    - Avatar: `bg-[#f7f7f7] border-2 border-[#1a1c1c] rounded-full w-[32px] h-[32px] overflow-hidden`

---

### `DashboardLayout`
- **Props:** none
- **State:** none
- **Children:** `SideNavBar`, `TopAppBar`, React Router `<Outlet />`
- **Behavior:** Renders the fixed chrome and provides the offset content area. The `<Outlet />` renders the matched nested route (PositionsPage, AddCandidateForm, etc.). Any route not matched within the dashboard redirects to `/positions`.
- **Design:**
  - Outer wrapper: `relative min-h-screen bg-[#f9f9f9]`
  - `SideNavBar` fixed left (built-in to SideNavBar styles)
  - `TopAppBar` fixed top (built-in to TopAppBar styles)
  - Content area: `pl-[256px] pt-[64px]` — no extra wrapper styling needed; child pages own their own padding

---

## Data & API

Base URL: `http://localhost:3010`

```
GET /position
Request:  (none)
Response: Position[]
Errors:   { 500: server error }
```

The Position shape returned by the API (inferred from existing `Positions.tsx` + CLAUDE.md):
```ts
// Verify against actual API response — fields marked ? may not exist
type Position = {
  id: number;
  title: string;           // e.g. "Senior Frontend Engineer"
  status: string;          // e.g. "Open", "Paused", "Closed"
  location: string;        // e.g. "Remote (US)"
  department?: string;     // e.g. "Engineering"
  applicationDeadline: string | null;
  companyName: string;
  // Possibly included:
  hiringManager?: string;        // manager name
  hiringManagerAvatar?: string;  // photo URL (may not exist)
  activeApplicants?: number;     // pipeline count
};
```

> **Note:** Stats card data (total applicants, interviews this week, avg time-to-fill) are not available from `GET /position`. Derive `openCount` by filtering `status === 'Open'` (case-insensitive). For the other three stats, render `–` as placeholder until a stats endpoint exists.

## Types

File location: `src/types/dashboard.ts`

```ts
type Position = {
  id: number;
  title: string;
  status: string;
  location: string;
  department: string;
  applicationDeadline: string | null;
  companyName: string;
  hiringManager?: string;
  hiringManagerAvatar?: string;
  hiringManagerInitials?: string;
  activeApplicants?: number;
};

type StatCardProps = {
  label: string;
  value: string;
  suffix?: string;
};

type StatusChipProps = {
  status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';
};

type PipelineBarProps = {
  total: number;
  activeCount: number;
};

type ManagerCellProps = {
  name: string;
  avatarUrl?: string;
  initials?: string;
};

type PositionRowProps = {
  position: Position;
  onView: (id: number) => void;
};

type PositionsTableProps = {
  positions: Position[];
  onView: (id: number) => void;
};

type FiltersRowProps = {
  search: string;
  department: string;
  location: string;
  status: string;
  departments: string[];
  locations: string[];
  onSearchChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onStatusChange: (v: string) => void;
};
```

## State Management

- **`PositionsPage`** owns: `positions`, `loading`, `error`, `search`, `department`, `location`, `status`
- **`TopAppBar`** owns: `globalSearch` (local, cosmetic only)
- **Derived (computed, not stored):**
  - `filteredPositions` = client-side filter of `positions` by search + department + location + status
  - `openCount` = `positions.filter(p => p.status.toLowerCase() === 'open').length`
  - `departments` = `[...new Set(positions.map(p => p.department).filter(Boolean))]`
  - `locations` = `[...new Set(positions.map(p => p.location).filter(Boolean))]`
- **Nothing needs lifting** between siblings in this spec — `DashboardLayout` holds no state.

## Validation & Constraints

*No constraints specified — validate at API boundary only.*

Filter dropdowns always include "All" as the first option. Status filter includes: All, Open, Paused, Closed, Draft.

## Behaviors

### Route restructuring
1. `App.js`/`App.tsx` wraps child routes in `DashboardLayout` using React Router v7 nested routes:
   ```
   <Route element={<DashboardLayout />}>
     <Route index element={<Navigate to="/positions" replace />} />
     <Route path="/positions" element={<PositionsPage />} />
     <Route path="/positions/:id" element={<PositionBoard />} />
     <Route path="/add-candidate" element={<AddCandidateForm />} />
   </Route>
   ```
2. The existing `RecruiterDashboard` route (`/`) is replaced by a redirect to `/positions`.

### Positions page load
1. Component mounts → `loading = true`
2. `GET /position` → on success: `setPositions(data)`, `loading = false`; on error: `setError(message)`, `loading = false`
3. `filteredPositions` recomputed whenever `positions`, `search`, `department`, `location`, or `status` changes

### Client-side filtering
```
filteredPositions = positions
  .filter(p => search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  .filter(p => department === 'All' || p.department === department)
  .filter(p => location === 'All' || p.location === location)
  .filter(p => status === 'All' || p.status.toLowerCase() === status.toLowerCase())
```

### "New position" button
Navigate to `/add-candidate`.

### "VIEW" button on row
`navigate(`/positions/${position.id}`)`.

### Active nav link detection
Use `useLocation().pathname` and check `pathname === '/positions'` (exact) for Positions, `pathname === '/'` for Dashboard.

## Accessibility

- `SideNavBar` nav links: `role="navigation"` on `<nav>`, each link is a `<Link>` (native keyboard). Active link gets `aria-current="page"`.
- "New Opening" CTA: `<button>` or `<Link>` — either is fine.
- `TopAppBar` search: `<input type="text" aria-label="Global search" />`.
- Filters: `<label>` elements above each `<select>` (visually hidden with `sr-only` if the select text already shows the label).
- Table: `<table>` with `<thead>`, `<tbody>`, `<th scope="col">` on header cells.
- `VIEW` and `...` buttons: `<button>` elements with `aria-label="View {position.title}"` and `aria-label="More actions for {position.title}"` respectively.
- Focus management: no special focus management needed for this layout (no modals).

## Edge Cases & Error States

| Case | How the UI handles it |
|------|-----------------------|
| Loading positions | Full-width centered `Loading...` text (or spinner) inside the main content area; sidebar and topbar still visible |
| Empty positions list after load | Table renders with empty body; show "No positions found." row spanning all columns |
| API error on load | Error banner below filter row: `rounded border border-red-300 bg-red-50 text-red-800 p-4` with error message |
| No positions match filters | Table shows "No positions match your filters." empty row |
| Position has no hiring manager data | `ManagerCell` renders initials derived from position title initials as fallback (e.g., "SFE" → not ideal; show `?` initials in gray circle) |
| Position has no department | Department cell shows `–`; filter omits blank from department options |
| Stats not available from API | Stats cards show `–` for non-derivable values (totalApplicants, interviewsThisWeek, avgTimeToFill) |

## Implementation Order

1. `src/types/dashboard.ts` — all types
2. `src/services/positionService.ts` — `fetchPositions(): Promise<Position[]>` using native `fetch`
3. `src/components/StatCard.tsx` — leaf
4. `src/components/StatusChip.tsx` — leaf
5. `src/components/PipelineBar.tsx` — leaf
6. `src/components/ManagerCell.tsx` — leaf
7. `src/components/PositionRow.tsx` — uses StatusChip, PipelineBar, ManagerCell
8. `src/components/PositionsTable.tsx` — uses PositionRow
9. `src/components/FiltersRow.tsx` — filter controls
10. `src/components/SideNavBar.tsx` — navigation chrome
11. `src/components/TopAppBar.tsx` — header chrome
12. `src/components/PositionsPage.tsx` — container (replaces Positions.tsx)
13. `src/components/DashboardLayout.tsx` — shell, wraps Outlet
14. `src/App.tsx` — update routing (convert App.js to App.tsx, add nested routes)
