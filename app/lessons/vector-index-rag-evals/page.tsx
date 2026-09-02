"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {VectorIndexRagEvalsLesson} from "@/components/lessons/vector-index-rag-evals/vector-index-rag-evals-lesson";
const sections=[
{id:"vector-db",title:"What a vector database does",taskId:"index-vector-db"},
{id:"ann",title:"Exact vs approximate search",taskId:"index-ann"},
{id:"hnsw",title:"Walk an HNSW graph",taskId:"index-hnsw"},
{id:"ivf",title:"Probe IVF clusters",taskId:"index-ivf"},
{id:"threshold",title:"Tune similarity thresholds",taskId:"index-threshold"},
{id:"precision-recall",title:"Measure precision and recall",taskId:"index-precision-recall"},
{id:"rag-evals",title:"Evaluate retrieval and grounding",taskId:"index-rag-evals"},
{id:"migration",title:"Migrate embedding models",taskId:"index-migration"},
{id:"explain",title:"Explain indexes and evals",taskId:"index-explain"},
] as const;
export default function VectorIndexRagEvalsPage(){return <LessonShell lessonId="vector-index-rag-evals" lessonTitle="Vector Index & RAG Evals" sections={sections}>{progress=><VectorIndexRagEvalsLesson progress={progress}/>}</LessonShell>}
