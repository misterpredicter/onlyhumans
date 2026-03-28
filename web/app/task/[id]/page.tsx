import { ResultsDashboard } from "@/components/ResultsDashboard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskResultsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
      <a
        href="/"
        className="back-link"
        style={{
          fontFamily: "var(--font-sans), sans-serif", fontSize: "14px",
          color: "#6B7280", textDecoration: "none",
          display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Human Signal
      </a>

      <div className="card-elevated" style={{ padding: "32px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <h1 style={{
            fontFamily: "var(--font-sans), sans-serif", fontSize: "24px", fontWeight: 800,
            color: "#0C0C0C", margin: 0, letterSpacing: "-0.4px",
          }}>
            Live results
          </h1>
          <a
            href="/work"
            style={{
              fontFamily: "var(--font-sans), sans-serif", fontSize: "13px", fontWeight: 600,
              color: "#059669", textDecoration: "none",
              backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5",
              borderRadius: "10px", padding: "8px 16px",
              transition: "all 0.15s",
              display: "inline-flex", alignItems: "center", gap: "4px",
            }}
          >
            Earn USDC
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <ResultsDashboard taskId={id} />
      </div>

      {/* Meta */}
      <div style={{
        backgroundColor: "#FAFAF8", border: "1px solid #E8E5DE",
        borderRadius: "16px", padding: "18px 22px",
        display: "flex", flexDirection: "column", gap: "8px",
      }}>
        {[
          {
            label: "Sybil resistance",
            value: "Each vote authenticated via World ID ZKP. One unique human = one vote per task.",
            icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
          },
          {
            label: "Payments",
            value: "Workers paid automatically via ERC-20 USDC transfer on Base Sepolia.",
            icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
          },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "1px", flexShrink: 0 }}>
              <path d={item.icon} />
            </svg>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "12px", fontWeight: 600, color: "#374151" }}>{item.label}:</span>
              <span style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "12px", color: "#6B7280" }}>{item.value}</span>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
          </svg>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "12px", fontWeight: 600, color: "#374151" }}>Task ID:</span>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", color: "#6B7280" }}>{id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
