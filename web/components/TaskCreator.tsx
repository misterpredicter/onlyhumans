"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TierSelector } from "@/components/TierBadge";

interface OptionItem {
  label: string;
  content: string;
}

const DEFAULT_OPTIONS: OptionItem[] = [
  { label: "Option A", content: "" },
  { label: "Option B", content: "" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#F9F8F5",
  border: "1.5px solid #E8E5DE",
  borderRadius: "10px",
  padding: "10px 14px",
  fontFamily: "var(--font-sans), sans-serif",
  fontSize: "14px",
  color: "#0C0C0C",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans), sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
};

export function TaskCreator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [tier, setTier] = useState<"quick" | "reasoned" | "detailed">("quick");
  const [options, setOptions] = useState<OptionItem[]>(DEFAULT_OPTIONS);
  const [requesterWallet, setRequesterWallet] = useState("");
  const [maxWorkers, setMaxWorkers] = useState("20");
  const [bountyPerVote, setBountyPerVote] = useState("0.10");

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions((prev) => [
      ...prev,
      { label: `Option ${String.fromCharCode(65 + prev.length)}`, content: "" },
    ]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, field: "label" | "content", value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt))
    );
  };

  const bounty = parseFloat(bountyPerVote) || 0;
  const workers = parseInt(maxWorkers) || 0;
  const totalCost = bounty * workers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (options.some((o) => !o.content.trim())) {
      setError("All options need content.");
      setLoading(false);
      return;
    }

    if (bounty < 0.01) {
      setError("Bounty must be at least $0.01 per vote.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/tasks?total=${totalCost.toFixed(2)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description,
          context: context.trim() || null,
          options: options.map((o) => ({ label: o.label, content: o.content })),
          max_workers: workers,
          bounty_per_vote: bounty,
          requester_wallet: requesterWallet,
          tier,
        }),
      });

      if (res.status === 402) {
        const paymentInfo = await res.json();
        setError(
          `x402 gate active — payment required: $${totalCost.toFixed(2)} USDC on Base Sepolia. ` +
            `Use @x402/fetch with wrapFetchWithPayment() to pay automatically. ` +
            (paymentInfo ? `Response: ${JSON.stringify(paymentInfo).slice(0, 120)}` : "")
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const { error: errMsg } = await res.json();
        setError(errMsg ?? "Failed to create task");
        setLoading(false);
        return;
      }

      const { task_id } = await res.json();
      router.push(`/task/${task_id}`);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Description */}
      <div>
        <label style={labelStyle}>What are you comparing?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          placeholder="Which landing page converts better?"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Context */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Context for voters</label>
          <span style={{ fontFamily: "var(--font-sans), sans-serif", fontSize: "12px", color: "#9CA3AF" }}>optional</span>
        </div>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder="I'm choosing a logo for my startup. Looking for something premium but approachable."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Tier */}
      <div>
        <label style={labelStyle}>Feedback depth</label>
        <TierSelector
          value={tier}
          onChange={(t) => setTier(t as "quick" | "reasoned" | "detailed")}
        />
      </div>

      {/* Options */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Options ({options.length})</label>
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "13px", fontWeight: 600,
                color: "#6366F1", background: "none", border: "none",
                cursor: "pointer", padding: 0,
              }}
            >
              + Add option
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {options.map((opt, idx) => (
            <div key={idx} style={{
              border: "1.5px solid #E8E5DE", borderRadius: "12px",
              padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <input
                  value={opt.label}
                  onChange={(e) => updateOption(idx, "label", e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)} label`}
                  style={{
                    fontFamily: "var(--font-sans), sans-serif",
                    fontSize: "13px", fontWeight: 700,
                    color: "#0C0C0C", background: "none",
                    border: "none", outline: "none", flex: 1,
                  }}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    style={{
                      color: "#D1D5DB", background: "none", border: "none",
                      cursor: "pointer", fontSize: "18px", lineHeight: 1, marginLeft: "8px",
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                value={opt.content}
                onChange={(e) => updateOption(idx, "content", e.target.value)}
                required
                placeholder="URL or text content..."
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: "10px" }}>
        <div>
          <label style={labelStyle}>Bounty / vote</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
              fontFamily: "var(--font-sans), sans-serif", fontSize: "14px", color: "#9CA3AF",
            }}>$</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={bountyPerVote}
              onChange={(e) => setBountyPerVote(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "26px" }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Max voters</label>
          <input
            type="number"
            min="1"
            max="100"
            value={maxWorkers}
            onChange={(e) => setMaxWorkers(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Your wallet</label>
          <input
            value={requesterWallet}
            onChange={(e) => setRequesterWallet(e.target.value)}
            required
            placeholder="0x..."
            style={{ ...inputStyle, fontFamily: "var(--font-mono), monospace", fontSize: "12px" }}
          />
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
          borderRadius: "10px", padding: "12px 16px",
          fontFamily: "var(--font-sans), sans-serif", fontSize: "13px", color: "#92400E",
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || totalCost < 0.01}
        style={{
          width: "100%",
          backgroundColor: loading || totalCost < 0.01 ? "#D1D5DB" : "#10B981",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "12px",
          padding: "16px",
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: "15px", fontWeight: 700,
          cursor: loading || totalCost < 0.01 ? "not-allowed" : "pointer",
          transition: "background-color 0.15s",
        }}
      >
        {loading
          ? "Creating task..."
          : `Post task — $${totalCost.toFixed(2)} USDC (${workers} votes × $${bounty.toFixed(2)})`}
      </button>

      <p style={{
        textAlign: "center",
        fontFamily: "var(--font-sans), sans-serif",
        fontSize: "12px", color: "#9CA3AF", margin: 0,
      }}>
        Payment processed via x402 on Base Sepolia (testnet)
      </p>
    </form>
  );
}
