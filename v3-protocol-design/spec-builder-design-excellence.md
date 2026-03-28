# Builder Spec: Design Excellence — Best in Class

## Mission

Make themo.live the best-looking site at the hackathon. Not "good for a hackathon." Actually beautiful. The kind of site where people screenshot it and share it. Billion-dollar energy on a hackathon budget.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` (Next.js 15, App Router, Tailwind CSS)
- Current design: DM Sans/Serif/Mono, warm #F9F8F5 bg, white cards, #E8E5DE borders
- Live at themo.live via Vercel
- READ spec-v3 at `v3-protocol-design/spec-v3.md` for the vision
- PUSH when done

## What "Best in Class" Means

Reference sites for energy: Linear.app, Vercel.com, Stripe.com, Raycast.com. Clean, confident, dense, premium.

### Typography
- Headlines should HIT. DM Serif Display for hero text, DM Sans for body.
- Tight line heights on headlines, generous on body text.
- Type scale should breathe — clear hierarchy from h1 to body.

### Color & Space
- The warm palette is right (#F9F8F5 bg, white cards) — but push contrast harder
- Dark sections for emphasis (hero, CTAs) against the warm background
- Generous whitespace. Let things breathe.
- Accent color for CTAs and interactive elements — something warm but punchy

### Layout
- Homepage: full-width hero → clean sections → each section tells one part of the story
- Cards should have subtle shadows, clean borders, micro hover states
- Grid layouts for the four human roles, use cases, economics
- Mobile: every section stacks cleanly, no horizontal scroll, touch targets sized right

### Animation (Subtle)
- Page transitions: smooth fade/slide
- Scroll reveals: elements fade up as you scroll to them
- Button hover states: color shift, subtle scale
- Number counters: animate up when they enter viewport
- Nothing flashy. Just polished.

### The Onboarding Flow (/join)
This is the most important page. It should feel like:
- Joining something exclusive but welcoming
- World ID verification = "becoming part of something real"
- Each step feels like progress, not friction
- Completion feels like an achievement

### Key Pages to Polish
1. Homepage — hero, four roles, economics, why now, CTA
2. /join — onboarding flow with World ID
3. /work — the earning feed, should feel like opening a marketplace with money waiting
4. /docs — Stripe-quality, copy-paste code blocks, clean API reference
5. /spec — the rendered spec-v3, beautiful typography for long-form reading

### Micro-details That Matter
- Favicon and og:image should be updated for OnlyHumans
- Code blocks should have copy buttons and syntax highlighting
- Loading states should be skeleton screens, not spinners
- Error states should be helpful, not generic
- The economics visual (revenue split bar) should be gorgeous

## Constraints
- Tailwind CSS — use it well
- Don't add heavy animation libraries unless there's a very good reason
- Don't break any functionality
- COMMIT AND PUSH to github.com/misterpredicter/onlyhumans.git
