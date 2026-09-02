"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { InferenceFactory, InferenceStage } from "@/components/visualizations/inference-factory";
import styles from "./inference-factory.module.css";

type Props={progress:LessonProgressApi};
const hardwareCases=[
["Large parallel matrix multiplications with high-bandwidth accelerator memory","gpu"],["General-purpose execution and possible RAM/offload path","cpu"],["Google-designed ML accelerator family","tpu"],["Very high-bandwidth memory attached close to accelerators","hbm"],
] as const;
const serverCases=[
["Accept API request, tokenize/prepare it, schedule model execution, stream result","inference-server"],["Store source code in Git","not-server"],["Manage model replicas/KV blocks/batches","inference-server"],["A model checkpoint file by itself listens on HTTP","false"],
] as const;
const loadCases=[
["Read checkpoint weights from storage","load"],["Allocate tensors/buffers on target device","load"],["Initialize runtime kernels/graphs/cache structures","load"],["Every request reloads the full checkpoint from disk","false"],
] as const;
const queueCases=[
["Request arrives faster than capacity","queue"],["Scheduler selects which requests/tokens run next","scheduler"],["Priority/deadline policy can affect order","scheduler"],["Queue growth never affects latency","false"],
] as const;
const prefillCases=[
["Process input prompt/context tokens and build initial KV state","prefill"],["Usually highly parallel over prompt tokens","prefill"],["Equivalent to emitting one new token at a time forever","false"],
] as const;
const decodeCases=[
["Generate next token using previous context + cached KV","decode"],["Append new KV state as generation proceeds","decode"],["Recompute all previous K/V projections from scratch every step in ordinary cached decode","false"],["Longer/concurrent sequences can consume more KV memory","true"],
] as const;
const batchCases=[
["Wait briefly and group compatible requests into one batch","dynamic"],["Continuously add/remove active sequences while decoding","continuous"],["Every request gets its own dedicated GPU forever","false"],["Batching can improve throughput while affecting latency trade-offs","true"],
] as const;
const metricCases=[
["Time from request arrival to first generated token","TTFT"],["Delay between generated tokens after first token","ITL"],["Generated tokens per second for one stream/model measurement","TPS"],["Total useful work completed across service per time","throughput"],["Requests completed per second","RPS"],
] as const;
const streamCases=[
["Send each text delta as it becomes available","stream"],["Wait for full 500-token answer then send once","buffered"],["Streaming improves perceived responsiveness even if total compute is similar","true"],
] as const;
const quiz=[
["An inference server primarily…",["Loads/serves a trained model and schedules incoming inference requests","Trains every model from scratch","Stores only PDFs","Creates Git commits"],0],
["HBM is valued for accelerators mainly because of…",["High memory bandwidth close to compute","OAuth support","DOM access","Vector indexing"],0],
["Model loading includes…",["Reading weights and placing/initializing them for runtime execution","Only writing prompts","Only browser login","Only citations"],0],
["A request queue grows when…",["Arrival/work demand exceeds immediate serving capacity","KV cache is empty","The model has no weights","A user logs out"],0],
["Prefill processes…",["The input prompt/context before autoregressive decode","Only the final token","Only tool results after completion","Only model licenses"],0],
["Decode is the phase where…",["New output tokens are generated step by step","Training gradients update weights","Documents are chunked","The model downloads"],0],
["KV cache helps decode by…",["Reusing previously computed attention key/value state","Caching final API bills only","Storing Git diffs","Replacing weights"],0],
["Continuous batching can…",["Keep a GPU batch populated as sequences enter/finish instead of waiting for one static batch to end","Eliminate all latency","Remove context limits","Train the tokenizer"],0],
["TTFT means…",["Time to first token","Total training FLOPs","Tensor transfer format","Tool timeout frequency"],0],
["Streaming usually improves perceived latency because…",["Users receive partial output before the entire response finishes","It changes learned weights","It eliminates model compute","It removes network transfer"],0],
["GPU utilization near 100% always means user latency is optimal.",["True","False"],1],
["Throughput and per-request latency can trade off against each other.",["True","False"],0],
] as const;

export function InferenceFactoryLesson({progress}:Props){
 const [hardware,setHardware]=useState<Record<number,string>>({}),[server,setServer]=useState<Record<number,string>>({}),[loading,setLoading]=useState<Record<number,string>>({}),[queueAnswers,setQueueAnswers]=useState<Record<number,string>>({}),[prefill,setPrefill]=useState<Record<number,string>>({}),[decode,setDecode]=useState<Record<number,string>>({}),[batchAnswers,setBatchAnswers]=useState<Record<number,string>>({}),[metricAnswers,setMetricAnswers]=useState<Record<number,string>>({}),[streamAnswers,setStreamAnswers]=useState<Record<number,string>>({}),[stage,setStage]=useState<InferenceStage>("queue"),[arrival,setArrival]=useState(8),[batch,setBatch]=useState(4),[replicas,setReplicas]=useState(1),[contextK,setContextK]=useState(8),[streaming,setStreaming]=useState(false),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["infer-hardware","infer-server","infer-loading","infer-queue","infer-prefill","infer-decode","infer-batching","infer-metrics","infer-streaming","infer-explain"],sections=["hardware","server","loading","queue","prefill","decode","batching","metrics","streaming","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const metrics=useMemo(()=>{const capacity=replicas*(5+batch*1.7);const pressure=arrival/capacity;const queue=Math.max(0,Math.round((arrival-capacity)*1.7));const gpu=Math.min(99,Math.round(35+pressure*58));const ttft=Math.round(150+contextK*18+Math.max(0,pressure-1)*900+(batch>8?70:0));const tps=Math.max(8,Math.round(62/(1+Math.max(0,pressure-.65)*.9)));const itl=Math.round(1000/tps);return{capacity,pressure,queue,gpu,ttft,tps,itl,rps:Math.min(arrival,capacity).toFixed(1)}} ,[arrival,batch,replicas,contextK]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["server","queue","scheduler","prefill","decode","kv","batch","ttft","latency","throughput","stream","gpu"].filter(w=>t.includes(w)).length;if(explain.length<165||hits<9){setFeedback("Go deeper: explain model server/loading, queue+scheduler, prefill vs decode, KV cache, batching, TTFT/ITL/TPS/throughput and streaming.");return;}setFeedback("Strong. You described inference as a scheduling/memory/latency system around a fixed trained model.");progress.completeTask("infer-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 22 · INFERENCE FACTORY</span><h1>A model file becomes a product only after a serving system learns to feed it.</h1><p>Watch requests queue, prefill their prompts, decode with KV cache and stream tokens. Then tune batch size/load and see why throughput and user latency pull against each other.</p><TaskStamp done={done===10}>{done}/10 inference missions complete</TaskStamp></div><InferenceFactory stage={stage} queue={metrics.queue} batch={batch} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></section>

  <LessonSection id="hardware" onVisit={progress.markVisited} className={styles.scene}><h2>1. Compute and memory hardware shape the serving envelope.</h2>{hardwareCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["gpu","cpu","tpu","hbm"].map(answer=><button key={answer} className={`${styles.button} ${hardware[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(hardware,setHardware,hardwareCases,i,answer,"infer-hardware")}>{answer}</button>)}</div>)}<div className={styles.hardware}><span>CPU · general orchestration/offload</span><span>GPU/TPU · accelerator math</span><span>HBM/VRAM · bandwidth + capacity constraint</span></div></LessonSection>

  <LessonSection id="server" onVisit={progress.markVisited} className={styles.scene}><h2>2. The inference server is the factory foreman.</h2>{serverCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["inference-server","not-server","false"].map(answer=><button key={answer} className={`${styles.button} ${server[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(server,setServer,serverCases,i,answer,"infer-server")}>{answer}</button>)}</div>)}<InferenceFactory stage="queue" queue={metrics.queue} batch={batch} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></LessonSection>

  <LessonSection id="loading" onVisit={progress.markVisited} className={styles.scene}><h2>3. Load once, serve many requests.</h2>{loadCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["load","false"].map(answer=><button key={answer} className={`${styles.button} ${loading[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(loading,setLoading,loadCases,i,answer,"infer-loading")}>{answer}</button>)}</div>)}<div className={styles.loadFlow}><span>OBJECT STORAGE / DISK</span><b>load checkpoint →</b><span>GPU/HBM WEIGHTS</span><b>initialize →</b><span>READY MODEL SERVER</span></div></LessonSection>

  <LessonSection id="queue" onVisit={progress.markVisited} className={styles.scene}><h2>4. Queue and scheduler convert bursty traffic into executable work.</h2><div className={styles.sliders}><label>Incoming requests / s <b>{arrival}</b><input type="range" min="1" max="40" value={arrival} onChange={e=>{setArrival(+e.target.value);setStage("queue");progress.completeTask("infer-queue")}}/></label><label>Replicas <b>{replicas}</b><input type="range" min="1" max="6" value={replicas} onChange={e=>setReplicas(+e.target.value)}/></label></div>{queueCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["queue","scheduler","false"].map(answer=><button key={answer} className={`${styles.button} ${queueAnswers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(queueAnswers,setQueueAnswers,queueCases,i,answer,"infer-queue")}>{answer}</button>)}</div>)}<InferenceFactory stage="queue" queue={metrics.queue} batch={batch} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></LessonSection>

  <LessonSection id="prefill" onVisit={progress.markVisited} className={styles.scene}><h2>5. Prefill digests the prompt and creates the starting KV state.</h2><label className={styles.slider}>Prompt/context length <b>{contextK}k tokens</b><input type="range" min="1" max="64" value={contextK} onChange={e=>{setContextK(+e.target.value);setStage("prefill");progress.completeTask("infer-prefill")}}/></label>{prefillCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["prefill","false"].map(answer=><button key={answer} className={`${styles.button} ${prefill[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(prefill,setPrefill,prefillCases,i,answer,"infer-prefill")}>{answer}</button>)}</div>)}<InferenceFactory stage="prefill" queue={metrics.queue} batch={batch} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></LessonSection>

  <LessonSection id="decode" onVisit={progress.markVisited} className={styles.scene}><h2>6. Decode reuses KV state and advances one token step at a time.</h2>{decodeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["decode","true","false"].map(answer=><button key={answer} className={`${styles.button} ${decode[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>{setStage("decode");solve(decode,setDecode,decodeCases,i,answer,"infer-decode")}}>{answer}</button>)}</div>)}<div className={styles.kv}><span>token 1 KV</span><span>token 2 KV</span><span>…</span><span>token N KV</span><b>→ next-token attention can reuse prior K/V state</b></div></LessonSection>

  <LessonSection id="batching" onVisit={progress.markVisited} className={styles.scene}><h2>7. Batching keeps expensive accelerators busy.</h2><label className={styles.slider}>Batch target <b>{batch}</b><input type="range" min="1" max="16" value={batch} onChange={e=>{setBatch(+e.target.value);progress.completeTask("infer-batching")}}/></label>{batchCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["dynamic","continuous","true","false"].map(answer=><button key={answer} className={`${styles.button} ${batchAnswers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(batchAnswers,setBatchAnswers,batchCases,i,answer,"infer-batching")}>{answer}</button>)}</div>)}<div className={styles.batchDemo}>{Array.from({length:batch},(_,i)=><i key={i}>req {i+1}</i>)}</div></LessonSection>

  <LessonSection id="metrics" onVisit={progress.markVisited} className={styles.scene}><h2>8. Learn the latency/throughput vocabulary.</h2>{metricCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["TTFT","ITL","TPS","throughput","RPS"].map(answer=><button key={answer} className={`${styles.button} ${metricAnswers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(metricAnswers,setMetricAnswers,metricCases,i,answer,"infer-metrics")}>{answer}</button>)}</div>)}<div className={styles.metricGrid}><div><span>TTFT</span><b>{metrics.ttft} ms</b></div><div><span>ITL</span><b>{metrics.itl} ms/token</b></div><div><span>decode</span><b>{metrics.tps} tok/s</b></div><div><span>served</span><b>{metrics.rps} req/s</b></div><div><span>GPU util</span><b>{metrics.gpu}%</b></div></div></LessonSection>

  <LessonSection id="streaming" onVisit={progress.markVisited} className={styles.scene}><h2>9. Stream output as decode produces it.</h2>{streamCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["stream","buffered","true"].map(answer=><button key={answer} className={`${styles.button} ${streamAnswers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(streamAnswers,setStreamAnswers,streamCases,i,answer,"infer-streaming")}>{answer}</button>)}</div>)}<button className={styles.primary} onClick={()=>{setStreaming(true);setStage("stream");progress.completeTask("infer-streaming")}}>Start streaming decode</button>{streaming&&<div className={styles.stream}>The <i/> model <i/> is <i/> streaming <i/> token <i/> deltas…</div>}<InferenceFactory stage="stream" queue={metrics.queue} batch={batch} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain serving as a factory.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain model loading/server, queue/scheduler, prefill, decode/KV, batching, TTFT/ITL/TPS/throughput/GPU utilization and streaming."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Inference Factory quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ INFERENCE REQUEST LIFECYCLE MASTERED":"Pass is 10/12. Revisit prefill/decode and serving metrics."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-21-capstone">← Local Models</Link><Link href="/lessons/scaling-serving-lab">Scaling & Serving →</Link></div>
 </main>
}
