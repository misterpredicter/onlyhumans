# Human Signal: Full Design Space

**The primitive:** Ask verified humans a question. Get paid answers. Sybil-resistant.

That sentence describes infrastructure, not an app. Below is the full design space of what you can build on top of that primitive.

---

## 1. The Taxonomy

### A. AI Agent Services (the primary market)

The buyer is not a human with a clipboard. The buyer is software that hits `POST /api/tasks` and gets back verified human cognition.

| Use Case | What the Agent Asks | Why It Can't Be Automated |
|----------|--------------------|-----------------------------|
| **RLHF preference ranking** | "Which response is better? A or B?" | This IS the training signal. If you automate it, you're training on yourself. |
| **AI content quality gate** | "Is this blog post / ad copy / email good enough to publish?" | LLMs can't reliably evaluate their own output quality. |
| **Safety checkpoint** | "Does this agent action seem dangerous, unethical, or stupid?" | The entire point is a human veto on autonomous action. |
| **Ambiguity resolver** | "The user said 'handle it.' Does that mean archive, reply, or escalate?" | Context-dependent human judgment that agents systematically get wrong. |
| **Creative direction** | "Which of these 4 generated logos best represents 'premium but playful'?" | Aesthetic judgment. The whole point of taste. |
| **Hallucination check** | "Does this AI-generated summary accurately represent the source?" | Humans are still better than LLMs at catching subtle distortions. |
| **Tone calibration** | "Is this response empathetic, neutral, or condescending?" | LLMs have blind spots on their own emotional register. |
| **Edge case triage** | "I've encountered a situation not in my training data. What should I do?" | Novel situations require human reasoning by definition. |

### B. Product & Design

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **A/B preference testing** | "Which landing page converts better?" | Product teams, indie hackers |
| **Name/brand testing** | "Which startup name is more memorable?" (4-6 options) | Founders, brand agencies |
| **Packaging design** | "Which label makes you want to pick this up?" | CPG companies, D2C brands |
| **Ad creative testing** | "Which ad makes you want to click?" | Performance marketers |
| **Pricing perception** | "Does $29/mo feel fair, cheap, or expensive for this?" | SaaS, e-commerce |
| **Copy testing** | "Which headline grabs you?" | Content teams, copywriters |
| **Onboarding flow** | "Which signup flow feels easier?" | Product/growth teams |
| **Feature prioritization** | "Which of these 4 features would make you upgrade?" | PMs doing lightweight research |

### C. Content & Creative

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **Comedy testing** | "Is this joke funny? Rate 1-5." | Stand-up comedians, writers' rooms, meme accounts |
| **Music A/B** | "Which mix sounds more polished?" | Producers, independent artists |
| **Writing quality** | "Does this essay's argument hold together?" | Authors, essayists, newsletter writers |
| **Thumbnail optimization** | "Which YouTube thumbnail would you click?" | Creators, media companies |
| **Book cover selection** | "Which cover makes you want to read this?" | Self-published authors, publishers |
| **Cultural sensitivity** | "Would this ad land poorly in your culture?" | Global brands, localization teams |
| **AI art curation** | "Which of these 6 AI-generated images is actually gallery-worthy?" | AI artists, NFT creators, stock photo platforms |
| **Meme judgment** | "Is this meme fire or cringe?" | Social media managers, meme pages |

### D. Governance & Coordination

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **Sybil-resistant voting** | "Should we fund proposal #47?" | DAOs, community treasuries |
| **Dispute resolution** | "Was this Airbnb review fair or retaliatory?" | Marketplaces, platforms |
| **Community standards** | "Does this post violate our content policy?" | Forum mods, Discord communities |
| **Budget allocation** | "Split $10K across these 5 projects: what's your allocation?" | Grant programs, community funds |
| **Legitimacy check** | "Is this fundraiser real or a scam?" | Crowdfunding platforms |
| **Moderation appeals** | "Our AI flagged this. Was it right?" | Social platforms, content hosts |

### E. Science & Research

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **Citizen science** | "Is this a spiral galaxy or an elliptical galaxy?" | Astronomy, ecology, biology labs |
| **Medical image annotation** | "Do you see a lesion in this image? Mark the region." | Radiology AI, pathology startups |
| **Survey with verified unique respondents** | Any survey question, with cryptographic one-response-per-human | Social scientists, market researchers |
| **Behavioral economics** | "You have $10. Split it with an anonymous partner." (dictator game etc.) | Academic researchers |
| **Linguistic annotation** | "Is this sentence grammatically correct in your dialect?" | NLP researchers, language model teams |
| **UX research** | "Walk through this prototype. Where did you get confused?" | UX teams, design agencies |

### F. Trust & Verification

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **"Real or AI?" detection** | "Was this image generated by AI or taken by a camera?" | Media outlets, social platforms, dating apps |
| **Deepfake detection** | "Does this video look authentic?" | News organizations, political campaigns |
| **Review authenticity** | "Does this Amazon review read like a real person or a bot?" | E-commerce platforms, review aggregators |
| **Identity verification assist** | "Do these two photos look like the same person?" | KYC providers, identity platforms |
| **Fact checking** | "Does this claim match the linked source?" | News orgs, research teams |

### G. Markets & Prediction

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **Taste-weighted prediction** | "Which of these 4 sneaker designs will sell out first?" | Brands, prediction markets |
| **Trend detection** | "Have you seen this style in your city? (yes/no/where)" | Fashion, CPG, real estate |
| **Sentiment capture** | "How do you feel about [brand] right now? (1-5 + why)" | Brand trackers, hedge funds |
| **Product-market fit signal** | "Would you use this? Would you pay for this? How much?" | Founders, VCs doing diligence |
| **Competitive comparison** | "You're shopping for X. Which of these 3 would you buy?" | Strategy teams, investors |

### H. Personal & Consumer

| Use Case | What Gets Asked | Buyer |
|----------|----------------|-------|
| **Dating profile review** | "Rate this profile 1-10. What would you change?" | Dating app users |
| **Resume review** | "Would you interview this person based on this resume?" | Job seekers |
| **Outfit check** | "Which outfit for a first date?" | Fashion-uncertain humans |
| **Home design** | "Which furniture layout works better in this room?" | Homeowners, interior design |
| **Gift selection** | "Which gift would a 30-year-old woman prefer?" | Stuck gift-givers |
| **Naming a baby/pet/startup** | "Which name? Seriously, I can't decide." | The indecisive |

---

## 2. Top 10 Most Compelling

Ranked by: (novelty) x (market size) x (makes judges say "holy shit")

### 1. AI Safety Checkpoint Service

An autonomous AI agent is about to take an irreversible action (send an email, execute a trade, publish content, deploy code). It routes to Human Signal: "Should I do this?" 10 verified humans vote in 60 seconds. Agent proceeds or halts based on consensus.

**Why it wins:** This is the "human-in-the-loop as an API call" story. Every AI company building agents needs this. No one has built it as a protocol. The market is literally every AI agent in production.

### 2. RLHF Data Pipeline (Sybil-Resistant)

AI labs post preference pairs. Verified humans rank them. The data is cryptographically guaranteed to be one-human-one-vote -- no duplicate accounts, no bot farms, no Mechanical Turk sybil attacks. Premium signal for premium price.

**Why it wins:** OpenAI, Anthropic, Google, and Meta spend over $1B/year combined on human preference data. The entire RLHF pipeline is polluted by sybil attacks. Human Signal is the first protocol that structurally can't be sybiled.

### 3. Real-or-AI Detection Oracle

Any platform, agent, or user submits an image/text/video: "Is this real or AI-generated?" Verified humans vote. Returns a confidence-weighted authenticity score.

**Why it wins:** The AI-generated content detection problem is unsolved by algorithms and getting worse. Human detection is still more reliable than automated detection for novel generation techniques. Every social platform, news org, and dating app needs this.

### 4. Agent Ambiguity Resolver

AI assistant encounters ambiguity in a user instruction -- "handle this," "make it better," "clean this up." Instead of guessing (and getting it wrong), the agent posts the ambiguous instruction to Human Signal with 3-4 interpretations: "Which of these did the user probably mean?" Returns the consensus interpretation.

**Why it wins:** Every AI agent makes interpretation errors. This turns "the agent misunderstood me" from a failure mode into a solved problem. The market is every AI product that interacts with humans.

### 5. Micro-Research Panels (Verified Unique Respondents)

Market research with cryptographic proof that each response is from a unique human. No duplicate survey responses. No professional survey-takers gaming the system. World ID guarantees each data point is independent.

**Why it wins:** The $80B market research industry's biggest problem is panel quality. Every survey firm fights fake respondents. Human Signal makes it structurally impossible. Enterprise buyers will pay premium for guaranteed-clean data.

### 6. AI Content Quality Gate

An AI generates a blog post, ad copy, product description, social media post. Before publishing, it routes to Human Signal: "Is this good enough? What's wrong with it?" Gets back a verified quality score + reasoned feedback. Publishes only if it clears the bar.

**Why it wins:** Every company using AI-generated content needs a quality check. The current answer is "a human reviews it" -- but that doesn't scale. Human Signal makes the review scale with the generation.

### 7. Sybil-Resistant DAO Voting

Any DAO, community treasury, or collective can run a vote where each ballot is cryptographically guaranteed to be from a unique human. Not one-token-one-vote (plutocratic). Not one-account-one-vote (sybilable). One-human-one-vote.

**Why it wins:** The fundamental governance problem in crypto is sybil attacks. Gitcoin, Optimism, Arbitrum -- they all struggle with this. World ID + a voting protocol is literally the solution to the biggest unsolved problem in on-chain governance.

### 8. Comedy/Creative Testing at Scale

A writer, comedian, or creator tests material before publishing. "Is this joke funny?" "Which punchline lands harder?" "Does this opening hook you?" Gets back quantified human reactions from verified unique respondents.

**Why it wins:** Stand-up comedians test jokes in front of live audiences. Writers send drafts to beta readers. Human Signal digitizes this with economics attached. It's visceral, it's fun to demo, and the "testing comedy with micropayments" story is incredibly memorable.

### 9. Cross-Cultural Sensitivity Oracle

A global brand runs ad creative through verified humans in target markets: "Would this ad land well in Japan? In Brazil? In Nigeria?" Gets back culture-specific feedback from verified residents of those markets.

**Why it wins:** Global brands spend millions on localization and still make cultural blunders. The current solution is expensive focus groups. Human Signal makes it a $5 API call. The demo writes itself: show the same ad getting opposite reactions in different markets.

### 10. Deepfake / Misinformation Triage

News organizations, political campaigns, or social platforms submit suspicious content. Verified humans review it: "Does this look manipulated?" "Does this claim match the source?" Returns a trust score from verified, unique reviewers.

**Why it wins:** Trust infrastructure is the defining problem of the AI era. Human Signal becomes the "verified human consensus on whether something is real" -- a primitive that every platform needs and no one has built as a protocol.

---

## 3. The 3 That Should Be in the Demo

These are the tasks that should be pre-seeded on the live site when judges visit.

### Demo Task 1: "Which AI-generated image is actually good?"

**The task:**
> "An AI agent is selecting cover art for a client's album. Which of these 4 AI-generated images would you actually hang on your wall?"
>
> Option A: [abstract landscape]
> Option B: [portrait style]
> Option C: [geometric pattern]
> Option D: [surrealist composition]

**Why this one:** It demonstrates the multi-option capability (not just A/B), it's visual and instantly engaging, it tells the agent-as-buyer story, and it showcases the "AI needs human taste" narrative. Judges can vote on it immediately and feel the product.

**Tier:** Reasoned ($0.20/vote) -- voters explain WHY they chose, which is the valuable data.

### Demo Task 2: "Should this AI agent send this email?"

**The task:**
> "An AI executive assistant drafted this email on behalf of its user. Should the agent send it?"
>
> Context: "The user asked the AI to 'handle the angry client.' The AI drafted this response. Is the tone right?"
>
> Option A: "Yes, send it as-is"
> Option B: "Soften the tone, then send"
> Option C: "Don't send -- escalate to the user"

**Why this one:** This is the killer demo. It shows the AI safety checkpoint use case in action -- an agent that pauses before an irreversible action and asks verified humans for a judgment call. It demonstrates that Human Signal isn't just A/B testing -- it's the "human-in-the-loop as infrastructure" story. Every judge building AI agents will immediately see the value.

**Tier:** Reasoned ($0.20/vote) -- the reasoning ("I chose 'soften' because the phrase 'as discussed' sounds passive-aggressive") is the whole point.

### Demo Task 3: "Real photo or AI-generated?"

**The task:**
> "A news platform needs to verify image authenticity. Is this a real photograph or AI-generated?"
>
> Option A: "Real photograph"
> Option B: "AI-generated"

**Tier:** Quick ($0.10/vote) -- high volume, low friction, demonstrates the micropayment long tail.

**Why this one:** Instantly understandable. Every judge has seen the "is this real?" problem. It demonstrates a completely different category from the other two tasks -- showing that Human Signal is a general-purpose oracle, not a specialized tool. It also shows the quick tier: fast, cheap, high-volume tasks that only work because x402 makes micropayments frictionless.

**The trio tells a story:** Task 1 = AI needs taste. Task 2 = AI needs a safety checkpoint. Task 3 = Society needs a truth oracle. Three completely different problems, same protocol. That's what makes it infrastructure.

---

## 4. The Narrative

### How the breadth supports the "oracle network" positioning

The biggest mistake would be to pitch Human Signal as an A/B testing tool. A/B testing is one use case. Human Signal is the protocol layer beneath all of them.

**The Chainlink analogy, made precise:**

Chainlink answers: "What is the price of ETH right now?" -- a factual oracle.
Human Signal answers: "Is this good?" -- a judgment oracle.

Chainlink connects smart contracts to objective data feeds.
Human Signal connects AI agents to subjective human judgment.

Both are oracle networks. Both provide verified signal that can't be generated on-chain (or in-model). Both are infrastructure that thousands of applications build on top of.

**The breadth is the argument.** When you show a judge RLHF training data, content moderation, comedy testing, DAO governance, and deepfake detection all running on the same protocol -- the conclusion is obvious: this isn't an app. It's a primitive.

**The three-layer narrative:**

1. **Layer 1 -- The Primitive:** Ask verified humans a question, get paid answers, with sybil resistance. World ID + x402 + REST API.

2. **Layer 2 -- The Protocol:** Any agent, any platform, any researcher can integrate Human Signal as a building block. Create a task, get verified judgment, pay automatically. No accounts, no invoices, no intermediaries.

3. **Layer 3 -- The Network:** As more workers verify via World ID and build reputation, the network becomes more valuable. A worker with a gold reputation badge who consistently provides high-quality reasoned feedback is worth more than a fresh account. The reputation system creates a flywheel: better workers attract better tasks attract better workers.

**The key insight for judges:** The market for "verified human judgment accessible via API" doesn't exist yet because the infrastructure didn't exist. World ID (sybil resistance), x402 (micropayments), and agent-native APIs (the buyer) all shipped in the last 12 months. Human Signal is the first protocol to compose all three. The breadth of use cases isn't a list of features to build -- it's proof that the primitive is fundamental.

**The wedge strategy:**
- **Today:** A/B testing and multi-option judgment (live, working, demo-able)
- **This quarter:** AI agent integration (the demo-create-task.ts script is the seed)
- **This year:** Specialized verticals (RLHF pipelines, content moderation APIs, research panels)
- **Endgame:** The default oracle network for any question that requires verified human judgment

Each vertical is a separate business. The protocol serves them all.

---

## 5. Integration Stories

### Story 1: AI Safety Checkpoint (Claude Agent)

An autonomous Claude agent is managing a user's email. It drafts a response to an angry client and is about to send it. Before hitting send, the agent calls `POST /api/tasks` with the draft email and three options: "Send as-is," "Soften tone first," "Escalate to user." The x402 client auto-pays $2.00 USDC (10 voters at $0.20 each, reasoned tier). Within 3 minutes, 10 verified humans have voted -- 7 say "soften," 2 say "escalate," 1 says "send." The agent reads the reasoned feedback ("the phrase 'per my last email' sounds passive-aggressive"), rewrites the draft, and sends the softened version. Total cost: $2.00. Total time: 3 minutes. Damage avoided: one scorched client relationship.

### Story 2: RLHF Preference Pipeline (Anthropic/OpenAI)

An AI lab's training pipeline generates 10,000 response pairs per day that need human preference ranking. Instead of routing to Scale AI (sybil-vulnerable, 2-week payment cycle, 30% platform cut), the pipeline calls Human Signal's API in a loop: one `POST /api/tasks` per pair, quick tier, $0.05/vote, 5 voters per pair. Total daily spend: $2,500. The lab gets back preference data where every single vote is guaranteed to be from a unique human -- no duplicate accounts, no bot farms, no professional survey-takers gaming responses. The data quality improvement compounds: cleaner preference data means better RLHF means better models.

### Story 3: Real-or-AI Detection (Social Platform)

A social media platform's content pipeline flags 500 images per day as "possibly AI-generated" by their automated detector (which has a 15% false positive rate). Instead of employing a moderation team, the platform routes each flagged image to Human Signal: quick tier, $0.10/vote, 7 voters. If 5+ out of 7 verified humans say "AI-generated," the image gets labeled. If the vote is split, it goes to a second round at the reasoned tier ($0.20/vote) where voters explain their reasoning. The platform gets human-verified authenticity labels for $0.70-$2.10 per image, with written explanations for edge cases. Total daily cost: ~$500. Replaces a 3-person moderation team costing $15K/month.

### Story 4: Comedy Testing (AI Comedy Writer)

An AI agent is generating jokes for a late-night show's social media. It generates 20 candidate jokes per topic and needs to find the 3 that are actually funny. The agent posts each joke to Human Signal as a standalone task: "Rate this joke 1-5" with options mapping to rating buckets, quick tier, $0.10/vote, 15 voters. In 10 minutes, all 20 jokes have scores from 15 unique verified humans each. The agent selects the top 3 by average rating, reformats them for the social team, and delivers. The writer's room spent zero time on first-pass filtering. Cost: $30 total. Time saved: 2 hours of writers reading through AI slop.

### Story 5: Cross-Cultural Ad Testing (Global Brand Agent)

A multinational brand's AI marketing agent has generated 6 ad concepts for a global campaign. Before allocating media spend, the agent needs to know which concepts work in which markets. It posts the same 6 options to Human Signal three times -- once tagged "US market," once "Japan market," once "Brazil market" -- with different context prompts. Detailed tier, $0.50/vote, 20 voters per market. Within an hour, the agent has 60 verified responses per market with structured feedback (what works, what doesn't, suggestions). The Japan respondents flag that concept C uses a gesture that's offensive in Japanese culture. The Brazil respondents love concept E but note the color palette reads as a competitor's brand. The agent recommends different concepts for each market with cited reasoning. Total cost: $90. Replaces three focus groups at $15K each.

---

## Appendix: The Full List (Quick Reference)

For hackathon pitching -- a rapid-fire list of everything the protocol can do:

**AI can't do this alone:**
RLHF ranking, safety checkpoints, content quality gates, ambiguity resolution, creative direction, hallucination detection, tone calibration, edge case triage

**Businesses pay for this today (badly):**
A/B testing, brand testing, ad creative testing, name testing, packaging evaluation, pricing research, copy testing, feature prioritization, localization QA

**Creators need this:**
Comedy testing, music A/B, writing feedback, thumbnail optimization, book cover selection, AI art curation, cultural sensitivity review

**Governance needs this:**
Sybil-resistant voting, dispute resolution, community standards, budget allocation, moderation appeals, legitimacy verification

**Science needs this:**
Citizen science, medical annotation, verified surveys, behavioral experiments, linguistic annotation, UX research

**Trust needs this:**
Real-or-AI detection, deepfake triage, review authenticity, fact checking, identity verification assist

**Markets want this:**
Taste prediction, trend detection, sentiment capture, PMF signal, competitive comparison

**Humans want this:**
Dating profile review, resume feedback, outfit check, home design, gift selection, naming help

One protocol. One API. One payment rail. One identity layer.

That's infrastructure.
