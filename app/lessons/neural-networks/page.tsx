"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { NeuralNetworksLesson } from "@/components/lessons/neural-networks/neural-networks-lesson";

const sections = [
  { id: "anatomy", title: "Open a neural network", taskId: "inspect-network-anatomy" },
  { id: "single-neuron", title: "Control one neuron", taskId: "control-neuron" },
  { id: "connections", title: "Weights carry influence", taskId: "inspect-connections" },
  { id: "forward-pass", title: "Run a forward pass", taskId: "run-forward-pass" },
  { id: "decision-space", title: "Drag a new example", taskId: "explore-decision-space" },
  { id: "real-training", title: "Train the real toy network", taskId: "train-real-network" },
  { id: "hidden-neurons", title: "Inspect hidden representations", taskId: "inspect-hidden-neurons" },
  { id: "break-restore", title: "Break and restore the network", taskId: "break-restore-network" },
  { id: "explain-network", title: "Explain it back", taskId: "explain-neural-network" },
] as const;

export default function NeuralNetworksPage() {
  return <LessonShell lessonId="neural-networks" lessonTitle="What is a neural network?" sections={sections}>{(progress) => <NeuralNetworksLesson progress={progress} />}</LessonShell>;
}
