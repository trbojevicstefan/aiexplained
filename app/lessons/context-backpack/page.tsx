"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {ContextBackpackLesson} from "@/components/lessons/context-backpack/context-backpack-lesson";
const sections=[
{id:"what-is-context",title:"Open the context backpack",taskId:"inspect-context-backpack"},
{id:"pack-context",title:"Pack messages and evidence",taskId:"pack-context"},
{id:"overflow",title:"Overflow the context window",taskId:"overflow-context"},
{id:"truncate-compress",title:"Truncate, summarize or compress",taskId:"repair-overflow"},
{id:"prioritize",title:"Prioritize what matters",taskId:"prioritize-context"},
{id:"lost-middle",title:"Create the lost-in-the-middle problem",taskId:"inspect-lost-middle"},
{id:"long-context",title:"Long context is not infinite context",taskId:"compare-long-context"},
{id:"cache-types",title:"Prompt/context/KV cache are different",taskId:"separate-cache-types"},
{id:"explain-context",title:"Explain context back",taskId:"explain-context"},
] as const;
export default function ContextBackpackPage(){return <LessonShell lessonId="context-backpack" lessonTitle="Context backpack" sections={sections}>{progress=><ContextBackpackLesson progress={progress}/>}</LessonShell>}
