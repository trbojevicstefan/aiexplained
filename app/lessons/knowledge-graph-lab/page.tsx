"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { KnowledgeGraphLabLesson } from "@/components/lessons/knowledge-graph-lab/knowledge-graph-lab-lesson";
const sections=[
{id:"ontology",title:"Ontologies and schemas",taskId:"kg-ontology"},
{id:"entities",title:"Entities",taskId:"kg-entities"},
{id:"relationships",title:"Typed relationships",taskId:"kg-relationships"},
{id:"resolution",title:"Entity resolution",taskId:"kg-resolution"},
{id:"traversal",title:"Graph traversal",taskId:"kg-traversal"},
{id:"query",title:"Multi-hop graph questions",taskId:"kg-query"},
{id:"graph-rag",title:"Graph RAG",taskId:"kg-rag"},
{id:"hybrid",title:"Graph + vector hybrid",taskId:"kg-hybrid"},
{id:"when",title:"When graphs help",taskId:"kg-when"},
{id:"explain",title:"Explain knowledge graphs",taskId:"kg-explain"},
] as const;
export default function KnowledgeGraphLabPage(){return <LessonShell lessonId="knowledge-graph-lab" lessonTitle="Knowledge Graph Lab" sections={sections}>{progress=><KnowledgeGraphLabLesson progress={progress}/>}</LessonShell>}
