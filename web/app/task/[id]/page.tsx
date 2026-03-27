import { ResultsDashboard } from "@/components/ResultsDashboard";

interface Props {
  params: Promise<{ id: string }>;
}

const dm = { fontFamily: "var(--font-sans), sans-serif" } as const;

export default async function TaskResultsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
      <a
        href="/"
        style={{ ...dm, fontSize: "14px", color: "#6B7280", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginBottom: "24px" }}
      >
        ← Back to Human Signal
      </a>

      <div style={{
        backgroundColor: "#FFFFFF",
        border: "1.5px solid #E8E5DE",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h1 style={{ ...dm, fontSize: "22px", fontWeight: 800, color: "#0C0C0C", margin: 0, letterSpacing: "-0.3px" }}>
            Live results
          </h1>
          <a
            href="/work"
            style={{
              ...dm, fontSize: "13px", fontWeight: 600,
              color: "#059669", textDecoration: "none",
              backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
              borderRadius: "8px", padding: "8px 16px",
            }}
          >
            Earn USDC by voting →
          </a>
        </div>
        <ResultsDashboard taskId={id} />
      </div>

      {/* Meta */}
      <div style={{
        backgroundColor: "#FFFFFF", border: "1.5px solid #E8E5DE",
        borderRadius: "14px", padding: "16px 20px",
        display: "flex", flexDirection: "column", gap: "6px",
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ ...dm, fontSize: "12px", fontWeight: 600, color: "#374151" }}>Sybil resistance:</span>
          <span style={{ ...dm, fontSize: "12px", color: "#6B7280" }}>Each vote authenticated via World ID ZKP. One unique human = one vote per task.</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ ...dm, fontSize: "12px", fontWeight: 600, color: "#374151" }}>Payments:</span>
          <span style={{ ...dm, fontSize: "12px", color: "#6B7280" }}>Workers paid automatically via ERC-20 USDC transfer on Base Sepolia.</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ ...dm, fontSize: "12px", fontWeight: 600, color: "#374151" }}>Task ID:</span>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", color: "#6B7280" }}>{id}</span>
        </div>
      </div>
    </div>
  );
}
