import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Explained — Learn AI by touching it",
  description: "An interactive, visual path from absolute AI basics to LLMs, agents, tools, memory and production systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
