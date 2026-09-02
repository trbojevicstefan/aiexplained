"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { GenerativeVsPredictiveLesson } from "@/components/lessons/generative-vs-predictive/generative-vs-predictive-lesson";
import { generativePredictiveSections } from "@/content/course";

export default function GenerativeVsPredictivePage() {
  return <LessonShell lessonId="generative-vs-predictive" lessonTitle="Generative vs predictive" sections={generativePredictiveSections}>{(progress) => <GenerativeVsPredictiveLesson progress={progress} />}</LessonShell>;
}
