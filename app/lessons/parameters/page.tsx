"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ParametersLesson } from "@/components/lessons/parameters/parameters-lesson";

const sections = [
  { id: "open-control-room", title: "Open the control room", taskId: "inspect-controls" },
  { id: "sort-terms", title: "Sort the overloaded words", taskId: "sort-parameter-types" },
  { id: "watch-weights", title: "Watch learned parameters move", taskId: "train-weights" },
  { id: "learning-rate", title: "Break the learning rate", taskId: "test-learning-rates" },
  { id: "batch-epochs", title: "Tune batch size and epochs", taskId: "tune-training-controls" },
  { id: "architecture", title: "Architecture changes parameter count", taskId: "change-architecture" },
  { id: "tuning-arena", title: "Run a hyperparameter search", taskId: "hyperparameter-search" },
  { id: "vocabulary-traps", title: "Destroy vocabulary traps", taskId: "parameter-vocabulary" },
  { id: "explain-parameters", title: "Explain it back", taskId: "explain-parameters" },
] as const;

export default function ParametersPage() {
  return (
    <LessonShell lessonId="parameters" lessonTitle="Parameters vs hyperparameters" sections={sections}>
      {(progress) => <ParametersLesson progress={progress} />}
    </LessonShell>
  );
}
