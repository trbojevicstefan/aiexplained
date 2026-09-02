"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { LearningTypesLesson } from "@/components/lessons/learning-types/learning-types-lesson";

const sections = [
  { id: "four-rooms", title: "Open the four learning rooms", taskId: "inspect-learning-rooms" },
  { id: "supervised", title: "Learn from labeled examples", taskId: "train-supervised" },
  { id: "unsupervised", title: "Find structure without labels", taskId: "cluster-unlabeled" },
  { id: "self-supervised", title: "Create supervision from the data itself", taskId: "solve-self-supervised" },
  { id: "semi-supervised", title: "Mix a few labels with many unlabeled examples", taskId: "mix-semi-supervised" },
  { id: "same-data", title: "Same raw data, different objective", taskId: "compare-objectives" },
  { id: "scenario-router", title: "Route real tasks to a learning setup", taskId: "route-learning-scenarios" },
  { id: "data-budget", title: "Design under a labeling budget", taskId: "design-data-strategy" },
  { id: "explain-learning-types", title: "Explain it back", taskId: "explain-learning-types" },
] as const;

export default function LearningTypesPage() {
  return <LessonShell lessonId="learning-types" lessonTitle="Learning types" sections={sections}>{(progress) => <LearningTypesLesson progress={progress} />}</LessonShell>;
}
