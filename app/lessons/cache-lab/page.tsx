"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { CacheLabLesson } from "@/components/lessons/cache-lab/cache-lab-lesson";
const sections=[
{id:"prefix",title:"Prompt / prefix cache",taskId:"cache-prefix"},
{id:"context",title:"Application context cache",taskId:"cache-context"},
{id:"kv",title:"KV cache",taskId:"cache-kv"},
{id:"semantic",title:"Semantic cache",taskId:"cache-semantic"},
{id:"response",title:"Response cache",taskId:"cache-response"},
{id:"embedding",title:"Embedding cache",taskId:"cache-embedding"},
{id:"tool",title:"Tool-result cache",taskId:"cache-tool"},
{id:"retrieval",title:"Retrieval cache",taskId:"cache-retrieval"},
{id:"invalidation",title:"Invalidation and hit rate",taskId:"cache-invalidation"},
{id:"explain",title:"Explain why caches differ",taskId:"cache-explain"},
] as const;
export default function CacheLabPage(){return <LessonShell lessonId="cache-lab" lessonTitle="AI Cache Lab" sections={sections}>{progress=><CacheLabLesson progress={progress}/>}</LessonShell>}
