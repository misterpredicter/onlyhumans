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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans), sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
  letterSpacing: "-0.1px",
};

const DEMO_WALLET_ADDRESS = "0x0000000000000000000000000000000000000001";

interface TaskCreatorProps {
  demoMode?: boolean;
}

export function TaskCreator({ demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" }: TaskCreatorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [tier, setTier] = useState<"quick" | "reasoned" | "detailed">("quick");
  const [options, setOptions] = useState<OptionItem[]>(DEFAULT_OPTIONS);
  const [requesterWallet, setRequesterWallet] = useState(
    demoMode ? DEMO_WALLET_ADDRESS : ""
  );
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

    if (!description.trim()) {
      setError("Please describe what you're comparing.");
      setLoading(false);
      return;
    }

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

    if (workers < 1 || workers > 100) {
      setError("Max voters must be between 1 and 100.");
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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Description */}
      <div>
        <label style={labelStyle}>What are you comparing?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          placeholder="Which landing page converts better?"
          className="input-field"
          style={{ fontFamily: "var(--font-sans), sans-serif", resize: "vertical" }}
        />
      </div>

      {/* Context */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Context for voters</label>
          <span style={{
            fontFamily: "var(--font-sans), sans-serif", fontSize: "11px", color: "#B8B5AD",
            backgroundColor: "#F5F4F0", borderRadius: "4px", padding: "1px 6px",
          }}>optional</span>
        </div>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder="I'm choosing a logo for my startup. Looking for something premium but approachable."
          className="input-field"
          style={{ fontFamily: "var(--font-sans), sans-serif", resize: "vertical" }}
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Options ({options.length})</label>
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "13px", fontWeight: 600,
                color: "#10B981", background: "none", border: "none",
                cursor: "pointer", padding: "2px 0",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#059669"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#10B981"; }}
            >
              + Add option
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {options.map((opt, idx) => (
            <div key={idx} style={{
              border: "1.5px solid #E8E5DE", borderRadius: "14px",
              padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px",
              transition: "border-color 0.2s, box-shadow 0.2s",
              backgroundColor: "#FEFEFE",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 500,
                    color: "#9CA3AF", backgroundColor: "#F5F4F0",
                    borderRadius: "4px", padding: "2px 6px",
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
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
                </div>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    style={{
                      color: "#D1D5DB", background: "none", border: "none",
                      cursor: "pointer", fontSize: "18px", lineHeight: 1, marginLeft: "8px",
                      transition: "color 0.15s",
                      width: "24px", height: "24px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#EF4444";
                      e.currentTarget.style.backgroundColor = "#FEF2F2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#D1D5DB";
                      e.currentTarget.style.backgroundColor = "transparent";
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
                className="input-field"
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing row */}
      <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: "10px" }}>
        <div>
          <label style={labelStyle}>Bounty / vote</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
              fontFamily: "var(--font-sans), sans-serif", fontSize: "14px", color: "#B8B5AD",
              pointerEvents: "none",
            }}>$</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={bountyPerVote}
              onChange={(e) => setBountyPerVote(e.target.value)}
              className="input-field"
              style={{ fontFamily: "var(--font-sans), sans-serif", paddingLeft: "26px" }}
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
            className="input-field"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Your wallet</label>
            {demoMode && (
              <span style={{
                fontFamily: "var(--font-sans), sans-serif", fontSize: "10px", fontWeight: 600,
                color: "#10B981", backgroundColor: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "4px", padding: "1px 5px",
                letterSpacing: "0.3px",
              }}>DEMO</span>
            )}
          </div>
          <input
            value={requesterWallet}
            onChange={(e) => setRequesterWallet(e.target.value)}
            {...(!demoMode && { required: true })}
            placeholder="0x..."
            className="input-field"
            style={{
              fontFamily: "var(--font-mono), monospace", fontSize: "12px",
              ...(demoMode && { opacity: 0.5 }),
            }}
          />
        </div>
      </div>

      {/* Cost summary */}
      {totalCost > 0 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5",
          borderRadius: "12px", padding: "12px 16px",
        }}>
          <span style={{
            fontFamily: "var(--font-sans), sans-serif", fontSize: "13px", color: "#065F46",
          }}>
            Total cost
          </span>
          <span style={{
            fontFamily: "var(--font-sans), sans-serif", fontSize: "15px", fontWeight: 800, color: "#059669",
            letterSpacing: "-0.3px",
          }}>
            ${totalCost.toFixed(2)} USDC
          </span>
        </div>
      )}

      {error && (
        <div className="animate-slide-down" style={{
          backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
          borderRadius: "12px", padding: "14px 18px",
          fontFamily: "var(--font-sans), sans-serif", fontSize: "13px", color: "#92400E",
          lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || totalCost < 0.01}
        className="btn-primary"
        style={{
          width: "100%",
          fontFamily: "var(--font-sans), sans-serif",
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
            </svg>
            Creating task...
          </span>
        ) : (
          `Post task — $${totalCost.toFixed(2)} USDC`
        )}
      </button>

      <p style={{
        textAlign: "center",
        fontFamily: "var(--font-sans), sans-serif",
        fontSize: "12px", color: "#B8B5AD", margin: 0,
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Payment via x402 on Base Sepolia
      </p>
    </form>
  );
}
