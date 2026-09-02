import { LessonShell } from "@/components/course/lesson-shell";
import { WhatIsAiLesson } from "@/components/lessons/what-is-ai/what-is-ai-lesson";

export default function WhatIsAiPage() {
  return <LessonShell>{(progress) => <WhatIsAiLesson progress={progress} />}</LessonShell>;
}
