"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ReinforcementLearningLesson } from "@/components/lessons/reinforcement-learning/reinforcement-learning-lesson";

const sections = [
  { id: "rl-loop", title: "Open the RL loop", taskId: "inspect-rl-loop" },
  { id: "play-environment", title: "Be the policy", taskId: "play-gridworld" },
  { id: "train-policy", title: "Train from experience", taskId: "train-policy" },
  { id: "explore-exploit", title: "Explore vs exploit", taskId: "test-exploration" },
  { id: "reward-design", title: "Change the reward, change behavior", taskId: "change-rewards" },
  { id: "delayed-reward", title: "Immediate vs future reward", taskId: "test-discount" },
  { id: "reward-hacking", title: "Make the agent hack the reward", taskId: "repair-reward-hack" },
  { id: "rl-vs-supervised", title: "Reward is not a label", taskId: "compare-feedback" },
  { id: "explain-rl", title: "Explain it back", taskId: "explain-rl" },
] as const;

export default function ReinforcementLearningPage() {
  return <LessonShell lessonId="reinforcement-learning" lessonTitle="Reinforcement Learning" sections={sections}>{(progress) => <ReinforcementLearningLesson progress={progress} />}</LessonShell>;
}
