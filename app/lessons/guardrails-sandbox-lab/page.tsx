"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { GuardrailsSandboxLabLesson } from "@/components/lessons/guardrails-sandbox-lab/guardrails-sandbox-lab-lesson";
const sections=[
{id:"layers",title:"Build defense in depth",taskId:"guard-layers"},
{id:"input",title:"Design input guardrails",taskId:"guard-input"},
{id:"output",title:"Validate outputs",taskId:"guard-output"},
{id:"tools",title:"Guard tool actions",taskId:"guard-tools"},
{id:"budgets",title:"Set step, cost and rate limits",taskId:"guard-budgets"},
{id:"sandbox",title:"Build the execution sandbox",taskId:"guard-sandbox"},
{id:"commands",title:"Constrain executable capabilities",taskId:"guard-commands"},
{id:"human",title:"Place human approval gates",taskId:"guard-human"},
{id:"explain",title:"Explain defense in depth",taskId:"guard-explain"},
] as const;
export default function GuardrailsSandboxLabPage(){return <LessonShell lessonId="guardrails-sandbox-lab" lessonTitle="Guardrails & Sandbox Lab" sections={sections}>{progress=><GuardrailsSandboxLabLesson progress={progress}/>}</LessonShell>}
