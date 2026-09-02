"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module6CapstoneLesson} from "@/components/lessons/module-6-capstone/module-6-capstone-lesson";
const sections=[
{id:"incident",title:"Inspect the broken request",taskId:"ctx-boss-inspect"},
{id:"budget",title:"Repair the token budget",taskId:"ctx-boss-budget"},
{id:"hierarchy",title:"Repair instruction authority",taskId:"ctx-boss-hierarchy"},
{id:"evidence",title:"Select grounded evidence",taskId:"ctx-boss-evidence"},
{id:"placement",title:"Repair context placement",taskId:"ctx-boss-placement"},
{id:"injection",title:"Block indirect injection",taskId:"ctx-boss-injection"},
{id:"output",title:"Constrain the output contract",taskId:"ctx-boss-output"},
{id:"cache",title:"Choose the correct cache",taskId:"ctx-boss-cache"},
] as const;
export default function Module6CapstonePage(){return <LessonShell lessonId="module-6-capstone" lessonTitle="Module 6 Boss Lab" sections={sections}>{progress=><Module6CapstoneLesson progress={progress}/>}</LessonShell>}
