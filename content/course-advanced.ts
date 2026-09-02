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
  {
    id: "module-9",
    title: "RAG & Knowledge Retrieval",
    eyebrow: "RETRIEVAL SYSTEMS",
    color: "#48b77b",
    lessons: [
      { id: "rag-ingestion-chunking", title: "RAG ingestion and chunking", shortTitle: "Ingestion & Chunking", slug: "/lessons/rag-ingestion-chunking", status: "available", estimatedMinutes: 42 },
      { id: "retrieval-ranking-lab", title: "Keyword, semantic, hybrid and reranking", shortTitle: "Retrieval & Ranking", slug: "/lessons/retrieval-ranking-lab", status: "available", estimatedMinutes: 44 },
      { id: "vector-index-rag-evals", title: "Vector indexes and RAG evals", shortTitle: "Vector Index & Evals", slug: "/lessons/vector-index-rag-evals", status: "available", estimatedMinutes: 42 },
      { id: "module-9-capstone", title: "Module 9 RAG Boss Lab", shortTitle: "RAG Boss Lab", slug: "/lessons/module-9-capstone", status: "available", estimatedMinutes: 46 },
    ],
  },
];
