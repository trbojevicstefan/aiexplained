"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {ReasoningSolverArenaLesson} from "@/components/lessons/reasoning-solver-arena/reasoning-solver-arena-lesson";
const sections=[
{id:"reasoning",title:"What reasoning means here",taskId:"reasoning-meaning"},
{id:"budget",title:"Spend test-time compute",taskId:"reasoning-budget"},
{id:"plan",title:"Plan before solving",taskId:"reasoning-plan"},
{id:"search",title:"Search over candidates",taskId:"reasoning-search"},
{id:"verify",title:"Verify before answering",taskId:"reasoning-verify"},
{id:"self-correct",title:"Self-correct a failed solution",taskId:"reasoning-correct"},
{id:"critic",title:"Generator and critic",taskId:"reasoning-critic"},
{id:"tradeoff",title:"Quality, latency and cost",taskId:"reasoning-tradeoff"},
{id:"explain",title:"Explain reasoning back",taskId:"reasoning-explain"},
] as const;
export default function ReasoningSolverArenaPage(){return <LessonShell lessonId="reasoning-solver-arena" lessonTitle="Reasoning Solver Arena" sections={sections}>{progress=><ReasoningSolverArenaLesson progress={progress}/>}</LessonShell>}
