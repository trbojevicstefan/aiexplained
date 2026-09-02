"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { LocalModelGarageLesson } from "@/components/lessons/local-model-garage/local-model-garage-lesson";
const sections=[
{id:"formats",title:"Safetensors and GGUF",taskId:"garage-formats"},
{id:"precision",title:"Precision and quantization",taskId:"garage-precision"},
{id:"memory",title:"VRAM and RAM",taskId:"garage-memory"},
{id:"compute",title:"GPU vs CPU inference",taskId:"garage-compute"},
{id:"backends",title:"CUDA, ROCm and Metal",taskId:"garage-backends"},
{id:"llamacpp",title:"llama.cpp",taskId:"garage-llamacpp"},
{id:"ollama",title:"Ollama",taskId:"garage-ollama"},
{id:"servers",title:"vLLM and TensorRT-LLM",taskId:"garage-servers"},
{id:"fit",title:"Fit a model to hardware",taskId:"garage-fit"},
{id:"explain",title:"Explain local inference",taskId:"garage-explain"},
] as const;
export default function LocalModelGaragePage(){return <LessonShell lessonId="local-model-garage" lessonTitle="Local Model Garage" sections={sections}>{progress=><LocalModelGarageLesson progress={progress}/>}</LessonShell>}
