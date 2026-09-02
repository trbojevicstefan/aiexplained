import type { CourseModule } from "./course";

export const advancedCourseModules: CourseModule[] = [
  {
    id: "module-8",
    title: "Reasoning & Test-Time Compute",
    eyebrow: "REASONING SYSTEMS",
    color: "#7f73ff",
    lessons: [
      { id: "reasoning-solver-arena", title: "Reasoning Solver Arena", shortTitle: "Solver Arena", slug: "/lessons/reasoning-solver-arena", status: "available", estimatedMinutes: 42 },
      { id: "search-verification-lab", title: "Search, rewards and verification", shortTitle: "Search & Verification", slug: "/lessons/search-verification-lab", status: "available", estimatedMinutes: 42 },
      { id: "module-8-capstone", title: "Module 8 Boss Lab", shortTitle: "Reasoning Boss Lab", slug: "/lessons/module-8-capstone", status: "available", estimatedMinutes: 44 },
    ],
  },
];
