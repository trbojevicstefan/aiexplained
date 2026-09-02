"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { ObservabilityTraceLabLesson } from "@/components/lessons/observability-trace-lab/observability-trace-lab-lesson";
const sections=[
{id:"signals",title:"Logs, metrics and traces",taskId:"obs-signals"},
{id:"spans",title:"OpenTelemetry spans",taskId:"obs-spans"},
{id:"llm",title:"LLM spans",taskId:"obs-llm"},
{id:"tools",title:"Tool and retrieval spans",taskId:"obs-tools"},
{id:"tokens",title:"Token and cost telemetry",taskId:"obs-tokens"},
{id:"privacy",title:"Prompt/context logging privacy",taskId:"obs-privacy"},
{id:"debug",title:"Find the failing span",taskId:"obs-debug"},
{id:"replay",title:"Replay a run",taskId:"obs-replay"},
{id:"dashboards",title:"Metrics and alerts",taskId:"obs-dashboards"},
{id:"explain",title:"Explain observability",taskId:"obs-explain"},
] as const;
export default function ObservabilityTraceLabPage(){return <LessonShell lessonId="observability-trace-lab" lessonTitle="Observability Trace Lab" sections={sections}>{progress=><ObservabilityTraceLabLesson progress={progress}/>}</LessonShell>}
