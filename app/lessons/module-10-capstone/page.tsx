"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module10CapstoneLesson} from "@/components/lessons/module-10-capstone/module-10-capstone-lesson";
const sections=[
{id:"components",title:"Install missing agent components",taskId:"m10-components"},
{id:"goal",title:"Make the goal operational",taskId:"m10-goal"},
{id:"loop",title:"Run the action loop",taskId:"m10-loop"},
{id:"state",title:"Persist task state correctly",taskId:"m10-state"},
{id:"permission",title:"Gate a write action",taskId:"m10-permission"},
{id:"recovery",title:"Recover from tool failure",taskId:"m10-recovery"},
{id:"stop",title:"Stop the agent correctly",taskId:"m10-stop"},
{id:"diagnose",title:"Diagnose agent vs workflow",taskId:"m10-diagnose"},
] as const;
export default function Module10CapstonePage(){return <LessonShell lessonId="module-10-capstone" lessonTitle="Module 10 Agent Boss Lab" sections={sections}>{progress=><Module10CapstoneLesson progress={progress}/>}</LessonShell>}
