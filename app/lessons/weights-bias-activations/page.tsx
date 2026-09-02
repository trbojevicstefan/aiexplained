"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { WeightsBiasActivationsLesson } from "@/components/lessons/weights-bias-activations/weights-bias-activations-lesson";

const sections = [
  { id: "weight-influence", title: "Weights change influence", taskId: "test-weight-influence" },
  { id: "bias-offset", title: "Bias shifts the threshold", taskId: "test-bias-offset" },
  { id: "linear-stack", title: "Why linear layers need nonlinearity", taskId: "break-linear-stack" },
  { id: "relu", title: "ReLU", taskId: "explore-relu" },
  { id: "sigmoid", title: "Sigmoid", taskId: "explore-sigmoid" },
  { id: "softmax", title: "Softmax", taskId: "explore-softmax" },
  { id: "activation-router", title: "Choose the activation", taskId: "route-activations" },
  { id: "saturation", title: "Saturation and dead zones", taskId: "inspect-saturation" },
  { id: "explain-activations", title: "Explain it back", taskId: "explain-activations" },
] as const;

export default function WeightsBiasActivationsPage() {
  return <LessonShell lessonId="weights-bias-activations" lessonTitle="Weights, bias & activations" sections={sections}>{(progress) => <WeightsBiasActivationsLesson progress={progress} />}</LessonShell>;
}
