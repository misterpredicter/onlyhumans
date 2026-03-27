import { TaskCreator } from "@/components/TaskCreator";

const STEPS = [
  { n: "1", label: "Set bounty per vote" },
  { n: "2", label: "Choose max voters" },
  { n: "3", label: "Pay upfront via x402" },
];

export default function Home() {
  return (
    <>
      {/* ── Full-bleed dark hero ─────────────────────────────── */}
      <section style={{ backgroundColor: "#0C0C0C", width: "100%" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "72px 40px 64px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "28px",
          textAlign: "center",
        }}>
          {/* Stack pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A",
            borderRadius: "100px", padding: "6px 16px 6px 12px",
          }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "100px", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "#71717A" }}>
              World ID · x402 · Base Sepolia
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(42px, 5vw, 62px)",
            fontWeight: 400,
            color: "#FFFFFF",
            lineHeight: 1.08,
            letterSpacing: "-1.5px",
            margin: 0,
            maxWidth: "700px",
          }}>
            Human taste,<br />cryptographically verified.
          </h1>

          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px", color: "#71717A",
            lineHeight: 1.65, margin: 0, maxWidth: "500px",
          }}>
            Post a judgment task. Real humans vote via World ID — one person, one vote.
            Workers paid automatically. Feedback quality builds reputation.
          </p>
        </div>

        {/* Steps bar — full-bleed dark */}
        <div style={{ borderTop: "1px solid #1F1F1F", backgroundColor: "#111111", width: "100%" }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto", padding: "0 40px",
            display: "flex", alignItems: "center",
          }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "16px 32px",
                borderRight: "1px solid #1F1F1F",
              }}>
                <div style={{
                  width: "26px", height: "26px", flexShrink: 0,
                  backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A",
                  borderRadius: "100px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>{step.n}</span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#71717A", whiteSpace: "nowrap" }}>
                  {step.label}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 32px" }}>
              <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "100px", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#71717A", whiteSpace: "nowrap" }}>
                0 sybil votes possible
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form section ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", width: "100%", padding: "48px 40px 64px" }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #E8E5DE",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}>
            <h2 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "18px", fontWeight: 700,
              color: "#0C0C0C", margin: "0 0 24px",
              letterSpacing: "-0.3px",
            }}>
              Create judgment task
            </h2>
            <TaskCreator />
          </div>
        </div>
      </section>
    </>
  );
}
