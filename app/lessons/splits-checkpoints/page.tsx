"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { SplitsCheckpointsLesson } from "@/components/lessons/splits-checkpoints/splits-checkpoints-lesson";

const sections = [
  { id: "three-rooms", title: "Split the dataset", taskId: "build-data-splits" },
  { id: "train-room", title: "Train only on training data", taskId: "fit-on-train" },
  { id: "validation-room", title: "Use validation to choose", taskId: "tune-on-validation" },
  { id: "sealed-test", title: "Keep test sealed", taskId: "respect-test-seal" },
  { id: "split-strategies", title: "Random, stratified or time-based?", taskId: "choose-split-strategy" },
  { id: "duplicate-leakage", title: "Catch cross-split duplicates", taskId: "repair-split-leakage" },
  { id: "checkpoint-station", title: "Save and restore checkpoints", taskId: "choose-best-checkpoint" },
  { id: "split-vs-checkpoint", title: "Data split is not a checkpoint", taskId: "classify-split-checkpoint" },
  { id: "explain-evaluation", title: "Explain it back", taskId: "explain-evaluation" },
] as const;

export default function SplitsCheckpointsPage() {
  return <LessonShell lessonId="splits-checkpoints" lessonTitle="Splits & checkpoints" sections={sections}>{(progress) => <SplitsCheckpointsLesson progress={progress} />}</LessonShell>;
}
