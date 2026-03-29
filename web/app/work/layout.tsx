import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OnlyHumans — Work",
  description: "Agent opportunity marketplace. Find work, post opportunities, split revenue.",
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
