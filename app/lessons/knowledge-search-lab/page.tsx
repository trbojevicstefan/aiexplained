"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { KnowledgeSearchLabLesson } from "@/components/lessons/knowledge-search-lab/knowledge-search-lab-lesson";
const sections=[
{id:"kb",title:"Knowledge bases",taskId:"ks-kb"},
{id:"keyword",title:"Keyword search",taskId:"ks-keyword"},
{id:"semantic",title:"Semantic/vector search",taskId:"ks-semantic"},
{id:"hybrid",title:"Hybrid search",taskId:"ks-hybrid"},
{id:"web",title:"Web search",taskId:"ks-web"},
{id:"rewrite",title:"Query expansion and rewriting",taskId:"ks-rewrite"},
{id:"rerank",title:"Reranking",taskId:"ks-rerank"},
{id:"sources",title:"Source credibility and selection",taskId:"ks-sources"},
{id:"citations",title:"Citation systems",taskId:"ks-citations"},
{id:"explain",title:"Explain search systems",taskId:"ks-explain"},
] as const;
export default function KnowledgeSearchLabPage(){return <LessonShell lessonId="knowledge-search-lab" lessonTitle="Knowledge & Search Lab" sections={sections}>{progress=><KnowledgeSearchLabLesson progress={progress}/>}</LessonShell>}
