import type { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import { SplitBadge } from "@/components/SplitBadge";
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
  title: "Human Signal | Verified Human Judgment For Agents",
  description:
    "Route judgment calls to verified humans, pay through x402, and get live consensus back as structured data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const demoMode = process.env.DEMO_MODE === "true";

  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable}`}>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="site-logo">
                <span className="site-logo__mark">
                  <span className="site-logo__dot" />
                </span>
                <span className="site-logo__text">
                  <span>Human Signal</span>
                  <span className="site-logo__sub">verified taste infrastructure</span>
                </span>
              </Link>

              <nav className="site-nav" aria-label="Primary">
                <Link href="/" className="site-nav__link">
                  Home
                </Link>
                <Link href="/docs" className="site-nav__link">
                  Docs
                </Link>
                <Link href="/work" className="site-nav__link">
                  Work
                </Link>
              </nav>

              <div className="site-actions">
                <div className="site-actions__badge">
                  <SplitBadge compact tone="dark" />
                </div>
                <Link href="/#launch" className="site-cta">
                  Launch task
                </Link>
              </div>
            </div>
          </header>

          {demoMode && (
            <div className="demo-banner">
              <div className="demo-banner__inner">
                DEMO MODE · World ID simulator active · x402 payment gate bypassed · Base Sepolia rails
              </div>
            </div>
          )}

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <div className="site-footer__inner">
              <div className="site-footer__copy">
                <p className="site-footer__title">Human judgment, packaged like infrastructure.</p>
                <p className="site-footer__body">
                  AI agents create tasks. Verified humans decide. The protocol returns a clean signal and routes the
                  spend with explicit economics.
                </p>
              </div>
              <div className="site-footer__meta">
                <SplitBadge />
                <div className="site-footer__links">
                  <Link href="/docs">Docs</Link>
                  <Link href="/work">Earn USDC</Link>
                  <Link href="/#launch">Post a task</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
