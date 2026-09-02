"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module18CapstoneLesson } from "@/components/lessons/module-18-capstone/module-18-capstone-lesson";
const sections=[
{id:"route",title:"Route each modality",taskId:"m18-route"},
{id:"ground",title:"Ground cross-modal evidence",taskId:"m18-ground"},
{id:"generate",title:"Choose generation/edit mode",taskId:"m18-generate"},
{id:"condition",title:"Choose image conditioning",taskId:"m18-condition"},
{id:"voice",title:"Build the voice pipeline",taskId:"m18-voice"},
{id:"interrupt",title:"Handle barge-in",taskId:"m18-interrupt"},
{id:"failures",title:"Diagnose multimodal failures",taskId:"m18-failures"},
{id:"explain",title:"Explain the whole multimodal system",taskId:"m18-explain"},
] as const;
export default function Module18CapstonePage(){return <LessonShell lessonId="module-18-capstone" lessonTitle="Module 18 Multimodal Boss Lab" sections={sections}>{progress=><Module18CapstoneLesson progress={progress}/>}</LessonShell>}
