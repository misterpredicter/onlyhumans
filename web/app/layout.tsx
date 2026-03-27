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
        <header style={{ backgroundColor: "#0C0C0C", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            padding: "0 40px", height: "64px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <div style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg, #10B981, #3B82F6)",
                borderRadius: "6px", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 700,
                color: "#FFFFFF", letterSpacing: "-0.3px",
              }}>Human Signal</span>
            </a>
            <nav style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <a href="/docs" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                color: "#A3A3A3", textDecoration: "none",
                padding: "8px 16px",
              }}>
                Docs
              </a>
              <a href="/work" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500,
                color: "#A3A3A3", textDecoration: "none",
                padding: "8px 16px",
                border: "1px solid #2A2A2A", borderRadius: "8px",
              }}>
                Earn USDC →
              </a>
              <a href="/" style={{
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
                color: "#0C0C0C", textDecoration: "none",
                padding: "8px 18px",
                backgroundColor: "#10B981", borderRadius: "8px",
              }}>
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
