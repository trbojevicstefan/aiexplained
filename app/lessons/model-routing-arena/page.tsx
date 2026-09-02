"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { ModelRoutingArenaLesson } from "@/components/lessons/model-routing-arena/model-routing-arena-lesson";
const sections=[
{id:"task",title:"Route by task and complexity",taskId:"route-task"},
{id:"constraints",title:"Quality, latency and cost constraints",taskId:"route-constraints"},
{id:"context",title:"Context and modality constraints",taskId:"route-context"},
{id:"provider",title:"Provider and policy routing",taskId:"route-provider"},
{id:"rules",title:"Rules, semantic and learned routers",taskId:"route-rules"},
{id:"fallback",title:"Fallback models",taskId:"route-fallback"},
{id:"cascade",title:"Model cascades",taskId:"route-cascade"},
{id:"frontier",title:"Quality-cost-latency frontier",taskId:"route-frontier"},
{id:"explain",title:"Explain routing back",taskId:"route-explain"},
] as const;
export default function ModelRoutingArenaPage(){return <LessonShell lessonId="model-routing-arena" lessonTitle="Model Routing Arena" sections={sections}>{progress=><ModelRoutingArenaLesson progress={progress}/>}</LessonShell>}
