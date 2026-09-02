"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { ModelSystemsLabLesson } from "@/components/lessons/model-systems-lab/model-systems-lab-lesson";
const sections=[
{id:"levels",title:"MoE routing vs external model routing",taskId:"models-levels"},
{id:"ensemble",title:"Build an ensemble",taskId:"models-ensemble"},
{id:"judge",title:"Generator and judge system",taskId:"models-judge"},
{id:"cascade",title:"Cascade and escalation",taskId:"models-cascade"},
{id:"mixture",title:"Mixture of models",taskId:"models-mixture"},
{id:"correlation",title:"Shared failure and diversity",taskId:"models-correlation"},
{id:"policy",title:"System-level routing policy",taskId:"models-policy"},
{id:"economics",title:"Quality, latency and cost accounting",taskId:"models-economics"},
{id:"explain",title:"Explain systems of models",taskId:"models-explain"},
] as const;
export default function ModelSystemsLabPage(){return <LessonShell lessonId="model-systems-lab" lessonTitle="Systems of Models Lab" sections={sections}>{progress=><ModelSystemsLabLesson progress={progress}/>}</LessonShell>}
