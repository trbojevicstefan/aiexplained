"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module8CapstoneLesson} from "@/components/lessons/module-8-capstone/module-8-capstone-lesson";
const sections=[
{id:"budget",title:"Allocate reasoning compute",taskId:"m8-budget"},
{id:"plan",title:"Choose a planning strategy",taskId:"m8-plan"},
{id:"search",title:"Search multiple candidates",taskId:"m8-search"},
{id:"reward",title:"Choose PRM or ORM",taskId:"m8-reward"},
{id:"aggregate",title:"Aggregate candidate answers",taskId:"m8-aggregate"},
{id:"verify",title:"Select a verifier",taskId:"m8-verify"},
{id:"correct",title:"Recover from failed verification",taskId:"m8-correct"},
{id:"economics",title:"Balance quality latency cost",taskId:"m8-economics"},
] as const;
export default function Module8CapstonePage(){return <LessonShell lessonId="module-8-capstone" lessonTitle="Module 8 Boss Lab" sections={sections}>{progress=><Module8CapstoneLesson progress={progress}/>}</LessonShell>}
