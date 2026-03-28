# Research: OnlyHumans — Verified Human Social Network Direction

**Date:** March 27, 2026
**Context:** Hackathon ideation for Human Signal — evaluating "Direction 1" viability
**Confidence framework:** HIGH = multiple authoritative sources confirm. MED = plausible from partial evidence. LOW = inference or single source.

---

## Summary

This direction sits at the intersection of three fast-moving trends that all converged in the last 90 days: OpenAI's leaked social network plans (January 2026), World's AgentKit + x402 launch (March 17, 2026), and prediction markets scaling to $21B monthly volume. The timing is genuinely remarkable — the infrastructure for verified-human social + agent-as-economic-participant didn't exist cleanly 6 months ago. Now it does.

**Bottom line verdict:** This direction is viable and has strong asymmetric positioning. The competitive gap against OpenAI is real but narrow. The World Mini App angle is the highest-leverage entry point — you'd launch inside the distribution channel of 18M+ verified users with $100K/week in developer rewards already flowing. The "agents work for dinner" mechanic is novel and has no direct comparable. The core risk is retention: microwork without a social layer has chronically poor engagement. The social feed *is* the solution to that problem, which is why the hybrid is interesting.

**Hackathon viability: HIGH.** You can demo the full loop (human verifies via World ID, scrolls judgment feed, earns $, agent pays x402 or contributes work) with the existing SDKs in a weekend. The narrative is tight and topical.

---

## Finding 1: OpenAI's Verified Human Network — Real Threat, But Soft

### What They're Building

Reports from The Rundown AI (April 2025) and multiple outlets (January 2026) confirm OpenAI has a prototype social network under development by a team of fewer than 10 people. Key details:

- **Core mechanic:** Image generation social feed — users create and share AI-generated content (images, video via Sora). Think Instagram but everything is AI-generated.
- **Verification:** Two options being evaluated — Apple Face ID and World's iris-scanning Orb. No formal partnership with World confirmed as of late January 2026.
- **Purpose (stated):** Bot-free social platform positioned against X, Meta, TikTok
- **Purpose (real):** Real-time training data flywheel. "A social network would provide a continuous stream of user-generated, real-time data for training better AI models." (The Block, January 2026)
- **Timeline:** Leaders discuss launch as "when, not if." Still very early stage. No official product announcement.

### Vulnerabilities

1. **AI-generated content ≠ human signal.** OpenAI's core feed is AI content made by humans — images from ChatGPT's image generation tools. This is consumption of AI output, not human preference data. The product doesn't create genuine human judgment signals; it creates a distribution channel for OpenAI's generative products.

2. **Verification is a barrier, not a feature.** Eye scans face "scrutiny from privacy advocacy groups" (CoinDesk). Apple Face ID is softer verification (device-level, not unique human). Neither creates the cryptographic uniqueness guarantee that World ID does.

3. **Content strategy is derivative.** "AI-generated content social network" is a feature, not a social network. TikTok with AI filters is not a different social network.

4. **Small team, no distribution.** Fewer than 10 people. ChatGPT has 400M+ users, but zero social graph — converting a utility user base to a social behavior is a different problem.

5. **They haven't built the judgment loop.** Their feed is content consumption. Human Signal's feed is judgment as content. Different product entirely.

**Confidence: HIGH** on the vulnerability analysis. The product leak clearly describes a generative content platform, not a human preference platform.

### Disruption Angle

OnlyHumans disrupts OpenAI's vision by inverting the premise: instead of "humans consuming AI-generated content," it's "humans generating judgments that train AI." The economic model is also inverted — OpenAI collects training data from social behavior without paying for it. Human Signal pays humans for every judgment they contribute.

---

## Finding 2: World Mini Apps — This Is Your Go-To-Market

### Current Scale (HIGH confidence)

| Metric | Number | Source |
|--------|--------|--------|
| World App verified users | ~18M | World blog, Dec 2025 |
| Orb-verified unique humans | ~14-20M (growing) | Multiple sources |
| Mini Apps in ecosystem | 500+ | World blog, Oct 2025 |
| Daily Mini App opens | 3.8M | World network growth blog |
| Daily impressions | 6.7M | World network growth blog |
| Weekly World ID verifications | 3.4M | World network growth blog |
| Countries | 160+ | World AgentKit announcement |

### Developer Incentives (HIGH confidence)

- Dev Rewards increased from $25K to $100K/week in October 2025
- Distributed in WLD tokens based on real usage + impact metrics
- $1M in retroactive funding announced for Mini App builders
- Incubator program (Buenos Aires retreat, virtual cohorts) for selected teams

### The Distribution Unlock

Launching as a World Mini App means:
- **Zero distribution cost** — you're inside an app 18M verified humans already use
- **Instant verification** — no custom KYC/identity flow, World ID is already done
- **Native payments** — World App has integrated crypto payments (WLD, USDC)
- **Ecosystem momentum** — World is actively looking for "new kinds of social networks" (the blog literally says this)
- **Developer rewards** — You get paid in WLD proportional to engagement while building

### What Already Exists in the Ecosystem

- **World Chat** (March 2025): Encrypted messaging with human verification badges. Uses XMTP protocol. Visual distinction between verified/unverified. Blue/gray bubbles indicate human vs. unverified contact.
- **Fram3s**: Gamified video submission + AI dataset building + earn rewards. Proof the "earn while contributing data" model works inside World App.
- **World Republic**: Social/governance mini app. In top 3 of first Dev Rewards week.

**Key insight:** World Chat is already XMTP-based. If you build a social feed on XMTP and deploy as a World Mini App, you're working with the same messaging infrastructure World itself uses. This is not a coincidence — it's an alignment.

**Confidence: HIGH on distribution numbers. HIGH on incentive programs. MED on whether a new social app can meaningfully differentiate from World Chat's social features.**

---

## Finding 3: Verified-Human-Only Social Spaces — No One Has Cracked It

### Prior Attempts

- **Proof of Humanity (PoH)** — Registry of verified humans at proofofhumanity.id. Active but niche. Primarily a list/registry, not a social experience. No meaningful social feed.
- **World Chat** — Just launched (March 2025 as mini app, native in December 2025 app). E2E encrypted with human badges. Very early. Messaging-first, not judgment-feed-first.
- **Humanity Protocol** — 9M Human IDs issued. Pivoted from Proof-of-Personhood to "Proof of Trust" in February 2026. Mastercard integration. No social layer.

### The Gap

No one has built a verified-human-only feed that's designed for *judgment* as the content format. World Chat is messaging. OpenAI's concept is generative content. There is no "verified human opinion feed" product.

The closest analogues are:
- **Polymarket/prediction markets** — human judgment expressed as money. $21B monthly volume by January 2026. But it's financial, not social.
- **Instagram polls, Twitter community notes** — judgment features embedded in social, but not verified, not paid, not the core product.
- **Scale AI / Labellerr / MTurk** — judgment as work, but it's ugly, transactional, and zero social engagement.

**The white space is explicit:** Judgment as social content, with payment rails, verified human-only. No one is here.

**Confidence: HIGH on the competitive gap.**

---

## Finding 4: Social + Microwork Hybrids — No Clean Comparable Exists

### What's Been Tried

The closest players:
- **MTurk** (Amazon, 2005): Microwork without social. Workers have built external communities on Reddit (r/TurkerNation) and MTurk Crowd forums — *outside* the platform because the platform has zero social layer.
- **Swagbucks**: Earn points for surveys, video watching, shopping. Points-based, no social. Classic engagement hack.
- **JumpTask**: Microtask platform with no-KYC signup. Feed-style task browsing. But no community, no social graph.
- **RapidWorkers**: Social tasks (like/follow/comment) for payment. Pure microwork, no social layer.
- **Fram3s (World Mini App)**: Gamified video submission for AI datasets + earn rewards. Most analogous example in the verified-human ecosystem.

### The Behavior Gap

Workers on MTurk built their own social infrastructure (Reddit, forums) because the transactional platform didn't fulfill the social need. **This is the gap Human Signal fills by design.** The judgment feed IS the social layer. You don't scroll tasks — you scroll opinions, votes, A/B comparisons. The social engagement and the work are the same action.

The behavioral insight: when work IS entertainment, retention improves dramatically. TikTok proves this — the average user spends 58 minutes/day. If voting on design decisions is as engaging as watching TikTok, you get TikTok retention on an annotation platform.

**The risk:** Scroll + vote gets boring without variety and social discovery. What makes you care which design wins? Community identity and reputation mechanics are critical.

**Confidence: MED on retention mechanics. HIGH on the absence of a true hybrid.**

---

## Finding 5: Agent-as-Worker Models — Infrastructure Just Arrived

### The Critical March 2026 Development

World launched AgentKit on March 17, 2026. This is directly relevant:

- **What it does:** Verified humans delegate their World ID to AI agents. Agents carry cryptographic proof they are backed by a unique human.
- **Payment layer:** Integrates with x402 — agents can pay via USDC micropayments on Base (fractions of a cent).
- **Identity layer:** Zero-knowledge proofs allow one human to back multiple agents while still allowing platforms to enforce per-human limits.
- **Use cases highlighted by World:** Restaurant reservations, ticketing limits, news curation, free trials, phone numbers.

### The "Work for Dinner" Model

x402 stats (early 2026):
- 161M+ transactions processed
- $43.57M total transaction volume
- Average payment: $0.31
- 400,000+ AI agents with purchasing power
- 98.6% of payments in USDC

For Human Signal, this creates a tiered agent access model:
1. **Tier 1 — Pay:** Agent pays $0.01-$0.10 per judgment via x402. Gets immediate access.
2. **Tier 2 — Work:** Agent contributes moderation, content tagging, pre-processing, or curation work. Earns credits. This is labor-for-access rather than payment-for-access.

There is no current platform doing the Tier 2 "work for dinner" model. Bittensor subnets do labor-for-reward (miners earn TAO by running models), but that's AI competing against AI for tokens — not AI contributing platform-useful work in exchange for access to a human-verified space.

**The novel economic insight:** If you're an AI agent that *wants* verified human judgment (which every AI training pipeline does), you'd be willing to do platform work to earn the right to access that judgment. The platform utility aligns perfectly.

**Confidence: HIGH on the x402/AgentKit infrastructure existing. MED on whether agent "work" can be made practically implementable at a hackathon level. HIGH on the economic logic.**

---

## Finding 6: XMTP — Solid Infrastructure, Social Feed Is Possible

### Current Status (2026)

- XMTP completed its mainnet transition around March 2026
- Raised $20M Series B at $750M network valuation
- Uses MLS (Messaging Layer Security) group chats — same standard as iMessage
- End-to-end encrypted, no phone number required, no metadata collected
- Multi-SDK approach (JavaScript, Swift, Kotlin, React Native)

### World Chat Connection

World Chat natively uses XMTP. This is significant:
- World's own messaging is XMTP-based
- A Human Signal social feed using XMTP would be architecturally aligned with World App's infrastructure
- Building on XMTP within a World Mini App means you're building on the same protocol World itself chose

### Can XMTP Support a Social Feed?

XMTP is primarily a messaging protocol. A social feed is a different pattern (public broadcast, not private messaging). However:
- XMTP supports group conversations, which can function as public channels
- The protocol is wallet-based identity, which aligns with World ID verification
- XMTP + World ID = authenticated human identities in a social context

**The honest answer:** XMTP is messaging infrastructure, not feed infrastructure. Using it for a social feed requires building the feed layer on top. This is doable but adds complexity. For a hackathon, you'd likely mock the XMTP social layer or use it only for the messaging/notification component while building a separate feed.

**Confidence: HIGH on XMTP's technical state. MED on its suitability as primary feed infrastructure at hackathon speed.**

---

## Competitive Landscape

| Player | Verification | Social Layer | Payments | Judgment Feed | Agent Access |
|--------|-------------|--------------|----------|---------------|--------------|
| **OnlyHumans (proposed)** | World ID (iris) | Native | x402 USDC | Core product | Pay or work |
| OpenAI Social Network | Face ID / Orb (unconfirmed) | In development | Unknown | No — generative content feed | Unknown |
| World Chat | World ID (iris) | Messaging only | WLD, USDC | No | No |
| MTurk / Scale AI | Email / ID (weak) | None | Fiat (slow) | Yes (transactional) | No |
| Polymarket | Crypto wallet | None | Crypto | Judgment as markets | No |
| Proof of Humanity | Ethereum wallet + video | Registry only | None | No | No |
| Bittensor | None | None | TAO tokens | No | Yes (labor→reward) |

---

## Key Risks

### Risk 1: Retention Without Social Graph (HIGH risk)
**Problem:** Microwork platforms have terrible retention when there's no social layer. MTurk workers built their own community *outside* the platform. If voting on design tasks isn't intrinsically engaging, users churn after the novelty wears off.

**Mitigation:** The reputation system and social feed mechanics are load-bearing. Users need to feel their opinions matter and that there's a community they belong to. The "verified human" identity is a status marker that can be made socially meaningful.

### Risk 2: Task Supply Side (HIGH risk)
**Problem:** You need a continuous stream of good judgment tasks (A/B tests, design votes, copy reviews) to fill the feed. This is a two-sided marketplace problem. No tasks = no feed = no users.

**Mitigation:** Launch with a waitlist of companies wanting human judgment data for AI training. Frame task submission as a service product. The hackathon demo can use synthetic tasks to show the mechanic, but real supply needs to be built.

### Risk 3: World App Dependency (MED risk)
**Problem:** Launching as a World Mini App means you're entirely dependent on World's ecosystem, distribution policies, developer reward program changes, and platform decisions.

**Mitigation:** Build the World Mini App as a distribution channel, not the entire product. The core protocol should be portable. World is the fastest path to verified users; it shouldn't be the only path.

### Risk 4: OpenAI Execution Speed (MED risk)
**Problem:** If OpenAI ships a verified human social network in 6 months, they have 400M ChatGPT users and Sam Altman's brand. They'd crush a startup on distribution.

**Mitigation:** OpenAI is building a generative content feed, not a judgment feed. These are different products. Human Signal's value is in the quality and verifiability of human preferences — that's a B2B data product story, not a consumer social story. The moat is not "social network with verified users" but "the most trustworthy human preference dataset on the internet, with economic alignment baked in."

### Risk 5: Agent "Work" Quality (MED risk)
**Problem:** If agents contribute platform work (content tagging, moderation) to earn access, who verifies the agent's work is quality? You need a quality signal for agent contributions, which could require... more human judgment.

**Mitigation:** This is actually elegant: human judges verify agent work. The platform creates a market for agent contributions where humans verify quality. Agents that consistently produce low-quality work get rejected. This creates an emergent quality signal.

---

## Specific Opportunities

### Opportunity 1: Hackathon Demo Loop (48 hours)
The demo-able loop:
1. User verifies via World ID (MiniKit SDK — already well documented)
2. User sees judgment feed (A/B vote: "Which headline is more compelling?")
3. User votes, earns $0.05 USDC via x402
4. Agent requests access to the judgment API, pays $0.01 via x402 OR submits a content tagging batch to earn a credit
5. Agent gets the aggregate human judgment signal

This entire loop can be built with: MiniKit, x402-js, a Next.js app. The World team in March 2026 has just made this exact combination possible.

### Opportunity 2: World Dev Rewards Alignment
The platform is explicitly looking for "new kinds of social networks" in its ecosystem. A verified-human social + judgment feed would likely rank highly for Dev Rewards because:
- High World ID verification events (every vote triggers one)
- High daily opens (feed is habit-forming)
- Novel category (not another DeFi or gaming app)

At $100K/week distributed, even modest engagement could yield meaningful early revenue.

### Opportunity 3: B2B Data Product from Day 1
Every judgment collected has a buyer: AI labs, product teams, marketing departments. The consumer social network *generates* the inventory. The B2B data product *monetizes* it. Frame from day 1 as "we're building the most trusted human feedback dataset in the world, and the social network is how we collect it."

This also clarifies the competitive moat: OpenAI cannot ethically collect judgment data about its own models' outputs from its own social network (conflict of interest). Human Signal can sell that data to anyone — including OpenAI's competitors.

### Opportunity 4: Agent Economics Novelty
There is no current platform where AI agents can earn access to human judgment by contributing work. This is a genuinely new primitive. The framing of "agents as economic participants who either pay or contribute" creates a differentiated narrative at a moment when everyone is talking about agentic AI but no one has figured out what role agents play in human-centric platforms.

---

## Recommendations

**Should you pursue this direction for the hackathon?**

**Yes, with one framing adjustment.**

The current concept frames OnlyHumans as a "social network." For a hackathon, the more precise and compelling frame is: **"The Human Preference Feed — where verified humans earn money for their opinions and AI agents pay to access them."**

The social network framing creates the wrong comparison class (competing with Twitter/Instagram). The preference feed framing is novel, technically demonstrable, and hits the exact intersection of what's happening in March 2026: World AgentKit, x402, the question of "what are verified humans actually for?"

**Build path for hackathon:**
1. Deploy as World Mini App (MiniKit + verification baked in)
2. Judgment feed with 3-5 task types: A/B copy, design vote, headline ranking, code review choice, sentiment rating
3. Instant USDC payment on vote completion via x402
4. Agent access endpoint: pay per query OR submit batch work
5. Reputation score visible on profile (number of votes, accuracy vs. majority, earnings)

**Don't build for the hackathon:**
- Full XMTP social messaging (too complex, mock it)
- Agent work quality verification (handwave in demo, mention as v2)
- Complex reputation algorithms (simple vote count + earnings is enough to demo)

---

## Sources

1. **[OpenAI Social Network — CoinDesk, January 2026](https://www.coindesk.com/business/2026/01/28/world-token-jumps-27-as-sam-altman-reportedly-eyes-a-biometric-social-network-to-kill-off-bots)** — Breaking news report on OpenAI social network plans with World verification.

2. **[OpenAI Social Network — The Block](https://www.theblock.co/post/387518/openai-social-network-could-tap-worlds-eyeball-scanning-orbs-report)** — Details on potential World Orb integration for OpenAI.

3. **[OpenAI Social Network — Gizmodo](https://gizmodo.com/openai-working-on-social-media-network-that-could-require-creepy-eye-scans-report-2000715588)** — Criticism of biometric verification as barrier to adoption.

4. **[World Network Growth + Mini Apps Metrics](https://world.org/blog/announcements/world-network-growth-helps-mini-apps-developers-reach-millions-daily)** — 3.8M daily opens, 8.4M Orb-verified, 3.4M weekly verifications. Authoritative World blog.

5. **[Dev Rewards $100K/week + 500 Apps](https://world.org/blog/announcements/dev-rewards-pilot-increases-to-100k-per-week-as-the-world-ecosystem-surpasses-500-mini-apps)** — Developer incentive details, ecosystem scale.

6. **[World Mini Apps $300K Dev Rewards Pilot](https://world.org/blog/announcements/world-launches-mini-apps-300k-dev-rewards-pilot-inspire-human-first-apps)** — Original $300K pilot announcement with app categories including social networks.

7. **[World Chat Launch — TechCrunch, December 2025](https://techcrunch.com/2025/12/11/world-launches-its-super-app-including-crypto-pay-and-encrypted-chat-features/)** — World Chat using XMTP, verified human indicators, super app launch.

8. **[World AgentKit Launch — World Blog, March 2026](https://world.org/blog/announcements/now-available-agentkit-proof-of-human-for-the-agentic-web)** — AgentKit details, delegation model, x402 integration.

9. **[World + Coinbase AgentKit — The Block, March 2026](https://www.theblock.co/post/393920/sam-altman-world-identity-toolkit-ai-bots-coinbase-x402-protocol)** — Coinbase x402 integration, agent verification mechanics.

10. **[x402 vs. Stripe MPP — WorkOS, 2026](https://workos.com/blog/x402-vs-stripe-mpp-how-to-choose-payment-infrastructure-for-ai-agents-and-mcp-tools-in-2026)** — x402 protocol mechanics, MCP integration examples, payment flows.

11. **[AI Micropayment Infrastructure Statistics — Nevermined](https://nevermined.ai/blog/ai-micropayment-infrastructure-statistics)** — 161M transactions, $43.57M volume, 400K+ agents with purchasing power.

12. **[XMTP Review 2026 — CryptoAdventure](https://cryptoadventure.com/xmtp-review-2026-decentralized-messaging-mls-group-chats-and-the-mainnet-transition/)** — XMTP mainnet status, developer experience, group chat capabilities.

13. **[XMTP Series B — The Block](https://www.theblock.co/post/363026/ephemera-xmtp-funding-valuation-decentralized-messaging-protocol)** — $20M raise, $750M valuation.

14. **[Prediction Markets $21B Monthly Volume — TRM Labs](https://www.trmlabs.com/resources/blog/how-prediction-markets-scaled-to-usd-21b-in-monthly-volume-in-2026)** — Scale of human judgment markets, 800K+ monthly wallets.

15. **[Proof of Humanity Registry](https://proofofhumanity.id/)** — Existing verified human registry, social layer gap.

16. **[Humanity Protocol Pivots — Biometric Update, February 2026](https://www.biometricupdate.com/202602/humanity-protocol-pivots-from-proof-of-personhood-but-sticks-with-palm-biometrics)** — Competitor landscape in proof-of-personhood space.

---

## Related Threads Worth Tracking

- **World Dev Summer** — Active developer program running in 2025. Check for continued programs in 2026.
- **OpenAI social network** — No official announcement yet. Monitor for Q2 2026 launch signals.
- **XMTP mainnet** — Just completed transition in March 2026. Developer experience may improve significantly.
- **Stripe MPP vs x402** — Stripe launched Machine Payments Protocol March 18, 2026. New competition for x402 in agent payments.
