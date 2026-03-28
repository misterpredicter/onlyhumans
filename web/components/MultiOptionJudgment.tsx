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

const dm: React.CSSProperties = { fontFamily: "var(--font-sans), sans-serif" };

const isImage = (url: string) =>
  /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);

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
      // silent
    }
  };

  // Post-vote screen
  if (voted && result) {
    const chosenOption = options.find((o) => o.option_index === result.optionIndex);
    return (
      <div className="animate-scale-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{
          textAlign: "center", padding: "48px 24px",
          background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #D1FAE5 100%)",
          borderRadius: "16px",
          border: "1px solid #A7F3D0",
        }}>
          {/* Checkmark */}
          <div className="animate-check" style={{
            width: "56px", height: "56px", margin: "0 auto 16px",
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ ...dm, fontSize: "26px", fontWeight: 800, color: "#0C0C0C", margin: "0 0 6px", letterSpacing: "-0.4px" }}>Vote recorded</p>
          <p style={{ ...dm, fontSize: "14px", color: "#6B7280", margin: "0 0 20px" }}>
            You picked: <span style={{ fontWeight: 700, color: "#0C0C0C" }}>{chosenOption?.label}</span>
          </p>
          {result.amount > 0 ? (
            <>
              <p style={{
                ...dm, fontSize: "20px", fontWeight: 800, color: "#059669", margin: "0 0 4px",
                letterSpacing: "-0.3px",
              }}>
                +${result.amount.toFixed(2)} USDC sent
              </p>
              {result.tx && (
                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#9CA3AF", margin: 0 }}>
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
            backgroundColor: "#FAFAF8", borderRadius: "14px",
            padding: "20px", textAlign: "center",
            border: "1px solid #E8E5DE",
          }}>
            <p style={{ ...dm, fontSize: "14px", color: "#374151", margin: "0 0 14px", fontWeight: 500 }}>Was this task clear and fair?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {[
                { rating: 1 as const, label: "Yes, well written", color: "#059669", bg: "#F0FDF4", border: "#D1FAE5" },
                { rating: -1 as const, label: "No, confusing", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
              ].map(({ rating, label, color, bg, border }) => (
                <button
                  key={rating}
                  onClick={() => rateCreator(rating)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "10px 18px",
                    backgroundColor: bg, border: `1.5px solid ${border}`,
                    borderRadius: "10px", cursor: "pointer",
                    fontFamily: "var(--font-sans), sans-serif", fontSize: "13px", fontWeight: 600, color,
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        {creatorRated && (
          <p className="animate-fade-in" style={{ ...dm, textAlign: "center", fontSize: "14px", color: "#9CA3AF" }}>Thanks for the feedback!</p>
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
        <div className="animate-slide-down" style={{
          backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: "12px", padding: "12px 16px",
          ...dm, fontSize: "13px", color: "#DC2626",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Context (collapsible) */}
      {context && (
        <div style={{
          backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
          borderRadius: "14px", overflow: "hidden",
        }}>
          <button
            type="button"
            onClick={() => setContextExpanded((v) => !v)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
              background: "none", border: "none", cursor: "pointer",
              transition: "background-color 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span style={{ ...dm, fontSize: "13px", fontWeight: 600, color: "#92400E" }}>Context from task creator</span>
            </div>
            <span style={{
              ...dm, fontSize: "11px", color: "#B45309",
              transition: "transform 0.2s",
              transform: contextExpanded ? "rotate(180deg)" : "rotate(0deg)",
              display: "inline-block",
            }}>
              ▼
            </span>
          </button>
          {contextExpanded && (
            <div className="animate-slide-down" style={{
              padding: "0 18px 16px", ...dm, fontSize: "13px", color: "#92400E", lineHeight: 1.6,
            }}>
              {context}
            </div>
          )}
        </div>
      )}

      {/* Tier feedback */}
      {tier === "reasoned" && (
        <div className="animate-fade-in">
          <label style={{ ...dm, display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
            Why will you pick this option? <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={2}
            placeholder="1-2 sentences explaining your reasoning..."
            className="input-field"
            style={{ ...dm, resize: "vertical" }}
          />
        </div>
      )}

      {tier === "detailed" && (
        <div className="animate-fade-in" style={{
          backgroundColor: "#FAFAF8", borderRadius: "16px",
          padding: "18px", display: "flex", flexDirection: "column", gap: "14px",
          border: "1px solid #E8E5DE",
        }}>
          <p style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#374151", margin: 0 }}>
            Structured feedback
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
                className="input-field"
                style={{ ...dm, resize: "vertical" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      <div style={gridStyle}>
        {options.map((opt, idx) => {
          const isLoading = voting === opt.option_index;
          const isDisabled = voting !== null && !isLoading;
          return (
            <button
              key={opt.option_index}
              onClick={() => vote(opt.option_index)}
              disabled={voting !== null}
              style={{
                border: `2px solid ${isLoading ? "#10B981" : "#E8E5DE"}`,
                borderRadius: "18px",
                padding: "20px",
                textAlign: "left",
                cursor: voting !== null ? "not-allowed" : "pointer",
                backgroundColor: isLoading ? "#F0FDF4" : "#FFFFFF",
                transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                opacity: isDisabled ? 0.45 : 1,
                display: "flex", flexDirection: "column", gap: "14px",
                transform: isLoading ? "scale(0.98)" : "scale(1)",
                boxShadow: isLoading ? "0 0 0 3px rgba(16, 185, 129, 0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                if (voting === null) {
                  e.currentTarget.style.borderColor = "#C4C0B8";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (voting === null) {
                  e.currentTarget.style.borderColor = "#E8E5DE";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.2px" }}>{opt.label}</span>
                <span style={{
                  fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#B8B5AD",
                  backgroundColor: "#F5F4F0",
                  borderRadius: "6px", padding: "2px 7px",
                  fontWeight: 500,
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
              </div>

              {isImage(opt.content) ? (
                <div style={{
                  position: "relative", width: "100%",
                  height: options.length <= 2 ? "280px" : "180px",
                  borderRadius: "12px", overflow: "hidden",
                  backgroundColor: "#F5F4F0",
                }}>
                  <Image src={opt.content} alt={opt.label} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <p style={{ ...dm, fontSize: "13px", color: "#374151", lineHeight: 1.55, margin: 0 }}>{opt.content}</p>
              )}

              <div style={{
                background: isLoading
                  ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                  : "#0C0C0C",
                borderRadius: "12px", padding: "13px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    `Vote ${opt.label}`
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {tier !== "quick" && (
        <p style={{ ...dm, textAlign: "center", fontSize: "12px", color: "#B8B5AD", margin: 0 }}>
          {tier === "reasoned"
            ? "Write your reason above, then click your choice"
            : "Complete the feedback above, then click your choice"}
        </p>
      )}
    </div>
  );
}

export { };
