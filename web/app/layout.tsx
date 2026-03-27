import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human Signal — Sybil-Resistant Taste Oracle",
  description:
    "Post A/B judgment tasks. Get verified human preferences via World ID. Pay workers automatically via x402.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ backgroundColor: "var(--bg)" }}>
        <header style={{ backgroundColor: "#0C0C0C", borderBottom: "1px solid #1A1A1A" }}>
          <div className="max-w-6xl mx-auto px-8 flex items-center justify-between" style={{ height: "64px" }}>
            <a href="/" className="flex items-center gap-2 no-underline">
              <div style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg, #10B981, #3B82F6)",
                borderRadius: "6px"
              }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "17px", fontWeight: 700,
                color: "#FFFFFF", letterSpacing: "-0.3px"
              }}>
                Human Signal
              </span>
            </a>
            <nav className="flex items-center gap-3">
              <a
                href="/work"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px", fontWeight: 500,
                  color: "#A3A3A3", textDecoration: "none",
                  padding: "8px 16px",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px",
                  transition: "color 0.15s",
                }}
              >
                Earn USDC →
              </a>
              <a
                href="/"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px", fontWeight: 600,
                  color: "#0C0C0C", textDecoration: "none",
                  padding: "8px 18px",
                  backgroundColor: "#10B981",
                  borderRadius: "8px",
                  transition: "background-color 0.15s",
                }}
              >
                Post task
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
