"use client";

export const TIER_INFO = {
  quick: {
    label: "Quick Vote",
    color: "#0F766E",
    bg: "#ECFEFF",
    border: "#A5F3FC",
    desc: "Fast selection, no written rationale",
    micro: "10-20 sec",
    icon: "M13 3L4 14h6l-1 7 9-11h-6z",
    selectedBorder: "#0F766E",
    selectedBg: "linear-gradient(135deg, #ECFEFF 0%, #F0FDFA 100%)",
  },
  reasoned: {
    label: "Reasoned Vote",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Short rationale attached to your pick",
    micro: "30-45 sec",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    selectedBorder: "#1D4ED8",
    selectedBg: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFF 100%)",
  },
  detailed: {
    label: "Detailed Review",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    desc: "Structured critique and suggestions",
    micro: "1-3 min",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6M8 9h3",
    selectedBorder: "#7C3AED",
    selectedBg: "linear-gradient(135deg, #F5F3FF 0%, #FAF5FF 100%)",
  },
} as const;

export type TierKey = keyof typeof TIER_INFO;

export function getTierInfo(tier: string) {
  return TIER_INFO[tier as TierKey] ?? TIER_INFO.quick;
}

interface TierBadgeProps {
  tier: string;
  showPayout?: boolean;
  payout?: string;
  size?: "sm" | "md";
}

export function TierBadge({ tier, showPayout = false, payout, size = "sm" }: TierBadgeProps) {
  const info = getTierInfo(tier);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        borderRadius: "999px",
        padding: size === "sm" ? "6px 10px" : "8px 12px",
        border: `1px solid ${info.border}`,
        background: info.bg,
        color: info.color,
        fontSize: size === "sm" ? "11px" : "12px",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      }}
    >
      <svg width={size === "sm" ? "12" : "14"} height={size === "sm" ? "12" : "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={info.icon} />
      </svg>
      <span>{info.label}</span>
      {showPayout && payout && <span style={{ opacity: 0.64 }}>{payout}</span>}
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
      {(Object.keys(TIER_INFO) as TierKey[]).map((tier) => {
        const info = TIER_INFO[tier];
        const selected = value === tier;

        return (
          <button
            key={tier}
            type="button"
            onClick={() => onChange(tier)}
            className="tier-card"
            style={{
              padding: "16px",
              borderRadius: "20px",
              border: `1.5px solid ${selected ? info.selectedBorder : "rgba(12,12,12,0.08)"}`,
              background: selected ? info.selectedBg : "rgba(255,255,255,0.86)",
              textAlign: "left",
              cursor: "pointer",
              position: "relative",
              minHeight: "148px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${info.color}14`,
                  color: info.color,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={info.icon} />
                </svg>
              </span>
              {selected && (
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "999px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: info.color,
                    boxShadow: `0 10px 20px ${info.color}30`,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>

            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>
                {info.label}
              </div>
              <div style={{ fontSize: "12px", lineHeight: 1.55, color: "#6B7280" }}>{info.desc}</div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                width: "fit-content",
                borderRadius: "999px",
                padding: "5px 8px",
                background: "rgba(12,12,12,0.04)",
                fontSize: "11px",
                fontWeight: 700,
                color: selected ? info.color : "#6B7280",
              }}
            >
              <span>{info.micro}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
