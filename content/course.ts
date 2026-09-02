export type LessonStatus = "available" | "planned";

export type CourseLesson = {
  id: string;
  title: string;
  slug: string;
  shortTitle: string;
  status: LessonStatus;
  estimatedMinutes: number;
};

export type CourseModule = {
  id: string;
  title: string;
  eyebrow: string;
  color: string;
  lessons: CourseLesson[];
};

export type LessonSectionDefinition = {
  id: string;
  title: string;
  taskId: string;
};

export const courseModules: CourseModule[] = [
  {
    id: "module-1",
    title: "AI From Absolute Zero",
    eyebrow: "FOUNDATIONS",
    color: "#2357ff",
    lessons: [
      { id: "what-is-ai", title: "What is Artificial Intelligence?", shortTitle: "What is AI?", slug: "/lessons/what-is-ai", status: "available", estimatedMinutes: 24 },
      { id: "ai-vs-software", title: "AI vs normal software", shortTitle: "AI vs software", slug: "/lessons/ai-vs-software", status: "available", estimatedMinutes: 28 },
      { id: "ai-ml-dl", title: "AI vs Machine Learning vs Deep Learning", shortTitle: "AI / ML / DL", slug: "/lessons/ai-ml-dl", status: "available", estimatedMinutes: 30 },
      { id: "generative-vs-predictive", title: "Generative AI vs predictive AI", shortTitle: "Generative vs predictive", slug: "/lessons/generative-vs-predictive", status: "planned", estimatedMinutes: 18 },
      { id: "symbolic-vs-neural", title: "Symbolic AI vs neural AI", shortTitle: "Symbolic vs neural", slug: "/lessons/symbolic-vs-neural", status: "planned", estimatedMinutes: 20 },
      { id: "training-vs-inference", title: "Training vs inference", shortTitle: "Training vs inference", slug: "/lessons/training-vs-inference", status: "planned", estimatedMinutes: 20 },
      { id: "models-algorithms-data", title: "Models, algorithms and datasets", shortTitle: "Model / algorithm / data", slug: "/lessons/models-algorithms-data", status: "planned", estimatedMinutes: 22 },
      { id: "parameters", title: "Parameters vs hyperparameters", shortTitle: "Parameters", slug: "/lessons/parameters", status: "planned", estimatedMinutes: 18 },
      { id: "features-labels", title: "Features and labels", shortTitle: "Features & labels", slug: "/lessons/features-labels", status: "planned", estimatedMinutes: 16 },
      { id: "learning-types", title: "Supervised, unsupervised and self-supervised learning", shortTitle: "Learning types", slug: "/lessons/learning-types", status: "planned", estimatedMinutes: 28 },
      { id: "reinforcement-learning", title: "Reinforcement learning", shortTitle: "Reinforcement learning", slug: "/lessons/reinforcement-learning", status: "planned", estimatedMinutes: 24 },
      { id: "generalization", title: "Generalization, overfitting and underfitting", shortTitle: "Generalization", slug: "/lessons/generalization", status: "planned", estimatedMinutes: 26 },
      { id: "splits-checkpoints", title: "Train / validation / test sets and checkpoints", shortTitle: "Splits & checkpoints", slug: "/lessons/splits-checkpoints", status: "planned", estimatedMinutes: 22 }
    ]
  },
  { id: "module-2", title: "Neural Networks Without the Mystery", eyebrow: "NEXT MODULE", color: "#ff5f57", lessons: [] },
  { id: "module-3", title: "How Language Becomes Numbers", eyebrow: "COMING NEXT", color: "#9e6cff", lessons: [] },
  { id: "module-4", title: "Transformers Visually, Step by Step", eyebrow: "COMING NEXT", color: "#16a66a", lessons: [] }
];

export const whatIsAiSections: readonly LessonSectionDefinition[] = [
  { id: "cold-open", title: "AI or not AI?", taskId: "ai-or-not" },
  { id: "core-idea", title: "The three moves", taskId: "three-moves" },
  { id: "rules-vs-learning", title: "Rules vs learning", taskId: "teach-machine" },
  { id: "layers", title: "Open the AI machine", taskId: "inspect-layers" },
  { id: "training-loop", title: "Train it", taskId: "training-loop" },
  { id: "probability", title: "AI makes guesses", taskId: "probability-lab" },
  { id: "family-tree", title: "AI / ML / DL", taskId: "family-tree" },
  { id: "explain-back", title: "Explain it back", taskId: "explain-back" }
];

export const aiVsSoftwareSections: readonly LessonSectionDefinition[] = [
  { id: "be-the-computer", title: "Be the computer", taskId: "trace-rules" },
  { id: "same-input", title: "Same input, same result", taskId: "repeat-program" },
  { id: "rule-explosion", title: "When rules explode", taskId: "grow-rules" },
  { id: "learn-boundary", title: "Let examples shape behavior", taskId: "learn-boundary" },
  { id: "choose-engine", title: "Rules, ML or both?", taskId: "choose-engine" },
  { id: "hybrid-system", title: "Build a hybrid system", taskId: "hybrid-builder" },
  { id: "debug-it", title: "Debugging feels different", taskId: "debug-contrast" },
  { id: "boring-wins", title: "When boring software wins", taskId: "boring-wins" },
  { id: "explain-software", title: "Explain the difference", taskId: "explain-software" }
];

export const aiMlDlSections: readonly LessonSectionDefinition[] = [
  { id: "nested-world", title: "Walk inside the hierarchy", taskId: "enter-zones" },
  { id: "sort-examples", title: "Put examples on the right level", taskId: "sort-spectrum" },
  { id: "symbolic-ai", title: "AI without machine learning", taskId: "solve-symbolic" },
  { id: "classic-ml", title: "Machine learning without deep learning", taskId: "nearest-neighbor" },
  { id: "deep-learning", title: "Why deep is deep", taskId: "layer-elevator" },
  { id: "tradeoffs", title: "Compare the three approaches", taskId: "compare-approaches" },
  { id: "build-hierarchy", title: "Build the nesting yourself", taskId: "hierarchy-build" },
  { id: "myths", title: "Destroy the common myths", taskId: "myth-flips" },
  { id: "explain-hierarchy", title: "Explain AI / ML / DL", taskId: "explain-hierarchy" }
];
