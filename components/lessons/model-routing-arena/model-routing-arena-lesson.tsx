"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { RoutingModel, RoutingTask, RouterPlayground, modelFitness } from "@/components/visualizations/router-playground";
import styles from "./model-routing-arena.module.css";

type Props={progress:LessonProgressApi};
const models:RoutingModel[]=[
{id:"spark",name:"Spark Small",quality:68,latency:260,cost:.08,context:32,modalities:["text"],provider:"A",variant:"mail",accent:"#70d7b5"},
{id:"atlas",name:"Atlas Large",quality:91,latency:920,cost:.85,context:128,modalities:["text","image"],provider:"B",variant:"briefcase",accent:"#7ea4ff"},
{id:"reason",name:"Reason Pro",quality:97,latency:2400,cost:2.6,context:200,modalities:["text","image"],provider:"A",variant:"star",accent:"#ffd75c"},
{id:"vision",name:"Vision Mini",quality:78,latency:540,cost:.22,context:64,modalities:["image"],provider:"C",variant:"tile",accent:"#ff9bc7"},
];
const presets:Record<string,RoutingTask>={
classification:{label:"Classify support ticket intent",minQuality:65,maxLatency:500,maxCost:.15,context:8,modality:"text"},
legal:{label:"Review complex 90k-token legal packet",minQuality:92,maxLatency:3500,maxCost:3,context:100,modality:"text"},
vision:{label:"Extract issue from product screenshot",minQuality:75,maxLatency:900,maxCost:.4,context:16,modality:"image"},
chat:{label:"Interactive customer chat response",minQuality:82,maxLatency:1100,maxCost:1,context:40,modality:"text"},
};
const providerCases=[
["Customer policy forbids Provider B for this tenant","provider-constraint"],["Primary Provider A is temporarily unavailable","fallback-provider"],["Image input arrives","modality-route"],["Prompt needs 120k context","context-route"],
] as const;
const routerCases=[
["If modality=image → vision-capable model; if tokens>100k → long-context model","rules"],["Embed request and route near 'coding/legal/support' prototypes","semantic"],["Train a router from historical quality/cost labels","learned"],
] as const;
const quiz=[
["Model routing means…",["Selecting among separate models/endpoints/systems for a request","Choosing an MoE expert inside one model only","Tokenizing text","Changing model weights"],0],
["Routing only by task label is sufficient for production.",["True","False"],1],
["A request can fail model eligibility because of…",["Context length, modality, policy/provider, quality, latency or cost constraints","Only spelling","Only temperature","Only user name"],0],
["A fallback model is useful when…",["The preferred model/provider is unavailable or violates a runtime condition","Training data is duplicated","A tokenizer changes","A user logs out"],0],
["A cascade often tries…",["A cheaper/faster model first and escalates harder cases to a stronger model","Every model in parallel always","Only the largest model","Only one MoE expert"],0],
["Semantic routing can use…",["Embeddings/similarity to route requests near known task categories","Gradient descent every request","Only regex","No request content"],0],
["Learned routing can optimize from historical outcomes.",["True","False"],0],
["Quality/cost/latency optimization usually has…",["Trade-offs rather than one universally best model","One permanent winner","No constraints","No measurement"],0],
["External model routing and internal MoE expert routing are the same layer.",["True","False"],1],
] as const;

export function ModelRoutingArenaLesson({progress}:Props){
 const [preset,setPreset]=useState("classification"),[task,setTask]=useState<RoutingTask>(presets.classification),[seenPresets,setSeenPresets]=useState<string[]>([]),[constraintTouched,setConstraintTouched]=useState<string[]>([]),[contextTouched,setContextTouched]=useState(false),[provider,setProvider]=useState<Record<number,string>>({}),[router,setRouter]=useState<Record<number,string>>({}),[primary,setPrimary]=useState("atlas"),[fallback,setFallback]=useState("reason"),[fallbackTested,setFallbackTested]=useState(false),[cascadeThreshold,setCascadeThreshold]=useState(72),[cascadeTouched,setCascadeTouched]=useState(false),[frontierSeen,setFrontierSeen]=useState<string[]>([]),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["route-task","route-constraints","route-context","route-provider","route-rules","route-fallback","route-cascade","route-frontier","route-explain"],sections=["task","constraints","context","provider","rules","fallback","cascade","frontier","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===9&&read===9;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const ranked=useMemo(()=>models.map(model=>({model,...modelFitness(model,task)})).sort((a,b)=>b.score-a.score),[task]);
 const eligible=ranked.filter(x=>x.failures.length===0);
 const winner=eligible[0]?.model.id??ranked[0]?.model.id;
 const selectPreset=(name:string)=>{setPreset(name);setTask(presets[name]);const next=[...new Set([...seenPresets,name])];setSeenPresets(next);if(next.length===Object.keys(presets).length)progress.completeTask("route-task")};
 const touchConstraint=(name:string,value:number)=>{setTask(current=>({...current,[name]:value}));const next=[...new Set([...constraintTouched,name])];setConstraintTouched(next);if(["minQuality","maxLatency","maxCost"].every(x=>next.includes(x)))progress.completeTask("route-constraints")};
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,taskId:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(taskId)};
 const cascadeCost=useMemo(()=>{const easyShare=Math.max(.05,Math.min(.95,cascadeThreshold/100));return easyShare*.08+(1-easyShare)*(2.6+.08)},[cascadeThreshold]);
 const cascadeQuality=useMemo(()=>68*(cascadeThreshold/100)+97*(1-cascadeThreshold/100),[cascadeThreshold]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["task","quality","latency","cost","context","modality","fallback","cascade","semantic","learned","provider"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: explain eligibility constraints, routing policies, rules/semantic/learned routers, fallbacks/cascades and the quality-cost-latency trade-off.");return;}setFeedback("Strong. You described routing as constrained optimization across separate model choices, not as one hard-coded task label or MoE routing.");progress.completeTask("route-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 16 · MODEL ROUTING ARENA</span><h1>The best model is the model that fits this request.</h1><p>Route by task <b>and constraints</b>: complexity, quality floor, latency SLO, cost budget, context, modality, provider policy and availability. Then learn when fallbacks and cascades beat one-model-for-everything.</p><TaskStamp done={done===9}>{done}/9 routing missions complete</TaskStamp></div><div className={styles.scoreboard}>{models.map(model=><div key={model.id}><b>{model.name}</b><span>Q {model.quality}</span><span>{model.latency}ms</span><span>${model.cost}</span></div>)}</div></section>

  <LessonSection id="task" onVisit={progress.markVisited} className={styles.scene}><h2>1. Change the task. Watch the best route change.</h2><div className={styles.tabs}>{Object.keys(presets).map(name=><button key={name} className={preset===name?styles.active:""} onClick={()=>selectPreset(name)}>{name}</button>)}</div><RouterPlayground models={models} task={task} selected={winner}/><p>Explore all 4 presets: {seenPresets.length}/4.</p></LessonSection>

  <LessonSection id="constraints" onVisit={progress.markVisited} className={styles.scene}><h2>2. Quality, latency and cost create hard eligibility and soft preference.</h2><div className={styles.sliders}><label>Minimum quality <b>{task.minQuality}</b><input type="range" min="50" max="99" value={task.minQuality} onChange={e=>touchConstraint("minQuality",+e.target.value)}/></label><label>Max latency <b>{task.maxLatency}ms</b><input type="range" min="200" max="3500" step="100" value={task.maxLatency} onChange={e=>touchConstraint("maxLatency",+e.target.value)}/></label><label>Max cost <b>${task.maxCost.toFixed(2)}</b><input type="range" min="0.05" max="3" step="0.05" value={task.maxCost} onChange={e=>touchConstraint("maxCost",+e.target.value)}/></label></div><RouterPlayground models={models} task={task} selected={winner}/></LessonSection>

  <LessonSection id="context" onVisit={progress.markVisited} className={styles.scene}><h2>3. Some models are simply ineligible.</h2><div className={styles.sliders}><label>Required context <b>{task.context}k</b><input type="range" min="4" max="180" step="4" value={task.context} onChange={e=>{setTask(current=>({...current,context:+e.target.value}));setContextTouched(true);progress.completeTask("route-context")}}/></label><label>Modality<select value={task.modality} onChange={e=>{setTask(current=>({...current,modality:e.target.value}));setContextTouched(true);progress.completeTask("route-context")}}><option value="text">text</option><option value="image">image</option></select></label></div>{contextTouched&&<RouterPlayground models={models} task={task} selected={winner}/>}</LessonSection>

  <LessonSection id="provider" onVisit={progress.markVisited} className={styles.scene}><h2>4. Provider/policy routing lives above raw model quality.</h2>{providerCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["provider-constraint","fallback-provider","modality-route","context-route"].map(choice=><button className={`${styles.button} ${provider[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(provider,setProvider,providerCases,i,choice,"route-provider")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="rules" onVisit={progress.markVisited} className={styles.scene}><h2>5. Router implementation can be rules-based, semantic or learned.</h2>{routerCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["rules","semantic","learned"].map(choice=><button className={`${styles.button} ${router[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(router,setRouter,routerCases,i,choice,"route-rules")}>{choice}</button>)}</div>)}<p>These can be combined: hard safety/provider/context constraints first, then a learned/semantic scorer among eligible models.</p></LessonSection>

  <LessonSection id="fallback" onVisit={progress.markVisited} className={styles.scene}><h2>6. A fallback is a recovery path, not the normal winner.</h2><div className={styles.grid2}><label>Primary<select value={primary} onChange={e=>setPrimary(e.target.value)}>{models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label><label>Fallback<select value={fallback} onChange={e=>setFallback(e.target.value)}>{models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label></div><button className={styles.primary} onClick={()=>{setFallbackTested(true);progress.completeTask("route-fallback")}}>Simulate primary provider outage</button>{fallbackTested&&<div className={styles.routeLine}><span>{models.find(m=>m.id===primary)?.name}</span><b>UNAVAILABLE</b><span>→ {models.find(m=>m.id===fallback)?.name}</span></div>}</LessonSection>

  <LessonSection id="cascade" onVisit={progress.markVisited} className={styles.scene}><h2>7. Cascade: cheap first, escalate hard cases.</h2><label className={styles.cascade}>Confidence threshold for accepting Spark answer <b>{cascadeThreshold}%</b><input type="range" min="30" max="95" value={cascadeThreshold} onChange={e=>{setCascadeThreshold(+e.target.value);setCascadeTouched(true);progress.completeTask("route-cascade")}}/></label><div className={styles.grid3}><div className={styles.metric}><span>toy avg cost</span><b>${cascadeCost.toFixed(2)}</b></div><div className={styles.metric}><span>toy avg quality</span><b>{cascadeQuality.toFixed(1)}</b></div><div className={styles.metric}><span>flow</span><b>Spark → maybe Reason</b></div></div>{cascadeTouched&&<p>Real cascades need a trustworthy escalation signal: confidence calibration, task classifier, verifier/eval, rule trigger or other quality proxy. A fake confidence number can route badly.</p>}</LessonSection>

  <LessonSection id="frontier" onVisit={progress.markVisited} className={styles.scene}><h2>8. There is a frontier, not a single winner.</h2><div className={styles.frontier}>{models.map(model=><button key={model.id} className={frontierSeen.includes(model.id)?styles.active:""} style={{left:`${Math.min(88,model.cost/3*88)}%`,bottom:`${Math.min(82,model.quality)}%`}} onClick={()=>{const next=[...new Set([...frontierSeen,model.id])];setFrontierSeen(next);if(next.length===models.length)progress.completeTask("route-frontier")}} title={`${model.name}: cost ${model.cost}, quality ${model.quality}`}>{model.name}</button>)}</div><p>Horizontal axis ≈ cost; vertical axis ≈ quality. Latency/context/modality/policy add more dimensions. Inspect all models: {frontierSeen.length}/{models.length}.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>9. Explain model routing as a production decision.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain task/quality/latency/cost/context/modality/provider constraints, rules/semantic/learned routing, fallback and cascade trade-offs."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Model Routing Arena quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=8)}>Submit · {score}/9</button>{quizDone&&<p className={styles.feedback}>{score>=8?"★ MODEL ROUTING FOUNDATIONS MASTERED":"Pass is 8/9. Revisit constraints, fallbacks and cascades."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-15-capstone">← Orchestration</Link><Link href="/lessons/model-systems-lab">Systems of Models →</Link></div>
 </main>
}
