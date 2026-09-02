"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module21CapstoneLesson } from "@/components/lessons/module-21-capstone/module-21-capstone-lesson";
const sections=[
{id:"access",title:"Choose provider/access pattern",taskId:"m21-access"},
{id:"artifact",title:"Choose model artifact and format",taskId:"m21-artifact"},
{id:"precision",title:"Choose precision",taskId:"m21-precision"},
{id:"hardware",title:"Choose hardware/backend",taskId:"m21-hardware"},
{id:"runtime",title:"Choose runtime",taskId:"m21-runtime"},
{id:"fit",title:"Fit memory budget",taskId:"m21-fit"},
{id:"deploy",title:"Match three deployment scenarios",taskId:"m21-deploy"},
{id:"explain",title:"Explain local model deployment",taskId:"m21-explain"},
] as const;
export default function Module21CapstonePage(){return <LessonShell lessonId="module-21-capstone" lessonTitle="Module 21 Deployment Garage Boss Lab" sections={sections}>{progress=><Module21CapstoneLesson progress={progress}/>}</LessonShell>}
