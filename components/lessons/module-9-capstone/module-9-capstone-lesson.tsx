"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../retrieval-ranking-lab/retrieval-ranking-lab.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["RAG failures can come from…",["Ingestion, chunking, retrieval, ranking, context assembly or generation","Only the LLM","Only the vector DB vendor","Only prompts"],0],
["A tenant filter is especially important because…",["Similarity alone can retrieve semantically similar data from the wrong tenant","It trains embeddings","It increases context length","It changes model weights"],0],
["Hybrid search helps when…",["Both exact identifiers/terms and semantic paraphrases matter","Only exact strings matter","No index exists","You want to fine-tune"],0],
["Reranking is usually applied…",["After cheaper initial retrieval on a smaller candidate set","Before documents are ingested","To every web page on the internet necessarily","Instead of embeddings always"],0],
["A similarity threshold that is too high can…",["Reduce recall and miss needed evidence","Always improve answers","Increase parameter count","Train the model"],0],
["A similarity threshold that is too low can…",["Admit irrelevant evidence and reduce precision","Guarantee recall without side effects","Change tokenizer vocabulary","Disable citations"],0],
["Grounded generation means…",["The answer is supported by retrieved evidence used in context","The model never uses context","The answer is always short","The model is fine-tuned"],0],
["Citations are most useful when…",["They point to sources that actually support the claim","They are invented to look trustworthy","They replace retrieval","They hide source metadata"],0],
["Embedding-model migration should…",["Version/re-embed/reindex and evaluate before cutover","Mix arbitrary old/new vectors","Only rename the index","Skip testing"],0],
["Precision and recall should be evaluated…",["On labeled/relevant retrieval examples representative of the task","Only on one query","Only after model training","Only by token count"],0],
["HyDE hypothetical text should be treated as…",["A retrieval aid, not authoritative evidence","Ground truth","A system message","A model checkpoint"],0],
["Best RAG debugging practice is…",["Inspect each stage separately before blaming the model","Increase temperature first","Swap vendors randomly","Add all documents to context"],0],
] as const;

export function Module9CapstoneLesson({progress}:Props){
 const [chunk,setChunk]=useState("bad"),[scope,setScope]=useState<string[]>([]),[hybrid,setHybrid]=useState(100),[rewrite,setRewrite]=useState(""),[rerank,setRerank]=useState(false),[threshold,setThreshold]=useState(.55),[ground,setGround]=useState(""),[migration,setMigration]=useState<string[]>([]),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m9-chunk","m9-scope","m9-hybrid","m9-rewrite","m9-rerank","m9-threshold","m9-grounding","m9-migration"],sections=["chunk","scope","hybrid","rewrite","rerank","threshold","grounding","migration"];
 const done=tasks.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===8&&read===8;
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const markScope=(x:string)=>{const next=[...new Set([...scope,x])];setScope(next);if(next.includes("tenant")&&next.includes("version"))progress.completeTask("m9-scope")};
 const markMigration=(x:string)=>{const next=[...new Set([...migration,x])];setMigration(next);if(next.length===4)progress.completeTask("m9-migration")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 9 · RAG BOSS LAB</span><h1>The answer is wrong. Do not blame the LLM yet.</h1><p>Hotel Linden asks: “When do quiet hours start?” The pipeline returns Orion, an old v1 policy and a spa rule. Debug every retrieval stage until only defensible evidence reaches the model.</p><TaskStamp done={done===8}>{done}/8 RAG incident fixes complete</TaskStamp></div><div className={styles.stage}><AiMascot variant="mail" accent="#ff8d78" mood={done<3?"excited":"thinking"} size={102} label="BROKEN"/><AiMascot variant="tile" accent="#8de574" mood={done>4?"happy":"thinking"} size={102} label="INDEX"/><AiMascot variant="star" accent="#ffe05b" mood={done===8?"excited":"happy"} size={102} label="FIXED"/></div></section>

  <LessonSection id="chunk" onVisit={progress.markVisited} className={styles.scene}><h2>1. The decisive sentence is split across chunks.</h2>{[["bad","chunk A: Quiet hours begin at\nchunk B: 22:00 and end at 07:00"],["good","chunk: Quiet hours begin at 22:00 and end at 07:00"]].map(([id,text])=><button key={id} className={`${styles.choice} ${chunk===id?(id==="good"?styles.correct:styles.wrong):""}`} onClick={()=>{setChunk(id);if(id==="good")progress.completeTask("m9-chunk")}}>{text}</button>)}</LessonSection>

  <LessonSection id="scope" onVisit={progress.markVisited} className={styles.scene}><h2>2. Similarity retrieved another hotel's policy.</h2><p>Add both scope controls before ranking.</p><div className={styles.grid2}><button className={`${styles.panel} ${scope.includes("tenant")?styles.correct:""}`} onClick={()=>markScope("tenant")}><b>tenant = Hotel Linden</b><p>Do not let Orion compete at all.</p></button><button className={`${styles.panel} ${scope.includes("version")?styles.correct:""}`} onClick={()=>markScope("version")}><b>version = latest / v3</b><p>Exclude superseded policy v1.</p></button></div></LessonSection>

  <LessonSection id="hybrid" onVisit={progress.markVisited} className={styles.scene}><h2>3. Pure semantic retrieval keeps overvaluing “quiet spa.”</h2><div className={styles.control}><label>Semantic weight <b>{hybrid}%</b></label><input type="range" min="0" max="100" value={hybrid} onChange={e=>{setHybrid(+e.target.value);if(+e.target.value>=35&&+e.target.value<=70)progress.completeTask("m9-hybrid")}}/></div><p className={styles.feedback}>Blend exact policy terms/identifiers with semantic similarity instead of forcing one signal to solve every retrieval problem.</p></LessonSection>

  <LessonSection id="rewrite" onVisit={progress.markVisited} className={styles.scene}><h2>4. User query is vague: “when must guests keep it down?”</h2>{[
   ["hotel linden guest policy quiet hours start end time",true],
   ["spa quiet",false],
   ["hotel information",false],
  ].map(([text,ok])=><button key={String(text)} className={`${styles.choice} ${rewrite===text?(ok?styles.correct:styles.wrong):""}`} onClick={()=>{setRewrite(String(text));if(ok)progress.completeTask("m9-rewrite")}}>{String(text)}</button>)}</LessonSection>

  <LessonSection id="rerank" onVisit={progress.markVisited} className={styles.scene}><h2>5. Top 6 candidates are close. Read query + doc together.</h2><button className={styles.button} onClick={()=>{setRerank(true);progress.completeTask("m9-rerank")}}>Run pairwise reranker</button><div className={`${styles.result} ${rerank?styles.correct:""}`}><div><b>#1 Linden Guest Policy v3</b><p>Quiet hours begin at 22:00 and end at 07:00.</p></div><b>{rerank?"0.98":"0.76"}</b></div><div className={styles.result}><div><b>#2 Linden Spa</b><p>Spa relaxation zone closes at 21:00.</p></div><b>{rerank?"0.31":"0.75"}</b></div></LessonSection>

  <LessonSection id="threshold" onVisit={progress.markVisited} className={styles.scene}><h2>6. Tune threshold without killing recall.</h2><div className={styles.control}><label>minimum score <b>{threshold.toFixed(2)}</b></label><input type="range" min="0.3" max="0.95" step="0.01" value={threshold} onChange={e=>{setThreshold(+e.target.value);if(+e.target.value>=.65&&+e.target.value<=.82)progress.completeTask("m9-threshold")}}/></div><div className={styles.grid2}><div className={styles.panel}><b>Too low</b><p>More irrelevant spa/old docs → poor precision.</p></div><div className={styles.panel}><b>Too high</b><p>Potentially drop a needed supporting FAQ → poor recall.</p></div></div></LessonSection>

  <LessonSection id="grounding" onVisit={progress.markVisited} className={styles.scene}><h2>7. Which final answer is grounded?</h2>{[
 ["invent","Quiet hours start at 21:00 because hotels usually choose that time. [No source]",false],
 ["cite","Quiet hours begin at 22:00 and end at 07:00. [Hotel Linden Guest Policy v3]",true],
 ["mix","Quiet hours begin at 23:00. [Hotel Orion Policy]",false],
 ].map(([id,text,ok])=><button key={String(id)} className={`${styles.choice} ${ground===id?(ok?styles.correct:styles.wrong):""}`} onClick={()=>{setGround(String(id));if(ok)progress.completeTask("m9-grounding")}}>{String(text)}</button>)}</LessonSection>

  <LessonSection id="migration" onVisit={progress.markVisited} className={styles.scene}><h2>8. Embedding v2 shipped, but half the index still contains v1 vectors.</h2><div className={styles.pipeline}>{[
   ["version","version index/embedding metadata"],["reembed","re-embed all target docs with v2"],["parallel","build/evaluate v2 index in parallel"],["cutover","switch query embedding + index atomically with rollback"],
  ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${migration.includes(id)?styles.correct:""}`} onClick={()=>markMigration(id)}>{text}</button>{i<3&&<span className={styles.arrow}>→</span>}</span>)}</div></LessonSection>

  <section className={styles.quiz}><h2>Module 9 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Fix all eight RAG failures first. {done}/8 fixes · {read}/8 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit mastery exam · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODULE 9 MASTERED — you can debug RAG layer-by-layer instead of swapping vector databases blindly.":"Pass is 10/12. Revisit scope, ranking and evals."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/vector-index-rag-evals">← Vector Index & Evals</Link><Link href="/">Learning map →</Link></div>
 </main>
}
