"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {Module7CapstoneLesson} from "@/components/lessons/module-7-capstone/module-7-capstone-lesson";
const sections=[
{id:"data",title:"Sanitize the training corpus",taskId:"m7-data"},
{id:"objective",title:"Optimize pretraining loss",taskId:"m7-objective"},
{id:"cluster",title:"Design distributed training",taskId:"m7-cluster"},
{id:"sft",title:"Teach instruction following",taskId:"m7-sft"},
{id:"preferences",title:"Choose preference optimization",taskId:"m7-preferences"},
{id:"peft",title:"Adapt under a memory budget",taskId:"m7-peft"},
{id:"retain",title:"Preserve old capabilities",taskId:"m7-retain"},
{id:"ship",title:"Choose the final artifact",taskId:"m7-ship"},
] as const;
export default function Module7CapstonePage(){return <LessonShell lessonId="module-7-capstone" lessonTitle="Module 7 Boss Lab" sections={sections}>{progress=><Module7CapstoneLesson progress={progress}/>}</LessonShell>}
