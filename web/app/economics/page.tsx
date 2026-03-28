import Link from "next/link";
import { EconomicsBreakdown } from "@/components/EconomicsBreakdown";
import { LeaderboardPanel } from "@/components/LeaderboardPanel";
import { SplitBadge } from "@/components/SplitBadge";

export default function EconomicsPage() {
  return (
    <>
      <section className="hero-gradient" style={{ background: "#0C0C0C", color: "#FFFFFF" }}>
        <div className="wide-shell" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div className="feed-grid" style={{ alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <SplitBadge tone="dark" />
              <h1 className="section-title section-title--dark" style={{ maxWidth: "740px" }}>
                Transparent incentives, not hidden margin.
              </h1>
              <p className="section-copy section-copy--dark" style={{ maxWidth: "620px" }}>
                OnlyHumans is a market inside a constitution. The bulk goes to contributors. A variable percentage funds the platform. 1% goes to the founder. Idea contributors choose their own take rate, and workers decide whether it is worth their attention.
              </p>

              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  "90% goes to the people doing the work and originating the framing.",
                  "9% funds servers, features, safety, and distribution.",
                  "1% gives the founder skin in the game without turning the protocol into extraction.",
                  "Workers can inspect the split before they vote.",
                ].map((line) => (
                  <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "999px", backgroundColor: "#10B981", marginTop: "8px", flexShrink: 0 }} />
                    <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>{line}</p>
                  </div>
                ))}
              </div>
            </div>

            <EconomicsBreakdown
              taskRevenue={0.2}
              ideaContributorShare={0.05}
              maxWorkers={10}
              title="Reference split"
              subtitle="Default example: $0.20 revenue per vote, 10 voters, 5% idea take inside the contributor pool."
            />
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="section-shell">
          <LeaderboardPanel title="Leaderboards" limit={6} />
        </div>

        <div className="section-shell">
          <div className="metric-grid">
            {[
              {
                title: "Why 90%",
                body: "The majority of value should go to the people who create signal: workers and idea contributors.",
              },
              {
                title: "Why 9%",
                body: "A real protocol needs explicit fuel for infra, product work, and growth. Hidden margin is worse than a visible platform fund.",
              },
              {
                title: "Why 1%",
                body: "The founder keeps skin in the game, but the cap is clear and easy to explain.",
              },
            ].map((card) => (
              <div key={card.title} className="metric-card premium-card">
                <div className="soft-label" style={{ marginBottom: "10px" }}>{card.title}</div>
                <p style={{ fontSize: "14px", lineHeight: 1.75, color: "#6B7280", margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell" style={{ paddingTop: 0 }}>
          <div className="pill-row">
            <Link href="/" className="primary-link">
              Post a task
            </Link>
            <Link href="/docs#economics" className="secondary-link">
              Read the docs
            </Link>
            <Link href="/work" className="secondary-link">
              See the work feed
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
