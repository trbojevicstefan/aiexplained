"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { Module3CapstoneLesson } from "@/components/lessons/module-3-capstone/module-3-capstone-lesson";

const sections=[
  {id:"pipeline",title:"Text to embedding pipeline",taskId:"m3-build-pipeline"},
  {id:"place-words",title:"Place words in semantic space",taskId:"m3-place-words"},
  {id:"metric-room",title:"Choose a similarity metric",taskId:"m3-compare-metrics"},
  {id:"search-room",title:"Run semantic retrieval",taskId:"m3-semantic-search"},
  {id:"budget-room",title:"Fit the token budget",taskId:"m3-token-budget"},
  {id:"multimodal-room",title:"Match text and image",taskId:"m3-multimodal-match"},
  {id:"ann-room",title:"Choose exact or ANN",taskId:"m3-ann-choice"},
  {id:"debug-room",title:"Debug tokenizer vs embedding",taskId:"m3-debug-pipeline"},
] as const;

export default function Module3CapstonePage(){return <LessonShell lessonId="module-3-capstone" lessonTitle="Module 3 Boss Lab" sections={sections}>{progress=><Module3CapstoneLesson progress={progress}/>}</LessonShell>}
