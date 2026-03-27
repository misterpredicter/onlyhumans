"use client";

import { useEffect, useState } from "react";
import { WorldIDVerify } from "@/components/WorldIDVerify";
import { MultiOptionJudgment } from "@/components/MultiOptionJudgment";
import { TierBadge } from "@/components/TierBadge";

interface TaskOption {
  option_index: number;
  label: string;
  content: string;
}

interface Task {
  id: string;
  description: string;
  option_a: string;
  option_b: string;
  option_a_label: string;
  option_b_label: string;
  bounty_per_vote: number;
  max_workers: number;
  vote_count: number;
  tier?: string;
  context?: string | null;
  options?: TaskOption[];
}

const TIER_PAYOUTS: Record<string, string> = {
  quick: "$0.08",
  reasoned: "$0.20",
  detailed: "$0.50",
};

export default function WorkPage() {
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);
  const [workerWallet, setWorkerWallet] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedTaskIds, setVotedTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(({ tasks: t }) => {
        setTasks(t ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVoted = (taskId: string) => {
    setVotedTaskIds((prev) => new Set([...prev, taskId]));
    // Return to task list after a short delay
    setTimeout(() => setActiveTask(null), 2500);
  };

  // Resolve task options for display and judgment
  const resolveOptions = (task: Task): TaskOption[] => {
    if (Array.isArray(task.options) && task.options.length > 0) {
      return task.options;
    }
    return [
      { option_index: 0, label: task.option_a_label, content: task.option_a },
      { option_index: 1, label: task.option_b_label, content: task.option_b },
    ];
  };

  if (!nullifierHash) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Earn USDC for your judgment
          </h1>
          <p className="text-gray-500">
            Vote on comparisons. Each verified vote earns you USDC directly to your
            wallet. World ID ensures one vote per person — no bots, no duplicates.
          </p>
        </div>

        {/* Tier payout table */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-2.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Earn by feedback quality
          </p>
          {(["quick", "reasoned", "detailed"] as const).map((t) => (
            <div key={t} className="flex items-center justify-between">
              <TierBadge tier={t} showPayout={false} />
              <span className="text-green-600 font-semibold text-sm">
                {TIER_PAYOUTS[t]}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Your wallet address (to receive payment)
            </label>
            <input
              type="text"
              value={workerWallet}
              onChange={(e) => setWorkerWallet(e.target.value)}
              placeholder="0x... (optional, skip to vote without payment)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>

          <WorldIDVerify onVerified={setNullifierHash} />

          <p className="text-xs text-gray-400">
            World ID proves you are a unique human. Your identity is never revealed.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        Loading tasks...
      </div>
    );
  }

  if (activeTask) {
    const options = resolveOptions(activeTask);
    const tier = activeTask.tier ?? "quick";
    const payout = TIER_PAYOUTS[tier] ?? "$0.08";

    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTask(null)}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"
        >
          ← Back to tasks
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-1">
            <h2 className="font-semibold text-lg flex-1 mr-4">{activeTask.description}</h2>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-sm text-green-600 font-medium">{payout} USDC</span>
              <TierBadge tier={tier} showPayout={false} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            {activeTask.max_workers - activeTask.vote_count} slots remaining
          </p>

          <MultiOptionJudgment
            taskId={activeTask.id}
            options={options}
            tier={tier}
            nullifierHash={nullifierHash}
            workerWallet={workerWallet || undefined}
            context={activeTask.context}
            onVoted={() => handleVoted(activeTask.id)}
          />
        </div>
      </div>
    );
  }

  const availableTasks = tasks.filter((t) => !votedTaskIds.has(t.id));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Open tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Verified{" "}
            <span className="font-mono text-xs">{nullifierHash.slice(0, 10)}...</span>
          </p>
        </div>
        <span className="text-sm text-gray-500">{availableTasks.length} available</span>
      </div>

      {availableTasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No open tasks right now</p>
          <p className="text-sm mt-1">
            <a href="/" className="underline">
              Post one
            </a>{" "}
            to get the pool started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {availableTasks.map((task) => {
            const tier = task.tier ?? "quick";
            const payout = TIER_PAYOUTS[tier] ?? "$0.08";
            const opts = resolveOptions(task);

            return (
              <button
                key={task.id}
                onClick={() => setActiveTask(task)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-sm truncate">{task.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {opts.map((o) => o.label).join(" vs ")}
                    </p>
                    <div className="mt-2">
                      <TierBadge tier={tier} showPayout={false} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-green-600 font-semibold text-sm">{payout}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.max_workers - (task.vote_count ?? 0)} left
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
