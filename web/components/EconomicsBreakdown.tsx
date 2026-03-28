import {
  ECONOMICS,
  calculateFounderFee,
  calculateIdeaContributorPayout,
  calculatePlatformFee,
  calculateWorkerPayout,
} from "@/lib/economics";

interface EconomicsBreakdownProps {
  taskRevenue: number;
  ideaContributorShare?: number;
  title?: string;
  subtitle?: string;
  maxWorkers?: number;
  compact?: boolean;
  showFooter?: boolean;
}

const dm: React.CSSProperties = { fontFamily: "var(--font-sans), sans-serif" };

function formatUsd(value: number) {
  if (value === 0) return "$0.00";
  if (value < 0.01) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function EconomicsBreakdown({
  taskRevenue,
  ideaContributorShare = ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE,
  title = "Revenue split",
  subtitle,
  maxWorkers,
  compact = false,
  showFooter = true,
}: EconomicsBreakdownProps) {
  const worker = calculateWorkerPayout(taskRevenue, ideaContributorShare);
  const idea = calculateIdeaContributorPayout(taskRevenue, ideaContributorShare);
  const platform = calculatePlatformFee(taskRevenue);
  const founder = calculateFounderFee(taskRevenue);
  const projectedTotal = maxWorkers ? taskRevenue * maxWorkers : null;

  const entries = [
    {
      key: "workers",
      label: "Workers",
      amount: worker,
      pct: taskRevenue > 0 ? (worker / taskRevenue) * 100 : 0,
      color: "#10B981",
      track: "#ECFDF5",
    },
    {
      key: "idea",
      label: "Idea",
      amount: idea,
      pct: taskRevenue > 0 ? (idea / taskRevenue) * 100 : 0,
      color: "#3B82F6",
      track: "#EFF6FF",
    },
    {
      key: "platform",
      label: "Platform",
      amount: platform,
      pct: ECONOMICS.PLATFORM * 100,
      color: "#F59E0B",
      track: "#FFFBEB",
    },
    {
      key: "founder",
      label: "Founder",
      amount: founder,
      pct: ECONOMICS.FOUNDER * 100,
      color: "#8B5CF6",
      track: "#F5F3FF",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8E5DE",
        borderRadius: compact ? "16px" : "20px",
        padding: compact ? "16px" : "22px",
        display: "flex",
        flexDirection: "column",
        gap: compact ? "12px" : "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <p
            style={{
              ...dm,
              fontSize: compact ? "14px" : "16px",
              fontWeight: 800,
              color: "#0C0C0C",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            {title}
          </p>
          {subtitle && (
            <p
              style={{
                ...dm,
                fontSize: "12px",
                color: "#6B7280",
                margin: "4px 0 0",
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              ...dm,
              fontSize: compact ? "18px" : "22px",
              fontWeight: 800,
              color: "#0C0C0C",
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}
          >
            {formatUsd(taskRevenue)}
          </div>
          <div style={{ ...dm, fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>revenue per vote</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: compact ? "10px" : "12px" }}>
        {entries.map((entry) => (
          <div key={entry.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: entry.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ ...dm, fontSize: compact ? "12px" : "13px", fontWeight: 700, color: "#0C0C0C" }}>
                  {entry.label}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ ...dm, fontSize: compact ? "12px" : "13px", fontWeight: 700, color: "#0C0C0C" }}>
                  {formatPct(entry.pct)}
                </span>
                <span style={{ ...dm, fontSize: "12px", color: "#6B7280" }}>{formatUsd(entry.amount)}</span>
              </div>
            </div>
            <div
              style={{
                height: compact ? "10px" : "12px",
                borderRadius: "999px",
                backgroundColor: entry.track,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(entry.pct, 1)}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${entry.color}, ${entry.color}CC)`,
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {showFooter && (
        <div
          style={{
            backgroundColor: "#FAFAF8",
            border: "1px solid #F0EDE6",
            borderRadius: "14px",
            padding: compact ? "12px 14px" : "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <p style={{ ...dm, fontSize: "12px", color: "#374151", margin: 0, lineHeight: 1.5 }}>
            Idea contributor take: <strong>{(ideaContributorShare * 100).toFixed(0)}%</strong> of the 90% contributor pool.
            Workers keep the remaining <strong>{((1 - ideaContributorShare) * 100).toFixed(0)}%</strong> of that pool.
          </p>
          {projectedTotal !== null && (
            <p style={{ ...dm, fontSize: "12px", color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              If the task fills to {maxWorkers} votes, total network revenue is {formatUsd(projectedTotal)}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
