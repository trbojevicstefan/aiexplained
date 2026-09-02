"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { TrainingVsInferenceLesson } from "@/components/lessons/training-vs-inference/training-vs-inference-lesson";
import { trainingInferenceSections } from "@/content/course";

export default function TrainingVsInferencePage() {
  return <LessonShell lessonId="training-vs-inference" lessonTitle="Training vs inference" sections={trainingInferenceSections}>{(progress) => <TrainingVsInferenceLesson progress={progress} />}</LessonShell>;
}
