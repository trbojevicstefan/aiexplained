"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module24CapstoneLesson } from "@/components/lessons/module-24-capstone/module-24-capstone-lesson";
const sections=[
{id:"incident",title:"Open the production incident",taskId:"m24-incident"},
{id:"trace",title:"Find the failing span",taskId:"m24-trace"},
{id:"eval-suite",title:"Build the eval suite",taskId:"m24-eval-suite"},
{id:"judges",title:"Choose evaluation judges",taskId:"m24-judges"},
{id:"metrics",title:"Tune precision and recall",taskId:"m24-metrics"},
{id:"grounding",title:"Separate retrieval from groundedness",taskId:"m24-grounding"},
{id:"privacy",title:"Protect observability data",taskId:"m24-privacy"},
{id:"gate",title:"Configure the regression gate",taskId:"m24-gate"},
{id:"replay",title:"Replay and verify the fix",taskId:"m24-replay"},
{id:"explain",title:"Explain evals + observability together",taskId:"m24-explain"},
] as const;
export default function Module24CapstonePage(){return <LessonShell lessonId="module-24-capstone" lessonTitle="Module 24 Evals & Observability Boss Lab" sections={sections}>{progress=><Module24CapstoneLesson progress={progress}/>}</LessonShell>}
