# Demo Video Talking Points (90 seconds)

Use these 10 beats to narrate the demo video. Each point maps to what's on screen.

---

## 1. The Hook (0:00 - 0:10)
**Show:** Homepage at www.themo.live

**Say:** "Every AI company spends hundreds of millions on human feedback -- RLHF, A/B testing, content moderation. But the data is polluted by bots and fake accounts. Human Signal fixes this. World ID proves you're a real human. x402 pays you instantly in USDC on Base."

---

## 2. The Agent Creates a Task (0:10 - 0:22)
**Show:** Terminal running `npx tsx demo-create-task.ts`

**Say:** "Here's an AI agent creating a task. It hits our API, gets a 402 Payment Required, the x402 client automatically handles the USDC payment on Base -- and the task is live. Two dollars for ten verified human evaluations. The entire flow is one HTTP request."

---

## 3. The x402 Moment (0:22 - 0:28)
**Show:** Point at terminal output showing task ID, status, payment TX hash

**Say:** "No API keys. No checkout. No invoicing. The HTTP protocol itself handles payment. This is what x402 enables -- payments as a native part of the web."

---

## 4. Worker Verification (0:28 - 0:38)
**Show:** Navigate to www.themo.live/work, click "Verify with World ID"

**Say:** "Worker side. Before you earn, you prove you're human with World ID. Zero-knowledge proof -- no name, no email, no PII stored. Just a cryptographic guarantee: one person, one vote."

---

## 5. The ZK Proof (0:38 - 0:45)
**Show:** Complete World ID verification (use simulator), show verified badge

**Say:** "That nullifier hash is unique to me as a human. If I try to make a second account, World ID will produce the same hash. Sybil resistance isn't a policy -- it's math."

---

## 6. Browse and Vote (0:45 - 0:55)
**Show:** Task list, click into a task, see options with tier badge and payout

**Say:** "Open tasks with clear payouts. This one is a 'reasoned' tier -- I pick my option AND explain why. Quick votes are just a click. Detailed reviews are structured feedback. The requester sets the tier and the price."

---

## 7. Submit and Get Paid (0:55 - 1:05)
**Show:** Select an option, type reasoning, click submit, see the payment confirmation

**Say:** "I vote, I write my reasoning, and -- USDC hits my wallet. Not in two weeks. Not minus a 30% platform cut. Right now, on-chain, to my address. That's x402 micropayments making micro-tasks economically viable."

---

## 8. Live Results (1:05 - 1:15)
**Show:** Navigate to task results page, show vote bars, confidence, feedback

**Say:** "The requester -- or their agent -- sees results in real time. Vote distribution, confidence score, written reasoning from verified humans with reputation badges. All available via API. This is production-grade human signal."

---

## 9. The API (1:15 - 1:22)
**Show:** Quick flash of /docs page

**Say:** "Full REST API. Any agent can integrate this in minutes. Create tasks, poll results, get verified human judgment as an API call. Human-in-the-loop as a service."

---

## 10. The Vision Close (1:22 - 1:30)
**Show:** Homepage hero -- "Human taste, cryptographically verified"

**Say:** "Human Signal is the oracle network for human judgment. World ID makes it trustworthy. x402 makes it instant. Base makes it cheap. The $15 billion RLHF market finally has infrastructure it can trust."

---

## Delivery Notes

- **Pace:** Brisk but not rushed. Let the product speak -- don't over-explain the UI, focus on WHY each piece matters.
- **Tone:** Confident, technical, founder-energy. You're describing infrastructure, not a toy.
- **Key phrases to land:** "sybil resistance isn't a policy, it's math" / "human-in-the-loop as a service" / "the HTTP protocol itself handles payment" / "oracle network for human judgment"
- **If you go over 90 seconds:** Cut beat 3 (fold x402 moment into beat 2) and trim beat 9 (just flash the docs, don't narrate).
- **If something breaks:** Keep talking about the architecture. The narrative is stronger than any individual click.
