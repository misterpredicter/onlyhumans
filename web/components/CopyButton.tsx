"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  code: string;
  tone?: "dark" | "light";
}

export function CopyButton({ code, tone = "dark" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: no-op if clipboard API unavailable
    }
  }, [code]);

  const dark = tone === "dark";

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(12,12,12,0.1)",
        borderRadius: "8px",
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(12,12,12,0.04)",
        color: dark ? (copied ? "#10B981" : "rgba(255,255,255,0.5)") : (copied ? "#10B981" : "#6B7280"),
        fontSize: "11px",
        fontWeight: 600,
        fontFamily: "var(--font-mono), monospace",
        cursor: "pointer",
        transition: "color 0.2s ease, background 0.2s ease",
        flexShrink: 0,
      }}
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
