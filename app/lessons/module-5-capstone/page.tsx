"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module5CapstoneLesson} from "@/components/lessons/module-5-capstone/module-5-capstone-lesson";
const sections=[
{id:"logits",title:"Turn logits into probabilities",taskId:"boss-logits"},
{id:"sampling",title:"Control the sampler",taskId:"boss-sampling"},
{id:"autoregressive",title:"Run autoregressive generation",taskId:"boss-autoregressive"},
{id:"stopping",title:"Stop and repetition controls",taskId:"boss-stopping"},
{id:"hallucination",title:"Diagnose hallucination",taskId:"boss-hallucination"},
{id:"moe-routing",title:"Route inside and outside the model",taskId:"boss-routing"},
{id:"model-families",title:"Choose the right model family",taskId:"boss-model-families"},
{id:"scaling",title:"Interpret scaling carefully",taskId:"boss-scaling"},
] as const;
export default function Module5CapstonePage(){return <LessonShell lessonId="module-5-capstone" lessonTitle="Module 5 Boss Lab" sections={sections}>{progress=><Module5CapstoneLesson progress={progress}/>}</LessonShell>}
