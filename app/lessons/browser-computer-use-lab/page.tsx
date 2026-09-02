"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { BrowserComputerUseLabLesson } from "@/components/lessons/browser-computer-use-lab/browser-computer-use-lab-lesson";
const sections=[
{id:"dom",title:"DOM and selectors",taskId:"browser-dom"},
{id:"a11y",title:"Accessibility tree grounding",taskId:"browser-a11y"},
{id:"state",title:"Browser state, cookies and sessions",taskId:"browser-state"},
{id:"forms",title:"Forms and authentication",taskId:"browser-forms"},
{id:"visual",title:"Screenshots and visual grounding",taskId:"browser-visual"},
{id:"actions",title:"Mouse, keyboard and direct manipulation",taskId:"browser-actions"},
{id:"strategy",title:"DOM vs coordinates",taskId:"browser-strategy"},
{id:"verify",title:"Verify every consequential action",taskId:"browser-verify"},
{id:"limits",title:"CAPTCHA and anti-bot limitations",taskId:"browser-limits"},
{id:"explain",title:"Explain browser agents",taskId:"browser-explain"},
] as const;
export default function BrowserComputerUseLabPage(){return <LessonShell lessonId="browser-computer-use-lab" lessonTitle="Browser & Computer-Use Lab" sections={sections}>{progress=><BrowserComputerUseLabLesson progress={progress}/>}</LessonShell>}
