"use client";

const TIER_INFO = {
  quick: {
    label: "Quick Vote",
    payout: "$0.08",
    create: "$0.50",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    desc: "Click your pick",
  },
  reasoned: {
    label: "Reasoned Vote",
    payout: "$0.20",
    create: "$1.00",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Pick + 1-2 sentence reason",
  },
  detailed: {
    label: "Detailed Review",
    payout: "$0.50",
    create: "$2.50",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Pick + structured feedback",
  },
} as const;

interface TierBadgeProps {
  tier: string;
  showPayout?: boolean;
  size?: "sm" | "md";
}

export function TierBadge({ tier, showPayout = true, size = "sm" }: TierBadgeProps) {
  const info = TIER_INFO[tier as keyof typeof TIER_INFO] ?? TIER_INFO.quick;
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full border ${textSize} ${info.color}`}
    >
      {info.label}
      {showPayout && (
        <span className="opacity-70">· {info.payout}</span>
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
            <div className="mt-2 space-y-0.5">
              <div className="text-xs text-gray-400">
                Post: <span className="font-medium text-gray-700">{info.create}</span>
              </div>
              <div className="text-xs text-gray-400">
                Earn: <span className="font-medium text-green-600">{info.payout}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export const TIER_PRICES = {
  quick: "$0.50",
  reasoned: "$1.00",
  detailed: "$2.50",
} as const;
