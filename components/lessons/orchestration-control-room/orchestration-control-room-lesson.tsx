"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { QueueJob, QueueVisualizer } from "@/components/visualizations/queue-visualizer";
import styles from "./orchestration-control-room.module.css";

type Props={progress:LessonProgressApi};
const roleCases=[
["Break goal into research tasks","planner"],["Choose which specialist handles each task","router"],["Coordinate workers and review overall completion","supervisor"],["Execute one specialist research task","worker"],["Critique assembled final answer","critic"],
] as const;
const decomposition=["research-market","research-competitors","calculate-cost","draft-summary"];
const executionCases=[
["Search three independent sources","parallel"],["Fetch customer → use customer_id to create invoice","sequential"],["Send job now and continue when completion event arrives","async"],["One tiny deterministic transformation","sequential"],
] as const;
const eventCases=[
["Stripe tells us payment succeeded","webhook"],["One producer publishes order.created for many consumers","pubsub"],["Worker emits job.completed inside our runtime","event"],["Scheduler wakes a daily briefing at 08:00","schedule"],
] as const;
const retryCases=[
["Transient 503 from search API","retry"],["Malformed request will never validate without code/data change","dead-letter"],["Rate limited for 30 seconds","retry-later"],["Payment write timed out after request may have succeeded","reconcile"],
] as const;
const handoffCases=[
["Planner gives researcher goal + constraints + source context","handoff"],["Researcher writes findings into task-scoped workspace","shared-workspace"],["Two agents overwrite same mutable document without ownership/versioning","conflict"],["Worker returns structured artifact to supervisor","handoff"],
] as const;
const durableCases=[
["Process restarts while jobs remain queued","persist-queue"],["Supervisor waits for human approval overnight","persist-state"],["Worker claims same job twice after lease timeout","idempotency"],["Fan-out has 4/5 children done before crash","persist-child-status"],
] as const;
const quiz=[
["Orchestration mainly coordinates…",["Tasks, workers/agents, state, events and execution order","Model weights only","Tokenization","Prompt wording only"],0],
["A router and supervisor are identical roles.",["True","False"],1],
["Independent subtasks are good candidates for…",["Parallel fan-out","Forced sequential execution","Model fine-tuning","Context deletion"],0],
["Fan-in means…",["Combine/continue after multiple branches produce results","Create more tokens","Delete jobs","Pick a model weight"],0],
["A queue helps because…",["Producers can submit work independently of worker availability and workers can claim jobs","It replaces state","It eliminates failures","It is model memory"],0],
["A dead-letter queue is useful for…",["Jobs that repeatedly/permanently fail and need separate inspection/remediation","Successful jobs","Prompt caching","Embedding search"],0],
["Pub/Sub is useful when…",["Events should be distributed to one or more interested consumers","One model needs more layers","A user changes password","A tokenizer merges tokens"],0],
["Durable orchestration should persist enough state to survive process restart.",["True","False"],0],
["Parallelizing dependent write steps is always safe.",["True","False"],1],
["Agent handoffs work better when…",["Goal, context, expected output and ownership are explicit","Agents share an unbounded hidden chat","No task id exists","All agents write same file simultaneously"],0],
] as const;

export function OrchestrationControlRoomLesson({progress}:Props){
 const [roles,setRoles]=useState<Record<number,string>>({}),[parts,setParts]=useState<string[]>([]),[jobs,setJobs]=useState<QueueJob[]>(decomposition.map((label,i)=>({id:`J${i+1}`,label,status:"queued" as const}))),[execution,setExecution]=useState<Record<number,string>>({}),[dag,setDag]=useState<string[]>([]),[events,setEvents]=useState<Record<number,string>>({}),[retry,setRetry]=useState<Record<number,string>>({}),[handoff,setHandoff]=useState<Record<number,string>>({}),[durable,setDurable]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["orch-roles","orch-decompose","orch-queue","orch-execution","orch-dag","orch-events","orch-retries","orch-handoff","orch-durable","orch-explain"],sections=["roles","decompose","queue","execution","dag","events","retries","handoff","durable","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const workers=[{id:"research",label:"RESEARCH",variant:"briefcase" as const,accent:"#73cfff"},{id:"data",label:"DATA",variant:"tile" as const,accent:"#82dfae"},{id:"writer",label:"WRITER",variant:"star" as const,accent:"#ffd95d"}];
 const allDone=jobs.every(j=>j.status==="done");
 const nextQueued=jobs.find(j=>j.status==="queued"||j.status==="retry");
 const assignNext=()=>{if(!nextQueued)return;const worker=nextQueued.label.includes("cost")?"data":nextQueued.label.includes("draft")?"writer":"research";setJobs(current=>current.map(j=>j.id===nextQueued.id?{...j,status:"running",worker}:j));progress.completeTask("orch-queue")};
 const finishRunning=(fail=false)=>{const running=jobs.find(j=>j.status==="running");if(!running)return;setJobs(current=>current.map(j=>j.id===running.id?{...j,status:fail?"retry":"done",worker:undefined}:j))};
 const forceDead=()=>{const target=jobs.find(j=>j.status==="retry")??jobs.find(j=>j.status==="queued");if(!target)return;setJobs(current=>current.map(j=>j.id===target.id?{...j,status:"dead",worker:undefined}:j));progress.completeTask("orch-retries")};
 const collect=(value:string,current:string[],setter:(next:string[])=>void,required:string[],task:string)=>{const next=[...new Set([...current,value])];setter(next);if(required.every(x=>next.includes(x)))progress.completeTask(task)};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["queue","worker","router","supervisor","parallel","event","retry","dead","state","handoff"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: explain queues/workers, router/supervisor roles, sequential vs parallel work, events, retries/DLQ, durable state and handoffs.");return;}setFeedback("Strong. You described orchestration as execution coordination around agents rather than 'more agents = smarter'.");progress.completeTask("orch-explain")};
 const runningCount=jobs.filter(j=>j.status==="running").length;
 const completedCount=jobs.filter(j=>j.status==="done").length;
 const summary=useMemo(()=>({queued:jobs.filter(j=>j.status==="queued"||j.status==="retry").length,running:runningCount,done:completedCount,dead:jobs.filter(j=>j.status==="dead").length}),[jobs,runningCount,completedCount]);
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 15 · ORCHESTRATION CONTROL ROOM</span><h1>One agent is a worker. Orchestration makes a system.</h1><p>Coordinate <b>roles, jobs, queues, events, retries, execution order and durable state</b>. More agents do not automatically improve a product — the useful part is how work is decomposed, routed, synchronized and recovered.</p><TaskStamp done={done===10}>{done}/10 orchestration missions complete</TaskStamp></div><div className={styles.heroTeam}><AiMascot variant="bot" accent="#7e88ff" size={92} mood="happy" label="SUPERVISOR"/><AiMascot variant="briefcase" accent="#73cfff" size={80} mood={runningCount?"excited":"happy"} label="WORKER"/><AiMascot variant="star" accent="#ffd95d" size={80} mood={allDone?"excited":"thinking"} label="CRITIC"/></div></section>

  <LessonSection id="roles" onVisit={progress.markVisited} className={styles.scene}><h2>1. Give agents jobs, not vague personalities.</h2>{roleCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["planner","router","supervisor","worker","critic"].map(choice=><button className={`${styles.button} ${roles[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...roles,[i]:choice};setRoles(next);if(roleCases.every((x,j)=>next[j]===x[1]))progress.completeTask("orch-roles")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="decompose" onVisit={progress.markVisited} className={styles.scene}><h2>2. Decompose one goal into work that can actually be scheduled.</h2><p>Goal: “Produce a launch memo about the AI-agent hosting market with cost analysis.”</p><div className={styles.decompose}>{decomposition.map((part,i)=><button key={part} className={parts.includes(part)?styles.active:""} onClick={()=>collect(part,parts,setParts,decomposition,"orch-decompose")}><span>JOB {i+1}</span>{part}</button>)}</div></LessonSection>

  <LessonSection id="queue" onVisit={progress.markVisited} className={styles.scene}><h2>3. Put work in a queue and let workers claim it.</h2><QueueVisualizer jobs={jobs} workers={workers}/><div className={styles.controls}><button className={styles.primary} onClick={assignNext} disabled={!nextQueued}>Dispatch next job</button><button className={styles.button} onClick={()=>finishRunning(false)} disabled={!jobs.some(j=>j.status==="running")}>Finish running job</button><button className={styles.danger} onClick={()=>finishRunning(true)} disabled={!jobs.some(j=>j.status==="running")}>Fail running job</button><button className={styles.button} onClick={()=>setJobs(decomposition.map((label,i)=>({id:`J${i+1}`,label,status:"queued"})))}>Reset queue</button></div><pre className={styles.stats}>{JSON.stringify(summary,null,2)}</pre></LessonSection>

  <LessonSection id="execution" onVisit={progress.markVisited} className={styles.scene}><h2>4. Sequential, parallel and async are execution properties.</h2>{executionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["sequential","parallel","async"].map(choice=><button className={`${styles.button} ${execution[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...execution,[i]:choice};setExecution(next);if(executionCases.every((x,j)=>next[j]===x[1]))progress.completeTask("orch-execution")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="dag" onVisit={progress.markVisited} className={styles.scene}><h2>5. Build fan-out → fan-in as a tiny DAG.</h2><div className={styles.dag}><button className={dag.includes("start")?styles.active:""} onClick={()=>collect("start",dag,setDag,["start","fanout","three-branches","fanin","finish"],"orch-dag")}>START</button><span>→</span><button className={dag.includes("fanout")?styles.active:""} onClick={()=>collect("fanout",dag,setDag,["start","fanout","three-branches","fanin","finish"],"orch-dag")}>FAN OUT</button><span>→</span><button className={dag.includes("three-branches")?styles.active:""} onClick={()=>collect("three-branches",dag,setDag,["start","fanout","three-branches","fanin","finish"],"orch-dag")}>RESEARCH · DATA · COST</button><span>→</span><button className={dag.includes("fanin")?styles.active:""} onClick={()=>collect("fanin",dag,setDag,["start","fanout","three-branches","fanin","finish"],"orch-dag")}>FAN IN</button><span>→</span><button className={dag.includes("finish")?styles.active:""} onClick={()=>collect("finish",dag,setDag,["start","fanout","three-branches","fanin","finish"],"orch-dag")}>WRITE MEMO</button></div><p>A DAG makes dependencies explicit: independent branches can run concurrently, then downstream work waits until required parents are complete.</p></LessonSection>

  <LessonSection id="events" onVisit={progress.markVisited} className={styles.scene}><h2>6. Events wake systems without making everything poll everything.</h2>{eventCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["event","webhook","pubsub","schedule"].map(choice=><button className={`${styles.button} ${events[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...events,[i]:choice};setEvents(next);if(eventCases.every((x,j)=>next[j]===x[1]))progress.completeTask("orch-events")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="retries" onVisit={progress.markVisited} className={styles.scene}><h2>7. Retry transient failures. Quarantine permanent ones.</h2>{retryCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["retry","retry-later","dead-letter","reconcile"].map(choice=><button className={`${styles.button} ${retry[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...retry,[i]:choice};setRetry(next);if(retryCases.every((x,j)=>next[j]===x[1]))progress.completeTask("orch-retries")}}>{choice}</button>)}</div>)}<button className={styles.danger} onClick={forceDead}>Send one failed job to dead-letter lane in queue visualizer</button></LessonSection>

  <LessonSection id="handoff" onVisit={progress.markVisited} className={styles.scene}><h2>8. Handoffs need contracts and shared-workspace ownership.</h2>{handoffCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["handoff","shared-workspace","conflict"].map(choice=><button className={`${styles.button} ${handoff[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...handoff,[i]:choice};setHandoff(next);if(handoffCases.every((x,j)=>next[j]===x[1]))progress.completeTask("orch-handoff")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="durable" onVisit={progress.markVisited} className={styles.scene}><h2>9. Durable orchestration survives the runtime process.</h2>{durableCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["persist-queue","persist-state","idempotency","persist-child-status"].map(choice=><button className={`${styles.button} ${durable[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...durable,[i]:choice};setDurable(next);if(durableCases.every((x,j)=>next[j]===x[1]))progress.completeTask("orch-durable")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain orchestration without saying “it manages multiple agents.”</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain roles, decomposition, queue/workers, sequential/parallel/async execution, events, retries/DLQ, handoffs and durable state."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Orchestration Control Room quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selectedAnswer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ ORCHESTRATION FOUNDATIONS MASTERED":"Pass is 9/10. Revisit queues, fan-out/fan-in and durable execution."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-14-capstone">← Memory & State</Link><Link href="/lessons/multi-agent-patterns">Multi-Agent Patterns →</Link></div>
 </main>
}
