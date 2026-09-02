"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {PretrainingFactoryLesson} from "@/components/lessons/pretraining-factory/pretraining-factory-lesson";
const sections=[
{id:"corpus",title:"Build a training corpus",taskId:"pretrain-build-corpus"},
{id:"cleaning",title:"Clean, filter and deduplicate",taskId:"pretrain-clean-data"},
{id:"contamination",title:"Find evaluation contamination",taskId:"pretrain-find-contamination"},
{id:"synthetic",title:"Mix synthetic data carefully",taskId:"pretrain-synthetic"},
{id:"objective",title:"Run next-token cross entropy",taskId:"pretrain-objective"},
{id:"scale",title:"Backpropagation at cluster scale",taskId:"pretrain-scale"},
{id:"parallelism",title:"Choose distributed parallelism",taskId:"pretrain-parallelism"},
{id:"checkpoint",title:"Checkpoint and recover",taskId:"pretrain-checkpoint"},
{id:"explain",title:"Explain pretraining back",taskId:"pretrain-explain"},
] as const;
export default function PretrainingFactoryPage(){return <LessonShell lessonId="pretraining-factory" lessonTitle="Pretraining Factory" sections={sections}>{progress=><PretrainingFactoryLesson progress={progress}/>}</LessonShell>}
