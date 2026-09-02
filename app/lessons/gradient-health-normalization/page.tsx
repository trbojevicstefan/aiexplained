"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { GradientHealthNormalizationLesson } from "@/components/lessons/gradient-health-normalization/gradient-health-normalization-lesson";

const sections = [
  { id: "gradient-chain", title: "Multiply gradients through depth", taskId: "test-gradient-chain" },
  { id: "vanishing", title: "Make gradients vanish", taskId: "create-vanishing" },
  { id: "exploding", title: "Make gradients explode", taskId: "create-exploding" },
  { id: "saturation", title: "Saturation kills local derivative", taskId: "inspect-saturation-chain" },
  { id: "clipping", title: "Clip an exploding gradient", taskId: "clip-gradient" },
  { id: "normalize", title: "Normalize shifted activations", taskId: "normalize-activations" },
  { id: "batch-vs-layer", title: "BatchNorm vs LayerNorm axes", taskId: "compare-normalization-axes" },
  { id: "normalization-traps", title: "Normalization is not magic", taskId: "diagnose-normalization" },
  { id: "explain-gradient-health", title: "Explain it back", taskId: "explain-gradient-health" },
] as const;

export default function GradientHealthNormalizationPage() {
  return <LessonShell lessonId="gradient-health-normalization" lessonTitle="Gradient health & normalization" sections={sections}>{(progress) => <GradientHealthNormalizationLesson progress={progress} />}</LessonShell>;
}
