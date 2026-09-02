"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { AiCostChallengeLesson } from "@/components/lessons/ai-cost-challenge/ai-cost-challenge-lesson";
const sections=[
{id:"tokens",title:"Input, output, cached and reasoning cost",taskId:"cost-tokens"},
{id:"extras",title:"Embeddings and tool cost",taskId:"cost-extras"},
{id:"gpu",title:"GPU, training and fine-tuning cost",taskId:"cost-gpu"},
{id:"retries",title:"Retry amplification",taskId:"cost-retries"},
{id:"success",title:"Cost per successful task",taskId:"cost-success"},
{id:"budget",title:"Token and agent budgets",taskId:"cost-budget"},
{id:"routing",title:"Model routing for cost",taskId:"cost-routing"},
{id:"economics",title:"Unit economics",taskId:"cost-economics"},
{id:"forecast",title:"Forecast volume",taskId:"cost-forecast"},
{id:"explain",title:"Explain AI task economics",taskId:"cost-explain"},
] as const;
export default function AiCostChallengePage(){return <LessonShell lessonId="ai-cost-challenge" lessonTitle="AI Cost Challenge" sections={sections}>{progress=><AiCostChallengeLesson progress={progress}/>}</LessonShell>}
