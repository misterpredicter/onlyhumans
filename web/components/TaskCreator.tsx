"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EconomicsBreakdown } from "@/components/EconomicsBreakdown";
import { getTierInfo, TierSelector } from "@/components/TierBadge";
import { ECONOMICS, calculateWorkerPayout } from "@/lib/economics";

interface OptionItem {
  label: string;
  content: string;
}

const DEFAULT_OPTIONS: OptionItem[] = [
  { label: "Option A", content: "" },
  { label: "Option B", content: "" },
];

const DEMO_WALLET_ADDRESS = "0x0000000000000000000000000000000000000001";

interface TaskCreatorProps {
  demoMode?: boolean;
}

const sectionStyle: React.CSSProperties = {
  padding: "22px",
  borderRadius: "24px",
  border: "1px solid rgba(12,12,12,0.08)",
  background: "rgba(255,255,255,0.82)",
  boxShadow: "var(--shadow-card)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  color: "#20242A",
  letterSpacing: "-0.02em",
  marginBottom: "8px",
};

const hintStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#7A8089",
  lineHeight: 1.5,
};

function formatUsd(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function TaskCreator({ demoMode = false }: TaskCreatorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [tier, setTier] = useState<"quick" | "reasoned" | "detailed">("quick");
  const [options, setOptions] = useState<OptionItem[]>(DEFAULT_OPTIONS);
  const [requesterWallet, setRequesterWallet] = useState(demoMode ? DEMO_WALLET_ADDRESS : "");
  const [maxWorkers, setMaxWorkers] = useState("20");
  const [bountyPerVote, setBountyPerVote] = useState("0.10");
  const [ideaContributorSharePct, setIdeaContributorSharePct] = useState(
    String(ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE * 100)
  );

  const bounty = parseFloat(bountyPerVote) || 0;
  const workers = parseInt(maxWorkers) || 0;
  const totalCost = bounty * workers;
  const tierInfo = getTierInfo(tier);
  const ideaContributorShare =
    Math.min(
      ECONOMICS.IDEA_CONTRIBUTOR_RANGE.max * 100,
      Math.max(
        ECONOMICS.IDEA_CONTRIBUTOR_RANGE.min * 100,
        Number(ideaContributorSharePct) || ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE * 100
      )
    ) / 100;
  const workerPayout = calculateWorkerPayout(bounty, ideaContributorShare);

  const populatedOptions = useMemo(
    () => options.filter((option) => option.content.trim().length > 0).length,
    [options]
  );

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
    setOptions((prev) => prev.map((option, i) => (i === idx ? { ...option, [field]: value } : option)));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!description.trim()) {
      setError("Describe the judgment call before launching.");
      setLoading(false);
      return;
    }

    if (options.some((option) => !option.content.trim())) {
      setError("Every option needs content so contributors know what they are judging.");
      setLoading(false);
      return;
    }

    if (bounty < 0.01) {
      setError("Revenue must be at least $0.01 per vote.");
      setLoading(false);
      return;
    }

    if (
      ideaContributorShare < ECONOMICS.IDEA_CONTRIBUTOR_RANGE.min ||
      ideaContributorShare > ECONOMICS.IDEA_CONTRIBUTOR_RANGE.max
    ) {
      setError("Idea contributor take must stay between 1% and 20% of the 90% contributor pool.");
      setLoading(false);
      return;
    }

    if (workers < 1 || workers > 100) {
      setError("Max voters must be between 1 and 100.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/tasks?total=${totalCost.toFixed(2)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          description,
          context: context.trim() || null,
          options: options.map((option) => ({ label: option.label, content: option.content })),
          max_workers: workers,
          bounty_per_vote: bounty,
          requester_wallet: requesterWallet,
          tier,
          idea_contributor_share: ideaContributorShare,
        }),
      });

      if (response.status === 402) {
        const paymentInfo = await response.json();
        setError(
          `Payment required: ${formatUsd(totalCost)} USDC on Base Sepolia. Use @x402/fetch or a wrapped payment client to create the task. ${
            paymentInfo ? `Response: ${JSON.stringify(paymentInfo).slice(0, 120)}` : ""
          }`
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const { error: message } = await response.json();
        setError(message ?? "Failed to create task");
        setLoading(false);
        return;
      }

      const { task_id: taskId } = await response.json();
      router.push(`/task/${taskId}`);
    } catch {
      setError("Network error while creating the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div
        className="animate-fade-in-up"
        style={{
          ...sectionStyle,
          gap: "18px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,247,0.88) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "440px" }}>
            <p className="soft-label" style={{ margin: "0 0 8px" }}>
              Launch a judgment market
            </p>
            <h3 style={{ margin: "0 0 10px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em" }}>
              Create a premium task in under a minute.
            </h3>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
              Set the question, the payout, and the depth of feedback. The protocol locks spend through x402 and routes it to verified humans.
            </p>
          </div>

          <div
            style={{
              minWidth: "240px",
              padding: "16px",
              borderRadius: "20px",
              border: "1px solid rgba(12,12,12,0.08)",
              background: "rgba(255,255,255,0.84)",
              display: "grid",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" }}>
              <span className="soft-label">Spend locked</span>
              <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em" }}>{formatUsd(totalCost)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
              {[
                { label: "tier", value: tierInfo.label.replace(" Vote", "") },
                { label: "workers", value: workers > 0 ? `${workers}` : "0" },
                { label: "worker pay", value: formatUsd(workerPayout) },
              ].map((item) => (
                <div key={item.label} style={{ padding: "10px 12px", borderRadius: "16px", background: "#F5F4F0" }}>
                  <div className="micro-label" style={{ marginBottom: "6px" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0C0C0C" }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "12px", lineHeight: 1.5, color: "#6B7280" }}>
              90% routes to contributors. You are asking for {Number(ideaContributorSharePct || 0).toFixed(0)}% of that pool.
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up delay-100" style={sectionStyle}>
        <div>
          <label style={labelStyle}>What judgment do you need from the crowd?</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={3}
            placeholder="Which landing page makes the company feel more credible to a first-time visitor?"
            className="input-field"
            style={{ resize: "vertical" }}
          />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Context for contributors</label>
            <span className="pill" style={{ padding: "5px 9px", fontSize: "11px" }}>
              optional
            </span>
          </div>
          <textarea
            value={context}
            onChange={(event) => setContext(event.target.value)}
            rows={3}
            placeholder="Audience, constraints, what success looks like, or what tradeoff voters should optimize for."
            className="input-field"
            style={{ resize: "vertical" }}
          />
          <div style={{ marginTop: "8px", ...hintStyle }}>
            Good context improves speed and confidence. Think of it like briefing a careful human reviewer, not an LLM.
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up delay-200" style={sectionStyle}>
        <div>
          <label style={labelStyle}>Feedback depth</label>
          <TierSelector value={tier} onChange={(value) => setTier(value as "quick" | "reasoned" | "detailed")} />
        </div>

        <div className="pricing-grid">
          <div>
            <label style={labelStyle}>Revenue per vote</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#8A8F98", fontWeight: 700 }}>$</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={bountyPerVote}
                onChange={(event) => setBountyPerVote(event.target.value)}
                className="input-field"
                style={{ paddingLeft: "30px" }}
              />
            </div>
            <div style={{ marginTop: "8px", ...hintStyle }}>Workers see the actual payout before they vote. Higher revenue still fills faster.</div>
          </div>

          <div>
            <label style={labelStyle}>Max voters</label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxWorkers}
              onChange={(event) => setMaxWorkers(event.target.value)}
              className="input-field"
            />
            <div style={{ marginTop: "8px", ...hintStyle }}>Five votes is enough for a winner. More improves confidence.</div>
          </div>

          <div>
            <label style={labelStyle}>Idea take (% of the 90%)</label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                min={String(ECONOMICS.IDEA_CONTRIBUTOR_RANGE.min * 100)}
                max={String(ECONOMICS.IDEA_CONTRIBUTOR_RANGE.max * 100)}
                step="1"
                value={ideaContributorSharePct}
                onChange={(event) => setIdeaContributorSharePct(event.target.value)}
                className="input-field"
                style={{ paddingRight: "32px" }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#8A8F98",
                  fontWeight: 700,
                }}
              >
                %
              </span>
            </div>
            <div style={{ marginTop: "8px", ...hintStyle }}>Lower take is more attractive. The market decides whether your framing earns the spread.</div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Requester wallet</label>
              {demoMode && (
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "999px",
                    background: "rgba(16,185,129,0.1)",
                    color: "#059669",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  DEMO
                </span>
              )}
            </div>
            <input
              value={requesterWallet}
              onChange={(event) => setRequesterWallet(event.target.value)}
              {...(!demoMode && { required: true })}
              placeholder="0x..."
              className="input-field"
              style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", ...(demoMode && { opacity: 0.55 }) }}
            />
            <div style={{ marginTop: "8px", ...hintStyle }}>Funds are attributed to this wallet for x402 settlement and task provenance.</div>
          </div>
        </div>

        <EconomicsBreakdown
          taskRevenue={bounty}
          ideaContributorShare={ideaContributorShare}
          maxWorkers={workers}
          title="Visible economics"
          subtitle="This exact split appears to workers in the feed and on the task page."
        />
      </div>

      <div className="animate-fade-in-up delay-300" style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <label style={{ ...labelStyle, marginBottom: "4px" }}>Options to compare</label>
            <div style={hintStyle}>
              {populatedOptions}/{options.length} ready. Use URLs, screenshots, copy variants, or structured text.
            </div>
          </div>

          {options.length < 6 && (
            <button type="button" className="btn-secondary" onClick={addOption}>
              Add option
            </button>
          )}
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {options.map((option, index) => (
            <div
              key={index}
              style={{
                padding: "16px",
                borderRadius: "20px",
                border: "1px solid rgba(12,12,12,0.08)",
                background: index % 2 === 0 ? "rgba(255,255,255,0.74)" : "rgba(249,248,245,0.9)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#F1EFE8",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#6B7280",
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    value={option.label}
                    onChange={(event) => updateOption(index, "label", event.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)} label`}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#0C0C0C",
                      letterSpacing: "-0.02em",
                    }}
                  />
                </div>

                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "12px",
                      border: "none",
                      background: "rgba(239,68,68,0.08)",
                      color: "#DC2626",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              <input
                value={option.content}
                onChange={(event) => updateOption(index, "content", event.target.value)}
                required
                placeholder="Paste a URL, headline, product description, or prompt output..."
                className="input-field"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up delay-400" style={sectionStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "14px", alignItems: "center" }}>
          <div>
            <div className="soft-label" style={{ marginBottom: "8px" }}>
              Launch summary
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.05em", marginBottom: "6px" }}>
              {formatUsd(totalCost)} total budget
            </div>
            <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
              {workers} contributors, {formatUsd(workerPayout)} to workers per vote, configured for {tierInfo.label.toLowerCase()} feedback.
            </div>
          </div>

          <div className="pill-row">
            <span className="pill">x402 payment rail</span>
            <span className="pill">World ID reviewers</span>
            <span className="pill">Live consensus API</span>
          </div>
        </div>

        {error && (
          <div
            className="animate-slide-down"
            style={{
              padding: "14px 16px",
              borderRadius: "18px",
              background: "#FFF7ED",
              border: "1px solid #FED7AA",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#9A3412",
            }}
          >
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || totalCost < 0.01} className="btn-primary" style={{ width: "100%" }}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
              </svg>
              Launching task...
            </span>
          ) : (
            `Launch task for ${formatUsd(totalCost)}`
          )}
        </button>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#8A8F98", lineHeight: 1.6 }}>
          Payment clears through x402 on Base Sepolia. Contributors see the brief instantly once the task is live.
        </div>
      </div>
    </form>
  );
}
