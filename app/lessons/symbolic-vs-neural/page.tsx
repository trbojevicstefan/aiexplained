import { LessonShell } from "@/components/course/lesson-shell";
import { SymbolicVsNeuralLesson } from "@/components/lessons/symbolic-vs-neural/symbolic-vs-neural-lesson";
import { symbolicNeuralSections } from "@/content/course";

export default function SymbolicVsNeuralPage() {
  return (
    <LessonShell lessonId="symbolic-vs-neural" lessonTitle="Symbolic vs neural" sections={symbolicNeuralSections}>
      {(progress) => <SymbolicVsNeuralLesson progress={progress} />}
    </LessonShell>
  );
}
