"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module17CapstoneLesson } from "@/components/lessons/module-17-capstone/module-17-capstone-lesson";
const sections=[
{id:"repo",title:"Discover the bug surface",taskId:"m17-repo"},
{id:"patch",title:"Patch the code",taskId:"m17-patch"},
{id:"test",title:"Use test feedback",taskId:"m17-test"},
{id:"sandbox",title:"Run inside safe boundaries",taskId:"m17-sandbox"},
{id:"ground",title:"Ground the browser target",taskId:"m17-ground"},
{id:"verify",title:"Verify the UI postcondition",taskId:"m17-verify"},
{id:"git",title:"Create the reviewable Git artifact",taskId:"m17-git"},
{id:"explain",title:"Explain the end-to-end agent",taskId:"m17-explain"},
] as const;
export default function Module17CapstonePage(){return <LessonShell lessonId="module-17-capstone" lessonTitle="Module 17 Coding + Browser Boss Lab" sections={sections}>{progress=><Module17CapstoneLesson progress={progress}/>}</LessonShell>}
