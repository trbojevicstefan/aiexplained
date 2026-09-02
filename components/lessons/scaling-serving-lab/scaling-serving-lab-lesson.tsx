"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { InferenceFactory } from "@/components/visualizations/inference-factory";
import styles from "./scaling-serving-lab.module.css";

type Props={progress:LessonProgressApi};
const replicaCases=[
["Copy full model onto another GPU/server and send different requests to each copy","replica"],["Split one layer's matrix work across multiple GPUs","tensor-parallel"],["Replicas can increase aggregate request capacity","true"],
] as const;
const balanceCases=[
["Round-robin requests across equally healthy replicas","round-robin"],["Prefer replica with smallest active queue/KV pressure","least-loaded"],["Send all traffic to replica 1 forever","bad"],["Remove unhealthy replica from routing","health-aware"],
] as const;
const autoCases=[
["Queue depth and sustained GPU utilization high","scale-out"],["Traffic low for sustained period","scale-in"],["Single 2-second utilization spike","wait"],["Scale to zero even though latency SLO forbids cold start","bad"],
] as const;
const serverlessCases=[
["No warm replica; request triggers model/container load","cold-start"],["Warm pool already has loaded model","warm"],["Serverless automatically removes all GPU costs","false"],["Cold-start cost depends heavily on model/runtime/artifact loading","true"],
] as const;
const tensorCases=[
["One matrix/layer computation partitioned across GPUs","tensor-parallel"],["Requires communication between devices during layer computation","true"],["Creates fully independent copies serving unrelated requests","false"],
] as const;
const pipelineCases=[
["Different layer ranges/stages placed on different GPUs","pipeline-parallel"],["Activations move between pipeline stages","true"],["Identical to load-balancing independent full replicas","false"],
] as const;
const specCases=[
["Small draft model proposes several tokens","draft"],["Target model verifies/accepts a run of proposed tokens","verify"],["Useful only if draft is slower than target and acceptance is zero","false"],["Goal is fewer expensive target decode steps per accepted output span","true"],
] as const;
const routeCases=[
["Long-context request needs a replica with enough KV capacity","capacity"],["Image request needs multimodal-capable pool","capability"],["EU privacy workload must remain in EU pool","region"],["All requests should ignore pool health/capacity","bad"],
] as const;
const utilCases=[
["99% GPU util + growing queue + high TTFT","overloaded"],["20% util + no queue across six replicas","overprovisioned"],["75% util + stable queue/latency within SLO","healthy"],["Utilization alone proves quality is correct","false"],
] as const;
const quiz=[
["A model replica is…",["A separately loaded copy able to serve requests","One tensor shard only","A prompt cache entry","A training batch"],0],
["Load balancing decides…",["Which healthy serving replica/pool should receive a request","Which token ID is used","Which dataset trains next","Which image mask to paint"],0],
["Autoscaling commonly reacts to…",["Demand/capacity signals such as queue, utilization or request concurrency","Only model name","Only token IDs","Only license type"],0],
["Serverless cold start can include…",["Starting runtime and loading model artifacts before request execution","Only JSON parsing","Only citations","Only tool selection"],0],
["Tensor parallelism generally…",["Splits tensor/layer computation across multiple devices","Replicates entire service independently","Runs only CPU","Stores user memory"],0],
["Pipeline parallelism generally…",["Splits layer/stage ranges across devices","Splits one token string into characters","Only load balances replicas","Only streams SSE"],0],
["Speculative decoding uses…",["A faster draft process plus target verification to accelerate accepted decode spans","Only larger KV cache","Only more replicas","Only higher temperature"],0],
["Request routing can include capability/region/context/capacity constraints.",["True","False"],0],
["High GPU utilization is always healthy regardless of queue and latency.",["True","False"],1],
["Adding replicas and tensor-parallel sharding solve the same problem in exactly the same way.",["True","False"],1],
] as const;

export function ScalingServingLabLesson({progress}:Props){
 const [replicaAnswers,setReplicaAnswers]=useState<Record<number,string>>({}),[replicas,setReplicas]=useState(2),[balance,setBalance]=useState<Record<number,string>>({}),[auto,setAuto]=useState<Record<number,string>>({}),[targetUtil,setTargetUtil]=useState(75),[traffic,setTraffic]=useState(15),[serverless,setServerless]=useState<Record<number,string>>({}),[warm,setWarm]=useState(true),[tensor,setTensor]=useState<Record<number,string>>({}),[tp,setTp]=useState(1),[pipeline,setPipeline]=useState<Record<number,string>>({}),[pp,setPp]=useState(1),[spec,setSpec]=useState<Record<number,string>>({}),[draftQuality,setDraftQuality]=useState(75),[route,setRoute]=useState<Record<number,string>>({}),[util,setUtil]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["serve-replicas","serve-balance","serve-autoscale","serve-serverless","serve-tensor","serve-pipeline","serve-speculative","serve-routing","serve-utilization","serve-explain"],sections=["replicas","balance","autoscale","serverless","tensor","pipeline","speculative","routing","utilization","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const metrics=useMemo(()=>{const capacity=replicas*8*tp*.75;const pressure=traffic/Math.max(1,capacity);const gpu=Math.min(99,Math.round(25+pressure*65));const queue=Math.max(0,Math.round((traffic-capacity)*1.4));const cold=warm?0:900+tp*180;const ttft=Math.round(180+queue*55+cold);return{capacity,pressure,gpu,queue,ttft,tps:Math.max(9,Math.round(58/(1+Math.max(0,pressure-.75))))}},[replicas,tp,traffic,warm]);
 const desiredReplicas=Math.max(1,Math.ceil(traffic/(8*(targetUtil/100))));
 const speculativeGain=Math.max(1,1+draftQuality/100*1.6);
 const submit=()=>{const t=explain.toLowerCase();const hits=["replica","load balanc","autoscal","serverless","cold","tensor parallel","pipeline parallel","speculative","route","utilization"].filter(w=>t.includes(w)).length;if(explain.length<160||hits<8){setFeedback("Go deeper: distinguish replicas/load balancing/autoscaling from tensor/pipeline sharding, then explain cold starts, speculative decoding and constrained request routing.");return;}setFeedback("Strong. You separated horizontal service scaling from model sharding and decode acceleration.");progress.completeTask("serve-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 22 · SCALING & SERVING LAB</span><h1>More GPUs can mean more copies — or one model spread across more GPUs.</h1><p>Scale traffic with replicas, split oversized models with parallelism, route by capability/capacity and accelerate decode with speculation.</p><TaskStamp done={done===10}>{done}/10 serving missions complete</TaskStamp></div><InferenceFactory stage="decode" queue={metrics.queue} batch={4} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></section>

  <LessonSection id="replicas" onVisit={progress.markVisited} className={styles.scene}><h2>1. Replicas are independent loaded copies.</h2><label className={styles.slider}>Full-model replicas <b>{replicas}</b><input type="range" min="1" max="6" value={replicas} onChange={e=>{setReplicas(+e.target.value);progress.completeTask("serve-replicas")}}/></label>{replicaCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["replica","tensor-parallel","true"].map(answer=><button key={answer} className={`${styles.button} ${replicaAnswers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(replicaAnswers,setReplicaAnswers,replicaCases,i,answer,"serve-replicas")}>{answer}</button>)}</div>)}<InferenceFactory stage="queue" queue={metrics.queue} batch={4} replicas={replicas} gpuUtil={metrics.gpu} ttft={metrics.ttft} tps={metrics.tps}/></LessonSection>

  <LessonSection id="balance" onVisit={progress.markVisited} className={styles.scene}><h2>2. Load balancer chooses a healthy place for each request.</h2>{balanceCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["round-robin","least-loaded","health-aware","bad"].map(answer=><button key={answer} className={`${styles.button} ${balance[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(balance,setBalance,balanceCases,i,answer,"serve-balance")}>{answer}</button>)}</div>)}<div className={styles.replicaRow}>{Array.from({length:replicas},(_,i)=><span key={i}>replica {i+1}<b>{Math.max(0,metrics.queue-i*2)} queued</b></span>)}</div></LessonSection>

  <LessonSection id="autoscale" onVisit={progress.markVisited} className={styles.scene}><h2>3. Autoscale against a target, not panic.</h2><div className={styles.twoSliders}><label>Traffic <b>{traffic} req/s</b><input type="range" min="1" max="50" value={traffic} onChange={e=>{setTraffic(+e.target.value);progress.completeTask("serve-autoscale")}}/></label><label>Target GPU util <b>{targetUtil}%</b><input type="range" min="40" max="90" value={targetUtil} onChange={e=>setTargetUtil(+e.target.value)}/></label></div><div className={styles.autoscale}><span>current replicas <b>{replicas}</b></span><span>toy desired <b>{desiredReplicas}</b></span><button className={styles.primary} onClick={()=>setReplicas(Math.min(6,desiredReplicas))}>Apply autoscale decision</button></div>{autoCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["scale-out","scale-in","wait","bad"].map(answer=><button key={answer} className={`${styles.button} ${auto[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(auto,setAuto,autoCases,i,answer,"serve-autoscale")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="serverless" onVisit={progress.markVisited} className={styles.scene}><h2>4. Serverless can trade idle cost for cold-start latency.</h2><button className={styles.primary} onClick={()=>{setWarm(!warm);progress.completeTask("serve-serverless")}}>{warm?"Scale to zero":"Warm a replica"}</button><div className={styles.cold}><b>{warm?"WARM":"COLD START"}</b><span>TTFT proxy {metrics.ttft} ms</span></div>{serverlessCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["cold-start","warm","true","false"].map(answer=><button key={answer} className={`${styles.button} ${serverless[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(serverless,setServerless,serverlessCases,i,answer,"serve-serverless")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="tensor" onVisit={progress.markVisited} className={styles.scene}><h2>5. Tensor parallelism splits one layer's math across devices.</h2><label className={styles.slider}>Tensor-parallel degree <b>{tp}</b><input type="range" min="1" max="8" value={tp} onChange={e=>{setTp(+e.target.value);progress.completeTask("serve-tensor")}}/></label><div className={styles.shards}>{Array.from({length:tp},(_,i)=><span key={i}>tensor shard {i+1}/{tp}</span>)}</div>{tensorCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["tensor-parallel","true","false"].map(answer=><button key={answer} className={`${styles.button} ${tensor[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(tensor,setTensor,tensorCases,i,answer,"serve-tensor")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="pipeline" onVisit={progress.markVisited} className={styles.scene}><h2>6. Pipeline parallelism places different layer stages on different devices.</h2><label className={styles.slider}>Pipeline stages <b>{pp}</b><input type="range" min="1" max="6" value={pp} onChange={e=>{setPp(+e.target.value);progress.completeTask("serve-pipeline")}}/></label><div className={styles.pipeline}>{Array.from({length:pp},(_,i)=><span key={i}>layers {i*10+1}–{(i+1)*10}<b>GPU {i+1}</b></span>)}</div>{pipelineCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["pipeline-parallel","true","false"].map(answer=><button key={answer} className={`${styles.button} ${pipeline[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(pipeline,setPipeline,pipelineCases,i,answer,"serve-pipeline")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="speculative" onVisit={progress.markVisited} className={styles.scene}><h2>7. Speculative decoding asks a cheap drafter to run ahead.</h2><label className={styles.slider}>Draft acceptance quality <b>{draftQuality}%</b><input type="range" min="20" max="95" value={draftQuality} onChange={e=>{setDraftQuality(+e.target.value);progress.completeTask("serve-speculative")}}/></label><div className={styles.spec}><span>DRAFT: the · model · can · stream</span><b>target verifies →</b><span>accept several / reject from mismatch</span><em>toy speedup proxy {speculativeGain.toFixed(1)}×</em></div>{specCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["draft","verify","true","false"].map(answer=><button key={answer} className={`${styles.button} ${spec[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(spec,setSpec,specCases,i,answer,"serve-speculative")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="routing" onVisit={progress.markVisited} className={styles.scene}><h2>8. Route requests to eligible serving pools before optimizing load.</h2>{routeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["capacity","capability","region","bad"].map(answer=><button key={answer} className={`${styles.button} ${route[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(route,setRoute,routeCases,i,answer,"serve-routing")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="utilization" onVisit={progress.markVisited} className={styles.scene}><h2>9. Utilization means nothing without queue/latency/SLO context.</h2>{utilCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["overloaded","overprovisioned","healthy","false"].map(answer=><button key={answer} className={`${styles.button} ${util[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(util,setUtil,utilCases,i,answer,"serve-utilization")}>{answer}</button>)}</div>)}<div className={styles.capacity}><span>GPU {metrics.gpu}%</span><span>queue {metrics.queue}</span><span>TTFT {metrics.ttft}ms</span><span>capacity {metrics.capacity.toFixed(1)} req/s</span></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain how to scale model serving.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain replicas/load balancing/autoscaling, cold starts, tensor vs pipeline parallelism, speculative decoding, request routing and capacity/utilization."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Scaling & Serving quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ SCALING & SERVING MASTERED":"Pass is 9/10. Revisit replicas vs parallelism."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/inference-factory">← Inference Factory</Link><Link href="/lessons/module-22-capstone">Infrastructure Boss Lab →</Link></div>
 </main>
}
