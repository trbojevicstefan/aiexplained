"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {AgentLoopBuilderLesson} from "@/components/lessons/agent-loop-builder/agent-loop-builder-lesson";
const sections=[
{id:"naked-model",title:"Start with a naked model",taskId:"loop-naked-model"},
{id:"assemble",title:"Assemble the agent system",taskId:"loop-assemble"},
{id:"observe",title:"Observe goal and context",taskId:"loop-observe"},
{id:"decide",title:"Choose a tool action",taskId:"loop-decide"},
{id:"execute",title:"Execute outside the model",taskId:"loop-execute"},
{id:"result",title:"Return result to context",taskId:"loop-result"},
{id:"state-memory",title:"Update state vs memory",taskId:"loop-state-memory"},
{id:"approval",title:"Permission gate and retries",taskId:"loop-approval"},
{id:"explain",title:"Explain the loop back",taskId:"loop-explain"},
] as const;
export default function AgentLoopBuilderPage(){return <LessonShell lessonId="agent-loop-builder" lessonTitle="Agent Loop Builder" sections={sections}>{progress=><AgentLoopBuilderLesson progress={progress}/>}</LessonShell>}
