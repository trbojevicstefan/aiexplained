"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ArchitectureMuseumLesson } from "@/components/lessons/cnn-rnn-lstm-attention/architecture-museum-lesson";

const sections=[
  {id:"biases",title:"Different architectural biases",taskId:"inspect-architecture-biases"},
  {id:"cnn-kernel",title:"Slide a convolution kernel",taskId:"run-convolution"},
  {id:"weight-sharing",title:"Reuse one kernel",taskId:"inspect-weight-sharing"},
  {id:"rnn-state",title:"Carry recurrent state",taskId:"run-rnn-state"},
  {id:"long-memory",title:"Stress long dependencies",taskId:"stress-rnn-memory"},
  {id:"lstm-gates",title:"Control an LSTM cell",taskId:"control-lstm-gates"},
  {id:"attention-path",title:"Connect distant tokens directly",taskId:"inspect-attention-path"},
  {id:"architecture-choice",title:"Choose the right architecture",taskId:"choose-sequence-architecture"},
  {id:"explain-evolution",title:"Explain the evolution",taskId:"explain-architecture-evolution"},
] as const;

export default function ArchitectureMuseumPage(){return <LessonShell lessonId="cnn-rnn-lstm-attention" lessonTitle="CNN, RNN, LSTM & attention" sections={sections}>{progress=><ArchitectureMuseumLesson progress={progress}/>}</LessonShell>}
