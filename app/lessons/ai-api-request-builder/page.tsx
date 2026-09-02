"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { AiApiRequestBuilderLesson } from "@/components/lessons/ai-api-request-builder/ai-api-request-builder-lesson";
const sections=[
{id:"http",title:"HTTP and REST basics",taskId:"api-http"},
{id:"json",title:"JSON request body",taskId:"api-json"},
{id:"auth",title:"API keys, Bearer and OAuth",taskId:"api-auth"},
{id:"request",title:"Typical LLM request structure",taskId:"api-request"},
{id:"stream",title:"Streaming with SSE",taskId:"api-stream"},
{id:"websocket",title:"WebSockets",taskId:"api-websocket"},
{id:"limits",title:"Rate limits and retry policy",taskId:"api-limits"},
{id:"webhooks",title:"Webhooks",taskId:"api-webhooks"},
{id:"async",title:"Async and batch APIs",taskId:"api-async"},
{id:"explain",title:"Explain AI API lifecycle",taskId:"api-explain"},
] as const;
export default function AiApiRequestBuilderPage(){return <LessonShell lessonId="ai-api-request-builder" lessonTitle="AI API Request Builder" sections={sections}>{progress=><AiApiRequestBuilderLesson progress={progress}/>}</LessonShell>}
