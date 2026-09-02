"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module9CapstoneLesson} from "@/components/lessons/module-9-capstone/module-9-capstone-lesson";
const sections=[
{id:"chunk",title:"Repair chunk boundaries",taskId:"m9-chunk"},
{id:"scope",title:"Fix tenant and version scope",taskId:"m9-scope"},
{id:"hybrid",title:"Tune hybrid retrieval",taskId:"m9-hybrid"},
{id:"rewrite",title:"Repair the query",taskId:"m9-rewrite"},
{id:"rerank",title:"Rerank candidates",taskId:"m9-rerank"},
{id:"threshold",title:"Tune precision and recall",taskId:"m9-threshold"},
{id:"grounding",title:"Ground and cite the answer",taskId:"m9-grounding"},
{id:"migration",title:"Repair embedding migration",taskId:"m9-migration"},
] as const;
export default function Module9CapstonePage(){return <LessonShell lessonId="module-9-capstone" lessonTitle="Module 9 RAG Boss Lab" sections={sections}>{progress=><Module9CapstoneLesson progress={progress}/>}</LessonShell>}
