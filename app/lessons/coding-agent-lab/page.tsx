"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { CodingAgentLabLesson } from "@/components/lessons/coding-agent-lab/coding-agent-lab-lesson";
const sections=[
{id:"context",title:"Repository context",taskId:"code-context"},
{id:"discovery",title:"File discovery and code search",taskId:"code-discovery"},
{id:"ast",title:"AST and dependency intuition",taskId:"code-ast"},
{id:"shell",title:"Shell commands and sandbox",taskId:"code-shell"},
{id:"patch",title:"Edit with a patch",taskId:"code-patch"},
{id:"tests",title:"Run tests and read failure",taskId:"code-tests"},
{id:"repair",title:"Iterative repair loop",taskId:"code-repair"},
{id:"checkpoint",title:"Planning and checkpoints",taskId:"code-checkpoint"},
{id:"git",title:"Git commit, PR and verification",taskId:"code-git"},
{id:"explain",title:"Explain coding agents",taskId:"code-explain"},
] as const;
export default function CodingAgentLabPage(){return <LessonShell lessonId="coding-agent-lab" lessonTitle="Coding Agent Lab" sections={sections}>{progress=><CodingAgentLabLesson progress={progress}/>}</LessonShell>}
