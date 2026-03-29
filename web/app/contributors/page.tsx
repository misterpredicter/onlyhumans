"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Contributor {
  nullifier_hash: string;
  verified_at: string;
  total_earned: string;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  const diffHours = Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60));
  if (diffHours <= 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function shortHash(hash: string) {
  if (!hash) return "—";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/contributors")
      .then((r) => r.json())
      .then((d) => {
        setContributors(d.contributors ?? []);
        setCount(d.count ?? 0);
      })
      .catch(() => { setError(true); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-shell">
      <div className="section-shell" style={{ maxWidth: "720px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div className="eyebrow-pill animate-fade-in" style={{ marginBottom: "20px" }}>
            <span className="eyebrow-pill__dot" />
            World ID verified contributors
          </div>
          <h1
            className="section-title animate-fade-in-up"
            style={{ fontSize: "clamp(34px, 5vw, 56px)", marginBottom: "16px" }}
          >
            Verified humans contributing.
          </h1>
          {!loading && !error && (
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "999px",
                background: "rgba(16,185,129,0.10)",
                color: "#059669",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              {count} contributor{count !== 1 ? "s" : ""}
            </span>
          )}
          <p className="section-copy animate-fade-in-up delay-100" style={{ maxWidth: "520px", marginBottom: "28px" }}>
            Each contributor has completed World ID biometric verification — one person, one identity.
            Nullifier hashes are shown for privacy. No names, no wallets, no surveillance.
          </p>
          <Link href="/join" className="site-cta" style={{ display: "inline-flex" }}>
            Join as a contributor
          </Link>
        </div>

        {/* Contributor list */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid rgba(12,12,12,0.08)",
                borderTopColor: "#10B981",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{
            padding: "32px",
            borderRadius: "20px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#B91C1C", marginBottom: "8px" }}>
              Could not load contributors
            </div>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              The contributor list requires a database connection. Try again later or visit the live site.
            </p>
          </div>
        ) : count === 0 ? (
          <div
            style={{
              padding: "48px",
              borderRadius: "24px",
              background: "#F8F7F3",
              border: "1px solid rgba(12,12,12,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>◎</div>
            <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>
              No contributors yet.
            </div>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px" }}>
              Be the first to verify and join the project.
            </p>
            <Link href="/join" className="btn-primary" style={{ display: "inline-flex" }}>
              Verify and join
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1px", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(12,12,12,0.08)" }}>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "16px",
                padding: "12px 20px",
                background: "#F8F7F3",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#9CA3AF",
                textTransform: "uppercase",
              }}
            >
              <div>Contributor</div>
              <div style={{ textAlign: "right" }}>Earned</div>
              <div style={{ textAlign: "right" }}>Joined</div>
            </div>

            {contributors.map((c, idx) => (
              <div
                key={c.nullifier_hash}
                className="animate-fade-in-up"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "16px",
                  padding: "16px 20px",
                  background: "#FFFFFF",
                  alignItems: "center",
                  borderTop: idx > 0 ? "1px solid rgba(12,12,12,0.05)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.12))",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
                      <circle cx="12" cy="12" r="4" fill="#10B981" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#374151" }}>
                      {shortHash(c.nullifier_hash)}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>World ID verified</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "13px", fontWeight: 700, color: parseFloat(c.total_earned) > 0 ? "#059669" : "#9CA3AF" }}>
                  {parseFloat(c.total_earned) > 0 ? `$${parseFloat(c.total_earned).toFixed(2)}` : "—"}
                </div>
                <div style={{ textAlign: "right", fontSize: "12px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                  {formatDate(c.verified_at)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "32px", padding: "16px 20px", borderRadius: "16px", background: "rgba(12,12,12,0.03)", fontSize: "12px", lineHeight: 1.7, color: "#9CA3AF" }}>
          Contributors are displayed by nullifier hash prefix only. Full hashes are never shown publicly.
          This is the anti-sybil mechanism: one World ID, one permanent identity in the system.
        </div>
      </div>
    </section>
  );
}
