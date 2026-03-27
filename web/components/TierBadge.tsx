"use client";

const TIER_INFO = {
  quick: {
    label: "Quick Vote",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    desc: "Click your pick",
  },
  reasoned: {
    label: "Reasoned Vote",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Pick + 1-2 sentence reason",
  },
  detailed: {
    label: "Detailed Review",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Pick + structured feedback",
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
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full border ${textSize} ${info.color}`}
    >
      {info.label}
      {showPayout && payout && (
        <span className="opacity-70">· {payout}</span>
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
            className={`rounded-xl border-2 p-3 text-left transition-all ${
              selected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold text-sm">{info.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{info.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
