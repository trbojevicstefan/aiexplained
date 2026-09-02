"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module14CapstoneLesson } from "@/components/lessons/module-14-capstone/module-14-capstone-lesson";
const sections=[
{id:"triage",title:"Triage context, memory and state",taskId:"m14-triage"},
{id:"memory-pipeline",title:"Build the memory pipeline",taskId:"m14-memory"},
{id:"retrieval",title:"Retrieve only useful memory",taskId:"m14-retrieval"},
{id:"conflict",title:"Repair stale and conflicting memory",taskId:"m14-conflict"},
{id:"workflow",title:"Build persistent workflow state",taskId:"m14-workflow"},
{id:"crash",title:"Recover without duplicate side effects",taskId:"m14-crash"},
{id:"storage",title:"Design storage boundaries",taskId:"m14-storage"},
{id:"explain",title:"Explain memory and state together",taskId:"m14-explain"},
] as const;
export default function Module14CapstonePage(){return <LessonShell lessonId="module-14-capstone" lessonTitle="Module 14 Memory & State Boss Lab" sections={sections}>{progress=><Module14CapstoneLesson progress={progress}/>}</LessonShell>}
