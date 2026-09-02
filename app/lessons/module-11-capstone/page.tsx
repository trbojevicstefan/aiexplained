"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module11CapstoneLesson } from "@/components/lessons/module-11-capstone/module-11-capstone-lesson";
const sections=[
{id:"classify",title:"Classify model harness runtime framework SDK",taskId:"m11-classify"},
{id:"assemble",title:"Assemble the harness",taskId:"m11-assemble"},
{id:"tools",title:"Repair tool permissions",taskId:"m11-tools"},
{id:"sandbox",title:"Repair the sandbox",taskId:"m11-sandbox"},
{id:"errors",title:"Repair retries and errors",taskId:"m11-errors"},
{id:"trace",title:"Repair tracing and token budget",taskId:"m11-trace"},
{id:"durability",title:"Repair checkpoint approval session",taskId:"m11-durability"},
{id:"framework",title:"Choose the right framework shape",taskId:"m11-framework"},
] as const;
export default function Module11CapstonePage(){return <LessonShell lessonId="module-11-capstone" lessonTitle="Module 11 Harness Boss Lab" sections={sections}>{progress=><Module11CapstoneLesson progress={progress}/>}</LessonShell>}
