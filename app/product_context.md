# Product Context — RCA Chat & Alerts (CommerceIQ / AllyAI)

> Always read this file before designing, building, or describing any feature in this project.
> It defines who we are building for, what problems we are solving, and the exact product language to use.

---

## What is CommerceIQ?

CommerceIQ (CIQ) is an **AI-powered ecommerce management platform** built for consumer brands (primarily CPGs — Consumer Packaged Goods companies) selling on Amazon and other major retailers.

It helps brands **protect revenue, grow market share, and reduce operational overhead** by combining:
- Data aggregation across retailers
- Automation of repetitive ecommerce tasks
- AI analytics and root cause analysis
- Agentic decision-making (AI that can take corrective actions, not just flag issues)

### CIQ's Core Modules
| Module | What It Does |
|---|---|
| **ESM** (Sales & Operations) | Day-to-day sales performance, gap-to-plan tracking, recommendations |
| **Retail Media Management** | Advertising budget and campaign optimization |
| **PRA** (Profit Recovery) | Recovering money lost to Amazon shortages, chargebacks, price variance |
| **Market Share Intelligence** | Competitive positioning and share tracking |
| **Content Agent** | PDP (product detail page) content compliance and SEO |
| **Sales Agent / AllyAI** | Agentic AI workflows — the home of RCA Chat and Alerts |

### The Core Problem CIQ Solves
Brand ecommerce teams are **lean (3–5 people)** managing hundreds or thousands of SKUs across complex retailer environments. CIQ automates the monitoring, alerting, and corrective actions that would otherwise require multiple full-time employees.

---

## What Are We Building? — RCA Chat & Alerts

These two features live inside **Sales Agent (AllyAI)** — the AI-powered command center for ecommerce sales teams.

---

### 1. Root Cause Analysis (RCA) — "Ask AllyAI Diagnostics"

**What it does:**
Automatically identifies *why* sales are changing — drilling across traffic, conversion, price, availability, and media spend — at the SKU, category, and brand level.

**Current state:** A basic version exists in "Ally Sales Teammate II" today.

**What we are building (launching end of Q1 '26):**
An **agentic RCA with Chat** — the "RCA Chat" workflow.

**How it works:**
1. The system surfaces a diagnosis (e.g. "Your Kitchen Appliances category is down $3.1M — driven by a rank drop on 12 high-volume keywords").
2. The user can ask follow-up questions in plain language:
   > "Why is my category share dropping and how do I fix it?"
3. The agent dynamically appends new insights to build a **continuous discovery thread** — not a one-shot answer, but a growing investigation.
4. **Deep Reasoning mode** goes beyond "what happened" to explain *why* and prescribe *what to do next*, aligned to the user's specific sales goals.

**In plain terms:** Think of it like a very smart analyst who is always watching your data, can answer your questions instantly, and tells you exactly what action to take.

---

### 2. Alerts — Proactive SKU-Level Signal Engine

**What it does:**
Surfaces signals when deviations or notable events are detected on specific SKUs — before they compound into bigger revenue losses.

**Alert types (out-of-the-box, not yet configurable by users):**
- Sales Drop / Sales Increase
- Predictive Out of Stock
- Lost Buy Box
- Content Change (competitor or self)
- Search Entry / Exit from Page 1
- Competitor Out of Stock or Promo
- Unavailable / Suppressed SKUs
- Change in Amazon Forecast
- Predicted CRaP (margin risk signal)
- PO Discrepancy

**Where alerts appear:**
- In the platform's **Recommendations** module inside ESM
- Grouped into: Sales, Operations, and Marketing categories
- Delivered via reports and email

**In plain terms:** Alerts are the early warning system. They tell you "something is wrong with this SKU right now" so you can act before it shows up as a revenue miss in your weekly report.

---

## The "Diagnose → Act" Loop

These two features work together as the core loop of the Sales Agent product:

```
Alerts  →  surface a signal ("Payment API sales dropped 40%")
   ↓
RCA Chat  →  diagnose the root cause ("Lost Buy Box on 3 SKUs + keyword rank drop")
   ↓
Recommendations  →  prescribe the action ("Fix content, adjust bids, escalate to ops")
```

---

## Who Are We Designing For? — The Personas

All users are **brand-side ecommerce professionals** at CPG / consumer goods companies.

| Persona | Day-to-Day Focus |
|---|---|
| **Ecommerce Manager / Director** | Sales performance, gap-to-plan tracking, retail execution |
| **Commercial / Sales Team** | Closing performance gaps, reporting up to leadership |
| **Analyst** | Deep-dive diagnostics, data exports, ad-hoc reporting |
| **Finance / Revenue Recovery** | PRA disputes — shortages, chargebacks, price variance |
| **Content / Digital Shelf Team** | PDP content compliance, SEO, syndication |

**Key insight about these users:**
- They are NOT engineers or data scientists.
- They are managing 100s–1000s of SKUs with a 3–5 person team.
- They are always time-poor and need answers fast.
- They care about dollars and rank, not technical metrics.
- The UI must be **clear, fast, and action-oriented** — every screen should answer "so what do I do about it?"

---

## Language & Terminology to Use in the UI

| Use This | Not This |
|---|---|
| SKU | Product / Item |
| Gap to plan | Budget shortfall |
| Buy Box | Purchase button |
| Keyword rank | Search position |
| Out of stock (OOS) | Unavailable |
| Suppress / Suppressed | Hidden / Inactive |
| RCA | Root cause analysis (spell it out on first use) |
| AllyAI | The AI agent (not "chatbot") |
| Insight | Finding / Result |
| Recommendation | Suggestion |

---

## Design Principles (derived from this context)

1. **Dollar-first** — Always show business impact in $ terms, not just percentages.
2. **Action-oriented** — Every alert or insight should have a clear "what to do" next step.
3. **Lean team-friendly** — Minimize clicks. A manager should get to the answer in under 30 seconds.
4. **Trust through specificity** — Show the exact SKU, the exact keyword, the exact drop. Vague insights lose trust.
5. **Agentic, not just reporting** — The UI should feel like talking to a smart analyst, not reading a dashboard.

---

## PRD Excerpt — RCA Landing Page Dynamic Data API

> Version: v1 | Status: Draft
> This section defines the data contract the frontend must consume to power the RCA Landing Page.

### Why This Exists

The RCA Workflow has no proper landing page today, causing a disjointed experience. This API endpoint is the single source of truth for the landing page — it provides pre-prioritized, client-scoped business health signals sorted by **Gap value** (the most impactful gaps first).

---

### Key Concepts — Know These Before Building Any Data-Driven UI

| Term | Definition |
|---|---|
| **Gap Value ($)** | Target sales $ minus actual sales $. Negative = underperforming. **This is the primary sort key for everything.** |
| **Gap Value (Units)** | Target units minus actual units. Used as secondary sort when dollar Gap is tied. |
| **Target Value** | The sales target set for that entity. Used as tertiary sort — lower target ranks higher when both Gap values are tied. |

**Sort precedence (applies to all ranked lists — brands and categories):**
1. Dollar Gap — most negative first *(primary)*
2. Unit Gap — most negative first *(secondary, tie-break on dollar Gap)*
3. Target value ascending *(tertiary, tie-break when both Gap values are equal)*

---

### What the API Returns (Functional Requirements)

#### FR-001 — Overall Business Gap
- Returns the **aggregate Gap value** across the client's entire portfolio.
- This is the top-level health number shown on the landing page.

#### FR-002 — Top Brands by Gap
- Returns **up to 3 brands**, ranked by sort precedence.
- Each brand includes: brand name, dollar Gap, unit Gap.
- If the client has fewer than 3 brands, return all available.

#### FR-003 — Top Categories per Brand
- For **each brand** returned, returns **up to 3 categories** within that brand, ranked by sort precedence.
- Each category includes: category name, dollar Gap, unit Gap.
- If a brand has fewer than 3 categories, return all available.

#### FR-004 — Consistent Sort Order
- All lists (brands and categories) **must** use the three-tier sort described above.

#### FR-005 — Client-Scoped Data
- All data is scoped to the **authenticated client only**. Cross-client data leakage is not acceptable.

---

### How This Maps to the UI

| API Data | Where It Appears in the UI |
|---|---|
| Overall business Gap | Summary banner or top-level stat on the Home/RCA landing page |
| Top 3 brands by Gap | Insight cards row — each card = one brand |
| Top 3 categories per brand | Detail inside each insight card, or expanded drill-down |
| Sort order (most negative first) | The order insight cards and alert lists are rendered — never alphabetical |

### Important Design Implications

- **Never sort alphabetically.** Always sort by Gap value — most negative first. A brand with a -$3.1M gap must always appear before a brand with a -$500K gap.
- **Always show the dollar Gap prominently.** It is the primary signal. Unit Gap is secondary context.
- **The landing page should load with data already prioritized** — the user should not need to sort or filter to find the biggest problem. It must be front and center on arrival.
