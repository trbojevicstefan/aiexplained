"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { WhatIsAiLesson } from "@/components/lessons/what-is-ai/what-is-ai-lesson";
import { whatIsAiSections } from "@/content/course";

export default function WhatIsAiPage() {
  return <LessonShell lessonId="what-is-ai" lessonTitle="What is AI?" sections={whatIsAiSections}>{(progress) => <WhatIsAiLesson progress={progress} />}</LessonShell>;
}
