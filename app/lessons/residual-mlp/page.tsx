"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { ResidualMlpLesson } from "@/components/lessons/residual-mlp/residual-mlp-lesson";

const sections = [
  { id:"dense-anatomy", title:"Build a dense MLP", taskId:"build-dense-mlp" },
  { id:"width-depth", title:"Change width and depth", taskId:"explore-width-depth" },
  { id:"plain-chain", title:"Stress a plain deep stack", taskId:"stress-plain-stack" },
  { id:"residual-block", title:"Add an identity shortcut", taskId:"build-residual-block" },
  { id:"information-path", title:"Compare information paths", taskId:"compare-information-paths" },
  { id:"gradient-path", title:"Compare gradient paths", taskId:"compare-gradient-paths" },
  { id:"residual-limits", title:"Residuals do not solve everything", taskId:"diagnose-residual-limits" },
  { id:"architecture-choice", title:"Choose MLP or residual stack", taskId:"choose-architecture" },
  { id:"explain-residual", title:"Explain it back", taskId:"explain-residual" },
] as const;

export default function ResidualMlpPage(){return <LessonShell lessonId="residual-mlp" lessonTitle="Residual connections & MLPs" sections={sections}>{progress=><ResidualMlpLesson progress={progress}/>}</LessonShell>}
