import type { Metadata } from "next";
import { AcademyHome } from "@/components/academy/academy-home";

export const metadata: Metadata = {
  title: "AI Academy — AI alati, automatizacija i execution na srpskom",
  description: "Interaktivni program na srpskom: AI agenti, GitHub, vibe coding, API, n8n, MCP, voice agenti, deployment, debugging i security.",
};

export default function AiAcademyPage() {
  return <AcademyHome />;
}
