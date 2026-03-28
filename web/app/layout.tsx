import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Human Signal — Sybil-Resistant Taste Oracle",
  description:
    "Post A/B judgment tasks. Get verified human preferences via World ID. Pay workers automatically via x402.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: "var(--font-sans), sans-serif", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
        {/* Nav */}
        <header style={{
          backgroundColor: "#0C0C0C",
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            padding: "0 40px", height: "64px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "30px", height: "30px",
                background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
                borderRadius: "8px", flexShrink: 0,
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
              }} />
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 700,
                color: "#FFFFFF", letterSpacing: "-0.4px",
              }}>Human Signal</span>
            </a>
            <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <a href="/docs" className="nav-link" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                color: "#A3A3A3", textDecoration: "none",
                padding: "8px 16px", borderRadius: "8px",
              }}>
                Docs
              </a>
              <a href="/agent" className="nav-link" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                color: "#A3A3A3", textDecoration: "none",
                padding: "8px 16px", borderRadius: "8px",
              }}>
                Agent
              </a>
              <a href="/work" className="nav-btn-outline" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                color: "#A3A3A3", textDecoration: "none",
                padding: "8px 16px",
                border: "1px solid #2A2A2A", borderRadius: "8px",
              }}>
                Earn USDC
              </a>
              <a href="/" className="nav-btn-primary" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
                color: "#FFFFFF", textDecoration: "none",
                padding: "8px 18px",
                background: "linear-gradient(135deg, #10B981 0%, #0EA572 100%)",
                borderRadius: "8px",
              }}>
                Post task
              </a>
            </nav>
          </div>
        </header>

        {process.env.DEMO_MODE === "true" && (
          <div style={{
            backgroundColor: "#0A1A14",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
            borderLeft: "3px solid #10B981",
            padding: "7px 40px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.4px",
          }}>
            DEMO — World ID simulator active · x402 payments bypassed · Base Sepolia testnet
          </div>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}
