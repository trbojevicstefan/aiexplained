"use client";

import Link from "next/link";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection } from "@/components/course/lesson-primitives";

type Props = { progress: LessonProgressApi };

const sections = [
  { id: "gradient-chain", title: "Multiply gradients through depth" },
  { id: "vanishing", title: "Make gradients vanish" },
  { id: "exploding", title: "Make gradients explode" },
  { id: "saturation", title: "Saturation kills local derivative" },
  { id: "clipping", title: "Clip an exploding gradient" },
  { id: "normalize", title: "Normalize shifted activations" },
  { id: "batch-vs-layer", title: "BatchNorm vs LayerNorm axes" },
  { id: "normalization-traps", title: "Normalization is not magic" },
  { id: "explain-gradient-health", title: "Explain it back" },
] as const;

// PLACEHOLDER: the real interactive lesson component for this route was never
// committed upstream (commit ff97f18 added app/lessons/gradient-health-normalization/page.tsx
// only). This stub exists so the route resolves and the rest of the app builds.
// Replace it with the real lesson when the source is available.
export function GradientHealthNormalizationLesson({ progress }: Props) {
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
          committed. The eight scenes below are placeholders.
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
