"use client";

const TIER_INFO = {
  quick: {
    label: "Quick Vote",
    color: "#374151",
    bg: "#F5F4F0",
    border: "#E8E5DE",
    desc: "Click your pick",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    selectedBorder: "#0C0C0C",
    selectedBg: "#F5F4F0",
  },
  reasoned: {
    label: "Reasoned Vote",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Pick + 1-2 sentence reason",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    selectedBorder: "#1D4ED8",
    selectedBg: "#EFF6FF",
  },
  detailed: {
    label: "Detailed Review",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    desc: "Pick + structured feedback",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
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
  const padding = size === "sm" ? "3px 10px" : "5px 14px";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      fontFamily: "var(--font-sans), sans-serif",
      fontSize, fontWeight: 600,
      color: info.color,
      backgroundColor: info.bg,
      border: `1px solid ${info.border}`,
      borderRadius: "100px",
      padding,
      letterSpacing: "-0.1px",
    }}>
      <span style={{
        width: size === "sm" ? "4px" : "5px",
        height: size === "sm" ? "4px" : "5px",
        borderRadius: "100px",
        backgroundColor: info.color,
        opacity: 0.5,
        flexShrink: 0,
      }} />
      {info.label}
      {showPayout && payout && (
        <span style={{ opacity: 0.6, fontWeight: 500 }}>{payout}</span>
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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
      {(["quick", "reasoned", "detailed"] as const).map((t) => {
        const info = TIER_INFO[t];
        const selected = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className="tier-card"
            style={{
              borderRadius: "14px",
              border: `2px solid ${selected ? info.selectedBorder : "#E8E5DE"}`,
              backgroundColor: selected ? info.selectedBg : "#FEFEFE",
              padding: "14px",
              textAlign: "left",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {selected && (
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                width: "18px", height: "18px",
                backgroundColor: info.color,
                borderRadius: "100px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
            <div style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "13px", fontWeight: 700,
              color: selected ? info.color : "#374151",
              marginBottom: "3px",
              letterSpacing: "-0.1px",
            }}>
              {info.label}
            </div>
            <div style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "11px", color: "#9CA3AF",
              lineHeight: 1.4,
            }}>
              {info.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}
