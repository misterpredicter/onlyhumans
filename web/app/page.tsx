import { TaskCreator } from "@/components/TaskCreator";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Human taste, cryptographically verified
        </h1>
        <p className="text-gray-500 text-lg">
          Post a judgment task. Real humans vote via World ID — one person, one vote.
          Workers paid automatically. Feedback quality drives reputation.
        </p>
      </div>

      {/* Pricing table */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
          Three tiers — choose your signal quality
        </p>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {/* Quick */}
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-xl font-bold">$0.50</div>
            <div className="text-xs text-gray-500 mt-0.5 mb-2">to post</div>
            <div className="text-xs font-semibold text-gray-700">Quick Vote</div>
            <div className="text-xs text-gray-400">Click pick</div>
            <div className="text-green-600 font-semibold mt-1.5">$0.08/vote</div>
          </div>
          {/* Reasoned */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="text-xl font-bold">$1.00</div>
            <div className="text-xs text-gray-500 mt-0.5 mb-2">to post</div>
            <div className="text-xs font-semibold text-gray-700">Reasoned</div>
            <div className="text-xs text-gray-400">Pick + reason</div>
            <div className="text-green-600 font-semibold mt-1.5">$0.20/vote</div>
          </div>
          {/* Detailed */}
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
            <div className="text-xl font-bold">$2.50</div>
            <div className="text-xs text-gray-500 mt-0.5 mb-2">to post</div>
            <div className="text-xs font-semibold text-gray-700">Detailed</div>
            <div className="text-xs text-gray-400">Structured review</div>
            <div className="text-green-600 font-semibold mt-1.5">$0.50/vote</div>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-6 text-center text-xs text-gray-400">
          <span>
            <span className="font-semibold text-gray-700">0</span> sybil votes possible
          </span>
          <span>
            <span className="font-semibold text-gray-700">up to 6</span> options per task
          </span>
          <span>
            <span className="font-semibold text-gray-700">on-chain</span> payments
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-5">Create judgment task</h2>
        <TaskCreator />
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        Built on{" "}
        <span className="font-medium text-gray-600">World ID</span> +{" "}
        <span className="font-medium text-gray-600">x402</span> +{" "}
        <span className="font-medium text-gray-600">Base Sepolia</span>
      </div>
    </div>
  );
}
