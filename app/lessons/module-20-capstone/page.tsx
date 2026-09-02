"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module20CapstoneLesson } from "@/components/lessons/module-20-capstone/module-20-capstone-lesson";
const sections=[
{id:"transport",title:"Build the transport envelope",taskId:"m20-transport"},
{id:"auth",title:"Protect authentication",taskId:"m20-auth"},
{id:"request",title:"Assemble the model request",taskId:"m20-request"},
{id:"delivery",title:"Choose sync, stream, async or batch",taskId:"m20-delivery"},
{id:"schema",title:"Enforce a response schema",taskId:"m20-schema"},
{id:"repair",title:"Repair malformed model output",taskId:"m20-repair"},
{id:"action",title:"Separate data output from tool action",taskId:"m20-action"},
{id:"explain",title:"Explain the production contract",taskId:"m20-explain"},
] as const;
export default function Module20CapstonePage(){return <LessonShell lessonId="module-20-capstone" lessonTitle="Module 20 API Contract Boss Lab" sections={sections}>{progress=><Module20CapstoneLesson progress={progress}/>}</LessonShell>}
