"use client";

import { useState, useCallback } from "react";
import {
  IDKitRequestWidget,
  deviceLegacy,
  type IDKitResult,
  type RpContext,
} from "@worldcoin/idkit";

interface Props {
  onVerified: (nullifierHash: string) => void;
}

export function WorldIDVerify({ onVerified }: Props) {
  const [open, setOpen] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a fresh rp_context from the backend when the user wants to verify
  const fetchRpContext = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/rp-signature");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to get RP signature");
      }
      const { rp_context } = await res.json();
      setRpContext(rp_context);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize verification");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerify = async (result: IDKitResult) => {
    // Forward the entire IDKit result to our backend for server-side verification
    const res = await fetch("/api/verify-world-id", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Verification failed");
    }
  };

  const handleSuccess = (result: IDKitResult) => {
    // Extract nullifier from the first response item
    // V3 and V4 uniqueness responses have `nullifier`; session responses have `session_nullifier`
    const firstResponse = result.responses?.[0];
    if (!firstResponse) return;

    let nullifier: string | undefined;
    if ("nullifier" in firstResponse && firstResponse.nullifier) {
      nullifier = firstResponse.nullifier;
    } else if ("session_nullifier" in firstResponse && firstResponse.session_nullifier?.[0]) {
      nullifier = firstResponse.session_nullifier[0];
    }

    if (nullifier) {
      onVerified(nullifier);
    }
  };

  return (
    <>
      <button
        onClick={fetchRpContext}
        disabled={loading}
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fillOpacity="0.2" />
          <circle cx="12" cy="12" r="4" />
        </svg>
        {loading ? "Connecting..." : "Verify with World ID"}
      </button>

      {error && (
        <p style={{ color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>
          {error}
        </p>
      )}

      {rpContext && (
        <IDKitRequestWidget
          open={open}
          onOpenChange={setOpen}
          app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
          action={process.env.NEXT_PUBLIC_WORLD_ACTION ?? "vote-on-task"}
          rp_context={rpContext}
          allow_legacy_proofs={true}
          preset={deviceLegacy()}
          handleVerify={handleVerify}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
