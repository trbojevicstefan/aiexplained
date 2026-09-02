"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {EfficientAdaptationLesson} from "@/components/lessons/efficient-adaptation/efficient-adaptation-lesson";
const sections=[
{id:"full-vs-peft",title:"Full fine-tuning vs PEFT",taskId:"adapt-full-peft"},
{id:"lora",title:"Open a LoRA update",taskId:"adapt-lora"},
{id:"qlora",title:"Build a QLoRA stack",taskId:"adapt-qlora"},
{id:"adapters",title:"Adapters and domain tuning",taskId:"adapt-adapters"},
{id:"distillation",title:"Distill teacher into student",taskId:"adapt-distill"},
{id:"merging",title:"Merge model skills",taskId:"adapt-merge"},
{id:"continual",title:"Trigger catastrophic forgetting",taskId:"adapt-continual"},
{id:"qat",title:"Quantization-aware training",taskId:"adapt-qat"},
{id:"explain",title:"Explain efficient adaptation",taskId:"adapt-explain"},
] as const;
export default function EfficientAdaptationPage(){return <LessonShell lessonId="efficient-adaptation" lessonTitle="Efficient Adaptation Lab" sections={sections}>{progress=><EfficientAdaptationLesson progress={progress}/>}</LessonShell>}
