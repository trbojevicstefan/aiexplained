"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { FeaturesLabelsLesson } from "@/components/lessons/features-labels/features-labels-lesson";

const sections = [
  { id: "crime-scene", title: "Turn reality into clues", taskId: "extract-features" },
  { id: "feature-or-label", title: "Feature or label?", taskId: "sort-feature-label" },
  { id: "feature-selection", title: "Choose useful clues", taskId: "select-features" },
  { id: "leakage", title: "Catch target leakage", taskId: "repair-leakage" },
  { id: "encode-features", title: "Make features model-ready", taskId: "encode-features" },
  { id: "time-availability", title: "Could you know it at prediction time?", taskId: "check-availability" },
  { id: "engineered-learned", title: "Engineered vs learned representations", taskId: "compare-representations" },
  { id: "diagnose-dataset", title: "Audit a dataset", taskId: "audit-dataset" },
  { id: "explain-features", title: "Explain it back", taskId: "explain-features" },
] as const;

export default function FeaturesLabelsPage() {
  return <LessonShell lessonId="features-labels" lessonTitle="Features & labels" sections={sections}>{(progress) => <FeaturesLabelsLesson progress={progress} />}</LessonShell>;
}
