"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {HarnessRuntimeLabLesson} from "@/components/lessons/harness-runtime-lab/harness-runtime-lab-lesson";
const sections=[
{id:"tools",title:"Register and execute tools",taskId:"hr-tools"},
{id:"permissions",title:"Enforce tool permissions",taskId:"hr-permissions"},
{id:"errors",title:"Classify errors and retries",taskId:"hr-errors"},
{id:"state-memory",title:"Wire state and memory",taskId:"hr-state-memory"},
{id:"sandbox",title:"Sandbox execution",taskId:"hr-sandbox"},
{id:"capabilities",title:"Filesystem shell browser code",taskId:"hr-capabilities"},
{id:"tracing",title:"Trace tokens cost and latency",taskId:"hr-tracing"},
{id:"checkpoint",title:"Checkpoint approvals and sessions",taskId:"hr-checkpoint"},
{id:"explain",title:"Explain harness runtime back",taskId:"hr-explain"},
] as const;
export default function HarnessRuntimeLabPage(){return <LessonShell lessonId="harness-runtime-lab" lessonTitle="Harness Runtime Lab" sections={sections}>{progress=><HarnessRuntimeLabLesson progress={progress}/>}</LessonShell>}
