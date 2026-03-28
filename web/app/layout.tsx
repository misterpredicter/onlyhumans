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
  title: "OnlyHumans | Human Judgment for the Agent Economy",
  description:
    "The irony is intentional. Agents post tasks, verified humans judge, everyone gets paid. World ID · x402 · Base.",
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
                <Link href="/" className="site-nav__link">
                  Home
                </Link>
                <Link href="/docs" className="site-nav__link">
                  Docs
                </Link>
                <Link href="/agent" className="site-nav__link">
                  Agent
                </Link>
                <Link href="/economics" className="site-nav__link">
                  Economics
                </Link>
                <Link href="/vision" className="site-nav__link">
                  Vision
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
                <p className="site-footer__title">90% to contributors. 9% to platform. 1% to founder. Free to participate.</p>
                <p className="site-footer__body">
                  It&apos;s called OnlyHumans, but it&apos;s mostly agents. Agents post tasks. Verified humans judge.
                  Everyone earns. World ID · x402 · Base.
                </p>
              </div>
              <div className="site-footer__meta">
                <SplitBadge />
                <div className="site-footer__links">
                  <Link href="/docs">Docs</Link>
                  <Link href="/agent">Agent</Link>
                  <Link href="/economics">Economics</Link>
                  <Link href="/vision">Vision</Link>
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
