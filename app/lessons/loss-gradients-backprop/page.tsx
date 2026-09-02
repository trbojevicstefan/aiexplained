"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { LossGradientsBackpropLesson } from "@/components/lessons/loss-gradients-backprop/loss-gradients-backprop-lesson";

const sections = [
  { id: "loss", title: "Loss measures wrongness", taskId: "compare-loss" },
  { id: "loss-landscape", title: "Walk a loss landscape", taskId: "walk-loss-landscape" },
  { id: "gradient", title: "Measure the local slope", taskId: "inspect-gradient" },
  { id: "learning-rate", title: "Choose a step size", taskId: "test-learning-rate" },
  { id: "gradient-descent", title: "Run gradient descent", taskId: "run-gradient-descent" },
  { id: "chain-rule", title: "Open the chain rule", taskId: "trace-chain-rule" },
  { id: "backprop", title: "Send credit backward", taskId: "run-backprop" },
  { id: "real-network-gradients", title: "Inspect real toy-network gradients", taskId: "inspect-real-gradients" },
  { id: "explain-backprop", title: "Explain it back", taskId: "explain-backprop" },
] as const;

export default function LossGradientsBackpropPage() {
  return <LessonShell lessonId="loss-gradients-backprop" lessonTitle="Loss, gradients & backprop" sections={sections}>{(progress) => <LossGradientsBackpropLesson progress={progress} />}</LessonShell>;
}
