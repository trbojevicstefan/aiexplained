"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { Module2CapstoneLesson } from "@/components/lessons/module-2-capstone/module-2-capstone-lesson";

const sections=[
  {id:"wire-network",title:"Wire the network",taskId:"boss-wire-network"},
  {id:"forward-probe",title:"Trace a forward pass",taskId:"boss-forward-probe"},
  {id:"train-classifier",title:"Train the classifier",taskId:"boss-train-classifier"},
  {id:"optimizer-room",title:"Tune learning rate and batches",taskId:"boss-tune-optimizer"},
  {id:"gradient-emergency",title:"Stabilize gradient health",taskId:"boss-gradient-health"},
  {id:"generalization-room",title:"Control overfitting",taskId:"boss-generalization"},
  {id:"architecture-room",title:"Choose the architecture",taskId:"boss-architecture"},
  {id:"ship-checkpoint",title:"Ship a neural checkpoint",taskId:"boss-ship-checkpoint"},
] as const;

export default function Module2CapstonePage(){return <LessonShell lessonId="module-2-capstone" lessonTitle="Module 2 Boss Lab" sections={sections}>{progress=><Module2CapstoneLesson progress={progress}/>}</LessonShell>}
