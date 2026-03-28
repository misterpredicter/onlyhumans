interface SplitBadgeProps {
  compact?: boolean;
  tone?: "light" | "dark";
}

const SPLITS = [
  { value: "90%", label: "contributors", color: "#10B981" },
  { value: "9%", label: "platform", color: "#3B82F6" },
  { value: "1%", label: "founder", color: "#F59E0B" },
] as const;

export function SplitBadge({ compact = false, tone = "light" }: SplitBadgeProps) {
  const dark = tone === "dark";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? "8px" : "10px",
        flexWrap: "wrap",
        padding: compact ? "8px 10px" : "10px 12px",
        borderRadius: compact ? "999px" : "16px",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(12,12,12,0.08)",
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.78)",
        boxShadow: dark ? "none" : "0 12px 32px rgba(19, 23, 17, 0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {SPLITS.map((item) => (
        <span
          key={item.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: compact ? "11px" : "12px",
            lineHeight: 1,
            color: dark ? "rgba(255,255,255,0.7)" : "#5F6670",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: compact ? "34px" : "38px",
              padding: compact ? "4px 6px" : "5px 7px",
              borderRadius: "999px",
              background: `${item.color}16`,
              color: item.color,
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            {item.value}
          </span>
          <span style={{ fontWeight: 600 }}>{item.label}</span>
        </span>
      ))}
    </div>
  );
}
