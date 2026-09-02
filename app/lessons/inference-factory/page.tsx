"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { InferenceFactoryLesson } from "@/components/lessons/inference-factory/inference-factory-lesson";
const sections=[
{id:"hardware",title:"CPU, GPU, TPU and accelerator memory",taskId:"infer-hardware"},
{id:"server",title:"Inference/model servers",taskId:"infer-server"},
{id:"loading",title:"Model loading",taskId:"infer-loading"},
{id:"queue",title:"Request queue and scheduler",taskId:"infer-queue"},
{id:"prefill",title:"Prefill",taskId:"infer-prefill"},
{id:"decode",title:"Decode and KV cache",taskId:"infer-decode"},
{id:"batching",title:"Dynamic and continuous batching",taskId:"infer-batching"},
{id:"metrics",title:"TTFT, ITL, TPS and throughput",taskId:"infer-metrics"},
{id:"streaming",title:"Streaming responses",taskId:"infer-streaming"},
{id:"explain",title:"Explain inference serving",taskId:"infer-explain"},
] as const;
export default function InferenceFactoryPage(){return <LessonShell lessonId="inference-factory" lessonTitle="Inference Factory" sections={sections}>{progress=><InferenceFactoryLesson progress={progress}/>}</LessonShell>}
