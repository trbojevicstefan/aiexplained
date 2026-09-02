"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { StateMachineLabLesson } from "@/components/lessons/state-machine-lab/state-machine-lab-lesson";
const sections=[
{id:"state-types",title:"Ephemeral, session and persistent state",taskId:"state-types"},
{id:"machine",title:"State machines and transitions",taskId:"state-machine"},
{id:"events",title:"Events drive transitions",taskId:"state-events"},
{id:"checkpoint",title:"Create a checkpoint",taskId:"state-checkpoint"},
{id:"crash",title:"Crash and resume",taskId:"state-resume"},
{id:"storage",title:"Choose state storage",taskId:"state-storage"},
{id:"durable",title:"Durable execution and idempotency",taskId:"state-durable"},
{id:"event-log",title:"Snapshot vs event log",taskId:"state-event-log"},
{id:"explain",title:"Explain state back",taskId:"state-explain"},
] as const;
export default function StateMachineLabPage(){return <LessonShell lessonId="state-machine-lab" lessonTitle="State & Checkpoints Lab" sections={sections}>{progress=><StateMachineLabLesson progress={progress}/>}</LessonShell>}
