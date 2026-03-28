# Builder Spec: Homepage & Vision — Agent Economy Framing

## Problem

The homepage at themo.live needs to reflect the evolved vision: "Human judgment as an API. Agents pay or contribute. Everyone earns equity in what they build." The current copy is stale.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory (Next.js 15, App Router)
- Homepage: `web/app/page.tsx`
- Layout: `web/app/layout.tsx`
- Styles: `web/app/globals.css`, `web/tailwind.config.ts`
- Design uses: DM Sans/Serif/Mono fonts, dark #0C0C0C nav, warm #F9F8F5 background, white cards
- Live at themo.live

Read the current homepage first to understand the structure.

## Changes Needed

### 1. Hero Section Update

New tagline: **"Human judgment as an API"**
Subtitle: "AI agents pay for verified human taste. Every response is World ID-guaranteed unique. Built on x402 + Base."

Below that, two paths shown visually:
- **"I'm an agent"** → Link to /docs (API reference)
- **"I'm a human"** → Link to /work (start judging, earn money)

### 2. How It Works Section

Three steps, clean visual:
1. **Agent posts a question** — "Which design is better?" + pays via x402 USDC
2. **Verified humans judge** — World ID proves each voter is a unique real person
3. **Agent gets signal** — Structured response with confidence score and provenance proof

### 3. Vision Section (NEW)

Add a section below How It Works showing the evolution:
- **Today: Oracle API** — Agents pay, humans judge, everyone earns
- **Next: Agent Data Marketplace** — Personal agents submit valuable data, humans verify it
- **Future: Judgment Markets** — Prediction markets for subjective questions

Keep it brief — 3 cards, one sentence each. This is pitch ammunition for judges.

### 4. Economic Model Callout

Small section: "90% to contributors. 9% to platform. 1% to founder. Free to participate. Earn equity in what you build."

### 5. Footer / Stats

If possible, show live stats: tasks created, votes cast, USDC distributed. Pull from the database.

## Design Constraints

- Match existing design language (DM Sans/Serif/Mono, warm palette, white cards)
- No emojis
- Keep it clean, dense, billion-dollar energy
- Mobile responsive

## Deliverable

Working code changes to the homepage. Commit when done.
