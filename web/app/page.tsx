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

      {/* How it works */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
          You set the price
        </p>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-2xl font-bold">1</div>
            <div className="text-xs text-gray-500 mt-1">Set bounty per vote</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-gray-500 mt-1">Choose max voters</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-gray-500 mt-1">Pay total upfront</div>
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
