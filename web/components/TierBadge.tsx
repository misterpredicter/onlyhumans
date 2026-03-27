"use client";

const TIER_INFO = {
  quick: {
    label: "Quick Vote",
    color: "#374151",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    desc: "Click your pick",
    selectedBorder: "#0C0C0C",
    selectedBg: "#F9FAFB",
  },
  reasoned: {
    label: "Reasoned Vote",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Pick + 1–2 sentence reason",
    selectedBorder: "#1D4ED8",
    selectedBg: "#EFF6FF",
  },
  detailed: {
    label: "Detailed Review",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    desc: "Pick + structured feedback",
    selectedBorder: "#7C3AED",
    selectedBg: "#F5F3FF",
  },
} as const;

interface TierBadgeProps {
  tier: string;
  showPayout?: boolean;
  payout?: string;
  size?: "sm" | "md";
}

export function TierBadge({ tier, showPayout = false, payout, size = "sm" }: TierBadgeProps) {
  const info = TIER_INFO[tier as keyof typeof TIER_INFO] ?? TIER_INFO.quick;
  const fontSize = size === "sm" ? "11px" : "13px";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize, fontWeight: 600,
      color: info.color,
      backgroundColor: info.bg,
      border: `1px solid ${info.border}`,
      borderRadius: "100px",
      padding: "3px 10px",
    }}>
      {info.label}
      {showPayout && payout && (
        <span style={{ opacity: 0.7 }}>· {payout}</span>
      )}
    </span>
  );
}

export function TierSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (tier: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(["quick", "reasoned", "detailed"] as const).map((t) => {
        const info = TIER_INFO[t];
        const selected = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            style={{
              borderRadius: "12px",
              border: `2px solid ${selected ? info.selectedBorder : "#E8E5DE"}`,
              backgroundColor: selected ? info.selectedBg : "#FAFAFA",
              padding: "12px",
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
          >
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px", fontWeight: 700,
              color: selected ? info.color : "#374151",
              marginBottom: "2px",
            }}>
              {info.label}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", color: "#6B7280",
            }}>
              {info.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}
