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
}

interface VoteResult {
  tx: string | null;
  amount: number;
  totalVotes: number;
  optionIndex: number;
}

const dm: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

const textareaStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#F9F8F5",
  border: "1.5px solid #E8E5DE",
  borderRadius: "10px",
  padding: "10px 14px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  color: "#0C0C0C",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const isImage = (url: string) =>
  /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || url.startsWith("http");

export function MultiOptionJudgment({
  taskId,
  options,
  tier,
  nullifierHash,
  workerWallet,
  context,
  onVoted,
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
      setError("Please write a brief reason for your choice before submitting.");
      return;
    }
    if (tier === "detailed" && !feedbackWorks.trim()) {
      setError("Please complete the 'What works?' field before submitting.");
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
      const res = await fetch(`/api/tasks/${taskId}/vote`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          option_index: optionIndex,
          nullifier_hash: nullifierHash,
          worker_wallet: workerWallet,
          feedback_text: combinedFeedback,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
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
      setError("Network error — please try again");
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
      // silent — optional
    }
  };

  // Post-vote screen
  if (voted && result) {
    const chosenOption = options.find((o) => o.option_index === result.optionIndex);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{
          textAlign: "center", padding: "40px 24px",
          backgroundColor: "#F0FDF4", borderRadius: "16px",
          border: "1px solid #BBF7D0",
        }}>
          <p style={{ ...dm, fontSize: "28px", fontWeight: 800, color: "#0C0C0C", margin: "0 0 6px" }}>Vote recorded</p>
          <p style={{ ...dm, fontSize: "14px", color: "#6B7280", margin: "0 0 16px" }}>
            You picked: <span style={{ fontWeight: 700, color: "#0C0C0C" }}>{chosenOption?.label}</span>
          </p>
          {result.amount > 0 ? (
            <>
              <p style={{ ...dm, fontSize: "18px", fontWeight: 700, color: "#059669", margin: "0 0 4px" }}>
                +${result.amount.toFixed(2)} USDC sent to your wallet
              </p>
              {result.tx && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
                  tx: {result.tx.slice(0, 22)}...
                </p>
              )}
            </>
          ) : (
            <p style={{ ...dm, fontSize: "14px", color: "#6B7280" }}>Vote counted ({result.totalVotes} total)</p>
          )}
        </div>

        {!creatorRated && (
          <div style={{
            backgroundColor: "#F9F8F5", borderRadius: "14px",
            padding: "20px", textAlign: "center",
          }}>
            <p style={{ ...dm, fontSize: "14px", color: "#374151", margin: "0 0 12px" }}>Was this task clear and fair?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {[{ rating: 1 as const, label: "👍 Yes" }, { rating: -1 as const, label: "👎 No" }].map(({ rating, label }) => (
                <button
                  key={rating}
                  onClick={() => rateCreator(rating)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "10px 20px",
                    backgroundColor: "#FFFFFF", border: "1.5px solid #E8E5DE",
                    borderRadius: "10px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#374151",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        {creatorRated && (
          <p style={{ ...dm, textAlign: "center", fontSize: "14px", color: "#9CA3AF" }}>Thanks for the feedback!</p>
        )}
      </div>
    );
  }

  const gridStyle: React.CSSProperties =
    options.length === 2
      ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }
      : options.length <= 4
      ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }
      : { display: "flex", flexDirection: "column", gap: "10px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && (
        <div style={{
          backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: "10px", padding: "12px 16px",
          ...dm, fontSize: "13px", color: "#DC2626",
        }}>
          {error}
        </div>
      )}

      {/* Context (collapsible) */}
      {context && (
        <div style={{
          backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
          borderRadius: "12px", overflow: "hidden",
        }}>
          <button
            type="button"
            onClick={() => setContextExpanded((v) => !v)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px",
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💡</span>
              <span style={{ ...dm, fontSize: "13px", fontWeight: 600, color: "#92400E" }}>Context from task creator</span>
            </div>
            <span style={{ ...dm, fontSize: "11px", color: "#B45309" }}>{contextExpanded ? "▲ hide" : "▼ show"}</span>
          </button>
          {contextExpanded && (
            <div style={{ padding: "0 16px 14px", ...dm, fontSize: "13px", color: "#92400E", lineHeight: 1.5 }}>
              {context}
            </div>
          )}
        </div>
      )}

      {/* Tier feedback */}
      {tier === "reasoned" && (
        <div>
          <label style={{ ...dm, display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
            Why will you pick this option? <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={2}
            placeholder="1-2 sentences explaining your reasoning..."
            style={textareaStyle}
          />
        </div>
      )}

      {tier === "detailed" && (
        <div style={{
          backgroundColor: "#F9F8F5", borderRadius: "14px",
          padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
        }}>
          <p style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#374151", margin: 0 }}>
            Structured feedback (required before voting)
          </p>
          {[
            { label: "What works?", value: feedbackWorks, onChange: setFeedbackWorks, placeholder: "Strengths of your chosen option...", required: true },
            { label: "What doesn't work?", value: feedbackDoesnt, onChange: setFeedbackDoesnt, placeholder: "Weaknesses or concerns...", required: false },
            { label: "Suggestions", value: feedbackSuggestions, onChange: setFeedbackSuggestions, placeholder: "How would you improve it?", required: false },
          ].map(({ label, value, onChange, placeholder, required }) => (
            <div key={label}>
              <label style={{ ...dm, display: "block", fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>
                {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
              </label>
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={2}
                placeholder={placeholder}
                style={textareaStyle}
              />
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      <div style={gridStyle}>
        {options.map((opt, idx) => {
          const isLoading = voting === opt.option_index;
          const isFirst = idx === 0;
          return (
            <button
              key={opt.option_index}
              onClick={() => vote(opt.option_index)}
              disabled={voting !== null}
              style={{
                border: `2px solid ${isLoading ? "#10B981" : "#E8E5DE"}`,
                borderRadius: "16px",
                padding: "18px",
                textAlign: "left",
                cursor: voting !== null ? "not-allowed" : "pointer",
                backgroundColor: isLoading ? "#F0FDF4" : "#FFFFFF",
                transition: "border-color 0.15s, box-shadow 0.15s",
                opacity: voting !== null && !isLoading ? 0.5 : 1,
                display: "flex", flexDirection: "column", gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 800, color: "#0C0C0C" }}>{opt.label}</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF",
                  backgroundColor: "#F9F8F5", border: "1px solid #E8E5DE",
                  borderRadius: "100px", padding: "2px 8px",
                }}>
                  #{opt.option_index + 1}
                </span>
              </div>

              {isImage(opt.content) ? (
                <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#F9F8F5" }}>
                  <Image src={opt.content} alt={opt.label} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <p style={{ ...dm, fontSize: "13px", color: "#374151", lineHeight: 1.5, margin: 0 }}>{opt.content}</p>
              )}

              <div style={{
                backgroundColor: isLoading ? "#10B981" : isFirst ? "#0C0C0C" : "#0C0C0C",
                borderRadius: "10px", padding: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                  {isLoading ? "Submitting..." : `Vote for ${opt.label}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {tier !== "quick" && (
        <p style={{ ...dm, textAlign: "center", fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
          {tier === "reasoned"
            ? "Write your reason above, then click your choice"
            : "Complete the feedback above, then click your choice"}
        </p>
      )}
    </div>
  );
}

export { };
