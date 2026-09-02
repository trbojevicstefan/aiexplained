"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {RagIngestionChunkingLesson} from "@/components/lessons/rag-ingestion-chunking/rag-ingestion-chunking-lesson";
const sections=[
{id:"why-rag",title:"Why RAG exists",taskId:"rag-why"},
{id:"ingest",title:"Ingest and parse documents",taskId:"rag-ingest"},
{id:"clean",title:"Clean retrieval text",taskId:"rag-clean"},
{id:"chunk",title:"Choose chunk size",taskId:"rag-chunk"},
{id:"overlap",title:"Use overlap deliberately",taskId:"rag-overlap"},
{id:"metadata",title:"Attach useful metadata",taskId:"rag-metadata"},
{id:"embed-index",title:"Embed and index chunks",taskId:"rag-index"},
{id:"assemble",title:"Assemble grounded context",taskId:"rag-assemble"},
{id:"explain",title:"Explain ingestion back",taskId:"rag-ingest-explain"},
] as const;
export default function RagIngestionChunkingPage(){return <LessonShell lessonId="rag-ingestion-chunking" lessonTitle="RAG Ingestion & Chunking Lab" sections={sections}>{progress=><RagIngestionChunkingLesson progress={progress}/>}</LessonShell>}
