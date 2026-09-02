import type { Metadata } from "next";
import "./globals.css";
import "../components/course/lesson-shell-polish.css";

export const metadata: Metadata = {
  title: "AI Explained",
  description: "Learn AI by seeing it, touching it, breaking it, and rebuilding it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
