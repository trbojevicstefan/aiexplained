"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {SearchVerificationLabLesson} from "@/components/lessons/search-verification-lab/search-verification-lab-lesson";
const sections=[
{id:"prm-orm",title:"Process vs outcome rewards",taskId:"verify-prm-orm"},
{id:"tree-search",title:"Search a solution tree",taskId:"verify-tree-search"},
{id:"tree-thoughts",title:"Tree-of-Thoughts intuition",taskId:"verify-tot"},
{id:"best-of-n",title:"Best-of-N",taskId:"verify-best-n"},
{id:"majority",title:"Majority voting",taskId:"verify-majority"},
{id:"self-consistency",title:"Self-consistency",taskId:"verify-self-consistency"},
{id:"memorization",title:"Reasoning vs memorization",taskId:"verify-memorization"},
{id:"verifier-failure",title:"When the verifier fails",taskId:"verify-failure"},
{id:"explain",title:"Explain search and verification",taskId:"verify-explain"},
] as const;
export default function SearchVerificationLabPage(){return <LessonShell lessonId="search-verification-lab" lessonTitle="Search & Verification Lab" sections={sections}>{progress=><SearchVerificationLabLesson progress={progress}/>}</LessonShell>}
