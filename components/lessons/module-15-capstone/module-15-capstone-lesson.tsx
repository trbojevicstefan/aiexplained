"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { QueueJob, QueueVisualizer } from "@/components/visualizations/queue-visualizer";
import styles from "./module-15-capstone.module.css";

type Props={progress:LessonProgressApi};
const roleCases=[
["One supervisor owns completion and escalation","good"],["Research worker and writer both own final publish","bad"],["Router chooses specialist by task capability","good"],["Critic can silently create production writes","bad"],
] as const;
const dependencyCases=[
["Three independent research branches start together","parallel"],["Final memo starts only after required research + cost branches finish","fanin"],["Invoice create waits for customer lookup result","sequential"],["Optional sentiment branch can finish after core memo","optional"],
] as const;
const failureCases=[
["Search API returns transient 503","retry"],["Schema-invalid write request fails five times","dead-letter"],["Payment timeout may have succeeded","reconcile"],["Rate limit includes Retry-After: 30","backoff"],
] as const;
const loopCases=[
["A→B→A handoff repeats","max-handoffs"],["Same account-research job appears twice","dedupe-key"],["Critic/reviser cycle never improves score","termination-score"],["Tool retry loop has no cap","retry-budget"],
] as const;
const deadlockCases=[
["Research waits on critic; critic waits on research final","remove-cycle"],["Worker lease remains forever after crash","lease-expiry"],["Two workers lock A then B in opposite order","lock-order"],["Human approval never arrives","deadline-escalate"],
] as const;
const durableCases=[
["Queue must survive orchestrator restart","persist-queue"],["Fan-out child completion must survive restart","persist-children"],["Pending approval must survive overnight","persist-state"],["Write retries need side-effect safety","idempotency"],
] as const;
const quiz=[
["The main job of orchestration is…",["Coordinate tasks, workers, dependencies, events and recovery","Make model weights larger","Replace tools","Tokenize prompts"],0],
["A router usually decides…",["Where a task should go next","Whether model weights update","How tokens split","Which user memory is true"],0],
["A supervisor commonly…",["Coordinates completion/escalation across work","Acts as every specialist simultaneously","Replaces queues","Removes state"],0],
["Fan-out is useful when…",["Subtasks are sufficiently independent to run concurrently","Steps have strict data dependencies","Only one worker exists","All writes must serialize"],0],
["Fan-in should usually wait for…",["Required upstream branches to finish or satisfy join condition","Any one random branch","No state","Model training"],0],
["A transient error and a permanent validation error should have identical retry policy.",["True","False"],1],
["A dead-letter queue helps isolate…",["Repeated/permanent failures for later inspection/remediation","Successful tasks","User preferences","Model weights"],0],
["Duplicate job execution can be reduced with…",["Dedupe/idempotency keys and ownership/leases","More agents","Longer prompts","Higher temperature"],0],
["Deadlock requires…",["A waiting dependency/resource cycle or equivalent unresolved blocking condition","Only one completed job","Token sampling","A vector index"],0],
["Durable orchestration should persist child-job status across restart.",["True","False"],0],
["Consensus/voting can still fail when agents share the same wrong evidence.",["True","False"],0],
["Multi-agent architecture should be chosen because…",["Decomposition, specialization or parallelism justify its coordination cost","More agents always means better intelligence","It looks advanced","It eliminates testing"],0],
] as const;

export function Module15CapstoneLesson({progress}:Props){
 const [roles,setRoles]=useState<Record<number,string>>({}),[jobs,setJobs]=useState<QueueJob[]>([{id:"R1",label:"market research",status:"queued"},{id:"R2",label:"market research DUPLICATE",status:"queued"},{id:"C1",label:"cost model",status:"queued"},{id:"W1",label:"final memo",status:"queued"}]),[deps,setDeps]=useState<Record<number,string>>({}),[failures,setFailures]=useState<Record<number,string>>({}),[loops,setLoops]=useState<Record<number,string>>({}),[deadlocks,setDeadlocks]=useState<Record<number,string>>({}),[durable,setDurable]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m15-roles","m15-queue","m15-dependencies","m15-failures","m15-loops","m15-deadlock","m15-durable","m15-explain"],sections=["roles","queue","dependencies","failures","loops","deadlock","durable","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const workers=[{id:"research",label:"RESEARCH",variant:"briefcase" as const,accent:"#72ccff"},{id:"data",label:"DATA",variant:"tile" as const,accent:"#82dfaa"},{id:"writer",label:"WRITER",variant:"star" as const,accent:"#ffd85b"}];
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const repairQueue=()=>{setJobs([{id:"R1",label:"market research",status:"running",worker:"research"},{id:"C1",label:"cost model",status:"running",worker:"data"},{id:"W1",label:"final memo",status:"queued"}]);progress.completeTask("m15-queue")};
 const finishBranches=()=>setJobs([{id:"R1",label:"market research",status:"done"},{id:"C1",label:"cost model",status:"done"},{id:"W1",label:"final memo",status:"running",worker:"writer"}]);
 const finishAll=()=>setJobs([{id:"R1",label:"market research",status:"done"},{id:"C1",label:"cost model",status:"done"},{id:"W1",label:"final memo",status:"done"}]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["queue","worker","router","supervisor","fan","retry","dead","dedupe","deadlock","durable","idempot"].filter(w=>t.includes(w)).length;if(explain.length<150||hits<8){setFeedback("Go deeper: explain ownership/roles, queue workers, dependencies/fan-in, retry vs DLQ, loop/dedupe, deadlock and durable/idempotent recovery.");return;}setFeedback("Strong. You repaired coordination at the system level instead of trying to prompt-engineer around queue/dependency/recovery bugs.");progress.completeTask("m15-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 15 · BROKEN SWARM BOSS LAB</span><h1>Five smart agents. One terrible system.</h1><p>Repair ownership, duplicate work, dependencies, retries, deadlocks and persistence. The challenge is not to make the agents “smarter.” It is to make the <b>coordination semantics correct</b>.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><div className={styles.team}><AiMascot variant="bot" accent="#7f83ff" size={90} mood="thinking" label="SUPERVISOR"/><AiMascot variant="briefcase" accent="#72ccff" size={76} mood="happy" label="R1"/><AiMascot variant="briefcase" accent="#ff8c8c" size={76} mood="wow" label="R2 DUP"/><AiMascot variant="star" accent="#ffd85b" size={76} mood={done>6?"excited":"thinking"} label="CRITIC"/></div></section>

  <LessonSection id="roles" onVisit={progress.markVisited} className={styles.scene}><h2>1. Repair role boundaries and ownership.</h2>{roleCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","bad"].map(choice=><button key={choice} className={`${styles.button} ${roles[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(roles,setRoles,roleCases,i,choice,"m15-roles")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="queue" onVisit={progress.markVisited} className={styles.scene}><h2>2. Remove duplicate work and make worker claims explicit.</h2><QueueVisualizer jobs={jobs} workers={workers}/><div className={styles.controls}><button className={styles.primary} onClick={repairQueue}>Dedupe R1/R2 + claim independent jobs</button><button className={styles.button} onClick={finishBranches}>Finish required branches → start writer</button><button className={styles.button} onClick={finishAll}>Finish all</button></div></LessonSection>

  <LessonSection id="dependencies" onVisit={progress.markVisited} className={styles.scene}><h2>3. Fix dependency semantics.</h2>{dependencyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["parallel","fanin","sequential","optional"].map(choice=><button key={choice} className={`${styles.button} ${deps[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(deps,setDeps,dependencyCases,i,choice,"m15-dependencies")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="failures" onVisit={progress.markVisited} className={styles.scene}><h2>4. Route failures by class, not emotion.</h2>{failureCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["retry","dead-letter","reconcile","backoff"].map(choice=><button key={choice} className={`${styles.button} ${failures[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(failures,setFailures,failureCases,i,choice,"m15-failures")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="loops" onVisit={progress.markVisited} className={styles.scene}><h2>5. Stop agent loops and repeated jobs.</h2>{loopCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["max-handoffs","dedupe-key","termination-score","retry-budget"].map(choice=><button key={choice} className={`${styles.button} ${loops[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(loops,setLoops,loopCases,i,choice,"m15-loops")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="deadlock" onVisit={progress.markVisited} className={styles.scene}><h2>6. Break waits that cannot resolve.</h2>{deadlockCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["remove-cycle","lease-expiry","lock-order","deadline-escalate"].map(choice=><button key={choice} className={`${styles.button} ${deadlocks[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(deadlocks,setDeadlocks,deadlockCases,i,choice,"m15-deadlock")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="durable" onVisit={progress.markVisited} className={styles.scene}><h2>7. Make the control plane survive restart.</h2>{durableCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["persist-queue","persist-children","persist-state","idempotency"].map(choice=><button key={choice} className={`${styles.button} ${durable[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(durable,setDurable,durableCases,i,choice,"m15-durable")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the repaired architecture.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain roles/ownership, queue workers, fan-out/fan-in dependencies, retries/DLQ, dedupe/loop controls, deadlock prevention and durable/idempotent recovery."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 15 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ ORCHESTRATION MASTERED":"Pass is 10/12. Revisit dependencies, failure classes and durable coordination."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/multi-agent-patterns">← Multi-Agent Patterns</Link><Link href="/lessons/model-routing-arena">Model Routing →</Link></div>
 </main>
}
