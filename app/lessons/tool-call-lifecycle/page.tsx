"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {ToolCallLifecycleLesson} from "@/components/lessons/tool-call-lifecycle/tool-call-lifecycle-lesson";
const sections=[
{id:"definition",title:"Define a tool",taskId:"tool-definition"},
{id:"selection",title:"Select the right tool",taskId:"tool-selection"},
{id:"arguments",title:"Build valid arguments",taskId:"tool-arguments"},
{id:"lifecycle",title:"Run the tool lifecycle",taskId:"tool-lifecycle"},
{id:"result",title:"Return result to the model",taskId:"tool-result"},
{id:"sequential",title:"Chain sequential tools",taskId:"tool-sequential"},
{id:"parallel",title:"Run independent tools in parallel",taskId:"tool-parallel"},
{id:"errors",title:"Handle errors and timeouts",taskId:"tool-errors"},
{id:"explain",title:"Explain tool calling back",taskId:"tool-explain"},
] as const;
export default function ToolCallLifecyclePage(){return <LessonShell lessonId="tool-call-lifecycle" lessonTitle="Tool Call Lifecycle" sections={sections}>{progress=><ToolCallLifecycleLesson progress={progress}/>}</LessonShell>}
