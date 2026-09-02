"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ScopeUncertaintyLesson } from "@/components/lessons/scope-uncertainty/scope-uncertainty-lesson";

const sections = [
  { id: "scope-spectrum", title: "Task-specific to general capability", taskId: "inspect-scope-spectrum" },
  { id: "narrow-vs-agi", title: "Narrow AI vs AGI", taskId: "classify-scope" },
  { id: "deterministic-machine", title: "Deterministic systems", taskId: "test-determinism" },
  { id: "probability-machine", title: "Probabilistic systems", taskId: "sample-probability" },
  { id: "sampling-controls", title: "Probability vs sampling", taskId: "control-sampling" },
  { id: "hybrid-system", title: "Deterministic shell, probabilistic core", taskId: "build-hybrid-system" },
  { id: "confidence-traps", title: "Probability is not certainty", taskId: "diagnose-confidence" },
  { id: "scope-traps", title: "Capability breadth is not consciousness", taskId: "repair-scope-myths" },
  { id: "explain-scope", title: "Explain it back", taskId: "explain-scope" },
] as const;

export default function ScopeUncertaintyPage() {
  return <LessonShell lessonId="scope-uncertainty" lessonTitle="Scope & uncertainty" sections={sections}>{(progress) => <ScopeUncertaintyLesson progress={progress} />}</LessonShell>;
}
