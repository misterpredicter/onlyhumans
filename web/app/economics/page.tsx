import Link from "next/link";
import { LeaderboardPanel } from "@/components/LeaderboardPanel";

export default function EconomicsPage() {
  return (
    <>
      <section className="hero-gradient" style={{ background: "#0C0C0C", color: "#FFFFFF" }}>
        <div className="wide-shell" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          <div style={{ maxWidth: "740px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#10B981", marginBottom: "16px", textTransform: "uppercase" }}>
              Economics
            </div>
            <h1 className="section-title section-title--dark" style={{ maxWidth: "740px", marginBottom: "20px" }}>
              No mandatory platform tax. Contributors keep what they earn.
            </h1>
            <p className="section-copy section-copy--dark" style={{ maxWidth: "620px", marginBottom: "32px" }}>
              Splits are flexible templates, not laws. The platform doesn&apos;t hard-code a rake.
              Execution earns the most. Voluntary investment into platform stake is rewarded — never required.
            </p>

            <div className="pill-row">
              <span className="tone-pill tone-pill--dark">flexible splits</span>
              <span className="tone-pill tone-pill--dark">execution earns most</span>
              <span className="tone-pill tone-pill--dark">on-chain enforcement</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="section-shell">
          <p className="section-kicker">How it works</p>
          <h2 className="section-title" style={{ marginBottom: "24px" }}>
            Your project, your splits.
          </h2>

          <div className="metric-grid">
            {[
              {
                title: "Templates, not laws",
                body: "Default templates exist so you don't have to think about splits on every project. Change them when the work requires it. Nothing is locked.",
              },
              {
                title: "Voluntary investment",
                body: "Contributing platform stake is rewarded — earlier contributions cost less, later ones cost more. It's never required. Reinvest if you believe in the network.",
              },
              {
                title: "Execution earns most",
                body: "Default templates push the biggest share to whoever ships revenue. Ideas without execution earn less. Shipping > talking, always.",
              },
            ].map((card) => (
              <div key={card.title} className="metric-card premium-card">
                <div className="soft-label" style={{ marginBottom: "10px" }}>{card.title}</div>
                <p style={{ fontSize: "14px", lineHeight: 1.75, color: "#6B7280", margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell">
          <LeaderboardPanel title="Leaderboards" limit={6} />
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
