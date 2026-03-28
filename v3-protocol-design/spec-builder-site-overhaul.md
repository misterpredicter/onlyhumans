# Builder Spec: Website Overhaul — OnlyHumans Rebrand

## Mission

The website at themo.live still reflects the old "Human Signal / sybil-resistant annotation API" framing. It needs to reflect the OnlyHumans vision: an agent economy where humans steer. Every page should feel like a platform where agents and humans both come to make money.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory (Next.js 15, App Router)
- README.md has the correct vision — use it as the source of truth for copy
- New components already built by other builders: EconomicsBreakdown.tsx, LeaderboardPanel.tsx, SplitBadge.tsx
- Live at themo.live, deployed via Vercel
- Git remote: github.com/misterpredicter/onlyhumans.git
- PUSH YOUR CHANGES when done

## Changes Needed

### 1. Global Rebrand
- All references to "Human Signal" → "OnlyHumans"
- Page title, meta tags, nav bar, footer — everything
- The nav should say "OnlyHumans" not "Human Signal"

### 2. Homepage (page.tsx)
Read the README for the vision. The homepage should tell this story:

**Hero:** "OnlyHumans" big. Subtitle: "The irony is intentional. It's called OnlyHumans, but it's mostly agents." Then: "A platform where people steer their AI agents to monetize. Agents earn, compete, and build. Humans provide the taste, the governance, and decide where the compute goes."

**Two paths (big, clear CTAs):**
- "I have agents" → /docs (put your agents to work)
- "I'm a human" → /work (get paid. show up, have taste, make money.)

**How it works:**
- Agents propose, build, execute, submit data
- Humans judge, steer, govern, verify
- Everyone earns equity — 90% to contributors, transparent and immutable

**The four human roles** (from README):
- Taste / Governance / Compute allocation / Outbound execution

**Economics visual:** Use the EconomicsBreakdown component if it exists, or build a clean visual showing 90/9/1 with the internal market explanation

**Vision section:** Now → Next → Eventually (from README)

### 3. /work Page
This is where humans come to get paid. It should feel like opening a marketplace where money is waiting:
- "Get paid for your taste" as the header
- Show available tasks with pay amounts prominently displayed
- Show the split for each task (use SplitBadge if available)
- Leaderboard sidebar showing top earners (use LeaderboardPanel if available)

### 4. /docs Page
Agent-first. "Put your agents to work" energy:
- Quick start front and center
- Show how agents earn on the platform
- The economics visible

### 5. /agent Page
Agent dashboard — "Your agents at a glance":
- Platform health/status
- Available work
- Pricing
- Economics

### 6. Footer
On every page: "90% to contributors. 9% to platform. 1% to founder. Free to participate."

## Design Language
- Keep the existing warm palette (DM Sans/Serif/Mono, #F9F8F5 bg, white cards)
- But make it feel MORE premium — this is a billion-dollar platform, not a hackathon project
- No emojis
- Dense, confident copy. Short sentences.

## Constraints
- Don't break existing API functionality
- Use existing components (EconomicsBreakdown, LeaderboardPanel, SplitBadge) where they exist
- Commit and PUSH to github.com/misterpredicter/onlyhumans.git when done
