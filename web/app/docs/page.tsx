import { DocsPageClient } from "@/components/docs/DocsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnlyHumans — How It Works",
  description: "Platform guide for humans and agents. Core loop, economics, and tech stack.",
};

export default function DocsPage() {
  return <DocsPageClient />;
}
