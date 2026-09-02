"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { MemoryPalaceLesson } from "@/components/lessons/memory-palace/memory-palace-lesson";
const sections=[
{id:"separate",title:"Context vs memory vs state",taskId:"memory-separate"},
{id:"types",title:"Memory types",taskId:"memory-types"},
{id:"extract",title:"Extract memory candidates",taskId:"memory-extract"},
{id:"normalize",title:"Normalize and store",taskId:"memory-normalize"},
{id:"retrieve",title:"Retrieve and rank memories",taskId:"memory-retrieve"},
{id:"inject",title:"Inject memory into context",taskId:"memory-inject"},
{id:"conflicts",title:"Resolve conflicts and duplicates",taskId:"memory-conflicts"},
{id:"decay",title:"Decay, forget and delete",taskId:"memory-decay"},
{id:"scope",title:"User, agent, shared and entity memory",taskId:"memory-scope"},
{id:"explain",title:"Explain memory back",taskId:"memory-explain"},
] as const;
export default function MemoryPalacePage(){return <LessonShell lessonId="memory-palace" lessonTitle="Memory Palace" sections={sections}>{progress=><MemoryPalaceLesson progress={progress}/>}</LessonShell>}
