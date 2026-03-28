"use client";

import { useCallback, useState } from "react";
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
      const response = await fetch("/api/auth/rp-signature");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to get RP signature");
      }

      const { rp_context: context } = await response.json();
      setRpContext(context);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize verification");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerify = async (result: IDKitResult) => {
    const response = await fetch("/api/verify-world-id", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? "Verification failed");
    }
  };

  const handleSuccess = (result: IDKitResult) => {
    const firstResponse = result.responses?.[0];
    if (!firstResponse) {
      setError("Verification succeeded but the response payload was empty. Please try again.");
      return;
    }

    let nullifier: string | undefined;

    if ("nullifier" in firstResponse && firstResponse.nullifier) {
      nullifier = firstResponse.nullifier;
    } else if ("session_nullifier" in firstResponse && firstResponse.session_nullifier?.[0]) {
      nullifier = firstResponse.session_nullifier[0];
    }

    if (!nullifier) {
      setError("Could not extract a nullifier from the World ID response. Please retry.");
      return;
    }

    onVerified(nullifier);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "18px",
          borderRadius: "22px",
          border: "1px solid rgba(12,12,12,0.08)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(245,248,246,0.92) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(59,130,246,0.18))",
              color: "#0C0C0C",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.8" fill="#FFFFFF" />
            </svg>
          </div>

          <div>
            <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0C0C0C" }}>
              Unlock the verified work queue
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.55, color: "#6B7280" }}>
              One person, one vote. World ID proves uniqueness without revealing your identity.
            </div>
          </div>
        </div>

        <button
          onClick={fetchRpContext}
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            minHeight: "54px",
            background: "linear-gradient(135deg, #0C0C0C 0%, #20252C 100%)",
            boxShadow: "0 18px 38px rgba(12, 12, 12, 0.22)",
          }}
        >
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
              </svg>
              Connecting to World ID...
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span>Verify with World ID</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </button>

        <div style={{ display: "grid", gap: "8px" }}>
          {[
            "Zero-knowledge proof. No identity data exposed to OnlyHumans.",
            "Nullifier hash prevents duplicate votes on the same task.",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "12px", color: "#6B7280" }}>
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(16,185,129,0.12)",
                  color: "#059669",
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "10px",
            padding: "12px 14px",
            borderRadius: "16px",
            border: "1px solid #FECACA",
            background: "#FEF2F2",
            color: "#B91C1C",
            fontSize: "13px",
            lineHeight: 1.55,
          }}
        >
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
