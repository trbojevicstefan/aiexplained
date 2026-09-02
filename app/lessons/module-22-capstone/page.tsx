"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module22CapstoneLesson } from "@/components/lessons/module-22-capstone/module-22-capstone-lesson";
const sections=[
{id:"incident",title:"Diagnose serving incident",taskId:"m22-incident"},
{id:"batch",title:"Tune queue and batching",taskId:"m22-batch"},
{id:"scale",title:"Scale replicas",taskId:"m22-scale"},
{id:"shard",title:"Shard an oversized model",taskId:"m22-shard"},
{id:"cache",title:"Improve prefix cache hits",taskId:"m22-cache"},
{id:"spec",title:"Add speculative decoding",taskId:"m22-spec"},
{id:"slo",title:"Meet latency and throughput SLO",taskId:"m22-slo"},
{id:"explain",title:"Explain production serving",taskId:"m22-explain"},
] as const;
export default function Module22CapstonePage(){return <LessonShell lessonId="module-22-capstone" lessonTitle="Module 22 Infrastructure Incident Boss Lab" sections={sections}>{progress=><Module22CapstoneLesson progress={progress}/>}</LessonShell>}
