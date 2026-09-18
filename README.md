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
npm run start     # serve built API (after build)
```

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
| `components/` | Page shell, chart, and expandable table (CSS modules) |
| `hooks/` | `useClients` — loading / success / error + retry |
| `domain/` | Pure mappers: company → chart series, company + expand state → visible rows |
| `api/` | `fetchClients` against `/api/clients` |
| `shared` | `Company` types, month labels, sample payload (used by API + tests) |

```text
┌─────────────────────────────────────────┐
│  ClientsPage                            │
│   ├─ ClientsChart  ← buildChartSeries   │
│   └─ ClientsTable  ← buildVisibleRows   │
│         ↑ expand/collapse (Set of ids)  │
└──────────────────┬──────────────────────┘
                   │ useClients
                   ▼
            fetchClients  ──proxy──►  Express GET /api/clients
```

**UI behavior**

- Expansion is a `Set` of open node ids in page state (no global store).
- Collapsing a node clears its descendants, so re-expanding shows children collapsed.
- Default view: Company expanded; branches / employees / channels closed.

## Assumptions

- **Chart vs table:** The chart stacks acquisition **channels** aggregated by channel name across the tree. Today only Anna Blackwood has channels, so chart totals are smaller than company/branch table totals (which come from each node’s own `values`).
- **Series colors:** Fills follow first-seen series index in a CSS palette, not hard-coded channel names.
- **Avatars:** Initials from employee names (no image URLs in the payload).
- **Tokens:** Page neutrals from Nevis marketing (`#F7F6F0` / `#141413`); product accent and chart stacks follow the assignment UI (purple diamond / lavender–rose stacks).

## Accessibility

- Expand controls are native buttons with `aria-expanded` and keyboard support (Enter / Space).
- Hierarchical rows expose `aria-level`; the chart plot is decorative with a figcaption plus a visually hidden month × series data table.
- Expand chevron honors `prefers-reduced-motion`.
- Full `treegrid` arrow-key navigation was out of scope; expand/collapse via the control is the primary keyboard path.

## Tests

Client tests cover:

- Domain chart aggregation and visible-row flattening (including collapse-clears-descendants)
- `useClients` loading / error / retry
- Expand control, table, and chart (including accessible data table)

```bash
npm test
```

## Open questions / next steps

- Should the chart instead stack company-level totals (or a mix), to match design totals more closely?
- Photo avatars if the API gains image URLs.
- Optional product polish: panel titles, summary metrics, layout skeletons under the load delay, soft app chrome.
- Deeper a11y: `role="treegrid"` keyboard model if hierarchical table navigation becomes a requirement.

## Out of scope for this version

Pixel-perfect Figma parity, auth, multi-company switching, date-range controls, React Query / Redux, and a full responsive redesign beyond usable narrow viewports (sticky name column + horizontal scroll).
