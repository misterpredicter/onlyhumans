import Link from "next/link";
import { SplitBadge } from "@/components/SplitBadge";
import { ResultsDashboard } from "@/components/ResultsDashboard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskResultsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="page-shell">
      <div style={{ display: "grid", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <Link
            href="/"
            className="back-link"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#6B7280" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to OnlyHumans
          </Link>

          <div className="pill-row">
            <Link href="/work" className="quiet-link">
              Earn USDC
            </Link>
            <Link href="/docs" className="quiet-link">
              API docs
            </Link>
          </div>
        </div>

        <div className="premium-card" style={{ padding: "26px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
            <div style={{ maxWidth: "720px" }}>
              <div className="soft-label" style={{ marginBottom: "10px" }}>
                Task report
              </div>
              <h1 style={{ margin: "0 0 10px", fontSize: "36px", lineHeight: 1.06, fontWeight: 800, letterSpacing: "-0.06em" }}>
                Live consensus for task <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.7em" }}>{id.slice(0, 8)}</span>
              </h1>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.75, color: "#6B7280", maxWidth: "620px" }}>
                This page is the canonical output for a judgment task: vote distribution, confidence, and contributor rationale, all rendered in real time.
              </p>
            </div>

            <SplitBadge compact />
          </div>
        </div>

        <ResultsDashboard taskId={id} />
      </div>
    </div>
  );
}
