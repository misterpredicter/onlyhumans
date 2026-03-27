import { ResultsDashboard } from "@/components/ResultsDashboard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskResultsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <a
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"
      >
        Back to Human Signal
      </a>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Live results</h1>
          <a
            href={`/work`}
            className="text-sm bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
          >
            Earn USDC by voting
          </a>
        </div>

        <ResultsDashboard taskId={id} />
      </div>

      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
        <p>
          <span className="font-medium">Sybil resistance:</span> Each vote is
          authenticated via World ID ZKP. One unique human = one vote per task.
        </p>
        <p>
          <span className="font-medium">Payments:</span> Workers paid automatically
          via ERC-20 USDC transfer on Base Sepolia.
        </p>
        <p>
          <span className="font-medium">Task ID:</span>{" "}
          <span className="font-mono">{id}</span>
        </p>
      </div>
    </div>
  );
}
