"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ModelsAlgorithmsDataLesson } from "@/components/lessons/models-algorithms-data/models-algorithms-data-lesson";
import { modelAlgorithmDataSections } from "@/content/course";

export default function ModelsAlgorithmsDataPage() {
  return <LessonShell lessonId="models-algorithms-data" lessonTitle="Model / algorithm / data" sections={modelAlgorithmDataSections}>{(progress) => <ModelsAlgorithmsDataLesson progress={progress} />}</LessonShell>;
}
