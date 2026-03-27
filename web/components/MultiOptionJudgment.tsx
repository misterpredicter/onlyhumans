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

const BADGE_STYLES: Record<string, string> = {
  platinum: "bg-slate-100 text-slate-700 border border-slate-300",
  gold: "bg-yellow-50 text-yellow-700 border border-yellow-300",
  silver: "bg-gray-100 text-gray-600 border border-gray-300",
  bronze: "bg-orange-50 text-orange-700 border border-orange-300",
  new: "bg-gray-50 text-gray-400 border border-gray-200",
};

function ReputationBadge({ badge }: { badge: string }) {
  const cls = BADGE_STYLES[badge] ?? BADGE_STYLES.new;
  return (
    <span className={`inline-flex text-xs font-medium px-1.5 py-0.5 rounded capitalize ${cls}`}>
      {badge}
    </span>
  );
}

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

  // Tier-specific feedback state
  const [feedbackText, setFeedbackText] = useState(""); // reasoned
  const [feedbackWorks, setFeedbackWorks] = useState(""); // detailed
  const [feedbackDoesnt, setFeedbackDoesnt] = useState(""); // detailed
  const [feedbackSuggestions, setFeedbackSuggestions] = useState(""); // detailed

  const vote = async (optionIndex: number) => {
    if (voting !== null) return;

    // Validate feedback before submitting
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
        body: JSON.stringify({
          type: "creator",
          nullifier_hash: nullifierHash,
          rating,
        }),
      });
      setCreatorRated(true);
    } catch {
      // silent — creator rating is optional
    }
  };

  // Post-vote confirmation screen
  if (voted && result) {
    const chosenOption = options.find((o) => o.option_index === result.optionIndex);
    return (
      <div className="space-y-4">
        <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
          <p className="text-3xl font-bold mb-1">Vote recorded</p>
          <p className="text-gray-500 text-sm mb-3">
            You picked: <span className="font-medium text-gray-800">{chosenOption?.label}</span>
          </p>
          {result.amount > 0 ? (
            <>
              <p className="text-green-600 text-lg font-medium">
                +${result.amount.toFixed(2)} USDC sent to your wallet
              </p>
              {result.tx && (
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  tx: {result.tx.slice(0, 22)}...
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500">Vote counted ({result.totalVotes} total)</p>
          )}
        </div>

        {!creatorRated && (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-3">Was this task clear and fair?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => rateCreator(1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-green-400 hover:text-green-600 transition-colors"
              >
                👍 Yes
              </button>
              <button
                onClick={() => rateCreator(-1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-red-400 hover:text-red-600 transition-colors"
              >
                👎 No
              </button>
            </div>
          </div>
        )}
        {creatorRated && (
          <p className="text-center text-sm text-gray-400">Thanks for the feedback!</p>
        )}
      </div>
    );
  }

  // Layout: 2 options → grid-cols-2, 3-4 → 2x2 grid, 5+ → single column
  const gridClass =
    options.length === 2
      ? "grid grid-cols-2 gap-4"
      : options.length <= 4
      ? "grid grid-cols-2 gap-3"
      : "flex flex-col gap-3";

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Context (collapsible) */}
      {context && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setContextExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-amber-800"
          >
            <span>Context from task creator</span>
            <span className="text-xs opacity-60">{contextExpanded ? "▲ hide" : "▼ show"}</span>
          </button>
          {contextExpanded && (
            <div className="px-4 pb-4 text-sm text-amber-900 leading-relaxed">
              {context}
            </div>
          )}
        </div>
      )}

      {/* Tier-specific feedback prompts (shown before voting) */}
      {tier === "reasoned" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why will you pick this option? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={2}
            placeholder="1-2 sentences explaining your reasoning..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {tier === "detailed" && (
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700">Provide structured feedback before voting:</p>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              What works? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedbackWorks}
              onChange={(e) => setFeedbackWorks(e.target.value)}
              rows={2}
              placeholder="Strengths of your chosen option..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">What doesn&apos;t work?</label>
            <textarea
              value={feedbackDoesnt}
              onChange={(e) => setFeedbackDoesnt(e.target.value)}
              rows={2}
              placeholder="Weaknesses or concerns..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Suggestions</label>
            <textarea
              value={feedbackSuggestions}
              onChange={(e) => setFeedbackSuggestions(e.target.value)}
              rows={2}
              placeholder="How would you improve it?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Options grid */}
      <div className={gridClass}>
        {options.map((opt) => {
          const isLoading = voting === opt.option_index;
          return (
            <button
              key={opt.option_index}
              onClick={() => vote(opt.option_index)}
              disabled={voting !== null}
              className={`border-2 rounded-xl p-4 text-left transition-all ${
                isLoading
                  ? "border-blue-500 bg-blue-50 scale-[0.98]"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-md"
              } disabled:opacity-60`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{opt.label}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  #{opt.option_index + 1}
                </span>
              </div>

              {isImage(opt.content) ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={opt.content}
                    alt={opt.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">{opt.content}</p>
              )}

              {isLoading && (
                <p className="text-blue-600 text-xs mt-2 font-medium">Submitting...</p>
              )}
            </button>
          );
        })}
      </div>

      {tier !== "quick" && (
        <p className="text-xs text-center text-gray-400">
          {tier === "reasoned"
            ? "Write your reason above, then click your choice"
            : "Complete the feedback above, then click your choice"}
        </p>
      )}
    </div>
  );
}

export { ReputationBadge };
