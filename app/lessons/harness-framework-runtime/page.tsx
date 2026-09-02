"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {HarnessFrameworkRuntimeLesson} from "@/components/lessons/harness-framework-runtime/harness-framework-runtime-lesson";
const sections=[
{id:"naked",title:"Start with a naked model",taskId:"hfr-naked"},
{id:"harness",title:"Wrap it in a harness",taskId:"hfr-harness"},
{id:"runtime",title:"Runtime executes the system",taskId:"hfr-runtime"},
{id:"framework",title:"Framework gives abstractions",taskId:"hfr-framework"},
{id:"sdk",title:"SDK/library is another layer",taskId:"hfr-sdk"},
{id:"classify",title:"Classify the layers",taskId:"hfr-classify"},
{id:"context-tools",title:"Harness manages context and tools",taskId:"hfr-context-tools"},
{id:"state-memory",title:"Harness connects state and memory",taskId:"hfr-state-memory"},
{id:"explain",title:"Explain the distinction",taskId:"hfr-explain"},
] as const;
export default function HarnessFrameworkRuntimePage(){return <LessonShell lessonId="harness-framework-runtime" lessonTitle="Harness vs Framework vs Runtime" sections={sections}>{progress=><HarnessFrameworkRuntimeLesson progress={progress}/>}</LessonShell>}
