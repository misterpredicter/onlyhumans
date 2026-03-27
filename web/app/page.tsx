import { TaskCreator } from "@/components/TaskCreator";

export default function Home() {
  return (
    <>
      {/* Dark hero */}
      <div style={{ backgroundColor: "#0C0C0C" }}>
        <div className="max-w-6xl mx-auto px-8 py-16 flex flex-col items-center gap-8 text-center">
          {/* Stack pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A",
            borderRadius: "100px", padding: "6px 16px 6px 12px",
          }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "100px" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: "#71717A", letterSpacing: "0.2px" }}>
              World ID · x402 · Base Sepolia
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col items-center gap-4">
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(40px, 5vw, 60px)",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              margin: 0,
              maxWidth: "680px",
            }}>
              Human taste,<br />cryptographically verified.
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "17px", color: "#71717A",
              lineHeight: 1.6, margin: 0, maxWidth: "520px",
            }}>
              Post a judgment task. Real humans vote via World ID — one person, one vote.
              Workers paid automatically per vote. Feedback quality builds reputation.
            </p>
          </div>
        </div>

        {/* Steps bar */}
        <div style={{ borderTop: "1px solid #1F1F1F", backgroundColor: "#111111" }}>
          <div className="max-w-6xl mx-auto px-8 flex items-center">
            {[
              { n: "1", label: "Set bounty per vote" },
              { n: "2", label: "Choose max voters" },
              { n: "3", label: "Pay upfront via x402" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 py-4 px-8" style={{ borderRight: "1px solid #1F1F1F" }}>
                <div style={{
                  width: "26px", height: "26px",
                  backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A",
                  borderRadius: "100px", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: "#FFFFFF" }}>{step.n}</span>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#71717A" }}>{step.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 py-4 px-8">
              <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "100px" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#71717A" }}>0 sybil votes possible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="max-w-6xl mx-auto px-8 py-12 flex justify-center">
        <div style={{
          width: "100%", maxWidth: "580px",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #E8E5DE",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "18px", fontWeight: 700,
            color: "#0C0C0C", margin: "0 0 24px",
            letterSpacing: "-0.3px",
          }}>
            Create judgment task
          </h2>
          <TaskCreator />
        </div>
      </div>
    </>
  );
}
