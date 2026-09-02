"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { SgdBatchesEpochsLesson } from "@/components/lessons/sgd-batches-epochs/sgd-batches-epochs-lesson";

const sections = [
  { id: "epoch", title: "One epoch = one pass", taskId: "run-full-epoch" },
  { id: "batch-size", title: "Batch size controls examples per update", taskId: "test-batch-sizes" },
  { id: "sgd", title: "SGD is noisy on purpose", taskId: "compare-gradient-noise" },
  { id: "shuffle", title: "Shuffle changes the stochastic path", taskId: "test-shuffle" },
  { id: "updates", title: "Count optimizer updates", taskId: "count-updates" },
  { id: "mini-batch-trainer", title: "Train with real mini-batches", taskId: "train-mini-batches" },
  { id: "learning-rate", title: "Learning rate meets noisy gradients", taskId: "pair-rate-batch" },
  { id: "training-budget", title: "Design a training budget", taskId: "solve-training-budget" },
  { id: "explain-training-loop", title: "Explain it back", taskId: "explain-training-loop" },
] as const;

export default function SgdBatchesEpochsPage() {
  return <LessonShell lessonId="sgd-batches-epochs" lessonTitle="SGD, batches & epochs" sections={sections}>{(progress) => <SgdBatchesEpochsLesson progress={progress} />}</LessonShell>;
}
