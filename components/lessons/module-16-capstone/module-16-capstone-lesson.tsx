"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { RoutingModel, RoutingTask, RouterPlayground } from "@/components/visualizations/router-playground";
import styles from "./module-16-capstone.module.css";

type Props={progress:LessonProgressApi};
const models:RoutingModel[]=[
{id:"spark",name:"Spark Small",quality:68,latency:260,cost:.08,context:32,modalities:["text"],provider:"A",variant:"mail",accent:"#70d7b5"},
{id:"atlas",name:"Atlas Large",quality:91,latency:920,cost:.85,context:128,modalities:["text","image"],provider:"B",variant:"briefcase",accent:"#7ea4ff"},
{id:"reason",name:"Reason Pro",quality:97,latency:2400,cost:2.6,context:200,modalities:["text","image"],provider:"A",variant:"star",accent:"#ffd75c"},
{id:"vision",name:"Vision Mini",quality:78,latency:540,cost:.22,context:64,modalities:["image"],provider:"C",variant:"tile",accent:"#ff9bc7"},
];
const tasksList:{id:string;task:RoutingTask;answer:string}[]=[
{id:"support",task:{label:"Support intent classification",minQuality:65,maxLatency:500,maxCost:.15,context:8,modality:"text"},answer:"spark"},
{id:"screenshot",task:{label:"Screenshot issue extraction",minQuality:75,maxLatency:900,maxCost:.4,context:16,modality:"image"},answer:"vision"},
{id:"legal",task:{label:"120k-token legal review",minQuality:90,maxLatency:1600,maxCost:1.2,context:120,modality:"text"},answer:"atlas"},
{id:"reasoning",task:{label:"High-stakes multi-step reasoning",minQuality:95,maxLatency:3000,maxCost:3,context:60,modality:"text"},answer:"reason"},
];
const levelCases=[
["Top-2 FFN experts activate inside one sparse checkpoint","moe"],["Gateway chooses Reason Pro endpoint after task classification","external"],["Per-token expert gates are learned inside model","moe"],["Fallback switches from provider B endpoint to provider A endpoint","external"],
] as const;
const eligibility=["quality-floor","latency-slo","cost-budget","context-fit","modality-fit","provider-policy"];
const fallbackCases=[
["Provider B outage while legal task requires 120k context","reason"],["Vision Mini unavailable for screenshot","atlas"],["Provider A forbidden for tenant; support classification","none-eligible"],
] as const;
const quiz=[
["External model routing chooses…",["Among separate models/endpoints/systems","Only MoE experts inside one checkpoint","Tokenizer merges","Memory records"],0],
["Hard eligibility constraints should be checked…",["Before soft scoring among models","After sending data to an ineligible provider","Only after answer","Never"],0],
["A model with highest quality can still be ineligible due to…",["Latency, cost, context, modality or policy","Only its name","Only parameter count","Nothing"],0],
["Fallback primarily handles…",["Failure/unavailability/policy changes in the preferred path","All normal requests","Only training","Only sampling"],0],
["Cascade primarily handles…",["Escalating difficult/low-confidence cases to stronger compute","Provider outage only","Model training","Vector indexing"],0],
["An ensemble should usually be justified by…",["Expected quality/reliability gain worth added cost/latency","The desire to call more APIs","Model branding","No evals"],0],
["Correlated model errors can make majority vote unreliable.",["True","False"],0],
["Semantic routing commonly uses…",["Similarity/embeddings between request and routing categories","Only context length","Only retries","Only tool schemas"],0],
["Learned routers can use historical outcomes to optimize choices.",["True","False"],0],
["A quality-cost-latency frontier implies…",["Trade-offs; no model is universally best for every constraint","One model always dominates","Cost and latency do not matter","Only provider matters"],0],
["MoE expert routing and system model routing are…",["Different routing layers","Always identical","Both only network load balancers","Both RAG"],0],
["A production router should log/evaluate routing decisions.",["True","False"],0],
] as const;

export function Module16CapstoneLesson({progress}:Props){
 const [levels,setLevels]=useState<Record<number,string>>({}),[elig,setElig]=useState<string[]>([]),[routes,setRoutes]=useState<Record<string,string>>({}),[fallback,setFallback]=useState<Record<number,string>>({}),[cascadeThreshold,setCascadeThreshold]=useState(75),[cascadeDone,setCascadeDone]=useState(false),[ensemble,setEnsemble]=useState<string[]>([]),[policy,setPolicy]=useState({easyShare:70,ensembleShare:5}),[economicsDone,setEconomicsDone]=useState(false),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m16-levels","m16-eligibility","m16-route","m16-fallback","m16-cascade","m16-ensemble","m16-economics","m16-explain"],sections=["levels","eligibility","route","fallback","cascade","ensemble","economics","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,taskId:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(taskId)};
 const allRoutesCorrect=tasksList.every(item=>routes[item.id]===item.answer);
 const avg=useMemo(()=>{const easy=policy.easyShare/100,ens=policy.ensembleShare/100,hard=Math.max(0,1-easy-ens);const cost=easy*.08+hard*2.6+ens*(.85+2.6);const quality=easy*68+hard*97+ens*98;const latency=easy*260+hard*2400+ens*2500;return{cost,quality,latency}},[policy]);
 const target=avg.quality>=82&&avg.cost<=1&&avg.latency<=1400;
 const submit=()=>{const t=explain.toLowerCase();const hits=["eligib","quality","latency","cost","context","modality","provider","fallback","cascade","ensemble","moe"].filter(w=>t.includes(w)).length;if(explain.length<150||hits<8){setFeedback("Go deeper: separate MoE/system routing, explain eligibility, task routing, provider fallback, cascade, ensemble and measured quality/cost/latency trade-offs.");return;}setFeedback("Strong. You built a routing control plane with eligibility, optimization and recovery layers instead of a pile of model-name if statements.");progress.completeTask("m16-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 16 · ROUTING BOSS LAB</span><h1>Four workloads. Four budgets. One routing control plane.</h1><p>Build eligibility first, route normal traffic, design provider fallbacks, use cascades for hard cases and reserve ensembles for places where extra spend earns real reliability.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><div className={styles.party}>{models.map(m=><AiMascot key={m.id} variant={m.variant} accent={m.accent} size={78} mood={Object.values(routes).includes(m.id)?"excited":"happy"} label={m.name.split(" ")[0].toUpperCase()}/>)}</div></section>

  <LessonSection id="levels" onVisit={progress.markVisited} className={styles.scene}><h2>1. Keep the two routing levels separate.</h2>{levelCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["moe","external"].map(choice=><button key={choice} className={`${styles.button} ${levels[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(levels,setLevels,levelCases,i,choice,"m16-levels")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="eligibility" onVisit={progress.markVisited} className={styles.scene}><h2>2. Build eligibility gates before ranking.</h2><div className={styles.chips}>{eligibility.map(item=><button key={item} className={elig.includes(item)?styles.active:""} onClick={()=>{const next=[...new Set([...elig,item])];setElig(next);if(eligibility.every(x=>next.includes(x)))progress.completeTask("m16-eligibility")}}>{item}</button>)}</div><p>If a provider is forbidden or context does not fit, a high quality score should not rescue that route.</p></LessonSection>

  <LessonSection id="route" onVisit={progress.markVisited} className={styles.scene}><h2>3. Route four workloads to the smallest eligible fit.</h2>{tasksList.map(item=><div className={styles.routeCase} key={item.id}><RouterPlayground models={models} task={item.task} selected={routes[item.id]}/><div className={styles.chips}>{models.map(m=><button key={m.id} className={routes[item.id]===m.id?(m.id===item.answer?styles.good:styles.bad):""} onClick={()=>{const next={...routes,[item.id]:m.id};setRoutes(next);if(tasksList.every(x=>next[x.id]===x.answer))progress.completeTask("m16-route")}}>route → {m.name}</button>)}</div></div>)}{allRoutesCorrect&&<p className={styles.feedback}>✓ All four workloads route to an eligible cost/quality/latency fit.</p>}</LessonSection>

  <LessonSection id="fallback" onVisit={progress.markVisited} className={styles.scene}><h2>4. Fallback is constrained recovery, not “pick random second best.”</h2>{fallbackCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["spark","atlas","reason","vision","none-eligible"].map(choice=><button key={choice} className={`${styles.button} ${fallback[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(fallback,setFallback,fallbackCases,i,choice,"m16-fallback")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="cascade" onVisit={progress.markVisited} className={styles.scene}><h2>5. Tune an escalation threshold.</h2><label className={styles.slider}>Escalate Spark result to Reason when verifier score is below <b>{cascadeThreshold}%</b><input type="range" min="45" max="95" value={cascadeThreshold} onChange={e=>{setCascadeThreshold(+e.target.value);setCascadeDone(true);progress.completeTask("m16-cascade")}}/></label><div className={styles.flow}><span>Spark</span><b>verify &lt; {cascadeThreshold}%</b><span>Reason Pro</span></div>{cascadeDone&&<p>Higher threshold escalates more requests: usually higher quality potential, but more cost/latency. The verifier must itself be evaluated.</p>}</LessonSection>

  <LessonSection id="ensemble" onVisit={progress.markVisited} className={styles.scene}><h2>6. Spend on ensemble only where independent evidence helps.</h2><div className={styles.chips}>{["high-stakes-reasoning","simple-classification","exact-arithmetic-with-calculator","ambiguous-legal-analysis"].map(item=><button key={item} className={ensemble.includes(item)?styles.active:""} onClick={()=>{const next=[...new Set([...ensemble,item])];setEnsemble(next);if(next.includes("high-stakes-reasoning")&&next.includes("ambiguous-legal-analysis")&&!next.includes("simple-classification")&&!next.includes("exact-arithmetic-with-calculator"))progress.completeTask("m16-ensemble")}}>{item}</button>)}</div><p>Select only scenarios where multiple model candidates/judging may justify the cost. Exact arithmetic has a better authoritative verifier; simple classification rarely needs three premium models.</p></LessonSection>

  <LessonSection id="economics" onVisit={progress.markVisited} className={styles.scene}><h2>7. Hit the toy production target.</h2><div className={styles.sliders}><label>Easy traffic on Spark <b>{policy.easyShare}%</b><input type="range" min="30" max="90" value={policy.easyShare} onChange={e=>{setPolicy(p=>({...p,easyShare:+e.target.value}));setEconomicsDone(true)}}/></label><label>Traffic using parallel ensemble <b>{policy.ensembleShare}%</b><input type="range" min="0" max="30" value={policy.ensembleShare} onChange={e=>{setPolicy(p=>({...p,ensembleShare:+e.target.value}));setEconomicsDone(true)}}/></label></div><div className={styles.metrics}><div><span>quality</span><b>{avg.quality.toFixed(1)}</b><small>target ≥82</small></div><div><span>cost</span><b>${avg.cost.toFixed(2)}</b><small>target ≤1.00</small></div><div><span>latency</span><b>{Math.round(avg.latency)}ms</b><small>target ≤1400</small></div></div><button className={styles.primary} disabled={!economicsDone||!target} onClick={()=>progress.completeTask("m16-economics")}>Lock routing economics</button>{target&&<p className={styles.feedback}>✓ Toy target reached. In production, these values come from evals/traces, not invented confidence.</p>}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the routing architecture end to end.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain MoE vs external routing, eligibility, model selection, fallbacks, cascades, ensembles and measured quality/cost/latency."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 16 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODEL ROUTING MASTERED":"Pass is 10/12. Revisit eligibility, cascades, ensemble economics and routing layers."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/model-systems-lab">← Systems of Models</Link><Link href="/lessons/coding-agent-lab">Coding Agents →</Link></div>
 </main>
}
