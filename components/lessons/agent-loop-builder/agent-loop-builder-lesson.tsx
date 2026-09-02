"use client";

// PLACEHOLDER LESSON.
// Commit 14cf6b9 added app/lessons/agent-loop-builder/page.tsx but the
// component it imports was never committed, so the module could not be
// resolved. That single unresolved import takes down the whole dev server,
// not just this route. Replace this file with the real lesson when it is built.

import Link from "next/link";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection } from "@/components/course/lesson-primitives";

type Props = { progress: LessonProgressApi };

const sections = [
  { id: "naked-model", title: "Start with a naked model" },
  { id: "assemble", title: "Assemble the agent system" },
  { id: "observe", title: "Observe goal and context" },
  { id: "decide", title: "Choose a tool action" },
  { id: "execute", title: "Execute outside the model" },
  { id: "result", title: "Return result to context" },
  { id: "state-memory", title: "Update state vs memory" },
  { id: "approval", title: "Permission gate and retries" },
  { id: "explain", title: "Explain the loop back" },
] as const;

export function AgentLoopBuilderLesson({ progress }: Props) {
  return (
    <>
      <div
        style={{
          border: "3px solid var(--ink, #111)",
          background: "var(--yellow, #ffe27a)",
          padding: 20,
          marginBottom: 24,
          fontWeight: 800,
          lineHeight: 1.5,
        }}
      >
        <p style={{ margin: 0 }}>
          This lesson&apos;s interactive content has not been built yet — only its route was
          committed. The nine scenes below are placeholders.
        </p>
        <p style={{ margin: "10px 0 0" }}>
          <Link href="/">← Back to all lessons</Link>
        </p>
      </div>

      {sections.map((section) => (
        <LessonSection key={section.id} id={section.id} onVisit={progress.markVisited}>
          <h2>{section.title}</h2>
          <p style={{ opacity: 0.7 }}>Interactive scene not yet implemented.</p>
        </LessonSection>
      ))}
    </>
  );
}
