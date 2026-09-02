"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ModuleOneCapstoneLesson } from "@/components/lessons/module-1-capstone/module-1-capstone-lesson";

const sections = [
  { id: "briefing", title: "Accept the AI workshop mission", taskId: "accept-mission" },
  { id: "approach-router", title: "Choose learning approaches", taskId: "route-approaches" },
  { id: "lifecycle-builder", title: "Build the AI lifecycle", taskId: "build-lifecycle" },
  { id: "experiment-debugger", title: "Repair the evaluation", taskId: "repair-experiment" },
  { id: "model-clinic", title: "Repair model behavior", taskId: "repair-model" },
  { id: "adaptation-room", title: "Plan adaptation over time", taskId: "plan-adaptation" },
  { id: "vocabulary-grid", title: "Name every layer precisely", taskId: "master-vocabulary" },
  { id: "teach-the-system", title: "Explain the whole system", taskId: "teach-foundations" },
] as const;

export default function ModuleOneCapstonePage() {
  return <LessonShell lessonId="module-1-capstone" lessonTitle="Module 1 Boss Level" sections={sections}>{(progress) => <ModuleOneCapstoneLesson progress={progress} />}</LessonShell>;
}
