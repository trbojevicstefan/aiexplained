import { LessonShell } from "@/components/course/lesson-shell";
import { AiVsSoftwareLesson } from "@/components/lessons/ai-vs-software/ai-vs-software-lesson";
import { aiVsSoftwareSections } from "@/content/course";

export default function AiVsSoftwarePage() {
  return (
    <LessonShell lessonId="ai-vs-software" lessonTitle="AI vs software" sections={aiVsSoftwareSections}>
      {(progress) => <AiVsSoftwareLesson progress={progress} />}
    </LessonShell>
  );
}
