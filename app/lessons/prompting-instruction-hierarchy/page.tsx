"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {PromptingInstructionHierarchyLesson} from "@/components/lessons/prompting-instruction-hierarchy/prompting-instruction-hierarchy-lesson";
const sections=[
{id:"prompt-vs-context",title:"Prompt vs context engineering",taskId:"separate-prompt-context"},
{id:"hierarchy",title:"Instruction hierarchy",taskId:"build-instruction-hierarchy"},
{id:"examples",title:"Zero-shot, one-shot and few-shot",taskId:"compare-shot-patterns"},
{id:"prompt-parts",title:"Persona, constraints and delimiters",taskId:"assemble-prompt"},
{id:"structured",title:"Structured outputs",taskId:"build-structured-output"},
{id:"reasoning-patterns",title:"Planning, critique and self-consistency",taskId:"compare-reasoning-patterns"},
{id:"direct-injection",title:"Direct prompt injection",taskId:"stop-direct-injection"},
{id:"indirect-injection",title:"Indirect injection and leakage",taskId:"stop-indirect-injection"},
{id:"explain-prompting",title:"Explain it back",taskId:"explain-prompting"},
] as const;
export default function PromptingInstructionHierarchyPage(){return <LessonShell lessonId="prompting-instruction-hierarchy" lessonTitle="Prompting & instruction hierarchy" sections={sections}>{progress=><PromptingInstructionHierarchyLesson progress={progress}/>}</LessonShell>}
