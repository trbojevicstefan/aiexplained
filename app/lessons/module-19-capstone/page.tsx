"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { Module19CapstoneLesson } from "@/components/lessons/module-19-capstone/module-19-capstone-lesson";
const sections=[
{id:"sources",title:"Choose source systems",taskId:"m19-sources"},
{id:"search",title:"Choose retrieval modes",taskId:"m19-search"},
{id:"resolve",title:"Resolve graph entities",taskId:"m19-resolve"},
{id:"traverse",title:"Run multi-hop traversal",taskId:"m19-traverse"},
{id:"rerank",title:"Rerank for relevance and trust",taskId:"m19-rerank"},
{id:"hybrid",title:"Combine graph and documents",taskId:"m19-hybrid"},
{id:"cite",title:"Attach evidence citations",taskId:"m19-cite"},
{id:"explain",title:"Explain the investigation pipeline",taskId:"m19-explain"},
] as const;
export default function Module19CapstonePage(){return <LessonShell lessonId="module-19-capstone" lessonTitle="Module 19 Knowledge Investigation Boss Lab" sections={sections}>{progress=><Module19CapstoneLesson progress={progress}/>}</LessonShell>}
