Generate a dashboard

Create three desktop dashboard UI screens (1440×1024) for LTI — an HR management system, using the layout cues from the provided screenshots (fixed left sidebar, clean top bar, lots of whitespace, bold accent CTAs), but reimagined in a brutalist design system with yellow + blue accents.

Overall style direction (Brutalist)
• Aesthetic: raw, utilitarian, grid-first, high-contrast, minimal decoration, intentionally “printed UI” feel.
• Typography: bold grotesk or monospaced for headings; neutral sans for body. Large, confident type scale.
• Surfaces: off-white / light gray canvas; components in flat blocks; thick 2–3px borders, sharp corners (0–4px radius max).
• Accents: saturated electric blue and safety yellow for primary actions, tags, and key states. Use black/near-black for structure.
• Interaction states: obvious hover (border invert / underline), strong focus rings, clear disabled states.
• Icons: simple line icons, consistent stroke weight.
• Layout: strict 12-column grid, generous spacing, clear alignment, no soft shadows (or extremely minimal).

Global layout requirements (all pages)
• Left sidebar (fixed): LTI logo at top; navigation items with icons; active item highlighted (blue/yellow bar + bold label).
• Suggested nav: Dashboard, Positions, Applicants, Interviews, Teams, Analytics, Settings.
• Top bar: page title on left; breadcrumbs under title or inline below; user menu top-right (avatar + name + dropdown).
• Main content: modular sections with headers, filters, and dense-but-readable data presentation.
• CTA pattern: one primary CTA per page (yellow button with black text; blue secondary).

⸻

Screen 1 — Positions Dashboard (Main page)

Design the “Open Positions” overview.
• Header: “Positions” + breadcrumb: Home / Positions
• Primary CTA: “New position”
• Filters row: Search, Department, Location, Status (Open/Paused/Closed), Sort by (Newest / Most applicants)
• Main content:
• A table-first layout (brutalist, data-forward) listing open roles with columns:
• Role title, Department, Location, Hiring manager, Applicants, Stage distribution (small block bar), Status, Last updated
• Each row has a hard-edged “View” action and overflow menu.
• Add a compact right-side summary panel or top stats strip:
• Open roles, Total applicants, Interviews this week, Time-to-fill (avg)

Screen 2 — Position Detail + Applicants Kanban

Design a single position page showing details and applicant pipeline.
• Header: Position title (e.g., “Senior Product Designer”) + breadcrumb: Home / Positions / Senior Product Designer
• Top section (split layout):
• Left: role details card (level, department, location, employment type, salary range, description preview)
• Right: key metrics (applicants total, conversion %, days open) + actions: Edit, Share, Pause/Close
• Main section: Applicants Kanban board with brutalist columns and strong borders.
• Columns: Applied, Screening, Interview, Offer, Hired, Rejected
• Cards show: candidate name, source tag, last activity, rating, quick actions (message / schedule)
• Add a top board toolbar: Search applicants, filter by stage/score, “Add applicant”
• Include a small activity timeline panel or tab (Activity / Notes / Files) with stark typography and divider lines.

Screen 3 — Design System Showcase

Create a component gallery page for the LTI brutalist system.
• Header: “Design system” + breadcrumb: Home / Design system
• Sections laid out in a clean grid with labeled specimens:
• Typography scale (H1–H6, body, caption), spacing tokens
• Buttons: primary (yellow), secondary (blue), tertiary (outline), destructive (black/red accent), disabled, loading
• Form controls: input, textarea, select, checkbox, radio, toggle, search field
• Alerts/toasts: info (blue), warning (yellow), success, error
• Cards/panels: bordered containers, header + body + footer variants
• Tables: dense and roomy variants, sorting header, pagination
• Badges/tags: status pills with hard edges (Open, Paused, Closed)
• Modals + drawers: harsh border, strong overlay, clear hierarchy
• Kanban card specimen consistent with Screen 2

Output constraints
• High-fidelity UI, no device mockups, no 3D, no gradients-heavy skeuomorphism.
• Maintain consistent spacing, border thickness, and component styling across all three screens.
• Ensure readable contrast and accessible focus states.
