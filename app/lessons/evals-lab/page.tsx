"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { EvalsLabLesson } from "@/components/lessons/evals-lab/evals-lab-lesson";
const sections=[
{id:"eval",title:"What is an eval?",taskId:"eval-what"},
{id:"datasets",title:"Benchmarks, test sets and golden data",taskId:"eval-datasets"},
{id:"judges",title:"Human, LLM judge and pairwise evals",taskId:"eval-judges"},
{id:"classification",title:"Accuracy, precision, recall and F1",taskId:"eval-classification"},
{id:"grounding",title:"Groundedness and faithfulness",taskId:"eval-grounding"},
{id:"agent",title:"Agent-specific evals",taskId:"eval-agent"},
{id:"efficiency",title:"Cost and latency as eval dimensions",taskId:"eval-efficiency"},
{id:"design",title:"Design an eval suite",taskId:"eval-design"},
{id:"regression",title:"Regression gates",taskId:"eval-regression"},
{id:"explain",title:"Explain evals",taskId:"eval-explain"},
] as const;
export default function EvalsLabPage(){return <LessonShell lessonId="evals-lab" lessonTitle="AI Evals Lab" sections={sections}>{progress=><EvalsLabLesson progress={progress}/>}</LessonShell>}
