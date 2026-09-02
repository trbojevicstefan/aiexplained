export type ExplanationDepth = "simple" | "real" | "expert";

export type LessonProgress = {
  visitedSections: string[];
  completedTasks: Record<string, boolean>;
  quizPassed: boolean;
  quizScore: number;
  quizAttempts: number;
  depth: ExplanationDepth;
};

export type CourseProgress = Record<string, LessonProgress>;

export const PROGRESS_STORAGE_KEY = "ai-explained-progress-v1";

export const emptyLessonProgress = (): LessonProgress => ({
  visitedSections: [],
  completedTasks: {},
  quizPassed: false,
  quizScore: 0,
  quizAttempts: 0,
  depth: "simple"
});

export function loadCourseProgress(): CourseProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CourseProgress) : {};
  } catch {
    return {};
  }
}

export function persistCourseProgress(progress: CourseProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}
