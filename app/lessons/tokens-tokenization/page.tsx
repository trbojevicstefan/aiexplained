"use client";

import { LessonShell } from "@/components/course/lesson-shell";
import { TokensTokenizationLesson } from "@/components/lessons/tokens-tokenization/tokens-tokenization-lesson";

const sections=[
  {id:"split-text",title:"Break text into tokens",taskId:"split-text-into-tokens"},
  {id:"strategy",title:"Compare token units",taskId:"compare-token-units"},
  {id:"vocab-ids",title:"Map tokens to vocabulary IDs",taskId:"inspect-token-ids"},
  {id:"special-tokens",title:"Add BOS and EOS",taskId:"inspect-special-tokens"},
  {id:"bpe-lab",title:"Build a BPE merge",taskId:"run-bpe-merges"},
  {id:"different-tokenizers",title:"Same text, different tokenizer",taskId:"compare-tokenizers"},
  {id:"context-limit",title:"Hit a token limit",taskId:"hit-token-limit"},
  {id:"token-myths",title:"Tokens are not words",taskId:"destroy-token-myths"},
  {id:"explain-tokenization",title:"Explain it back",taskId:"explain-tokenization"},
] as const;

export default function TokensTokenizationPage(){return <LessonShell lessonId="tokens-tokenization" lessonTitle="Tokens & tokenization" sections={sections}>{progress=><TokensTokenizationLesson progress={progress}/>}</LessonShell>}
