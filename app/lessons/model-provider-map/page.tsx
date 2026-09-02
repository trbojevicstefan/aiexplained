"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { ModelProviderMapLesson } from "@/components/lessons/model-provider-map/model-provider-map-lesson";
const sections=[
{id:"provider-model",title:"Provider vs model",taskId:"provider-model"},
{id:"ecosystems",title:"Provider ecosystems",taskId:"provider-ecosystems"},
{id:"closed-open",title:"Closed vs open-weight",taskId:"provider-access"},
{id:"opensource",title:"Open-source terminology",taskId:"provider-opensource"},
{id:"hosted",title:"Hosted vs self-hosted",taskId:"provider-hosting"},
{id:"weights",title:"What model weights are",taskId:"provider-weights"},
{id:"hub",title:"Model hubs and artifacts",taskId:"provider-hub"},
{id:"choice",title:"Choose deployment pattern",taskId:"provider-choice"},
{id:"tradeoffs",title:"Provider trade-offs",taskId:"provider-tradeoffs"},
{id:"explain",title:"Explain provider vs model",taskId:"provider-explain"},
] as const;
export default function ModelProviderMapPage(){return <LessonShell lessonId="model-provider-map" lessonTitle="Model Provider Map" sections={sections}>{progress=><ModelProviderMapLesson progress={progress}/>}</LessonShell>}
