"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { LearningAcrossTimeTasksLesson } from "@/components/lessons/learning-across-time-tasks/learning-across-time-tasks-lesson";

const sections = [
  { id: "batch-vs-online", title: "Batch vs online learning", taskId: "compare-batch-online" },
  { id: "stream-updates", title: "Learn from a stream", taskId: "run-online-updates" },
  { id: "concept-drift", title: "When the world moves", taskId: "adapt-to-drift" },
  { id: "transfer-learning", title: "Reuse what was already learned", taskId: "build-transfer-pipeline" },
  { id: "freeze-unfreeze", title: "Freeze or fine-tune?", taskId: "test-transfer-strategies" },
  { id: "representation-learning", title: "Learn the features", taskId: "learn-representation" },
  { id: "negative-transfer", title: "Transfer can fail", taskId: "diagnose-transfer" },
  { id: "scenario-router", title: "Choose a learning strategy", taskId: "route-learning-strategy" },
  { id: "explain-across-time", title: "Explain it back", taskId: "explain-across-time" },
] as const;

export default function LearningAcrossTimeTasksPage() {
  return <LessonShell lessonId="learning-across-time-tasks" lessonTitle="Learning across time & tasks" sections={sections}>{(progress) => <LearningAcrossTimeTasksLesson progress={progress} />}</LessonShell>;
}
