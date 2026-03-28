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
    const firstResponse = result.responses?.[0];
    if (!firstResponse) {
      setError("Verification succeeded but no response data received. Please try again.");
      return;
    }

    let nullifier: string | undefined;
    if ("nullifier" in firstResponse && firstResponse.nullifier) {
      nullifier = firstResponse.nullifier;
    } else if ("session_nullifier" in firstResponse && firstResponse.session_nullifier?.[0]) {
      nullifier = firstResponse.session_nullifier[0];
    }

    if (nullifier) {
      onVerified(nullifier);
    } else {
      setError("Could not extract nullifier from verification. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={fetchRpContext}
        disabled={loading}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          backgroundColor: "#0C0C0C",
          color: "#FFFFFF",
          padding: "14px 24px",
          borderRadius: "14px",
          border: "none",
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
          transition: "all 0.2s ease",
          opacity: loading ? 0.7 : 1,
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = "#1A1A1A";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0C0C0C";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* World ID icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="#0C0C0C" />
        </svg>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
            </svg>
            Connecting...
          </span>
        ) : (
          "Verify with World ID"
        )}
      </button>

      {error && (
        <div style={{
          marginTop: "8px",
          backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: "10px", padding: "10px 14px",
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: "13px", color: "#DC2626",
        }}>
          {error}
        </div>
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
