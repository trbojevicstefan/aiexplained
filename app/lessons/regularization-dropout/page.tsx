"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { RegularizationDropoutLesson } from "@/components/lessons/regularization-dropout/regularization-dropout-lesson";

const sections = [
  { id: "overfit-gap", title: "Grow an overfit network", taskId: "create-overfit-gap" },
  { id: "l2-pruning", title: "Shrink weights with L2", taskId: "apply-l2-decay" },
  { id: "dropout-masks", title: "Sample dropout masks", taskId: "sample-dropout-masks" },
  { id: "train-vs-infer", title: "Dropout train vs inference", taskId: "compare-dropout-modes" },
  { id: "early-stop", title: "Stop before validation turns", taskId: "choose-early-stop" },
  { id: "capacity-data", title: "Capacity vs data", taskId: "balance-capacity-data" },
  { id: "regularizer-choice", title: "Choose the intervention", taskId: "choose-regularizer" },
  { id: "recipe", title: "Build a regularization recipe", taskId: "build-regularization-recipe" },
  { id: "explain-regularization", title: "Explain it back", taskId: "explain-regularization" },
] as const;

export default function RegularizationDropoutPage() {
  return <LessonShell lessonId="regularization-dropout" lessonTitle="Regularization & dropout" sections={sections}>{(progress) => <RegularizationDropoutLesson progress={progress} />}</LessonShell>;
}
