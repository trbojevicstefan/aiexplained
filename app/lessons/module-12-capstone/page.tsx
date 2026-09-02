"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module12CapstoneLesson} from "@/components/lessons/module-12-capstone/module-12-capstone-lesson";
const sections=[
{id:"select",title:"Select the correct tool",taskId:"m12-select"},
{id:"schema",title:"Repair the tool schema",taskId:"m12-schema"},
{id:"arguments",title:"Repair malformed arguments",taskId:"m12-arguments"},
{id:"permission",title:"Gate the write action",taskId:"m12-permission"},
{id:"dependencies",title:"Fix sequential vs parallel calls",taskId:"m12-dependencies"},
{id:"idempotency",title:"Fix retry and idempotency",taskId:"m12-idempotency"},
{id:"result",title:"Normalize the tool result",taskId:"m12-result"},
{id:"diagnose",title:"Diagnose tool categories",taskId:"m12-diagnose"},
] as const;
export default function Module12CapstonePage(){return <LessonShell lessonId="module-12-capstone" lessonTitle="Module 12 Tool Calling Boss Lab" sections={sections}>{progress=><Module12CapstoneLesson progress={progress}/>}</LessonShell>}
