# Nevis Books

Clients book-of-business dashboard: stacked acquisition chart and an expandable hierarchy table for company → branch → employee → channel, over Feb 2024–Jan 2025.

## Stack

npm workspaces monorepo:

| Package | Role |
| --- | --- |
| `client` | React 19 + TypeScript + Vite + Recharts |
| `server` | Express `GET /api/clients` (+ health) |
| `shared` | Shared `Company` types, month labels, and the sample payload |

No CSS framework — design tokens (`client/src/styles/tokens.css`) and CSS modules. Vite proxies `/api` → `http://localhost:3001`.

## Requirements

- Node.js 20+
- npm 9+ (workspaces)

## Run locally

```bash
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001/api/clients](http://localhost:3001/api/clients)

Useful scripts:

```bash
npm test          # client Vitest suite
npm run build     # shared → server → client
```

Local development is via `npm run dev` (tsx). A production `npm start` path for the built API is not the supported demo flow yet.

### Simulated API latency

`GET /api/clients` waits ~500ms by default so loading UI is visible in demos.

```bash
CLIENTS_DELAY_MS=0 npm run dev:server   # disable
CLIENTS_DELAY_MS=1000 npm run dev:server
```

## Architecture

The client is layered so UI stays presentational and tree logic stays testable without React:

| Layer | Responsibility |
| --- | --- |
| `components/` | Page shell, summary, chart, and expandable table (CSS modules) |
| `hooks/` | `useClients` — loading / success / error + retry |
| `domain/` | Pure mappers: company → chart series / summary / visible rows |
| `api/` | `fetchClients` against `/api/clients` |
| `shared` | `Company` types, month labels, sample payload (used by API + tests) |

```text
┌──────────────────────────────────────────────────┐
│  ClientsPage                                     │
│   ├─ SummaryStrip  ← buildClientSummary          │
│   ├─ ClientsChart  ← buildChartSeries            │
│   └─ ClientsTable  ← buildVisibleRows            │
│         ↑ expand/collapse (Set of ids)           │
└──────────────────────┬───────────────────────────┘
                       │ useClients
                       ▼
                fetchClients  ──proxy──►  Express GET /api/clients
```

**UI behavior**

- Expansion is a `Set` of open node ids in page state (no global store).
- Collapsing a node clears its descendants, so re-expanding shows children collapsed.
- Default view: Company expanded; branches / employees / channels closed.
- Loading uses layout-shaped skeletons (chart bars + table grid) under the API delay.
- Errors surface once at page level (“Couldn’t load clients”) with Retry; chart/table panels stay hidden until data loads.

## Assumptions

- **Chart vs table:** The chart stacks acquisition **channels** aggregated by channel name across the tree. Today only Anna Blackwood has channels, so chart totals are smaller than company/branch table totals (which come from each node’s own `values`).
- **Series colors:** Fills follow first-seen series index in a CSS palette, not hard-coded channel names.
- **Avatars:** Initials from employee names (no image URLs in the payload).
- **Tokens:** Page neutrals from Nevis marketing (`#F7F6F0` / `#141413`); product accent and chart stacks follow the assignment UI (purple diamond / lavender–rose stacks).

## Accessibility

- Expand controls are native buttons with `aria-expanded` and keyboard support (Enter / Space).
- Hierarchical rows expose `aria-level`; the chart plot is decorative with a figcaption plus a visually hidden month × series data table.
- Expand chevron and loading skeletons honor `prefers-reduced-motion`.
- Full `treegrid` arrow-key navigation was out of scope; expand/collapse via the control is the primary keyboard path.

## Tests

Client tests cover:

- Domain chart aggregation, summary metrics, and visible-row flattening (including collapse-clears-descendants)
- `useClients` loading / error / retry
- Expand control, table, and chart (including accessible data table)

```bash
npm test
```

Standards today are enforced by TypeScript strictness (`strict`, unused checks, `noUncheckedIndexedAccess`) and the Vitest suite — there is no ESLint/Prettier config yet (see Improvements).

## Open questions

- Should the chart instead stack company-level totals (or a mix), so chart and table speak the same “book” numbers?
- Should collapse always clear descendants (current behavior), or preserve nested expand state for power users?

## Improvements

Honest next steps if this grew beyond a focused dashboard slice — split into product feel vs engineering hygiene.

### Product (make it feel like a real Clients book)

- **Table affordances** — Expand all / Collapse all; a short empty hint when everything is collapsed.
- **Chart ↔ table sync** — hover or focus a month in the table to emphasize that month on the chart (and vice versa).
- **Density & formatting** — thousands separators; optional compact table density for long trees.
- **Search / filter** — filter the hierarchy by branch or employee name (local state only).
- **Richer identity** — photo avatars when the API provides URLs; soft app shell with product name + Clients as the current section.

### Engineering

- **Lint / format** — ESLint + Prettier (or Biome) with a CI check before merge.
- **Page-level expand test** — one UI test that expands Company → Branch and asserts collapse clears descendants end-to-end.
- **Data layer** — React Query (or similar) for cache, stale-while-revalidate, and clearer retry semantics once there is more than one resource.
- **Chart code-splitting** — lazy-load Recharts again once the Vitest/lazy path is stable (eager import today to keep tests reliable).

## Out of scope for this version

Pixel-perfect Figma parity, auth, multi-company switching, date-range / CSV export, mutations, notifications, Redux, and a full responsive redesign beyond usable narrow viewports (sticky name column + horizontal scroll).
