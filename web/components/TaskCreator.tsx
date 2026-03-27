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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What are you comparing?
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          placeholder="Which landing page converts better?"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Context (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Context for voters{" "}
          <span className="text-gray-400 font-normal">(optional — helps voters give better judgments)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder="I'm choosing a logo for my startup. Looking for something that feels premium but approachable."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tier selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback depth
        </label>
        <TierSelector
          value={tier}
          onChange={(t) => setTier(t as "quick" | "reasoned" | "detailed")}
        />
      </div>

      {/* Dynamic options */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Options ({options.length})
          </label>
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add option
            </button>
          )}
        </div>

        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  value={opt.label}
                  onChange={(e) => updateOption(idx, "label", e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)} label`}
                  className="text-sm font-medium border-0 p-0 focus:outline-none focus:ring-0 bg-transparent text-gray-700 flex-1"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="text-gray-300 hover:text-red-500 text-lg leading-none ml-2"
                    aria-label="Remove option"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pricing row */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bounty / vote
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={bountyPerVote}
              onChange={(e) => setBountyPerVote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max voters
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={maxWorkers}
            onChange={(e) => setMaxWorkers(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your wallet
          </label>
          <input
            value={requesterWallet}
            onChange={(e) => setRequesterWallet(e.target.value)}
            required
            placeholder="0x..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-800 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || totalCost < 0.01}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
      >
        {loading
          ? "Creating task..."
          : `Post task — $${totalCost.toFixed(2)} USDC (${workers} votes × $${bounty.toFixed(2)})`}
      </button>

      <p className="text-xs text-center text-gray-400">
        Payment processed via x402 on Base Sepolia (testnet)
      </p>
    </form>
  );
}
