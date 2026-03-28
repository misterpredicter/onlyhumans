"use client";

import { useState } from "react";
import Image from "next/image";

interface TaskOption {
  option_index: number;
  label: string;
  content: string;
}

interface Props {
  taskId: string;
  options: TaskOption[];
  tier: string;
  nullifierHash: string;
  workerWallet?: string;
  context?: string | null;
  onVoted?: () => void;
  onBackToQueue?: () => void;
}

interface VoteResult {
  tx: string | null;
  amount: number;
  totalVotes: number;
  optionIndex: number;
}

const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);

export function MultiOptionJudgment({
  taskId,
  options,
  tier,
  nullifierHash,
  workerWallet,
  context,
  onVoted,
  onBackToQueue,
}: Props) {
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState<number | null>(null);
  const [result, setResult] = useState<VoteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [creatorRated, setCreatorRated] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackWorks, setFeedbackWorks] = useState("");
  const [feedbackDoesnt, setFeedbackDoesnt] = useState("");
  const [feedbackSuggestions, setFeedbackSuggestions] = useState("");

  const vote = async (optionIndex: number) => {
    if (voting !== null) return;

    if (tier === "reasoned" && !feedbackText.trim()) {
      setError("Write a short reason before you submit.");
      return;
    }

    if (tier === "detailed" && !feedbackWorks.trim()) {
      setError("Complete the 'What works?' field before submitting.");
      return;
    }

    setVoting(optionIndex);
    setError(null);

    const combinedFeedback =
      tier === "reasoned"
        ? feedbackText
        : tier === "detailed"
          ? [
              feedbackWorks ? `What works: ${feedbackWorks}` : "",
              feedbackDoesnt ? `What doesn't: ${feedbackDoesnt}` : "",
              feedbackSuggestions ? `Suggestions: ${feedbackSuggestions}` : "",
            ]
              .filter(Boolean)
              .join("\n\n")
          : null;

    try {
      const response = await fetch(`/api/tasks/${taskId}/vote`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          option_index: optionIndex,
          nullifier_hash: nullifierHash,
          worker_wallet: workerWallet,
          feedback_text: combinedFeedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Vote failed");
        setVoting(null);
        return;
      }

      if (data.success) {
        setVoted(true);
        setResult({
          tx: data.payment_tx_hash,
          amount: data.amount_paid_usdc,
          totalVotes: data.total_votes,
          optionIndex: data.option_index,
        });
        onVoted?.();
      }
    } catch {
      setError("Network error. Please try again.");
      setVoting(null);
    }
  };

  const rateCreator = async (rating: 1 | -1) => {
    try {
      await fetch(`/api/tasks/${taskId}/rate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "creator", nullifier_hash: nullifierHash, rating }),
      });
      setCreatorRated(true);
    } catch {
      // Silent failure. Rating is secondary to the primary vote flow.
    }
  };

  if (voted && result) {
    const chosenOption = options.find((option) => option.option_index === result.optionIndex);

    return (
      <div className="animate-scale-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            padding: "30px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 48%, #D1FAE5 100%)",
            border: "1px solid #A7F3D0",
            boxShadow: "0 24px 48px rgba(16,185,129,0.14)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px", flexWrap: "wrap" }}>
            <div
              className="animate-check"
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "18px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                boxShadow: "0 18px 34px rgba(16,185,129,0.24)",
                color: "#FFFFFF",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: "220px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "30px", fontWeight: 800, letterSpacing: "-0.05em", color: "#052E16" }}>
                Vote recorded
              </p>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: "#065F46" }}>
                You chose <strong>{chosenOption?.label}</strong>. The live consensus has been updated.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
            {[
              { label: "payout", value: result.amount > 0 ? `+${result.amount.toFixed(2)} USDC` : "Counted only" },
              { label: "total votes", value: `${result.totalVotes}` },
              { label: "option", value: chosenOption?.label ?? `#${result.optionIndex + 1}` },
            ].map((item) => (
              <div key={item.label} style={{ padding: "14px 16px", borderRadius: "18px", background: "rgba(255,255,255,0.7)" }}>
                <div className="micro-label" style={{ marginBottom: "6px", color: "#059669" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.03em", color: "#052E16" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {result.tx && (
            <div
              style={{
                marginTop: "14px",
                padding: "12px 14px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.62)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                color: "#065F46",
              }}
            >
              payout tx: {result.tx}
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: onBackToQueue ? "minmax(0, 1fr) auto" : "1fr",
            gap: "14px",
            alignItems: "center",
            padding: "18px 20px",
            borderRadius: "22px",
            border: "1px solid rgba(12,12,12,0.08)",
            background: "rgba(255,255,255,0.82)",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>
              Keep the queue moving
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.6, color: "#6B7280" }}>
              Good contributors stay in flow. Head back to the queue for the next decision or rate task quality below.
            </div>
          </div>

          {onBackToQueue && (
            <button type="button" className="btn-secondary" onClick={onBackToQueue}>
              Next task
            </button>
          )}
        </div>

        {!creatorRated ? (
          <div
            style={{
              padding: "20px",
              borderRadius: "22px",
              border: "1px solid rgba(12,12,12,0.08)",
              background: "rgba(255,255,255,0.82)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>
                Was this brief clear and fair?
              </div>
              <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6 }}>
                This helps the best requesters float to the top of the marketplace.
              </div>
            </div>

            <div className="pill-row">
              {[
                { rating: 1 as const, label: "Yes, well written", color: "#059669", bg: "#F0FDF4", border: "#A7F3D0" },
                { rating: -1 as const, label: "No, confusing", color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" },
              ].map((item) => (
                <button
                  key={item.rating}
                  type="button"
                  onClick={() => rateCreator(item.rating)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "44px",
                    padding: "0 16px",
                    borderRadius: "14px",
                    border: `1px solid ${item.border}`,
                    background: item.bg,
                    color: item.color,
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", fontSize: "13px", color: "#6B7280" }}>Thanks. Your task-quality signal was recorded too.</div>
        )}
      </div>
    );
  }

  const gridStyle: React.CSSProperties =
    options.length === 2
      ? { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }
      : options.length <= 4
        ? { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }
        : { display: "flex", flexDirection: "column", gap: "12px" };

  const instruction =
    tier === "quick"
      ? "Pick the strongest option below."
      : tier === "reasoned"
        ? "Write a short reason, then submit the option you believe is strongest."
        : "Fill in the structured critique, then choose the strongest option.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="soft-label">Contributor view</div>
        <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.05em" }}>Make the call</div>
        <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>{instruction}</div>
      </div>

      {error && (
        <div
          className="animate-slide-down"
          style={{
            padding: "14px 16px",
            borderRadius: "18px",
            border: "1px solid #FECACA",
            background: "#FEF2F2",
            color: "#B91C1C",
            fontSize: "13px",
            lineHeight: 1.55,
          }}
        >
          {error}
        </div>
      )}

      {context && (
        <div style={{ borderRadius: "20px", border: "1px solid #FDE68A", background: "#FFFBEB", overflow: "hidden" }}>
          <button
            type="button"
            onClick={() => setContextExpanded((value) => !value)}
            style={{
              width: "100%",
              padding: "16px 18px",
              border: "none",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700, color: "#92400E" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Context from the requester
            </span>
            <span style={{ fontSize: "12px", color: "#B45309", transform: contextExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
              ▼
            </span>
          </button>

          {contextExpanded && (
            <div className="animate-slide-down" style={{ padding: "0 18px 18px", fontSize: "13px", lineHeight: 1.7, color: "#92400E" }}>
              {context}
            </div>
          )}
        </div>
      )}

      {tier === "reasoned" && (
        <div style={{ padding: "18px", borderRadius: "22px", border: "1px solid rgba(12,12,12,0.08)", background: "rgba(255,255,255,0.78)" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 700, color: "#20242A" }}>
            Why is this the stronger option? <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <textarea
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value)}
            rows={3}
            placeholder="Focus on the tradeoff that matters most."
            className="input-field"
            style={{ resize: "vertical" }}
          />
        </div>
      )}

      {tier === "detailed" && (
        <div
          style={{
            padding: "18px",
            borderRadius: "22px",
            border: "1px solid rgba(12,12,12,0.08)",
            background: "rgba(255,255,255,0.78)",
            display: "grid",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>Structured feedback</div>
            <div style={{ fontSize: "13px", lineHeight: 1.6, color: "#6B7280" }}>
              Capture the strongest positives, the most important weaknesses, and the next improvement.
            </div>
          </div>

          {[
            { label: "What works?", value: feedbackWorks, onChange: setFeedbackWorks, placeholder: "Where does the chosen option feel strongest?", required: true },
            { label: "What doesn’t work?", value: feedbackDoesnt, onChange: setFeedbackDoesnt, placeholder: "What introduces friction or weakens trust?", required: false },
            { label: "Suggestions", value: feedbackSuggestions, onChange: setFeedbackSuggestions, placeholder: "What would you change next?", required: false },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 700, color: "#525967" }}>
                {field.label} {field.required && <span style={{ color: "#DC2626" }}>*</span>}
              </label>
              <textarea
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                rows={3}
                placeholder={field.placeholder}
                className="input-field"
                style={{ resize: "vertical" }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={gridStyle}>
        {options.map((option, index) => {
          const isLoading = voting === option.option_index;
          const isDisabled = voting !== null && !isLoading;

          return (
            <button
              key={option.option_index}
              type="button"
              onClick={() => vote(option.option_index)}
              disabled={voting !== null}
              style={{
                padding: "18px",
                borderRadius: "24px",
                border: `1.5px solid ${isLoading ? "#10B981" : "rgba(12,12,12,0.08)"}`,
                background: isLoading
                  ? "linear-gradient(180deg, #F0FDF4 0%, #ECFDF5 100%)"
                  : "rgba(255,255,255,0.88)",
                textAlign: "left",
                cursor: voting !== null ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.48 : 1,
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                boxShadow: isLoading ? "0 18px 32px rgba(16,185,129,0.14)" : "var(--shadow-card)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <div className="micro-label" style={{ marginBottom: "6px" }}>
                    option {String.fromCharCode(65 + index)}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em", color: "#0C0C0C" }}>{option.label}</div>
                </div>

                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isLoading ? "rgba(16,185,129,0.12)" : "#F5F4F0",
                    color: isLoading ? "#059669" : "#6B7280",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
              </div>

              {isImage(option.content) ? (
                <div style={{ position: "relative", width: "100%", height: options.length <= 2 ? "280px" : "210px", borderRadius: "18px", overflow: "hidden", background: "#F1EFE8" }}>
                  <Image src={option.content} alt={option.label} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <div
                  style={{
                    minHeight: "122px",
                    padding: "16px",
                    borderRadius: "18px",
                    background: "rgba(249,248,245,0.92)",
                    border: "1px solid rgba(12,12,12,0.06)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#374151",
                  }}
                >
                  {option.content}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  background: isLoading ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "#0C0C0C",
                  color: "#FFFFFF",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {isLoading ? "Submitting vote..." : `Vote ${option.label}`}
                </span>
                {isLoading ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
