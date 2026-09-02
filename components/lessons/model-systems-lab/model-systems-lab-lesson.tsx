"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./model-systems-lab.module.css";

type Props={progress:LessonProgressApi};
const levelCases=[
["Token 'integral' activates Math + Science expert FFNs inside one checkpoint","moe"],["Gateway sends legal request to Reason Pro endpoint instead of Spark endpoint","external"],["Top-2 experts selected independently for every token position","moe"],["Product chooses between providers A/B/C before calling inference","external"],
] as const;
const ensembleCandidates=[
{id:"a",name:"Spark",answer:"42",quality:66,cost:.08,latency:260,accent:"#76d8b4",variant:"mail" as const},
{id:"b",name:"Atlas",answer:"42",quality:89,cost:.85,latency:920,accent:"#7ca3ff",variant:"briefcase" as const},
{id:"c",name:"Reason",answer:"41",quality:96,cost:2.6,latency:2400,accent:"#ffd65c",variant:"star" as const},
];
const mixtureCases=[
["Classifier chooses one specialist model for entire request","router"],["Two models draft independent answers then judge picks one","ensemble-judge"],["Cheap model handles easy cases, hard cases escalate","cascade"],["Specialist models each produce part of a composed final result","composition"],
] as const;
const correlationCases=[
["Three models trained on very similar data repeat same false claim","correlated"],["One model + authoritative calculator/tool verifier","diverse"],["Five samples from same model using same flawed source","correlated"],["Text model plus independent structured database check","diverse"],
] as const;
const policyCases=[
["Never send EU tenant data to Provider C","hard-policy"],["Prefer cheapest eligible model","cost-objective"],["Escalate if verifier score < 0.8","cascade-trigger"],["Image input requires image-capable endpoint","eligibility"],
] as const;
const quiz=[
["Internal MoE expert routing and external model routing happen…",["At different architectural levels","At exactly the same layer","Only during training","Only in vector search"],0],
["An ensemble often…",["Combines or compares outputs from multiple model runs","Selects one MoE expert only","Changes tokenizer","Stores memory"],0],
["Parallel multi-model ensembles usually cost more than one-model routing.",["True","False"],0],
["A generator+judge pattern needs…",["Candidates plus a selection/evaluation mechanism","Only a router label","No extra inference","No failure mode"],0],
["A cascade aims to…",["Spend expensive compute only when a cheaper stage is insufficient","Always call every model","Always use largest model first","Replace validation"],0],
["Model diversity matters because…",["Correlated models can repeat the same error and voting may not fix it","All models are independent automatically","Cost disappears","Latency becomes zero"],0],
["A hard policy constraint should usually be applied…",["Before soft optimization among eligible models","After leaking data","Only after the answer","Inside tokenizer"],0],
["System-of-models design should account for…",["Aggregate quality, latency, cost and failure correlation","Only parameter count","Only provider branding","Only temperature"],0],
["Mixture of models is necessarily identical to one specific standardized architecture.",["True","False"],1],
] as const;

export function ModelSystemsLabLesson({progress}:Props){
 const [levels,setLevels]=useState<Record<number,string>>({}),[selected,setSelected]=useState<string[]>([]),[judge,setJudge]=useState(""),[judgeSeen,setJudgeSeen]=useState(false),[threshold,setThreshold]=useState(72),[cascadeSeen,setCascadeSeen]=useState(false),[mixture,setMixture]=useState<Record<number,string>>({}),[correlation,setCorrelation]=useState<Record<number,string>>({}),[policy,setPolicy]=useState<Record<number,string>>({}),[mode,setMode]=useState<"route"|"ensemble"|"cascade">("route"),[economicsSeen,setEconomicsSeen]=useState<string[]>([]),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["models-levels","models-ensemble","models-judge","models-cascade","models-mixture","models-correlation","models-policy","models-economics","models-explain"],sections=["levels","ensemble","judge","cascade","mixture","correlation","policy","economics","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===9&&read===9;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const voteCounts=useMemo(()=>ensembleCandidates.reduce<Record<string,number>>((acc,c)=>{acc[c.answer]=(acc[c.answer]??0)+1;return acc},{}),[]);
 const majority=Object.entries(voteCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]??"";
 const cascadeEasy=Math.min(.95,Math.max(.1,threshold/100));
 const economics={route:{cost:.85,latency:920,quality:89},ensemble:{cost:3.53,latency:2400,quality:94},cascade:{cost:.08+(1-cascadeEasy)*2.6,latency:260+(1-cascadeEasy)*2400,quality:68*cascadeEasy+97*(1-cascadeEasy)}}[mode];
 const submit=()=>{const t=explain.toLowerCase();const hits=["moe","external","ensemble","judge","cascade","router","policy","cost","latency","correl"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: distinguish internal MoE vs external routing, then explain ensemble/judge/cascade/composition patterns, hard policies and aggregate economics/failure correlation.");return;}setFeedback("Strong. You separated multiple system-of-models patterns instead of treating 'many models' as one architecture.");progress.completeTask("models-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 16 · SYSTEMS OF MODELS</span><h1>“Use multiple models” can mean four completely different systems.</h1><p>Route one request, cascade hard cases, run an ensemble in parallel, or compose specialists. Learn what each pattern buys — and what it costs.</p><TaskStamp done={done===9}>{done}/9 system-of-models missions complete</TaskStamp></div><div className={styles.party}>{ensembleCandidates.map(c=><AiMascot key={c.id} variant={c.variant} accent={c.accent} size={86} mood={selected.includes(c.id)?"excited":"happy"} label={c.name.toUpperCase()}/>)}</div></section>

  <LessonSection id="levels" onVisit={progress.markVisited} className={styles.scene}><h2>1. First separate internal MoE routing from external model routing.</h2>{levelCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["moe","external"].map(choice=><button key={choice} className={`${styles.button} ${levels[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(levels,setLevels,levelCases,i,choice,"models-levels")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="ensemble" onVisit={progress.markVisited} className={styles.scene}><h2>2. Build a parallel ensemble.</h2><div className={styles.candidates}>{ensembleCandidates.map(c=><button key={c.id} className={selected.includes(c.id)?styles.active:""} onClick={()=>{const next=selected.includes(c.id)?selected.filter(x=>x!==c.id):[...selected,c.id];setSelected(next);if(next.length===3)progress.completeTask("models-ensemble")}}><AiMascot variant={c.variant} accent={c.accent} size={66}/><b>{c.name}</b><span>answer {c.answer}</span><small>${c.cost} · {c.latency}ms</small></button>)}</div><p>Current majority answer: <b>{selected.length===3?majority:"select all three"}</b>. Majority can help with independent noise, but it can also confidently agree on a shared error.</p></LessonSection>

  <LessonSection id="judge" onVisit={progress.markVisited} className={styles.scene}><h2>3. Replace blind voting with a judge/verifier.</h2><p>Question: “What is 6×7?” Candidates: Spark=42, Atlas=42, Reason=41. Choose the best judging signal.</p><div className={styles.judge}>{["majority-only","calculator-verifier","model-judge"].map(choice=><button key={choice} className={judge===choice?styles.active:""} onClick={()=>{setJudge(choice);setJudgeSeen(true);if(choice==="calculator-verifier")progress.completeTask("models-judge")}}>{choice}</button>)}</div>{judgeSeen&&<p className={styles.feedback}>{judge==="calculator-verifier"?"✓ An authoritative calculator is stronger evidence here than model popularity.":"This can be useful, but ask whether a more authoritative verifier exists for this task."}</p>}</LessonSection>

  <LessonSection id="cascade" onVisit={progress.markVisited} className={styles.scene}><h2>4. Cascade cheap → expensive only when necessary.</h2><label className={styles.slider}>Accept cheap-model result when confidence/verifier score ≥ <b>{threshold}%</b><input type="range" min="40" max="95" value={threshold} onChange={e=>{setThreshold(+e.target.value);setCascadeSeen(true);progress.completeTask("models-cascade")}}/></label><div className={styles.flow}><span>Spark $0.08</span><b>score below {threshold}%?</b><span>→ Reason $2.60</span></div>{cascadeSeen&&<p>Approx easy-share assumption: {Math.round(cascadeEasy*100)}%. The economics depend on escalation rate <i>and</i> how trustworthy the escalation signal is.</p>}</LessonSection>

  <LessonSection id="mixture" onVisit={progress.markVisited} className={styles.scene}><h2>5. Classify different “mixture of models” system patterns.</h2>{mixtureCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["router","ensemble-judge","cascade","composition"].map(choice=><button key={choice} className={`${styles.button} ${mixture[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(mixture,setMixture,mixtureCases,i,choice,"models-mixture")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="correlation" onVisit={progress.markVisited} className={styles.scene}><h2>6. Diversity is useful only when failure modes are actually different.</h2>{correlationCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["correlated","diverse"].map(choice=><button key={choice} className={`${styles.button} ${correlation[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(correlation,setCorrelation,correlationCases,i,choice,"models-correlation")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="policy" onVisit={progress.markVisited} className={styles.scene}><h2>7. Hard constraints first; soft optimization second.</h2>{policyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hard-policy","cost-objective","cascade-trigger","eligibility"].map(choice=><button key={choice} className={`${styles.button} ${policy[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(policy,setPolicy,policyCases,i,choice,"models-policy")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="economics" onVisit={progress.markVisited} className={styles.scene}><h2>8. Account for the whole system, not one API call.</h2><div className={styles.modeTabs}>{(["route","ensemble","cascade"] as const).map(value=><button key={value} className={mode===value?styles.active:""} onClick={()=>{setMode(value);const next=[...new Set([...economicsSeen,value])];setEconomicsSeen(next);if(next.length===3)progress.completeTask("models-economics")}}>{value}</button>)}</div><div className={styles.metrics}><div><span>toy quality</span><b>{economics.quality.toFixed(1)}</b></div><div><span>toy latency</span><b>{Math.round(economics.latency)}ms</b></div><div><span>toy cost</span><b>${economics.cost.toFixed(2)}</b></div></div><p>These numbers are deliberately toy values. The mental model is the point: ensemble cost sums calls; parallel latency tends toward the slowest required branch; cascades depend on escalation rate.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>9. Explain systems of models without calling everything “routing.”</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain internal MoE vs external routing; router, ensemble+judge, cascade and composition; hard policies; cost/latency; correlated failures."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Systems of Models quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selectedAnswer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=8)}>Submit · {score}/9</button>{quizDone&&<p className={styles.feedback}>{score>=8?"★ SYSTEMS OF MODELS MASTERED":"Pass is 8/9. Revisit routing levels, cascades and correlated errors."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/model-routing-arena">← Routing Arena</Link><Link href="/lessons/module-16-capstone">Routing Boss Lab →</Link></div>
 </main>
}
