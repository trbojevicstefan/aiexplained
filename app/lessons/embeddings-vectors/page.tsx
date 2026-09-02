"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { EmbeddingsVectorsLesson } from "@/components/lessons/embeddings-vectors/embeddings-vectors-lesson";

const sections=[
  {id:"lookup",title:"Token ID to embedding lookup",taskId:"inspect-embedding-lookup"},
  {id:"dimensions",title:"Open vector dimensions",taskId:"inspect-vector-dimensions"},
  {id:"similarity",title:"Measure semantic similarity",taskId:"measure-cosine-similarity"},
  {id:"metrics",title:"Cosine, dot and Euclidean",taskId:"compare-vector-metrics"},
  {id:"text-search",title:"Run semantic text search",taskId:"run-semantic-search"},
  {id:"multimodal",title:"Mix text and image embeddings",taskId:"inspect-multimodal-space"},
  {id:"clusters",title:"Find clusters in embedding space",taskId:"inspect-vector-clusters"},
  {id:"ann",title:"Approximate nearest neighbor",taskId:"compare-ann-search"},
  {id:"explain-embeddings",title:"Explain it back",taskId:"explain-embeddings"},
] as const;

export default function EmbeddingsVectorsPage(){return <LessonShell lessonId="embeddings-vectors" lessonTitle="Embeddings & vectors" sections={sections}>{progress=><EmbeddingsVectorsLesson progress={progress}/>}</LessonShell>}
