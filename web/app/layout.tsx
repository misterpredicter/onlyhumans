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
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-100 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-tight">
              Human Signal
            </a>
            <nav className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/work" className="hover:text-gray-900 transition-colors">
                Earn USDC
              </a>
              <a
                href="/"
                className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Post task
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
