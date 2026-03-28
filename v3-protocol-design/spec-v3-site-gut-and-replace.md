# Builder Master Spec: Gut and Replace — OnlyHumans V3

## Read First

Before writing a single line of code, read these files in this order:
1. `Desktop/Hackathons/World Coinbase Hackathon x402/onlyhumans/spec-v3.md` — the real spec
2. `Desktop/Hackathons/World Coinbase Hackathon x402/onlyhumans/dawson-raw-prompts.md` — what Dawson actually said
3. `Desktop/Hackathons/World Coinbase Hackathon x402/onlyhumans/chatgpt-feedback.md` — best copy identified
4. `Desktop/Hackathons/World Coinbase Hackathon x402/onlyhumans/grok-feedback.md` — strongest critique

## Context

The website at themo.live is STILL the old Human Signal annotation API with new paint. Dawson's vision has evolved far past "human judgment as an API." That was the hackathon starting point. The real idea is OnlyHumans — a platform where you bring your agents to earn money, with humans providing taste, governance, and steering.

**Dawson said:** "this has to be valuable enough for people to use it, both inside and outside of the hackathon." This is not a demo. It needs to feel like a real product someone would actually use.

**Dawson said:** "I got depressed today because my ideas get sloppified so much. This cannot be that."

## The Anti-Slop Rules

These are non-negotiable:

1. **Use Dawson's actual words as copy.** The best lines are already written. Don't "improve" them into generic AI voice. Here are the keeper lines (identified by ChatGPT as the strongest copy):
   - "It's called OnlyHumans, but it's mostly agents."
   - "You steer them. You provide taste when they need a human call. You earn from everything they produce."
   - "Go solo or form a team."
   - "Execution > ideation. Shipping > talking."
   - "You're the capital allocator, but the capital is compute."
   - "One person running 3,000 agents = skill, encouraged."
   - "The network is the moat."
   - "Coordination wins."

2. **No buzzwords without substance.** If a word could appear in any startup's pitch deck, cut it. No "revolutionize," "empower," "unlock," "leverage," "next-generation."

3. **No walls of text.** Short sentences. Dense. Every sentence earns its place.

4. **No fake enthusiasm.** The honest founder's note at the bottom is the vibe for the whole site: "Is a lot of this rough? Yes. Are we here because this is exciting? Also yes. Let's find out."

5. **Numbers over adjectives.** "CashClaw: 252 agents, $45 total" beats "a rapidly growing ecosystem."

## What to KILL

Remove or completely rewrite any page content that:
- Leads with "human judgment as an API" as the primary pitch
- Frames the platform primarily as an annotation/RLHF tool
- Shows hardcoded 90/9/1 as THE economics (economics are flexible now)
- Uses "sybil-resistant A/B preference oracle" or similar old framing
- Has generic startup copy that sounds like every other hackathon project

## Page by Page

### Homepage (`web/app/page.tsx`)

The homepage tells the story in this order:

**Hero:** "OnlyHumans" — big, confident. "It's called OnlyHumans, but it's mostly agents." Then: "A platform where you bring your AI agents to make money. Steer them. Provide taste. Earn from everything they produce."

Two CTAs: "Join the Project" → /join, "Read the Spec" → /spec

**Section: What this is.** Not a long explanation. Three short blocks:
- "Go solo or form a team." One sentence on each.
- "Arb the old economy or build the new one." One sentence on each.
- "Your agent finds work, executes, gets paid." One sentence.

**Section: Why a network beats solo.** The CashClaw comparison:
- Solo: $0.18/agent average (252 agents, $45 total on Moltlaunch)
- Network: shared deal flow, verified reputation, human judgment, team coordination
- "That's the experiment. We think coordination beats isolation."

**Section: What humans do.** The four roles table. Clean. No extra copy. The table speaks for itself.

**Section: Why now.** Real numbers only. OpenClaw 247K stars. CashClaw $45. Moltbook collapsed. x402 live. World AgentKit March 17. Not "proof of traction" — "why this is buildable today."

**Section: The honest note.** "Is a lot of this rough? Yes. This is a hackathon project built in a weekend. Are we here because agents and frontier tech feel exciting? Also yes. The interesting question is whether coordination between humans and agents produces something worth more than the sum of its parts. Come find out."

CTA: "Join" + "@macrodawson on X"

### /join (`web/app/join/`)

Already mostly right. Keep the World ID verification flow. Make sure the post-verification experience feels like "you're in" not "now what." After verification:
- "You're verified. Here's what you can do."
- Link to /agent (bring your agents)
- Link to /spec (read the vision)
- Link to the GitHub repo (contribute)
- Link to /contributors (see who else is here)

### /agent (`web/app/agent/page.tsx`)

Just rebuilt — "Bring your agent. It earns money here." This is good. Keep it. Make sure the CashClaw fork CTA is prominent. The solo vs network comparison cards are strong.

### /spec (`web/app/spec/page.tsx`)

Renders spec-v3.md as a clean, readable page. Already built. Keep it. Make sure typography is excellent — this is long-form reading.

### /contributors (`web/app/contributors/`)

Already built. Scoreboard of World ID verified contributors. Keep it. Make sure it shows 0-state gracefully ("Be the first to verify").

### /work → RETHINK

The old /work page is an annotation task feed. That's ONE thing the platform can do, not THE thing.

**Option A (recommended):** Rename to "Opportunities" or just keep /work but reframe the intro copy. Instead of "Vote on tasks, earn USDC" it should be "Find work for your agents. Browse opportunities posted by other humans and agents. Pick what matches your skills." The existing task feed can stay as demo content — it's real functionality. Just reframe it.

**Option B:** Gut it entirely and show a "coming soon — marketplace launching" placeholder. Less useful but more honest.

Go with Option A. Keep the functional task feed but change the framing.

### /docs → RETHINK

The old /docs page is a Stripe-style API reference for the annotation API. That's still useful but shouldn't lead.

Restructure:
1. **Getting started:** Fork CashClaw → point at OnlyHumans → verify with World ID → earn
2. **For humans:** Verify → browse → vote → earn
3. **API reference:** The existing endpoint docs (keep these — they work and they're functional)
4. **Economics:** Brief section on flexible splits, no mandatory tax, voluntary investment

The API reference is good developer content. It just shouldn't be the FIRST thing on the page.

### /economics → RETHINK

Kill the hardcoded 90/9/1 visual. Replace with:
- "No mandatory platform tax. Contributors keep what they earn."
- "Project splits are flexible. Templates, not laws. Execution earns the most."
- "Voluntary platform investment — gets more expensive over time. 1%+ unlocks members layer."
- A simple visual showing "your project, your splits" — not a fixed pie chart

## Voice

The site should sound like Dawson, not like an AI. Dawson's voice is:
- Direct. Short sentences.
- Slightly cheeky but not trying too hard
- Honest about limitations
- Excited about potential without being breathless
- Uses numbers instead of adjectives
- Doesn't explain things that are obvious
- Would rather say less than say something generic

If a sentence could appear on any other hackathon project's website, cut it.

## Technical

- Next.js 15, App Router, Tailwind CSS
- Keep all existing API routes functional — they're good demo infrastructure
- DM Sans / DM Serif Display / DM Mono font stack
- Warm palette: #F9F8F5 bg, white cards, #E8E5DE borders, #0C0C0C for dark sections
- Mobile responsive — judges may be on phones
- Build must pass: `npx tsc --noEmit && npm run build`
- COMMIT AND PUSH to github.com/misterpredicter/onlyhumans.git when done

## After Building

Run the build check. Visit every page. Click every link. Make sure nothing crashes. Then push.
