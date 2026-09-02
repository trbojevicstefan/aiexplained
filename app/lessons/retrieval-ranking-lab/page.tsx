"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {RetrievalRankingLabLesson} from "@/components/lessons/retrieval-ranking-lab/retrieval-ranking-lab-lesson";
const sections=[
{id:"keyword",title:"Keyword and BM25 intuition",taskId:"retrieve-keyword"},
{id:"semantic",title:"Semantic retrieval",taskId:"retrieve-semantic"},
{id:"hybrid",title:"Blend hybrid search",taskId:"retrieve-hybrid"},
{id:"metadata",title:"Apply metadata filters",taskId:"retrieve-metadata"},
{id:"rewrite",title:"Rewrite ambiguous queries",taskId:"retrieve-rewrite"},
{id:"multi-query",title:"Use multiple query views",taskId:"retrieve-multi"},
{id:"hyde",title:"HyDE intuition",taskId:"retrieve-hyde"},
{id:"rerank",title:"Rerank candidate documents",taskId:"retrieve-rerank"},
{id:"explain",title:"Explain retrieval back",taskId:"retrieve-explain"},
] as const;
export default function RetrievalRankingLabPage(){return <LessonShell lessonId="retrieval-ranking-lab" lessonTitle="Retrieval & Ranking Lab" sections={sections}>{progress=><RetrievalRankingLabLesson progress={progress}/>}</LessonShell>}
