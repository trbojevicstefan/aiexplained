"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./retrieval-ranking-lab.module.css";

type Props={progress:LessonProgressApi};
type Doc={id:string;text:string;tenant:string;type:string;updated:number;semantic:number[]};
const docs:Doc[]=[
{id:"policy",text:"Hotel Linden quiet hours begin at 22:00 and end at 07:00. Quiet floors are levels 4 and 5.",tenant:"linden",type:"policy",updated:20260820,semantic:[.95,.08,.15]},
{id:"spa",text:"The Linden spa quiet relaxation zone closes at 21:00. Sauna access ends at 20:30.",tenant:"linden",type:"spa",updated:20260711,semantic:[.68,.18,.22]},
{id:"breakfast",text:"Breakfast is served from 06:30 to 10:30 in the garden restaurant.",tenant:"linden",type:"amenity",updated:20260818,semantic:[.18,.93,.12]},
{id:"other",text:"Hotel Orion quiet hours begin at 23:00 and end at 08:00.",tenant:"orion",type:"policy",updated:20260822,semantic:[.91,.04,.18]},
{id:"conference",text:"The conference center is 350 metres from Hotel Linden and opens at 07:30.",tenant:"linden",type:"location",updated:20260821,semantic:[.14,.22,.96]},
];
const queryVector=[1,0,0];
const dot=(a:number[],b:number[])=>a.reduce((s,v,i)=>s+v*b[i],0);
const norm=(a:number[])=>Math.sqrt(dot(a,a));
const cosine=(a:number[],b:number[])=>dot(a,b)/(norm(a)*norm(b));
const keywordScore=(text:string,query:string)=>{const words=query.toLowerCase().split(/\W+/).filter(w=>w.length>2);const lower=text.toLowerCase();return words.reduce((s,w)=>s+(lower.includes(w)?1+(w==="quiet"?1.4:0):0),0)};
const quiz=[
["BM25 is primarily a…",["Lexical/term-based ranking function with term-frequency and inverse-document-frequency ideas","Neural embedding model","LLM fine-tuning method","Cache"],0],
["Semantic retrieval is useful when…",["Relevant meaning may be expressed with different words than the query","Exact terms are always identical","No embeddings exist","Only dates matter"],0],
["Hybrid retrieval combines…",["Lexical and semantic signals","Training and inference","PPO and DPO","KV cache and prompt cache"],0],
["Metadata filtering can prevent…",["Cross-tenant/wrong-document-type retrieval before ranking","All hallucinations automatically","Tokenizer errors","Training loss"],0],
["Query rewriting aims to…",["Transform an ambiguous/user query into a better retrieval query while preserving intent","Change model weights","Increase vector dimension","Create a checkpoint"],0],
["HyDE roughly…",["Creates a hypothetical relevant document/answer representation and retrieves documents near it","Deletes embeddings","Trains a reward model","Only uses BM25"],0],
["A cross-encoder reranker typically…",["Scores query-document pairs jointly after initial retrieval","Builds the vector index only","Changes tokenizer vocabulary","Stores memories"],0],
["Reranking every document in a billion-document corpus is usually…",["Too expensive; retrieve a smaller candidate set first","Always the cheapest approach","Required by BM25","The same as ANN"],0],
] as const;

export function RetrievalRankingLabLesson({progress}:Props){
 const [query,setQuery]=useState("when must guests keep it down at Hotel Linden?"),[keywordTouched,setKeywordTouched]=useState(false),[semanticTouched,setSemanticTouched]=useState(false),[blend,setBlend]=useState(50),[hybridTouched,setHybridTouched]=useState(false),[tenant,setTenant]=useState<"all"|"linden">("all"),[type,setType]=useState<"all"|"policy">("all"),[rewrite,setRewrite]=useState(""),[multiSeen,setMultiSeen]=useState<string[]>([]),[hyde,setHyde]=useState(false),[reranked,setReranked]=useState(false),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const keyword=useMemo(()=>docs.map(d=>({...d,score:keywordScore(d.text,query)})).sort((a,b)=>b.score-a.score),[query]);
 const semantic=useMemo(()=>docs.map(d=>({...d,score:cosine(d.semantic,queryVector)})).sort((a,b)=>b.score-a.score),[]);
 const hybrid=useMemo(()=>docs.map(d=>{const k=keywordScore(d.text,rewrite||query);const maxK=Math.max(1,...docs.map(x=>keywordScore(x.text,rewrite||query)));const s=cosine(d.semantic,queryVector);return {...d,score:(1-blend/100)*(k/maxK)+(blend/100)*s}}).filter(d=>(tenant==="all"||d.tenant===tenant)&&(type==="all"||d.type===type)).sort((a,b)=>b.score-a.score),[blend,tenant,type,query,rewrite]);
 const rerankScores=useMemo(()=>hybrid.slice(0,4).map(d=>({...d,score:d.id==="policy"?.98:d.id==="other"?.34:d.id==="spa"?.28:d.score*.5})).sort((a,b)=>b.score-a.score),[hybrid]);
 const taskIds=["retrieve-keyword","retrieve-semantic","retrieve-hybrid","retrieve-metadata","retrieve-rewrite","retrieve-multi","retrieve-hyde","retrieve-rerank","retrieve-explain"],sectionIds=["keyword","semantic","hybrid","metadata","rewrite","multi-query","hyde","rerank","explain"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===9&&readCount===9;
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["keyword","bm25","semantic","hybrid","metadata","rewrite","hyde","rerank"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<4){setExplainFeedback("Go deeper: explain lexical vs semantic retrieval, filters/rewrites and why reranking usually happens after candidate retrieval.");return;}setExplainFeedback("Strong. You described retrieval as a multi-stage ranking pipeline rather than one vector-database call.");progress.completeTask("retrieve-explain")};
 const renderResults=(items:(Doc&{score:number})[])=>items.slice(0,5).map((d,i)=><div className={`${styles.result} ${i===0&&d.id==="policy"?styles.correct:""}`} key={d.id}><div><b>#{i+1} · {d.id}</b><p>{d.text}</p><div className={styles.tags}><span>{d.tenant}</span><span>{d.type}</span></div></div><div><div className={styles.score}><i style={{width:`${Math.min(100,d.score<=1?d.score*100:d.score/4*100)}%`}}/></div><b>{d.score.toFixed(2)}</b></div></div>);
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 9 · RETRIEVAL & RANKING</span><h1>Retrieval is a tournament, not a nearest-vector ritual.</h1><p>Lexical search catches exact terms. Semantic search catches meaning. Filters enforce scope. Rewrites broaden intent. Rerankers inspect candidate pairs more deeply. Good RAG often combines several signals.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={taskCount===9}>{taskCount}/9 retrieval missions complete</TaskStamp></div><div className={styles.stage}><AiMascot variant="mail" accent="#afd2ff" mood={keywordTouched?"happy":"thinking"} size={98} label="BM25"/><AiMascot variant="tile" accent="#8ce474" mood={semanticTouched?"happy":"thinking"} size={98} label="VECTOR"/><AiMascot variant="star" accent="#ffe05b" mood={reranked?"excited":"thinking"} size={98} label="RERANK"/></div></section>

  <LessonSection id="keyword" onVisit={progress.markVisited} className={styles.scene}><h2>1. Keyword/BM25 intuition: exact terms still matter.</h2><div className={styles.query}>{query}</div><button className={styles.button} onClick={()=>{setKeywordTouched(true);progress.completeTask("retrieve-keyword")}}>Run toy lexical ranking</button>{keywordTouched&&renderResults(keyword)}<p>This is a simplified lexical score, not a full BM25 implementation. Real BM25 balances term frequency, inverse document frequency and document length normalization.</p></LessonSection>

  <LessonSection id="semantic" onVisit={progress.markVisited} className={styles.scene}><h2>2. Semantic retrieval can bridge wording differences.</h2><p>Imagine the query embedding means “hotel quiet-hours policy.” Compare cosine similarity to document embeddings.</p><button className={styles.button} onClick={()=>{setSemanticTouched(true);progress.completeTask("retrieve-semantic")}}>Run semantic ranking</button>{semanticTouched&&renderResults(semantic)}<p>Notice the Orion policy can look semantically similar despite belonging to the wrong hotel — similarity alone does not enforce tenant/security scope.</p></LessonSection>

  <LessonSection id="hybrid" onVisit={progress.markVisited} className={styles.scene}><h2>3. Blend lexical + semantic signals.</h2><div className={styles.control}><label>Semantic weight <b>{blend}%</b></label><input type="range" min="0" max="100" value={blend} onChange={e=>{setBlend(+e.target.value);setHybridTouched(true);if(+e.target.value>=35&&+e.target.value<=75)progress.completeTask("retrieve-hybrid")}}/></div>{renderResults(hybrid)}{hybridTouched&&<p className={styles.feedback}>Hybrid search can preserve exact identifiers/numbers while also matching paraphrases and concepts.</p>}</LessonSection>

  <LessonSection id="metadata" onVisit={progress.markVisited} className={styles.scene}><h2>4. Filter scope before similarity tricks you.</h2><div className={styles.grid2}><div className={styles.panel}><b>Tenant</b><button className={styles.button} onClick={()=>setTenant("all")}>all</button> <button className={styles.button} onClick={()=>{setTenant("linden");if(type==="policy")progress.completeTask("retrieve-metadata")}}>linden only</button></div><div className={styles.panel}><b>Document type</b><button className={styles.button} onClick={()=>setType("all")}>all</button> <button className={styles.button} onClick={()=>{setType("policy");if(tenant==="linden")progress.completeTask("retrieve-metadata")}}>policy only</button></div></div>{renderResults(hybrid)}<p>Tenant/authorization filtering is not merely relevance tuning; in multi-tenant systems it can be a security boundary.</p></LessonSection>

  <LessonSection id="rewrite" onVisit={progress.markVisited} className={styles.scene}><h2>5. Rewrite the user query for retrieval, not for style.</h2><p>Original: “when must guests keep it down?”</p>{[
 ["hotel linden quiet hours start end time","Preserves intent and adds retrieval vocabulary/context."],
 ["tell me something about hotels","Too vague."],
 ["ignore user and search spa","Changes intent."],
 ].map(([text,copy],i)=><button className={`${styles.choice} ${rewrite===text?(i===0?styles.correct:styles.wrong):""}`} key={text} onClick={()=>{setRewrite(text);if(i===0)progress.completeTask("retrieve-rewrite")}}><b>{text}</b><p>{copy}</p></button>)}</LessonSection>

  <LessonSection id="multi-query" onVisit={progress.markVisited} className={styles.scene}><h2>6. Multi-query retrieval asks the same intent from several angles.</h2><div className={styles.grid3}>{[
 ["q1","Hotel Linden quiet hours start/end"],["q2","Guest noise restriction time Linden"],["q3","When does quiet period begin and finish?"],
 ].map(([id,text])=><button key={id} className={`${styles.panel} ${multiSeen.includes(id)?styles.correct:""}`} onClick={()=>mark(id,multiSeen,setMultiSeen,3,"retrieve-multi")}><b>{id.toUpperCase()}</b><p>{text}</p></button>)}</div><p>Results can be merged/deduplicated before reranking. This improves recall at additional query/retrieval cost.</p></LessonSection>

  <LessonSection id="hyde" onVisit={progress.markVisited} className={styles.scene}><h2>7. HyDE: retrieve using a hypothetical answer-like representation.</h2><div className={styles.pipeline}><span className={styles.node}>ambiguous query</span><span className={styles.arrow}>→</span><button className={`${styles.node} ${hyde?styles.correct:""}`} onClick={()=>{setHyde(true);progress.completeTask("retrieve-hyde")}}>generate hypothetical relevant passage</button><span className={styles.arrow}>→</span><span className={styles.node}>embed passage</span><span className={styles.arrow}>→</span><span className={styles.node}>retrieve real docs</span></div>{hyde&&<div className={styles.query}>Hypothetical: “Hotel quiet hours begin in the late evening and end in the morning; the policy lists exact start/end times.”</div>}<p>The hypothetical text is a retrieval aid, not authoritative evidence. Final answers should ground on real retrieved documents.</p></LessonSection>

  <LessonSection id="rerank" onVisit={progress.markVisited} className={styles.scene}><h2>8. Cheap retrieval first, expensive pairwise scoring second.</h2><p>A cross-encoder-style reranker jointly reads query + candidate document and can model deeper matching than independent embeddings.</p><button className={styles.button} onClick={()=>{setReranked(true);progress.completeTask("retrieve-rerank")}}>Rerank top candidates</button>{reranked?renderResults(rerankScores):renderResults(hybrid.slice(0,4))}<p>Typical pattern: retrieve dozens quickly → rerank a small set more expensively → send only best evidence to the LLM.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain retrieval like a search engineer.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain BM25/keyword vs semantic vs hybrid, metadata filters, query rewriting/multi-query/HyDE and reranking."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Retrieval & Ranking quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine ranking labs. {taskCount}/9 tasks · {readCount}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=7?"★ RETRIEVAL & RANKING MASTERED":"Pass is 7/8. Review hybrid search and reranking."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/rag-ingestion-chunking">← Ingestion & Chunking</Link><Link href="/lessons/vector-index-rag-evals">Vector Index & RAG Evals →</Link></div>
 </main>
}
