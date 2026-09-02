"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { AiMlDlLesson } from "@/components/lessons/ai-ml-dl/ai-ml-dl-lesson";
import { aiMlDlSections } from "@/content/course";

export default function AiMlDlPage() {
  return <LessonShell lessonId="ai-ml-dl" lessonTitle="AI / ML / DL" sections={aiMlDlSections}>{(progress) => <AiMlDlLesson progress={progress} />}</LessonShell>;
}
