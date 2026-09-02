"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { StateMachineViewer } from "@/components/visualizations/state-machine-viewer";
import styles from "./state-machine-lab.module.css";

type Props={progress:LessonProgressApi};
type FlowState="received"|"planning"|"waiting-approval"|"executing"|"completed";

const nodes=[
{id:"received",label:"RECEIVED",detail:"job accepted"},{id:"planning",label:"PLANNING",detail:"model builds next actions"},{id:"waiting-approval",label:"WAITING APPROVAL",detail:"sensitive write paused"},{id:"executing",label:"EXECUTING",detail:"approved tool runs"},{id:"completed",label:"COMPLETED",detail:"result persisted"},
];
const edges=[
{from:"received",to:"planning",event:"start"},{from:"planning",to:"waiting-approval",event:"requires_write"},{from:"waiting-approval",to:"executing",event:"approved"},{from:"executing",to:"completed",event:"tool_success"},
];
const typeCases=[
["Loop-local variable candidateIndex during one function call","ephemeral"],["Conversation turn number for the current browser session","session"],["Long-running invoice job is waiting_for_approval and must survive restart","persistent"],["User prefers English responses across future sessions","memory"],
] as const;
const storageCases=[
["Fast TTL session state and short leases","redis"],["Durable workflow/task state with queries and transactions","sql"],["Append-only history of every transition","event-log"],["Small local single-user checkpoint prototype","file"],
] as const;
const durableCases=[
["Worker crashes after charging card but before recording success","idempotency-key"],["HTTP API times out before response is known","reconcile-before-retry"],["Job waits two days for approval","durable-state"],["Retry loop keeps running forever","retry-budget"],
] as const;
const quiz=[
["State is primarily…",["The current execution position/data needed to continue a process","A user's stable preference only","Model weights","A tokenizer"],0],
["Ephemeral state should usually…",["Exist only as long as the current computation needs it","Survive forever","Be embedded into a vector DB automatically","Replace checkpoints"],0],
["A workflow state machine makes…",["Allowed states and transitions explicit","Model weights bigger","Tokenization deterministic","Authentication unnecessary"],0],
["A checkpoint is useful because…",["A job can resume from a known saved execution state after interruption","It trains the model","It replaces tools","It removes retries"],0],
["Durable execution requires more than saving one string status.",["True","False"],0],
["Why does idempotency matter during retries?",["Repeated delivery should not duplicate side effects such as charges or sends","It increases embedding size","It removes auth","It makes prompts shorter"],0],
["An event log differs from a current-state snapshot because…",["It records the sequence of events/transitions that produced current state","It has no history","It is always a vector DB","It only stores user preferences"],0],
["Session state and persistent task state are identical.",["True","False"],1],
["A pending human approval should generally be…",["Persisted so restart does not silently forget the gate","Kept only in one process variable","Converted into model weights","Auto-approved after crash"],0],
] as const;

export function StateMachineLabLesson({progress}:Props){
 const [typeAnswers,setTypeAnswers]=useState<Record<number,string>>({}),[state,setState]=useState<FlowState>("received"),[visitedStates,setVisitedStates]=useState<FlowState[]>(["received"]),[eventClicks,setEventClicks]=useState<string[]>([]),[checkpoint,setCheckpoint]=useState<null|{state:FlowState;toolCalls:number;approval:boolean}>(null),[crashed,setCrashed]=useState(false),[toolCalls,setToolCalls]=useState(0),[storage,setStorage]=useState<Record<number,string>>({}),[durable,setDurable]=useState<Record<number,string>>({}),[eventLog,setEventLog]=useState<string[]>(["job.received"]),[replayed,setReplayed]=useState(false),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["state-types","state-machine","state-events","state-checkpoint","state-resume","state-storage","state-durable","state-event-log","state-explain"],sections=["state-types","machine","events","checkpoint","crash","storage","durable","event-log","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===9&&read===9;
 const quizScore=quiz.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const transition=(next:FlowState,event:string)=>{setState(next);setVisitedStates(current=>{const merged=[...new Set([...current,next])];if(nodes.every(node=>merged.includes(node.id as FlowState)))progress.completeTask("state-machine");return merged});setEventClicks(current=>{const merged=[...new Set([...current,event])];if(["start","requires_write","approved","tool_success"].every(x=>merged.includes(x)))progress.completeTask("state-events");return merged});setEventLog(current=>[...current,`job.${event}`]);if(next==="executing")setToolCalls(c=>c+1)};
 const validNext:Record<FlowState,{state:FlowState;event:string}|null>={received:{state:"planning",event:"start"},planning:{state:"waiting-approval",event:"requires_write"},"waiting-approval":{state:"executing",event:"approved"},executing:{state:"completed",event:"tool_success"},completed:null};
 const currentNext=validNext[state];
 const snapshot=useMemo(()=>({state,toolCalls,approval:state!=="waiting-approval"}),[state,toolCalls]);
 const saveCheckpoint=()=>{setCheckpoint(snapshot);progress.completeTask("state-checkpoint")};
 const crash=()=>{setCrashed(true);setState("received")};
 const resume=()=>{if(!checkpoint)return;setState(checkpoint.state);setToolCalls(checkpoint.toolCalls);setCrashed(false);progress.completeTask("state-resume")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["state","session","persistent","transition","event","checkpoint","resume","idempot","snapshot","event log"].filter(w=>t.includes(w)).length;if(explain.length<120||hits<6){setFeedback("Go deeper: distinguish ephemeral/session/persistent state, state transitions/events, checkpoints/resume, idempotency and snapshot vs event log.");return;}setFeedback("Strong. You described state as durable execution information, not persistent user knowledge, and explained how checkpoints/events support recovery.");progress.completeTask("state-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 14 · STATE & CHECKPOINTS LAB</span><h1>Memory answers “what should I recall?” State answers “where am I now?”</h1><p>A reliable agent must survive time, retries, approvals and crashes. That means explicit <b>state, transitions, checkpoints and recovery semantics</b> — not just a clever prompt.</p><TaskStamp done={done===9}>{done}/9 state missions complete</TaskStamp></div><div className={styles.heroVisual}><AiMascot variant="tile" accent="#6f9dff" size={110} mood={crashed?"wow":state==="completed"?"excited":"thinking"} label={crashed?"CRASH":state.toUpperCase()}/><code>{JSON.stringify(snapshot,null,2)}</code></div></section>

  <LessonSection id="state-types" onVisit={progress.markVisited} className={styles.scene}><h2>1. Classify four very different lifetimes.</h2>{typeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["ephemeral","session","persistent","memory"].map(choice=><button className={`${styles.button} ${typeAnswers[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...typeAnswers,[i]:choice};setTypeAnswers(next);if(typeCases.every((x,j)=>next[j]===x[1]))progress.completeTask("state-types")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="machine" onVisit={progress.markVisited} className={styles.scene}><h2>2. Walk a real state machine.</h2><StateMachineViewer nodes={nodes} edges={edges} active={state}/><div className={styles.controls}><button className={styles.primary} disabled={!currentNext} onClick={()=>currentNext&&transition(currentNext.state,currentNext.event)}>{currentNext?`Fire event: ${currentNext.event}`:"Workflow complete"}</button><button className={styles.button} onClick={()=>{setState("received");setVisitedStates(["received"]);setEventClicks([]);setEventLog(["job.received"])}}>Reset</button></div><p>Visited states: {visitedStates.join(" → ")}</p></LessonSection>

  <LessonSection id="events" onVisit={progress.markVisited} className={styles.scene}><h2>3. Events explain why a transition happened.</h2><div className={styles.grid2}><div className={styles.card}><b>STATE</b><p>{state}</p><small>Current snapshot.</small></div><div className={styles.card}><b>LAST EVENTS</b><pre>{eventLog.slice(-5).join("\n")}</pre><small>History of causes/transitions.</small></div></div><p>Run the complete machine above to observe `start`, `requires_write`, `approved` and `tool_success` events.</p></LessonSection>

  <LessonSection id="checkpoint" onVisit={progress.markVisited} className={styles.scene}><h2>4. Save a checkpoint before life gets messy.</h2><div className={styles.grid2}><div className={styles.card}><b>LIVE STATE</b><pre>{JSON.stringify(snapshot,null,2)}</pre><button className={styles.primary} onClick={saveCheckpoint}>Save checkpoint</button></div><div className={styles.card}><b>SAVED CHECKPOINT</b><pre>{checkpoint?JSON.stringify(checkpoint,null,2):"No checkpoint yet"}</pre></div></div><p>A useful checkpoint normally stores enough state to continue safely — task identity, current node, relevant outputs, retry counters, approvals, and references to external side effects.</p></LessonSection>

  <LessonSection id="crash" onVisit={progress.markVisited} className={styles.scene}><h2>5. Crash the worker. Then prove the process can recover.</h2><div className={styles.crashBox}><button className={styles.danger} disabled={!checkpoint} onClick={crash}>💥 Kill worker process</button><button className={styles.primary} disabled={!crashed||!checkpoint} onClick={resume}>Restore checkpoint & resume</button><div><b>process</b> {crashed?"offline / volatile variables lost":"running"}</div><div><b>durable checkpoint</b> {checkpoint?"available":"missing"}</div></div><p>Crashing a process should not silently erase a pending approval or force the whole job to repeat destructive side effects.</p></LessonSection>

  <LessonSection id="storage" onVisit={progress.markVisited} className={styles.scene}><h2>6. Choose state storage by access and durability needs.</h2>{storageCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["redis","sql","event-log","file"].map(choice=><button className={`${styles.button} ${storage[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...storage,[i]:choice};setStorage(next);if(storageCases.every((x,j)=>next[j]===x[1]))progress.completeTask("state-storage")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="durable" onVisit={progress.markVisited} className={styles.scene}><h2>7. Durable execution means handling uncertain delivery and side effects.</h2>{durableCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["idempotency-key","reconcile-before-retry","durable-state","retry-budget"].map(choice=><button className={`${styles.button} ${durable[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...durable,[i]:choice};setDurable(next);if(durableCases.every((x,j)=>next[j]===x[1]))progress.completeTask("state-durable")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="event-log" onVisit={progress.markVisited} className={styles.scene}><h2>8. Snapshot tells you “now.” Event log can replay “how.”</h2><div className={styles.grid2}><div className={styles.card}><b>CURRENT SNAPSHOT</b><pre>{JSON.stringify(snapshot,null,2)}</pre></div><div className={styles.card}><b>EVENT LOG</b><pre>{eventLog.join("\n")}</pre></div></div><button className={styles.primary} onClick={()=>{setReplayed(true);progress.completeTask("state-event-log")}}>Replay events into reconstructed state</button>{replayed&&<div className={styles.replay}>REPLAY → {eventLog.map((event,i)=><span key={`${event}-${i}`}>{event}</span>)} → <b>{state}</b></div>}<p>This is event-sourcing intuition, not a claim that every agent needs event sourcing. Often a durable snapshot plus audit log is enough.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>9. Explain why a reliable agent needs state even if its model is excellent.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain state lifetime, state machines/events, checkpoints/resume, durable side effects/idempotency and snapshot vs event log."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>State & Checkpoints quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 9 rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=8)}>Submit · {quizScore}/9</button>{quizDone&&<p className={styles.feedback}>{quizScore>=8?"★ STATE & RECOVERY MASTERED":"Pass is 8/9. Revisit durable execution and event history."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/memory-palace">← Memory Palace</Link><Link href="/lessons/module-14-capstone">Memory & State Boss Lab →</Link></div>
 </main>
}
