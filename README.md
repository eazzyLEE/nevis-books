# Nevis Books

A Clients book-of-business dashboard: stacked acquisition over time, plus a monthly detail table you can expand from company → branch → advisor → channel (Feb 2024–Jan 2025).

## Run

Needs Node 20+ and npm 9+ (workspaces).

```bash
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:3001/api/clients  

```bash
npm test          # client Vitest suite
npm run build     # shared → server → client
```

`npm run dev` is the supported path. The API uses `tsx` in development.

By default `GET /api/clients` waits ~500ms so loading UI is visible. Override with `CLIENTS_DELAY_MS` (e.g. `0` or `1000`) on the server.

## What’s in the repo

npm workspaces:

| Package | What it does |
| --- | --- |
| `client` | React 19 + TypeScript + Vite + Recharts |
| `server` | Express `GET /api/clients` (and a health check) |
| `shared` | `Company` types, month labels, and the sample payload from the brief |

CSS tokens are in `client/src/styles/tokens.css`, then CSS modules. Vite proxies `/api` to the Express server.

### How the client is split

I kept UI presentational and put tree/chart math in plain functions so it’s easy to test without mounting React:

- `domain/` — company → chart series, summary metrics, visible table rows  
- `hooks/useClients` — fetch lifecycle (loading / success / error + retry)  
- `hooks/useClientsDashboard` — page wiring (expansion, month highlight, derived props)  
- `components/` — page shell, chart, table  
- `api/` — `fetchClients`  
- `formatting/` — month tick labels and highlight opacity helpers  

```text
ClientsPage (compose)
  └─ useClientsDashboard
        ├─ SummaryStrip  ← buildClientSummary
        ├─ ClientsChart  ← buildChartSeries
        └─ ClientsTable  ← buildVisibleRows
              ↑ expand/collapse + month highlight
                    │
              useClients → fetchClients → GET /api/clients
```

`ClientsPage` mostly composes. Expansion is a `Set` of open ids (no global store). Default: Company open, everything under it closed- same as the first design frame. Collapsing a parent also clears its descendants so a re-expand doesn’t resurrect nested open state.

## Assumptions

These are the calls the brief left open, and why I landed where I did.

**Chart vs table numbers.** The chart stacks **acquisition channels**, summed by channel name across the tree. The table shows each node’s own `values`. In the sample data only Anna Blackwood has channels, so chart totals are smaller than company/branch totals. I think that’s the right read of “acquisition over time,” but it’s also the biggest place the brief’s data and the design totals can disagree (see Open questions).

**Uneven tree.** Branch 2 and Branch 3 have no employees; only Anna has channels. Rows without children simply omit the expand control.

**Avatars.** The design shows photos; the payload only has names. I used initials rather than inventing image URLs.

**Series colors.** Palette by first-seen series index (CSS tokens), not hard-coded channel names, so a new channel still gets a color.

**Look and feel.** Light theme only. Neutrals lean on Nevis marketing beige/near-black; purple accent and chart stacks follow the assignment UI. Table zebra is intentionally soft. Not aiming for pixel-perfect Figma parity.

**Narrow viewports.** Full responsive redesign wasn’t required. Down around 375px the table keeps a sticky name column and scrolls horizontally for the months instead of crushing the layout.

**Month highlight.** Hovering/focusing a month in the table (or hovering it on the chart) ties the two views together with a light column highlight and a soft dim on other bars. Tooltip stays chart-hover only so the table doesn’t drag a floating tooltip around.

## Accessibility

Expand/collapse uses native buttons with `aria-expanded` (keyboard: Enter / Space). Rows expose `aria-level` for the hierarchy. The Recharts plot is treated as decorative; there’s a figcaption plus a visually hidden month × series data table for screen readers. Month headers are focusable so the highlight sync works from the keyboard too. Chevron animation and skeleton pulse respect `prefers-reduced-motion`.

I didn’t implement a full `treegrid` arrow-key model- the expand control is the primary keyboard path. That felt like the right cut for the timebox; it’s listed under next steps if hierarchy navigation becomes a hard requirement.

## Tests

```bash
npm test
```

Coverage includes chart aggregation, summary metrics, visible-row flattening (including collapse-clears-descendants), `useClients` states, expand control / table / chart UI (including the accessible data table), page-level error + retry, and month-highlight helpers.

TypeScript is strict (`strict`, unused checks, `noUncheckedIndexedAccess`, etc.). There’s no ESLint/Prettier config yet — I’d add that with CI if this lived past the exercise.

## Open questions

- Should the chart use company-level totals (or a blend) so it lines up with the table “book” numbers? Right now channel-only stacking matches acquisition language but not the big company figures in the design.
- On collapse, clear nested expand state (current) or remember it for power users?
- Anything else in the sample tree that should drive the chart (e.g. employees without channels)?

## What I’d do next

Product-wise: expand/collapse all, thousands separators, optional name filter, photo avatars once the API has URLs.

Engineering-wise: lint/format in CI, one page-level expand/collapse UI test, React Query once there’s more than one resource, and lazy-loading Recharts again when the Vitest path is solid (it’s eager today because lazy + Suspense was flaky under test).

Deliberately not in this version: auth, multi-company switching, date range / CSV export, mutations, Redux, or chasing every Figma detail.
