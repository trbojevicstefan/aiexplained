"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module25CapstoneLesson } from "@/components/lessons/module-25-capstone/module-25-capstone-lesson";
const sections=[
{id:"incident",title:"Open the compromised agent",taskId:"m25-incident"},
{id:"injection",title:"Repair the trust boundary",taskId:"m25-injection"},
{id:"poisoning",title:"Clean poisoned knowledge and memory",taskId:"m25-poisoning"},
{id:"permissions",title:"Shrink permissions",taskId:"m25-permissions"},
{id:"secrets",title:"Protect credentials and sensitive data",taskId:"m25-secrets"},
{id:"sandbox",title:"Contain execution",taskId:"m25-sandbox"},
{id:"limits",title:"Bound runtime cost and steps",taskId:"m25-limits"},
{id:"approval",title:"Place human approval",taskId:"m25-approval"},
{id:"audit",title:"Verify audit and detection",taskId:"m25-audit"},
{id:"explain",title:"Explain the secure architecture",taskId:"m25-explain"},
] as const;
export default function Module25CapstonePage(){return <LessonShell lessonId="module-25-capstone" lessonTitle="Module 25 Security Escape Room" sections={sections}>{progress=><Module25CapstoneLesson progress={progress}/>}</LessonShell>}
