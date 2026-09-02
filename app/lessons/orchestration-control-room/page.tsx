"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { OrchestrationControlRoomLesson } from "@/components/lessons/orchestration-control-room/orchestration-control-room-lesson";
const sections=[
{id:"roles",title:"Single vs multi-agent roles",taskId:"orch-roles"},
{id:"decompose",title:"Task and goal decomposition",taskId:"orch-decompose"},
{id:"queue",title:"Queue, scheduler and workers",taskId:"orch-queue"},
{id:"execution",title:"Sequential, parallel and async execution",taskId:"orch-execution"},
{id:"dag",title:"Fan-out, fan-in and DAGs",taskId:"orch-dag"},
{id:"events",title:"Events, webhooks and Pub/Sub",taskId:"orch-events"},
{id:"retries",title:"Retries and dead-letter queues",taskId:"orch-retries"},
{id:"handoff",title:"Agent handoffs and shared workspace",taskId:"orch-handoff"},
{id:"durable",title:"Durable orchestration",taskId:"orch-durable"},
{id:"explain",title:"Explain orchestration back",taskId:"orch-explain"},
] as const;
export default function OrchestrationControlRoomPage(){return <LessonShell lessonId="orchestration-control-room" lessonTitle="Orchestration Control Room" sections={sections}>{progress=><OrchestrationControlRoomLesson progress={progress}/>}</LessonShell>}
