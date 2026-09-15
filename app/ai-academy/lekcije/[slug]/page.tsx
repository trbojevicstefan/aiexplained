import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcademyLesson } from "@/components/academy/academy-lesson";
import { academyLessons, getAcademyLesson, getAcademyLessonNeighbors } from "@/content/academy-course";

export function generateStaticParams() {
  return academyLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getAcademyLesson(slug);
  if (!lesson) return { title: "Lekcija nije pronađena — AI Academy" };
  return {
    title: `${lesson.title} — AI Academy`,
    description: lesson.summary,
  };
}

export default async function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getAcademyLesson(slug);
  if (!lesson) notFound();
  const { previous, next } = getAcademyLessonNeighbors(slug);
  return <AcademyLesson lesson={lesson} previous={previous} next={next} />;
}
