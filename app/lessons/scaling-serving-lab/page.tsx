"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { ScalingServingLabLesson } from "@/components/lessons/scaling-serving-lab/scaling-serving-lab-lesson";
const sections=[
{id:"replicas",title:"Model replicas",taskId:"serve-replicas"},
{id:"balance",title:"Load balancing",taskId:"serve-balance"},
{id:"autoscale",title:"Autoscaling",taskId:"serve-autoscale"},
{id:"serverless",title:"Serverless and cold starts",taskId:"serve-serverless"},
{id:"tensor",title:"Tensor parallelism",taskId:"serve-tensor"},
{id:"pipeline",title:"Pipeline parallelism",taskId:"serve-pipeline"},
{id:"speculative",title:"Speculative decoding",taskId:"serve-speculative"},
{id:"routing",title:"Request routing",taskId:"serve-routing"},
{id:"utilization",title:"GPU utilization and capacity",taskId:"serve-utilization"},
{id:"explain",title:"Explain scaling inference",taskId:"serve-explain"},
] as const;
export default function ScalingServingLabPage(){return <LessonShell lessonId="scaling-serving-lab" lessonTitle="Scaling & Serving Lab" sections={sections}>{progress=><ScalingServingLabLesson progress={progress}/>}</LessonShell>}
