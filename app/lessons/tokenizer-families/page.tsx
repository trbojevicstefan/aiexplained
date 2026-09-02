"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { TokenizerFamiliesLesson } from "@/components/lessons/tokenizer-families/tokenizer-families-lesson";

const sections=[
  {id:"three-families",title:"Meet three tokenizer families",taskId:"inspect-tokenizer-families"},
  {id:"bpe-workshop",title:"BPE merges",taskId:"build-bpe-token"},
  {id:"wordpiece-workshop",title:"WordPiece scoring",taskId:"build-wordpiece-token"},
  {id:"sentencepiece-workshop",title:"SentencePiece text stream",taskId:"inspect-sentencepiece"},
  {id:"whitespace",title:"Whitespace becomes data",taskId:"inspect-whitespace-markers"},
  {id:"unknowns",title:"Handle unseen text",taskId:"compare-unknown-handling"},
  {id:"tradeoffs",title:"Vocabulary vs sequence length",taskId:"compare-tokenizer-tradeoffs"},
  {id:"choose-family",title:"Choose a tokenizer design",taskId:"choose-tokenizer-family"},
  {id:"explain-families",title:"Explain it back",taskId:"explain-tokenizer-families"},
] as const;

export default function TokenizerFamiliesPage(){return <LessonShell lessonId="tokenizer-families" lessonTitle="BPE, WordPiece & SentencePiece" sections={sections}>{progress=><TokenizerFamiliesLesson progress={progress}/>}</LessonShell>}
