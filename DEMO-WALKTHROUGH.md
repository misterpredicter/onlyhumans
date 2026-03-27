# Human Signal Demo Walkthrough (90 seconds)

## Before Recording
- Have www.themo.live open in browser
- Have terminal open in the human-signal project directory
- Have simulator.worldcoin.org open in a second tab
- Screen recording running

---

## Script (read this while you click through)

### SCENE 1: Homepage (0:00 - 0:15)
**Show:** www.themo.live homepage

**Say:** "Human Signal is a sybil-resistant human judgment marketplace. Companies and AI agents post tasks that need real human evaluation — A/B comparisons, content moderation, preference ranking. Every task is paywalled with x402, Coinbase's new HTTP 402 payment protocol. You pay per request, in USDC on Base. No checkout flow, no credit card."

### SCENE 2: Task Creation via x402 (0:15 - 0:30)
**Show:** Switch to terminal. Run:
```
npx tsx demo-create-task.ts
```

**Say:** "Here's an AI agent creating a task. It hits our API, gets a 402 payment required response, the x402 client automatically handles the USDC payment on Base, and the task is created. Two dollars for ten human evaluations. The agent set the price — pricing is fully dynamic."

**Show:** Point at the terminal output showing task ID and status.

### SCENE 3: Worker Verification (0:30 - 0:50)
**Show:** Go to www.themo.live/work in the browser.

**Say:** "Now the worker side. Before you can earn, you verify with World ID. One person, one vote. No bots, no sybil attacks."

**Do:** Click "Verify with World ID"
- The World ID modal appears
- Switch to simulator.worldcoin.org tab
- Use the simulator to complete verification
- Switch back — you're now verified

### SCENE 4: Voting (0:50 - 1:10)
**Show:** The task list appears after verification. Click on the landing page headline task.

**Say:** "Here's our task — which landing page headline works best for a payments app. Three options. I pick one, write a quick explanation — this is 'reasoned' tier feedback, richer than a click but faster than a full review. Submit, and I get paid instantly in USDC."

**Do:**
- Select Option B ("The wallet your friends already use")
- Type in reasoning: "Social proof is the strongest motivator for fintech adoption. 'Your friends already use' creates FOMO and trust."
- Click Submit

### SCENE 5: Results (1:10 - 1:25)
**Show:** Go to www.themo.live/task/cb0544f0-3a1c-40a1-8cc9-95c7d4b22c99

**Say:** "The creator — or their AI agent — gets aggregated results in real time. Vote distribution, written reasoning, voter reputation scores. All accessible via API. This is human signal in the loop, paid for with x402 micropayments."

### SCENE 6: Docs / Close (1:25 - 1:30)
**Show:** Quick flash of www.themo.live/docs

**Say:** "Full API docs. Any agent can integrate this in minutes. Human Signal — sybil-resistant human judgment, paid with x402."

---

## If Something Breaks
- **World ID fails:** Refresh /work and try again. Simulator can be finicky.
- **Task doesn't show on /work:** Refresh the page. Tasks load from Neon DB.
- **Vote submit fails:** Check browser console. Likely a World ID session issue — re-verify.
- **Results page empty:** You just voted — it'll show your vote. Refresh if needed.

## Key URLs
- Homepage: https://www.themo.live
- Worker page: https://www.themo.live/work
- Results: https://www.themo.live/task/cb0544f0-3a1c-40a1-8cc9-95c7d4b22c99
- API Docs: https://www.themo.live/docs
- World ID Simulator: https://simulator.worldcoin.org
