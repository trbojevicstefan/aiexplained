"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { StructuredOutputLabLesson } from "@/components/lessons/structured-output-lab/structured-output-lab-lesson";
const sections=[
{id:"syntax",title:"Valid JSON syntax",taskId:"so-syntax"},
{id:"json-mode",title:"JSON mode",taskId:"so-json-mode"},
{id:"schema",title:"JSON Schema",taskId:"so-schema"},
{id:"types",title:"Typed validation",taskId:"so-types"},
{id:"constrained",title:"Constrained decoding",taskId:"so-constrained"},
{id:"parse",title:"Output parsing",taskId:"so-parse"},
{id:"retry",title:"Validation and retry",taskId:"so-retry"},
{id:"repair",title:"Schema repair",taskId:"so-repair"},
{id:"tools",title:"Structured output vs tool calls",taskId:"so-tools"},
{id:"explain",title:"Explain structured outputs",taskId:"so-explain"},
] as const;
export default function StructuredOutputLabPage(){return <LessonShell lessonId="structured-output-lab" lessonTitle="Structured Output Lab" sections={sections}>{progress=><StructuredOutputLabLesson progress={progress}/>}</LessonShell>}
