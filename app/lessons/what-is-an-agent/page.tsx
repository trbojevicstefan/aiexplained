"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {WhatIsAgentLesson} from "@/components/lessons/what-is-agent/what-is-agent-lesson";
const sections=[
{id:"compare",title:"Chatbot vs workflow vs agent",taskId:"agent-compare"},
{id:"goal",title:"Give the agent a goal",taskId:"agent-goal"},
{id:"environment",title:"Define the environment",taskId:"agent-environment"},
{id:"state-actions",title:"State and actions",taskId:"agent-state-actions"},
{id:"tools-memory",title:"Tools and memory",taskId:"agent-tools-memory"},
{id:"autonomy",title:"Autonomy and permissions",taskId:"agent-autonomy"},
{id:"policy-runtime",title:"Policy and runtime",taskId:"agent-policy-runtime"},
{id:"stop",title:"Completion and stop decisions",taskId:"agent-stop"},
{id:"explain",title:"Explain an agent back",taskId:"agent-explain"},
] as const;
export default function WhatIsAgentPage(){return <LessonShell lessonId="what-is-an-agent" lessonTitle="What Is an AI Agent?" sections={sections}>{progress=><WhatIsAgentLesson progress={progress}/>}</LessonShell>}
