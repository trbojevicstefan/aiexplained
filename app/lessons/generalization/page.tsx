"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { GeneralizationLesson } from "@/components/lessons/generalization/generalization-lesson";

const sections = [
  { id: "new-data", title: "Training score is not the goal", taskId: "predict-new-data" },
  { id: "complexity", title: "Move model complexity", taskId: "test-complexity" },
  { id: "underfitting", title: "Make a model too simple", taskId: "repair-underfit" },
  { id: "overfitting", title: "Make a model memorize noise", taskId: "repair-overfit" },
  { id: "more-data", title: "Change how much data the model sees", taskId: "test-data-size" },
  { id: "bias-variance", title: "Open the bias/variance seesaw", taskId: "inspect-bias-variance" },
  { id: "outside-range", title: "Interpolation is easier than extrapolation", taskId: "test-extrapolation" },
  { id: "diagnose-generalization", title: "Diagnose model behavior", taskId: "diagnose-generalization" },
  { id: "explain-generalization", title: "Explain it back", taskId: "explain-generalization" },
] as const;

export default function GeneralizationPage() {
  return <LessonShell lessonId="generalization" lessonTitle="Generalization" sections={sections}>{(progress) => <GeneralizationLesson progress={progress} />}</LessonShell>;
}
