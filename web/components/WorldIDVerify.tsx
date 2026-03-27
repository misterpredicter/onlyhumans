"use client";

import { IDKitWidget, VerificationLevel, ISuccessResult } from "@worldcoin/idkit";

interface Props {
  onVerified: (nullifierHash: string) => void;
}

export function WorldIDVerify({ onVerified }: Props) {
  const handleVerify = async (result: ISuccessResult) => {
    const res = await fetch("/api/verify-world-id", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Verification failed");
    }

    const { verified, nullifier_hash } = await res.json();
    if (verified && nullifier_hash) {
      onVerified(nullifier_hash);
    }
  };

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
      action={process.env.NEXT_PUBLIC_WORLD_ACTION ?? "vote-on-task"}
      verification_level={VerificationLevel.Device}
      handleVerify={handleVerify}
      onSuccess={() => {}}
    >
      {({ open }: { open: () => void }) => (
        <button
          onClick={open}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fillOpacity="0.2" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  );
}
