"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {A2aDelegationLabLesson} from "@/components/lessons/a2a-delegation-lab/a2a-delegation-lab-lesson";
const sections=[
{id:"why",title:"Why agent to agent protocols",taskId:"a2a-why"},
{id:"card",title:"Discover an Agent Card",taskId:"a2a-card"},
{id:"identity",title:"Verify identity and trust",taskId:"a2a-identity"},
{id:"task",title:"Create a delegated task",taskId:"a2a-task"},
{id:"messages",title:"Exchange task messages",taskId:"a2a-messages"},
{id:"status",title:"Track task status",taskId:"a2a-status"},
{id:"artifact",title:"Receive artifacts",taskId:"a2a-artifact"},
{id:"marketplace",title:"Discovery services and marketplaces",taskId:"a2a-marketplace"},
{id:"explain",title:"Explain A2A back",taskId:"a2a-explain"},
] as const;
export default function A2aDelegationLabPage(){return <LessonShell lessonId="a2a-delegation-lab" lessonTitle="Agent-to-Agent Delegation Lab" sections={sections}>{progress=><A2aDelegationLabLesson progress={progress}/>}</LessonShell>}
