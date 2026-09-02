"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module16CapstoneLesson } from "@/components/lessons/module-16-capstone/module-16-capstone-lesson";
const sections=[
{id:"levels",title:"Separate MoE from external routing",taskId:"m16-levels"},
{id:"eligibility",title:"Build eligibility constraints",taskId:"m16-eligibility"},
{id:"route",title:"Route four workloads",taskId:"m16-route"},
{id:"fallback",title:"Design provider fallback",taskId:"m16-fallback"},
{id:"cascade",title:"Tune a cascade",taskId:"m16-cascade"},
{id:"ensemble",title:"Use an ensemble only when justified",taskId:"m16-ensemble"},
{id:"economics",title:"Hit the quality-cost-latency target",taskId:"m16-economics"},
{id:"explain",title:"Explain the routing architecture",taskId:"m16-explain"},
] as const;
export default function Module16CapstonePage(){return <LessonShell lessonId="module-16-capstone" lessonTitle="Module 16 Routing Boss Lab" sections={sections}>{progress=><Module16CapstoneLesson progress={progress}/>}</LessonShell>}
