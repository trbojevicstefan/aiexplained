"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { VectorPlot2D } from "@/components/interactive/vector-plot-2d";
import { cosine, defs, dot, euclidean, points, queryVectors, quiz, tokenId, vector8 } from "./embedding-data";
import styles from "./embeddings-vectors.module.css";

type Props={progress:LessonProgressApi};
const lookupTokens=["cat","dog","car","banana"];
const multimodal=[...points,{id:"dog-photo",label:"🐕 photo",x:.73,y:.66,group:"pet"},{id:"car-photo",label:"🚗 photo",x:-.67,y:.24,group:"vehicle"}];

export function EmbeddingsVectorsLesson({progress}:Props){
  const [lookup,setLookup]=useState("cat");
  const [showVector,setShowVector]=useState(false);
  const [dimsSeen,setDimsSeen]=useState(2);
  const [active,setActive]=useState("cat");
  const [metricScale,setMetricScale]=useState(1);
  const [queries,setQueries]=useState<string[]>([]);
  const [query,setQuery]=useState("pet");
  const [multiSeen,setMultiSeen]=useState<string[]>([]);
  const [clusterSeen,setClusterSeen]=useState<string[]>([]);
  const [annMode,setAnnMode]=useState<"exact"|"ann">("exact");
  const [annSeen,setAnnSeen]=useState<string[]>([]);
  const [explanation,setExplanation]=useState("");
  const [feedback,setFeedback]=useState("");
  const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
  const [quizFeedback,setQuizFeedback]=useState("");

  const embedding=vector8(lookup);
  const selected=points.find(p=>p.id===active)??points[0];
  const petQuery=queryVectors.pet;
  const sim=cosine([selected.x,selected.y],petQuery);
  const a=[.8,.4],b=[.3,.9],scaledB=b.map(x=>x*metricScale);
  const ranked=[...points].sort((p1,p2)=>cosine([p2.x,p2.y],queryVectors[query])-cosine([p1.x,p1.y],queryVectors[query]));
  const tasks=defs.filter(([,t])=>progress.completedTasks[t]).length;
  const rooms=defs.filter(([id])=>progress.visitedSections.has(id)).length;
  const unlocked=tasks===9&&rooms===9;
  const copy={simple:"A token ID is just an index. The model looks up that index in an embedding table and gets a vector — a list of numbers that can place similar things near each other.",real:"Embeddings are learned vector representations. Similarity metrics compare vectors, enabling semantic search, clustering and multimodal retrieval. Token IDs are discrete addresses; embeddings are continuous coordinates.",expert:"An embedding layer maps categorical IDs into a learned dense space. Geometry is task/model-dependent; cosine, dot product and Euclidean distance impose different retrieval behavior. Large-scale retrieval commonly uses ANN indexes to trade exact recall for latency and memory efficiency."} as const;

  const runQuery=(q:string)=>{setQuery(q);const next=queries.includes(q)?queries:[...queries,q];setQueries(next);if(next.length===3)progress.completeTask("run-semantic-search");};
  const inspectMulti=(id:string)=>{const next=multiSeen.includes(id)?multiSeen:[...multiSeen,id];setMultiSeen(next);if(next.includes("dog")&&next.includes("dog-photo"))progress.completeTask("inspect-multimodal-space");};
  const inspectCluster=(g:string)=>{const next=clusterSeen.includes(g)?clusterSeen:[...clusterSeen,g];setClusterSeen(next);if(next.length===3)progress.completeTask("inspect-vector-clusters");};
  const inspectAnn=(mode:"exact"|"ann")=>{setAnnMode(mode);const next=annSeen.includes(mode)?annSeen:[...annSeen,mode];setAnnSeen(next);if(next.length===2)progress.completeTask("compare-ann-search");};
  const explain=()=>{const t=explanation.toLowerCase();const hits=["id","vector","embedding","dimension","cosine","similar","semantic","nearest","ann"].filter(k=>t.includes(k));if(explanation.trim().length<110||hits.length<5){setFeedback("Explain the lookup from token ID to vector, what vector dimensions are, how similarity powers retrieval, and why ANN may be used at scale.");return;}setFeedback("Strong. You separated discrete vocabulary IDs from continuous learned geometry and retrieval metrics.");progress.completeTask("explain-embeddings");};
  const submitQuiz=()=>{const score=quiz.reduce((s,q,i)=>s+(quizAnswers[i]===q.c?1:0),0);const passed=score>=6;progress.saveQuiz(score,passed);setQuizFeedback(passed?`Passed ${score}/7.`:`${score}/7. Need 6/7.`);};

  return <main className={styles.root}>
    <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 3 · EMBEDDING SPACE LAB</span><h1>Turn discrete symbols into geometry.</h1><p>{copy[progress.depth]}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.orb}><b>8-D EMBEDDING PREVIEW</b><div className={styles.vectorBars}>{vector8("meaning").map((v,i)=><i key={i} style={{height:`${35+Math.abs(v)*100}px`,background:v>=0?"#83c9ff":"#ff9fc3"}}/>)}</div><p>{tasks}/9 vector experiments complete</p></div></section>

    <LessonSection id="lookup" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-embedding-lookup"]}>01 · EMBEDDING LOOKUP</TaskStamp><h2>ID in. Vector out.</h2><p>The tokenizer gives a vocabulary ID. An embedding table uses that discrete index to retrieve a learned vector.</p><div className={styles.controls}>{lookupTokens.map(t=><button key={t} className={`${styles.choice} ${lookup===t?styles.active:""}`} onClick={()=>{setLookup(t);setShowVector(false)}}>{t}</button>)}<button className={styles.button} onClick={()=>{setShowVector(true);progress.completeTask("inspect-embedding-lookup");}}>Lookup embedding</button></div><div className={styles.lookup}><div>token<br/><b>{lookup}</b></div><div>ID<br/><b>{tokenId(lookup)}</b></div><div>{showVector?`[ ${embedding.map(x=>x.toFixed(2)).join(", ")} ]`:"embedding table → ?"}</div></div></LessonSection>

    <LessonSection id="dimensions" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-vector-dimensions"]}>02 · DIMENSIONS</TaskStamp><h2>Open the coordinate axes.</h2><p>Real embedding vectors may have hundreds or thousands of dimensions. Here we expose eight. Individual dimensions are learned coordinates, not guaranteed human-readable concepts.</p><div className={styles.controls}><button className={styles.button} onClick={()=>{setDimsSeen(8);progress.completeTask("inspect-vector-dimensions");}}>Reveal all 8 dimensions</button></div><div className={styles.dims}>{embedding.slice(0,dimsSeen).map((v,i)=><div className={styles.dim} key={i}><small>d{i+1}</small><br/><b>{v.toFixed(3)}</b></div>)}</div></LessonSection>

    <LessonSection id="similarity" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["measure-cosine-similarity"]}>03 · COSINE SIMILARITY</TaskStamp><h2>Measure direction, not token ID distance.</h2><p>Select a point and compare its 2-D teaching vector with the “pet” query direction.</p><VectorPlot2D points={points} activeId={active} onSelect={id=>{setActive(id);progress.completeTask("measure-cosine-similarity")}}/><div className={styles.stats}><div className={styles.stat}><span>Selected</span><b>{selected.label}</b></div><div className={styles.stat}><span>Cosine to “pet”</span><b>{sim.toFixed(3)}</b></div><div className={styles.stat}><span>Group</span><b>{selected.group}</b></div></div></LessonSection>

    <LessonSection id="metrics" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-vector-metrics"]}>04 · THREE METRICS</TaskStamp><h2>Scale vector B and watch the metrics disagree.</h2><div className={styles.controls}><label className={styles.choice}>Scale B <input type="range" min=".3" max="3" step=".1" value={metricScale} onChange={e=>setMetricScale(+e.target.value)}/> {metricScale.toFixed(1)}×</label><button className={styles.button} onClick={()=>{if(metricScale>=2)progress.completeTask("compare-vector-metrics");}}>Compare metrics</button></div><div className={styles.stats}><div className={styles.stat}><span>Cosine</span><b>{cosine(a,scaledB).toFixed(3)}</b></div><div className={styles.stat}><span>Dot</span><b>{dot(a,scaledB).toFixed(3)}</b></div><div className={styles.stat}><span>Euclidean</span><b>{euclidean(a,scaledB).toFixed(3)}</b></div></div><p>Positive scaling preserves direction, so cosine stays stable; dot product and Euclidean distance respond to magnitude.</p></LessonSection>

    <LessonSection id="text-search" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["run-semantic-search"]}>05 · SEMANTIC SEARCH</TaskStamp><h2>Retrieve by meaning-space neighborhood.</h2><div className={styles.controls}>{Object.keys(queryVectors).map(q=><button className={`${styles.choice} ${query===q?styles.active:""}`} key={q} onClick={()=>runQuery(q)}>{q}</button>)}</div><div className={styles.results}>{ranked.slice(0,5).map(p=><div className={styles.result} key={p.id}><span>{p.label}</span><b>{cosine([p.x,p.y],queryVectors[query]).toFixed(3)}</b></div>)}</div><p>Queries explored: {queries.length}/3</p></LessonSection>

    <LessonSection id="multimodal" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-multimodal-space"]}>06 · MULTIMODAL EMBEDDINGS</TaskStamp><h2>Put text and images in a compatible space.</h2><p>In a multimodal model, an image encoder and text encoder can be trained so related concepts land near each other.</p><VectorPlot2D points={multimodal} activeId={multiSeen.at(-1)} onSelect={inspectMulti}/><p>Click both <b>dog</b> and <b>🐕 photo</b>. Inspected: {multiSeen.join(", ")||"none"}</p></LessonSection>

    <LessonSection id="clusters" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-vector-clusters"]}>07 · CLUSTERS</TaskStamp><h2>Neighborhoods can reveal structure without class labels on the plot.</h2><div className={styles.clusters}>{["pet","vehicle","fruit"].map(g=><button className={styles.cluster} key={g} onClick={()=>inspectCluster(g)}><h3>{g}</h3><p>{points.filter(p=>p.group===g).map(p=>p.label).join(" · ")}</p></button>)}</div><p>Clusters inspected: {clusterSeen.length}/3</p></LessonSection>

    <LessonSection id="ann" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-ann-search"]}>08 · ANN INTUITION</TaskStamp><h2>Search fewer candidates when the collection gets huge.</h2><p>Exact nearest-neighbor search checks everything. ANN indexes narrow the candidate set using an index structure, trading some recall for speed.</p><div className={styles.controls}><button className={`${styles.choice} ${annMode==="exact"?styles.active:""}`} onClick={()=>inspectAnn("exact")}>Exact search</button><button className={`${styles.choice} ${annMode==="ann"?styles.active:""}`} onClick={()=>inspectAnn("ann")}>ANN search</button></div><div className={styles.stats}><div className={styles.stat}><span>Candidates checked</span><b>{annMode==="exact"?1000000:320}</b></div><div className={styles.stat}><span>Recall proxy</span><b>{annMode==="exact"?"100%":"~96%"}</b></div><div className={styles.stat}><span>Latency proxy</span><b>{annMode==="exact"?"high":"low"}</b></div></div></LessonSection>

    <LessonSection id="explain-embeddings" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><TaskStamp done={!!progress.completedTasks["explain-embeddings"]}>09 · EXPLAIN IT BACK</TaskStamp><h2>How do IDs become semantic search?</h2><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="A token ID indexes an embedding table..."/><button className={styles.button} onClick={explain}>Check explanation</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</LessonSection>

    <section className={styles.quiz}><h2>Embedding Check</h2>{!unlocked?<div className={styles.locked}>Locked: {tasks}/9 tasks · {rooms}/9 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q.q}><strong>{i+1}. {q.q}</strong>{q.o.map((o,j)=><button key={o} className={quizAnswers[i]===j?styles.selected:""} onClick={()=>setQuizAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div>)}<button className={styles.button} onClick={submitQuiz}>Submit quiz</button>{quizFeedback&&<div className={styles.feedback}>{quizFeedback}</div>}</>}<div className={styles.footer}><Link href="/lessons/tokens-tokenization">← Tokens & tokenization</Link><Link href="/">Course map →</Link></div></section>
  </main>;
}
