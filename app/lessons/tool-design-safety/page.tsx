"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {ToolDesignSafetyLesson} from "@/components/lessons/tool-design-safety/tool-design-safety-lesson";
const sections=[
{id:"descriptions",title:"Write useful tool descriptions",taskId:"design-descriptions"},
{id:"granularity",title:"Choose tool granularity",taskId:"design-granularity"},
{id:"idempotency",title:"Understand idempotency",taskId:"design-idempotency"},
{id:"risk",title:"Read write destructive risk",taskId:"design-risk"},
{id:"confirmation",title:"Require confirmation where needed",taskId:"design-confirmation"},
{id:"timeouts",title:"Timeouts retries rate limits",taskId:"design-timeouts"},
{id:"categories",title:"Map tool categories",taskId:"design-categories"},
{id:"reliability",title:"Design reliable tool outputs",taskId:"design-reliability"},
{id:"explain",title:"Explain good tool design",taskId:"design-explain"},
] as const;
export default function ToolDesignSafetyPage(){return <LessonShell lessonId="tool-design-safety" lessonTitle="Tool Design & Safety" sections={sections}>{progress=><ToolDesignSafetyLesson progress={progress}/>}</LessonShell>}
