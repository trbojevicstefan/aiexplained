"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { courseModules } from "@/content/course";
import {
  CourseProgress,
  emptyLessonProgress,
  ExplanationDepth,
  loadCourseProgress,
  persistCourseProgress,
} from "@/lib/course-progress";

export type LessonSectionDefinition = {
  id: string;
  title: string;
  taskId: string;
};

export type LessonProgressApi = {
  depth: ExplanationDepth;
  setDepth: (depth: ExplanationDepth) => void;
  visitedSections: Set<string>;
  completedTasks: Record<string, boolean>;
  markVisited: (id: string) => void;
  completeTask: (id: string) => void;
  quizPassed: boolean;
  quizScore: number;
  quizAttempts: number;
  saveQuiz: (score: number, passed: boolean) => void;
  resetLesson: () => void;
};

type Props = {
  lessonId: string;
  lessonTitle: string;
  sections: readonly LessonSectionDefinition[];
  children: (api: LessonProgressApi) => ReactNode;
};

export function LessonShell({ lessonId, lessonTitle, sections, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [progress, setProgress] = useState<CourseProgress>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadCourseProgress());
    setHydrated(true);
  }, []);

  const lesson = progress[lessonId] ?? emptyLessonProgress();

  const updateLesson = (updater: (current: ReturnType<typeof emptyLessonProgress>) => ReturnType<typeof emptyLessonProgress>) => {
    setProgress((current) => {
      const currentLesson = current[lessonId] ?? emptyLessonProgress();
      const nextLesson = updater(currentLesson);
      if (nextLesson === currentLesson) return current;
      const next = { ...current, [lessonId]: nextLesson };
      persistCourseProgress(next);
      return next;
    });
  };

  const api = useMemo<LessonProgressApi>(() => ({
    depth: lesson.depth,
    setDepth: (depth) => updateLesson((current) => current.depth === depth ? current : ({ ...current, depth })),
    visitedSections: new Set(lesson.visitedSections),
    completedTasks: lesson.completedTasks,
    markVisited: (id) => updateLesson((current) => current.visitedSections.includes(id)
      ? current
      : ({ ...current, visitedSections: [...current.visitedSections, id] })),
    completeTask: (id) => updateLesson((current) => current.completedTasks[id]
      ? current
      : ({ ...current, completedTasks: { ...current.completedTasks, [id]: true } })),
    quizPassed: lesson.quizPassed,
    quizScore: lesson.quizScore,
    quizAttempts: lesson.quizAttempts,
    saveQuiz: (score, passed) => updateLesson((current) => ({
      ...current,
      quizScore: Math.max(score, current.quizScore),
      quizPassed: current.quizPassed || passed,
      quizAttempts: current.quizAttempts + 1,
    })),
    resetLesson: () => updateLesson(() => emptyLessonProgress()),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lesson, lessonId]);

  const requiredTasks = sections.map((section) => section.taskId);
  const tasksDone = requiredTasks.filter((id) => lesson.completedTasks[id]).length;
  const sectionsRead = sections.filter((section) => lesson.visitedSections.includes(section.id)).length;
  const totalMilestones = requiredTasks.length + sections.length + 1;
  const achieved = tasksDone + sectionsRead + (lesson.quizPassed ? 1 : 0);
  const percent = hydrated && totalMilestones > 0 ? Math.round((achieved / totalMilestones) * 100) : 0;

  return (
    <div className="lesson-app-shell">
      <header className="lesson-topbar">
        <button className="drawer-button tactile" onClick={() => setDrawerOpen(true)} aria-label="Open lessons drawer">
          <span className="drawer-lines"><i /><i /><i /></span>
          <span>Lessons</span>
        </button>

        <Link className="brand-mark" href="/">
          <span className="brand-dot" /> AI EXPLAINED
        </Link>

        <div className="topbar-progress" aria-label={`Lesson progress ${percent}%`}>
          <div className="topbar-progress-copy">
            <strong>{percent}%</strong>
            <span>lesson progress</span>
          </div>
          <div className="progress-pill"><motion.i animate={{ width: `${percent}%` }} /></div>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              className="drawer-backdrop"
              aria-label="Close drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="lesson-drawer"
              initial={{ x: -560, rotate: -1 }}
              animate={{ x: 0, rotate: 0 }}
              exit={{ x: -580, rotate: -1 }}
              transition={{ type: "spring", stiffness: 320, damping: 31 }}
            >
              <div className="drawer-head">
                <div>
                  <span className="eyebrow">YOUR LEARNING MAP</span>
                  <h2>Jump anywhere.</h2>
                  <p>Your progress stays with you.</p>
                </div>
                <button className="icon-close tactile" onClick={() => setDrawerOpen(false)} aria-label="Close lessons drawer">×</button>
              </div>

              <div className="drawer-meter-card">
                <div className="drawer-meter-orb"><span>{percent}%</span></div>
                <div>
                  <strong>{lessonTitle}</strong>
                  <p>{tasksDone}/{requiredTasks.length} activities · {sectionsRead}/{sections.length} sections</p>
                </div>
              </div>

              <nav className="section-jump-list" aria-label="Current lesson sections">
                <span className="drawer-label">Inside this lesson</span>
                {sections.map((section, index) => {
                  const visited = lesson.visitedSections.includes(section.id);
                  const done = Boolean(lesson.completedTasks[section.taskId]);
                  return (
                    <a key={section.id} href={`#${section.id}`} onClick={() => setDrawerOpen(false)} className={done ? "done" : visited ? "visited" : ""}>
                      <span className="section-index">{String(index + 1).padStart(2, "0")}</span>
                      <span>{section.title}</span>
                      <b>{done ? "✓" : visited ? "•" : ""}</b>
                    </a>
                  );
                })}
              </nav>

              <div className="drawer-course-list">
                {courseModules.map((module) => (
                  <section key={module.id} className="drawer-module">
                    <div className="drawer-module-title">
                      <span style={{ background: module.color }} />
                      <div><small>{module.eyebrow}</small><strong>{module.title}</strong></div>
                    </div>
                    {module.lessons.length > 0 && (
                      <div className="drawer-lessons">
                        {module.lessons.map((item, index) => {
                          const current = item.id === lessonId;
                          const itemProgress = progress[item.id];
                          const itemPercent = itemProgress?.quizPassed ? 100 : current ? percent : 0;
                          return item.status === "available" ? (
                            <Link key={item.id} href={item.slug} className={`drawer-lesson-row ${current ? "current" : ""}`} onClick={() => setDrawerOpen(false)}>
                              <span>{index + 1}</span>
                              <div><strong>{item.shortTitle}</strong><small>{item.estimatedMinutes} min</small></div>
                              <b>{itemPercent ? `${itemPercent}%` : "→"}</b>
                            </Link>
                          ) : (
                            <div key={item.id} className="drawer-lesson-row planned" title="This lesson is in the build queue">
                              <span>{index + 1}</span>
                              <div><strong>{item.shortTitle}</strong><small>{item.estimatedMinutes} min · planned</small></div>
                              <b>○</b>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {children(api)}
    </div>
  );
}
