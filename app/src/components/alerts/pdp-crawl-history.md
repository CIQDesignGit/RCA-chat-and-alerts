# PDP Crawl Snapshot — Design & Reimplementation Guide

> **Status:** Spec documented on `main`. Full implementation lives on branch `crawl_snapshot`.
> **Primary code module (when implemented):** `pdp-crawl-history.ts`
> **UI integration:** `sku-rca.tsx` (`IssueCrawlIndicator`, `RootCauseRow`, `RootCauses`) and `alert-details-panel.tsx` (`PdpHistoryDropdown`)

---

## What problem does this solve?

Each **issue row** in the SKU RCA **Issues** section (formerly “Root causes”) needs a compact way to answer:

> *“Was this issue detected on each of our recent PDP crawls?”*

Instead of repeating status dots or a legend, we show a **row of small squares** — one per crawl — directly on each issue row, next to the expand chevron.

---

## Core concept

| Idea | Detail |
|------|--------|
| **One square = one PDP crawl** | Same crawl list as **PDP Snapshots** in the SKU header dropdown |
| **Left → right = oldest → newest** | Chronological strip; rightmost square is the latest crawl |
| **Grey square** | Issue **not** detected on that crawl |
| **Filled square** | Issue **was** detected on that crawl |
| **Rose fill** | Bad / ongoing issues (lost Buy Box, OOS, etc.) |
| **Amber fill** | Warning-only issues (e.g. **Coupon**) |
| **Healthy (OK) rows** | All squares grey — no detections |

This replaces the old **live-status colored dots** (red/amber/green circles) to the left of each row icon. Those dots and the **Ongoing Issue / Warning / OK** legend were removed to avoid duplicate signaling.

---

## Where it appears in the UI

```
Issues                                    Last updated 11:35 AM today (2h ago)
├── PDP & Promos
│   └── [Buy Box row]
│       icon  Buy Box  [Lost]  −$119.7K   [□□■■■■■]  ▼
│                              ↑ impact    ↑ crawl strip
```

**Row layout (left → right):**
1. Icon + issue label + status pill (`Lost`, `OK`, etc.)
2. Impact chip (if dollar impact exists) — grey background, tooltip on hover
3. Flex spacer
4. **Crawl indicator strip** (`IssueCrawlIndicator`)
5. Chevron

---

## Shared data module: `pdp-crawl-history.ts`

Single source of truth for crawl timestamps. Used by:
- **PDP Snapshots dropdown** (`alert-details-panel.tsx`) — newest first
- **Issue crawl squares** (`sku-rca.tsx`) — oldest → newest (`PDP_CRAWL_HISTORY_CHRONOLOGICAL`)

### Types

```ts
type PdpCrawlEntry = {
  crawledAt: string;  // ISO timestamp
  url: string;        // snapshot URL fallback
};
```

### Exports

| Export | Purpose |
|--------|---------|
| `MOCK_PDP_CRAWL_HISTORY` | Crawl list, **newest first** (dropdown order) |
| `PDP_CRAWL_HISTORY_CHRONOLOGICAL` | Same list **reversed** (indicator strip order) |
| `CRAWL_COUNT` | `MOCK_PDP_CRAWL_HISTORY.length` |
| `formatCrawlTimestamp(crawledAt)` | Display label for tooltips & dropdown |
| `pdpSnapshotUrl(asin, fallbackUrl)` | `https://www.amazon.com/dp/{asin}` or fallback |

### Timestamp formatting (`formatCrawlTimestamp`)

**Within last 24 hours:**
```
2:30 PM (2 hours ago)
```
- Time in 12-hour format
- Relative “ago” in hours (or minutes if &lt; 1 hour)

**Older than 24 hours:**
```
May 25, 2026, 9:00 AM
```
- `Mon D, YYYY, h:mm AM/PM`

### Mock data (dev)

Crawls are generated relative to `Date.now()` via `crawlAtHoursAgo(hours)` so “ago” labels stay fresh on refresh. Example offsets: 2.5h, 8h, 14h, 20h, 36h, 48h (6 crawls).

**Production:** Replace mock array with API response — one `crawledAt` + snapshot `url` per crawl, sorted newest-first in the API; reverse for the indicator strip.

---

## Crawl indicator component: `IssueCrawlIndicator`

**Location:** `sku-rca.tsx`

**Props:**
- `detections: boolean[]` — length must equal `CRAWL_COUNT`; `true` = issue seen on that crawl
- `variant: "rose" | "amber"`
- `asin?: string` — builds PDP link in tooltip

### Square styling

| State | Classes |
|-------|---------|
| Not detected | `bg-slate-200` |
| Detected (bad) | `border border-rose-300 bg-rose-100` |
| Detected (warning) | `border border-amber-300 bg-amber-100` |
| Size | `h-2 w-2.5` (8×10px), `rounded-[2px]`, `box-border` |

### Per-square tooltip

On hover, each square shows:
```
{formatCrawlTimestamp(crawledAt)}  [↗ external link icon]
```

- Link opens PDP snapshot in new tab
- `onClick` on link uses `stopPropagation()` so the row does not expand/collapse
- Use `@/components/ui/tooltip` (`Tooltip`, `TooltipTrigger`, `TooltipContent`)
- **Important:** Recharts also exports `Tooltip` — alias chart tooltip as `ChartTooltip` in `sku-rca.tsx` to avoid duplicate import error

---

## Detection data: `getCrawlDetections(cause)`

**Location:** `sku-rca.tsx`

- If `cause.liveStatus === "ok"` → all `false` (all grey squares)
- Otherwise → boolean array keyed by `cause.id` (mock patterns per issue type)
- Array is sliced to `CRAWL_COUNT` so it stays in sync if crawl count changes

**Variant:** `getCrawlIndicatorVariant(cause)` returns `"amber"` only when `issueCardType === "coupon"`; everything else uses `"rose"`.

**Production:** Replace mock `patterns` record with API field per issue, e.g. `cause.crawlDetections: boolean[]` aligned to `PDP_CRAWL_HISTORY_CHRONOLOGICAL` order.

---

## Impact chip (related UI change)

Dollar impact (e.g. `−$119.7K`) no longer shows inline label **“Est. revenue impacted”** on every row (too repetitive).

Instead:
- Chip: `bg-slate-100 px-1 pt-0.5 text-sm font-medium text-slate-700`
- Tooltip on hover: **“Estimated revenue impacted”**
- Stored on each cause as `impactLabel` (constant `REVENUE_IMPACT_TOOLTIP`)

---

## Issues section header (related UI changes)

| Before | After |
|--------|-------|
| Title: “Root causes” | Title: **“Issues”** |
| Subtitle: “From previous 24 hours” | **“Last updated 11:35 AM today (2h ago)”** (mock: `rootCausesLastChecked`) |
| Right-aligned “As of …” + legend | Legend removed; timestamp moved under title |

---

## Files to touch when reimplementing

| File | Changes |
|------|---------|
| `app/src/components/alerts/pdp-crawl-history.ts` | **Create** — types, mock/API data, formatters |
| `app/src/components/sku/sku-rca.tsx` | `IssueCrawlIndicator`, `getCrawlDetections`, `RootCauseRow` layout, impact tooltip, section header |
| `app/src/components/alerts/alert-details-panel.tsx` | Import shared history + `formatCrawlTimestamp` in PDP Snapshots dropdown |

---

## API contract (suggested for production)

```ts
// Per SKU — shared crawl timeline
GET /sku/{asin}/pdp-crawls
→ { crawls: { crawledAt: string; snapshotUrl: string }[] }  // newest first

// Per issue row — detections aligned to chronological crawl order
GET /sku/{asin}/rca/issues
→ issues[].crawlDetections: boolean[]  // same length as crawls, oldest→newest
→ issues[].severity: "bad" | "warning" | "ok"  // drives rose vs amber vs all-grey
```

---

## Checklist for QA

- [ ] Square count matches PDP Snapshots list length
- [ ] Leftmost square = oldest crawl; rightmost = newest
- [ ] OK issues show all grey squares
- [ ] Coupon uses amber; other active issues use rose
- [ ] Tooltip timestamp format switches at 24h boundary
- [ ] PDP link in tooltip uses correct ASIN
- [ ] Clicking tooltip link does not toggle row accordion
- [ ] Impact chip tooltip shows “Estimated revenue impacted”
- [ ] No `Tooltip` naming conflict with Recharts in `sku-rca.tsx`
