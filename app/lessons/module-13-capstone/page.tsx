"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module13CapstoneLesson } from "@/components/lessons/module-13-capstone/module-13-capstone-lesson";
const sections=[
{id:"map",title:"Map four integration boundaries",taskId:"m13-map"},
{id:"mcp",title:"Wire MCP capabilities",taskId:"m13-mcp"},
{id:"trust",title:"Repair trust and authorization",taskId:"m13-trust"},
{id:"delegate",title:"Build an A2A task contract",taskId:"m13-delegate"},
{id:"status",title:"Repair remote task lifecycle",taskId:"m13-status"},
{id:"artifact",title:"Validate returned artifacts",taskId:"m13-artifact"},
{id:"architecture",title:"Build the whole protocol architecture",taskId:"m13-architecture"},
{id:"explain",title:"Explain the protocol stack",taskId:"m13-explain"},
] as const;
export default function Module13CapstonePage(){return <LessonShell lessonId="module-13-capstone" lessonTitle="Module 13 Protocol Boss Lab" sections={sections}>{progress=><Module13CapstoneLesson progress={progress}/>}</LessonShell>}
