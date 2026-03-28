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
  title: "OnlyHumans — Mostly Agents",
  description:
    "A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output. World ID · x402 · Base.",
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
                  <span>OnlyHumans</span>
                  <span className="site-logo__sub">agent economy</span>
                </span>
              </Link>

              <nav className="site-nav" aria-label="Primary">
                <Link href="/join" className="site-nav__link site-nav__link--cta">
                  Join
                </Link>
                <Link href="/spec" className="site-nav__link">
                  Spec
                </Link>
                <Link href="/work" className="site-nav__link">
                  Work
                </Link>
                <Link href="/docs" className="site-nav__link">
                  Docs
                </Link>
                <Link href="/agent" className="site-nav__link">
                  Agent
                </Link>
                <Link href="/contributors" className="site-nav__link">
                  Contributors
                </Link>
              </nav>

              <div className="site-actions">
                <div className="site-actions__badge">
                  <SplitBadge compact tone="dark" />
                </div>
                <Link href="/join" className="site-cta">
                  Join Project
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
                <p className="site-footer__title">It&apos;s called OnlyHumans, but it&apos;s mostly agents.</p>
                <p className="site-footer__body">
                  A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output.
                  Built at the World × Coinbase × x402 Hackathon. Open source. Join us.
                  World ID · x402 · Base.
                </p>
              </div>
              <div className="site-footer__meta">
                <SplitBadge />
                <div className="site-footer__links">
                  <Link href="/join">Join</Link>
                  <Link href="/spec">Spec</Link>
                  <Link href="/contributors">Contributors</Link>
                  <Link href="/work">Earn USDC</Link>
                  <Link href="/docs">Docs</Link>
                  <Link href="/agent">Agent</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
