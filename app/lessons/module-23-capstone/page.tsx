"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module23CapstoneLesson } from "@/components/lessons/module-23-capstone/module-23-capstone-lesson";
const sections=[
{id:"baseline",title:"Measure baseline cost",taskId:"m23-baseline"},
{id:"success",title:"Measure cost per success",taskId:"m23-success"},
{id:"route",title:"Route by task difficulty",taskId:"m23-route"},
{id:"cache",title:"Choose the right cache",taskId:"m23-cache"},
{id:"invalidate",title:"Protect cache correctness",taskId:"m23-invalidate"},
{id:"budget",title:"Set agent budgets",taskId:"m23-budget"},
{id:"target",title:"Hit quality under budget",taskId:"m23-target"},
{id:"explain",title:"Explain cost optimization",taskId:"m23-explain"},
] as const;
export default function Module23CapstonePage(){return <LessonShell lessonId="module-23-capstone" lessonTitle="Module 23 Quality Under Budget Boss Lab" sections={sections}>{progress=><Module23CapstoneLesson progress={progress}/>}</LessonShell>}
