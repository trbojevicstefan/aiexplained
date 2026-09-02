"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module15CapstoneLesson } from "@/components/lessons/module-15-capstone/module-15-capstone-lesson";
const sections=[
{id:"roles",title:"Repair roles and ownership",taskId:"m15-roles"},
{id:"queue",title:"Repair queue and worker claims",taskId:"m15-queue"},
{id:"dependencies",title:"Repair fan-out and fan-in dependencies",taskId:"m15-dependencies"},
{id:"failures",title:"Repair retries and dead letters",taskId:"m15-failures"},
{id:"loops",title:"Stop infinite loops and duplicate work",taskId:"m15-loops"},
{id:"deadlock",title:"Break coordination deadlocks",taskId:"m15-deadlock"},
{id:"durable",title:"Make orchestration durable",taskId:"m15-durable"},
{id:"explain",title:"Explain the repaired architecture",taskId:"m15-explain"},
] as const;
export default function Module15CapstonePage(){return <LessonShell lessonId="module-15-capstone" lessonTitle="Module 15 Orchestration Boss Lab" sections={sections}>{progress=><Module15CapstoneLesson progress={progress}/>}</LessonShell>}
