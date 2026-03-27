"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  taskId: string;
  description: string;
  optionA: string;
  optionB: string;
  labelA: string;
  labelB: string;
  nullifierHash: string;
  workerWallet?: string;
}

interface VoteResult {
  tx: string | null;
  amount: number;
  totalVotes: number;
}

export function ABJudgment({
  taskId,
  description,
  optionA,
  optionB,
  labelA,
  labelB,
  nullifierHash,
  workerWallet,
}: Props) {
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState<"A" | "B" | null>(null);
  const [result, setResult] = useState<VoteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const vote = async (choice: "A" | "B") => {
    if (voting) return;
    setVoting(choice);
    setError(null);

    try {
      const res = await fetch(`/api/tasks/${taskId}/vote`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          choice,
          nullifier_hash: nullifierHash,
          worker_wallet: workerWallet,
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
        });
      }
    } catch {
      setError("Network error — please try again");
      setVoting(null);
    }
  };

  if (voted && result) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
        <p className="text-3xl font-bold mb-2">Vote recorded</p>
        {result.amount > 0 ? (
          <>
            <p className="text-green-600 text-lg font-medium mt-2">
              +${result.amount.toFixed(2)} USDC sent to your wallet
            </p>
            {result.tx && (
              <p className="text-xs text-gray-400 mt-1 font-mono">
                tx: {result.tx.slice(0, 22)}...
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 mt-2">Vote counted ({result.totalVotes} total)</p>
        )}
      </div>
    );
  }

  const isImage = (url: string) =>
    /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || url.startsWith("http");

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">{description}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {(["A", "B"] as const).map((choice) => {
          const label = choice === "A" ? labelA : labelB;
          const content = choice === "A" ? optionA : optionB;
          const isLoading = voting === choice;

          return (
            <button
              key={choice}
              onClick={() => vote(choice)}
              disabled={!!voting}
              className={`border-2 rounded-xl p-5 text-left transition-all ${
                isLoading
                  ? "border-blue-500 bg-blue-50 scale-[0.98]"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-md"
              } disabled:opacity-60`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {choice}
                </span>
              </div>

              {isImage(content) ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={content}
                    alt={label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
              )}

              {isLoading && (
                <p className="text-blue-600 text-xs mt-2 font-medium">Submitting...</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
