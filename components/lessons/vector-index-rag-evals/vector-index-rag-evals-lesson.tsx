"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../retrieval-ranking-lab/retrieval-ranking-lab.module.css";

type Props={progress:LessonProgressApi};
const scored=[
{id:"p1",name:"Linden quiet-hours policy",score:.92,relevant:true},
{id:"p2",name:"Linden guest-noise FAQ",score:.81,relevant:true},
{id:"p3",name:"Linden spa silence zone",score:.72,relevant:false},
{id:"p4",name:"Orion quiet-hours policy",score:.69,relevant:false},
{id:"p5",name:"Linden old policy v1",score:.62,relevant:true},
{id:"p6",name:"Breakfast hours",score:.35,relevant:false},
];
const quiz=[
["A vector database/index primarily helps…",["Store/search vectors and associated metadata efficiently","Train LLM weights automatically","Create prompt roles","Replace embeddings"],0],
["ANN means…",["Approximate nearest-neighbor search trades some exactness for speed/scale","All-neural-network training","Automatic new knowledge","Agent neural navigation"],0],
["HNSW intuition is closest to…",["Navigating a multi-layer proximity graph toward closer neighbors","Sorting rows by date only","Training a tokenizer","Running PPO"],0],
["IVF intuition is closest to…",["Partition vectors into coarse clusters, then probe selected clusters","Store every vector in one linked list","Only rerank text","Fine-tune embeddings"],0],
["Raising a similarity threshold usually…",["Retrieves fewer results, often improving precision but risking recall","Always improves both precision and recall","Changes model weights","Increases context window"],0],
["Retrieval precision measures…",["How many retrieved items are relevant","How many total relevant items were found","How truthful the LLM is","GPU utilization"],0],
["Retrieval recall measures…",["How many of the relevant items were retrieved","How many retrieved items were relevant","Token throughput","Model parameters"],0],
["Changing embedding models often requires…",["Re-embedding documents/queries into the new representation space and rebuilding/migrating the index","Only changing the UI color","Keeping old vectors and assuming perfect compatibility","No evaluation"],0],
] as const;

export function VectorIndexRagEvalsLesson({progress}:Props){
 const [dbs,setDbs]=useState<string[]>([]),[ann,setAnn]=useState<"exact"|"ann">("exact"),[annSeen,setAnnSeen]=useState<string[]>([]),[hnsw,setHnsw]=useState<string[]>([]),[probes,setProbes]=useState(1),[ivfTouched,setIvfTouched]=useState(false),[threshold,setThreshold]=useState(.6),[thresholdTouched,setThresholdTouched]=useState(false),[evalSeen,setEvalSeen]=useState<string[]>([]),[ragChecks,setRagChecks]=useState<string[]>([]),[migration,setMigration]=useState<string[]>([]),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const retrieved=useMemo(()=>scored.filter(x=>x.score>=threshold),[threshold]);
 const tp=retrieved.filter(x=>x.relevant).length, precision=retrieved.length?tp/retrieved.length:1, recall=tp/scored.filter(x=>x.relevant).length;
 const taskIds=["index-vector-db","index-ann","index-hnsw","index-ivf","index-threshold","index-precision-recall","index-rag-evals","index-migration","index-explain"],sectionIds=["vector-db","ann","hnsw","ivf","threshold","precision-recall","rag-evals","migration","explain"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===9&&readCount===9;
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["vector","ann","hnsw","ivf","precision","recall","threshold","embedding"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<4){setExplainFeedback("Go deeper: explain ANN, at least one index structure, precision/recall and why changing embedding space requires migration/evaluation.");return;}setExplainFeedback("Strong. You separated the vector store product, the ANN index and the RAG evaluation layer.");progress.completeTask("index-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 9 · VECTOR INDEX & EVALS</span><h1>A vector database is not the intelligence. It is the retrieval engine room.</h1><p>Indexes make similarity search scalable. Thresholds and ANN settings trade recall against speed. Evals tell you whether the right evidence was retrieved — and whether the final answer actually used it faithfully.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={taskCount===9}>{taskCount}/9 index missions complete</TaskStamp></div><div className={styles.stage}><AiMascot variant="tile" accent="#8de574" mood={hnsw.length>=4?"excited":"thinking"} size={100} label="HNSW"/><AiMascot variant="briefcase" accent="#6ed8d1" mood={ivfTouched?"happy":"thinking"} size={100} label="IVF"/><AiMascot variant="star" accent="#ffe05b" mood={ragChecks.length>=3?"excited":"happy"} size={100} label="EVAL"/></div></section>

  <LessonSection id="vector-db" onVisit={progress.markVisited} className={styles.scene}><h2>1. Product names sit above common primitives.</h2><p>Examples you may encounter: pgvector/Postgres, Pinecone, Qdrant, Weaviate, Milvus, Chroma. They differ in architecture/features/operations, but the mental model stays: <b>vector + metadata + index + query/filter API</b>.</p><div className={styles.grid3}>{["vector storage","metadata/filtering","nearest-neighbor index","CRUD/update lifecycle","tenant/security scope","query API"].map(item=><button className={`${styles.panel} ${dbs.includes(item)?styles.correct:""}`} key={item} onClick={()=>mark(item,dbs,setDbs,6,"index-vector-db")}><b>{item}</b></button>)}</div></LessonSection>

  <LessonSection id="ann" onVisit={progress.markVisited} className={styles.scene}><h2>2. Exact nearest neighbor vs ANN</h2><div className={styles.grid2}>{(["exact","ann"] as const).map(mode=><button key={mode} className={`${styles.panel} ${ann===mode?styles.correct:""}`} onClick={()=>{setAnn(mode);mark(mode,annSeen,setAnnSeen,2,"index-ann")}}><b>{mode==="exact"?"EXACT SCAN":"APPROXIMATE NN"}</b><p>{mode==="exact"?"Compare the query against every candidate: maximum exactness, cost grows with corpus size.":"Use an index/search strategy to visit a small useful subset: much faster at scale, possible recall loss."}</p></button>)}</div></LessonSection>

  <LessonSection id="hnsw" onVisit={progress.markVisited} className={styles.scene}><h2>3. HNSW intuition: navigate a proximity graph.</h2><p>Start from an entry point, move to neighbors that look closer, descend through layers, refine locally.</p><div className={styles.pipeline}>{[
   ["entry","far entry"],["coarse","coarse neighbor"],["near","near region"],["target","nearest policy"],
  ].map(([id,title],i)=><span key={id}><button className={`${styles.node} ${hnsw.includes(id)?styles.correct:""}`} onClick={()=>mark(id,hnsw,setHnsw,4,"index-hnsw")}>{title}</button>{i<3&&<span className={styles.arrow}>→</span>}</span>)}</div><p>HNSW exposes tuning trade-offs around graph construction/memory and search breadth. This is a conceptual walk, not an implementation trace.</p></LessonSection>

  <LessonSection id="ivf" onVisit={progress.markVisited} className={styles.scene}><h2>4. IVF intuition: search only promising coarse clusters.</h2><div className={styles.control}><label>Clusters probed <b>{probes}/8</b></label><input type="range" min="1" max="8" value={probes} onChange={e=>{setProbes(+e.target.value);setIvfTouched(true);if(+e.target.value>=3&&+e.target.value<=6)progress.completeTask("index-ivf")}}/></div><div className={styles.grid3}><div className={styles.panel}><b>Toy recall opportunity</b><p>{Math.min(100,45+probes*8)}%</p></div><div className={styles.panel}><b>Vectors scanned</b><p>~{Math.round(probes/8*100)}%</p></div><div className={styles.panel}><b>Idea</b><p>coarse quantizer → candidate lists → local search</p></div></div></LessonSection>

  <LessonSection id="threshold" onVisit={progress.markVisited} className={styles.scene}><h2>5. Similarity threshold changes what enters the candidate set.</h2><div className={styles.control}><label>Minimum similarity <b>{threshold.toFixed(2)}</b></label><input type="range" min="0.3" max="0.95" step="0.01" value={threshold} onChange={e=>{setThreshold(+e.target.value);setThresholdTouched(true);if(+e.target.value>=.65&&+e.target.value<=.8)progress.completeTask("index-threshold")}}/></div>{retrieved.map(d=><div className={`${styles.result} ${d.relevant?styles.correct:""}`} key={d.id}><div><b>{d.name}</b><p>{d.relevant?"relevant":"not relevant for this query"}</p></div><b>{d.score.toFixed(2)}</b></div>)}{thresholdTouched&&<p className={styles.feedback}>Retrieved {retrieved.length} · relevant found {tp}/3. Threshold is a precision/recall knob, not a universal magic number.</p>}</LessonSection>

  <LessonSection id="precision-recall" onVisit={progress.markVisited} className={styles.scene}><h2>6. Precision and recall pull in different directions.</h2><div className={styles.grid2}><button className={styles.panel} onClick={()=>mark("precision",evalSeen,setEvalSeen,2,"index-precision-recall")}><b>PRECISION</b><p>relevant retrieved / all retrieved = {tp}/{retrieved.length||0} = {(precision*100).toFixed(0)}%</p></button><button className={styles.panel} onClick={()=>mark("recall",evalSeen,setEvalSeen,2,"index-precision-recall")}><b>RECALL</b><p>relevant retrieved / all relevant = {tp}/3 = {(recall*100).toFixed(0)}%</p></button></div><p>For RAG, missing the one decisive policy chunk can be worse than retrieving one extra mediocre chunk — but irrelevant context can also distract the generator.</p></LessonSection>

  <LessonSection id="rag-evals" onVisit={progress.markVisited} className={styles.scene}><h2>7. Evaluate retrieval separately from generation.</h2><div className={styles.grid3}>{[
   ["retrieval","Retrieval recall/precision","Did we fetch the evidence needed to answer?"],
   ["grounding","Groundedness / faithfulness","Does the answer stay supported by retrieved evidence?"],
   ["citation","Citation/source correctness","Do cited sources actually support the claim?"],
  ].map(([id,title,copy])=><button key={id} className={`${styles.panel} ${ragChecks.includes(id)?styles.correct:""}`} onClick={()=>mark(id,ragChecks,setRagChecks,3,"index-rag-evals")}><b>{title}</b><p>{copy}</p></button>)}</div><p>An end-to-end “answer looks good” score can hide whether failure came from retrieval or generation. Evaluate both layers.</p></LessonSection>

  <LessonSection id="migration" onVisit={progress.markVisited} className={styles.scene}><h2>8. Embedding migrations are schema migrations for semantic space.</h2><div className={styles.pipeline}>{[
   ["new","choose embedding model v2"],["reembed","re-embed document corpus"],["parallel","build new index alongside v1"],["query","embed queries with v2"],["cutover","evaluate + cut over / rollback"],
  ].map(([id,title],i)=><span key={id}><button className={`${styles.node} ${migration.includes(id)?styles.correct:""}`} onClick={()=>mark(id,migration,setMigration,5,"index-migration")}>{title}</button>{i<4&&<span className={styles.arrow}>→</span>}</span>)}</div><p>Vectors from unrelated embedding spaces are not safely comparable just because they have the same dimension. Version the embedding model/index.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain index + evals back.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain vector DB vs ANN index, HNSW/IVF, threshold precision/recall, RAG eval layers and embedding migration."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Vector Index & RAG Evals quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine index rooms. {taskCount}/9 tasks · {readCount}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=7?"★ VECTOR INDEX & RAG EVALS MASTERED":"Pass is 7/8. Review ANN and precision/recall."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/retrieval-ranking-lab">← Retrieval & Ranking</Link><Link href="/lessons/module-9-capstone">RAG Boss Lab →</Link></div>
 </main>
}
