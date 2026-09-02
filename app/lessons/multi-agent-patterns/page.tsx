"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { MultiAgentPatternsLesson } from "@/components/lessons/multi-agent-patterns/multi-agent-patterns-lesson";
const sections=[
{id:"topologies",title:"Single, hierarchical and peer topologies",taskId:"multi-topologies"},
{id:"specialists",title:"Choose specialist agents",taskId:"multi-specialists"},
{id:"patterns",title:"ReAct, plan-execute and reflection",taskId:"multi-patterns"},
{id:"dynamic",title:"Static vs dynamic workflows",taskId:"multi-dynamic"},
{id:"handoffs",title:"Handoffs and ownership",taskId:"multi-handoffs"},
{id:"workspace",title:"Shared memory and workspace",taskId:"multi-workspace"},
{id:"loops",title:"Infinite-loop and duplicate-work prevention",taskId:"multi-loops"},
{id:"deadlock",title:"Deadlock prevention",taskId:"multi-deadlock"},
{id:"consensus",title:"Debate, voting and consensus",taskId:"multi-consensus"},
{id:"explain",title:"Explain multi-agent architecture",taskId:"multi-explain"},
] as const;
export default function MultiAgentPatternsPage(){return <LessonShell lessonId="multi-agent-patterns" lessonTitle="Multi-Agent Patterns Lab" sections={sections}>{progress=><MultiAgentPatternsLesson progress={progress}/>}</LessonShell>}
