"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { MemoryItem, MemoryShelf } from "@/components/visualizations/memory-shelf";
import { StateMachineViewer } from "@/components/visualizations/state-machine-viewer";
import styles from "./module-14-capstone.module.css";

type Props={progress:LessonProgressApi};
type RefundState="received"|"verified"|"waiting-approval"|"refund-sent"|"completed";
const triage=[
["User prefers refunds to original card when possible","memory"],["Refund case is currently waiting_for_approval","state"],["Policy excerpt retrieved for this model turn","context"],["The model's trained language capability","weights"],
] as const;
const memorySteps=["extract","normalize","attach-provenance","store","retrieve","rank","inject","update/delete"];
const conflictCases=[
["Old inferred timezone = UTC+1; newer verified profile = UTC+2","prefer-new-verified"],["Same meeting preference saved three times","dedupe"],["User explicitly asks to forget old phone number","delete"],["Many episodes repeat same durable fact","consolidate"],
] as const;
const storageCases=[
["Canonical profile/preference facts","sql"],["Semantic recall over episodic notes","vector"],["Fast volatile session cursor","redis"],["Durable workflow state/checkpoints","sql"],["Append-only transition history","event-log"],
] as const;
const quiz=[
["The safest beginner mental model for persistent memory is…",["Application/system storage retrieved and inserted into future context","Model weights rewriting after every message","Only the chat transcript","A hidden prompt"],0],
["Workflow state primarily tracks…",["Where execution currently stands and what is needed to continue","Stable user biography","Training corpus","Token IDs"],0],
["A memory retrieval system should usually…",["Rank a small relevant subset instead of injecting everything","Load every memory into every prompt","Fine-tune after every query","Ignore provenance"],0],
["Provenance helps resolve conflicts because…",["Source, timestamp and confidence can distinguish stronger/newer evidence","It changes model size","It removes context limits","It guarantees truth"],0],
["A user deletion request should be treated as…",["A lifecycle operation the memory system must support","A suggestion to ignore forever","A prompt to train on more data","A state-machine event only"],0],
["A pending approval belongs primarily in…",["Durable workflow state","Long-term semantic user memory","Model weights","Tokenizer vocabulary"],0],
["Why checkpoint before a destructive/write action?",["Recovery can know what was pending/completed and avoid unsafe duplication","It increases model accuracy","It removes authorization","It makes tools deterministic"],0],
["Idempotency is useful when…",["Retries may repeat delivery around uncertain side effects","Embedding memories","Tokenizing text","Building prompts"],0],
["An event log and state snapshot can coexist.",["True","False"],0],
["A memory vector score alone should override tenant/user scope.",["True","False"],1],
["Context, memory, state and weights are…",["Distinct layers that may interact but should not be collapsed","Four names for the same thing","All vector DB records","All prompts"],0],
["A crash-safe agent needs…",["Durable state/checkpoints plus side-effect/retry semantics","Only a larger model","Only more memory","No approvals"],0],
] as const;
const nodes=[{id:"received",label:"RECEIVED"},{id:"verified",label:"VERIFIED"},{id:"waiting-approval",label:"WAITING APPROVAL"},{id:"refund-sent",label:"REFUND SENT"},{id:"completed",label:"COMPLETED"}];
const edges=[{from:"received",to:"verified",event:"identity_ok"},{from:"verified",to:"waiting-approval",event:"refund_requires_approval"},{from:"waiting-approval",to:"refund-sent",event:"approved"},{from:"refund-sent",to:"completed",event:"confirmation_saved"}];
const baseMemories:MemoryItem[]=[
{id:"pref",type:"preference",title:"Refund preference",detail:"Prefer original card when possible",score:.94},
{id:"phone",type:"semantic",title:"Old phone",detail:"+1 555 0101",score:.42,stale:true},
{id:"episode",type:"episodic",title:"Previous refund",detail:"Refund completed successfully in May",score:.58},
{id:"procedure",type:"procedural",title:"Refund procedure",detail:"Verify → approval → refund → confirmation",score:.76},
];

export function Module14CapstoneLesson({progress}:Props){
 const [triageAnswers,setTriageAnswers]=useState<Record<number,string>>({}),[memory,setMemory]=useState<string[]>([]),[selected,setSelected]=useState<string[]>([]),[conflicts,setConflicts]=useState<Record<number,string>>({}),[state,setState]=useState<RefundState>("received"),[seenStates,setSeenStates]=useState<RefundState[]>(["received"]),[checkpoint,setCheckpoint]=useState<RefundState|null>(null),[sideEffectDone,setSideEffectDone]=useState(false),[crashed,setCrashed]=useState(false),[recovered,setRecovered]=useState(false),[stores,setStores]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m14-triage","m14-memory","m14-retrieval","m14-conflict","m14-workflow","m14-crash","m14-storage","m14-explain"],sections=["triage","memory-pipeline","retrieval","conflict","workflow","crash","storage","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const renderedMemories=baseMemories.map(m=>({...m,selected:selected.includes(m.id)}));
 const collect=(value:string,current:string[],setter:(next:string[])=>void,required:string[],task:string)=>{const next=[...new Set([...current,value])];setter(next);if(required.every(x=>next.includes(x)))progress.completeTask(task)};
 const transitionOrder:RefundState[]=["received","verified","waiting-approval","refund-sent","completed"];
 const advanceWorkflow=()=>{const index=transitionOrder.indexOf(state);if(index<0||index===transitionOrder.length-1)return;const next=transitionOrder[index+1];setState(next);setSeenStates(current=>{const merged=[...new Set([...current,next])];if(transitionOrder.every(s=>merged.includes(s)))progress.completeTask("m14-workflow");return merged});if(next==="refund-sent")setSideEffectDone(true)};
 const crashNow=()=>{if(!checkpoint||!sideEffectDone)return;setCrashed(true);setState("received")};
 const recover=()=>{if(!checkpoint)return;setState(sideEffectDone?"refund-sent":checkpoint);setCrashed(false);setRecovered(true);progress.completeTask("m14-crash")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["context","memory","state","weights","retriev","checkpoint","idempot","event","delete","scope"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: separate context/memory/state/weights, then explain memory retrieval/update plus durable state/checkpoint/idempotency recovery.");return;}setFeedback("Strong. You connected memory and state without collapsing them: memory recalls information; durable state continues execution safely.");progress.completeTask("m14-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 14 · MEMORY + STATE BOSS LAB</span><h1>Make the agent remember the user — without forgetting where the job stopped.</h1><p>You are repairing a refund agent. It needs persistent user memory <b>and</b> durable workflow state. One is about useful information across time; the other is about safe execution across time.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><div className={styles.party}><AiMascot variant="briefcase" accent="#8ca6ff" size={105} mood="thinking" label="MEMORY"/><AiMascot variant="tile" accent="#75ddb0" size={105} mood={recovered?"excited":crashed?"wow":"happy"} label="STATE"/></div></section>

  <LessonSection id="triage" onVisit={progress.markVisited} className={styles.scene}><h2>1. Triage the agent's four information layers.</h2><div className={styles.grid2}>{triage.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["context","memory","state","weights"].map(choice=><button className={`${styles.button} ${triageAnswers[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...triageAnswers,[i]:choice};setTriageAnswers(next);if(triage.every((x,j)=>next[j]===x[1]))progress.completeTask("m14-triage")}}>{choice}</button>)}</div>)}</div></LessonSection>

  <LessonSection id="memory-pipeline" onVisit={progress.markVisited} className={styles.scene}><h2>2. Build the complete memory lifecycle.</h2><div className={styles.pipeline}>{memorySteps.map((step,i)=><button key={step} className={memory.includes(step)?styles.active:""} onClick={()=>collect(step,memory,setMemory,memorySteps,"m14-memory")}><span>{i+1}</span>{step}</button>)}</div><p>Memory quality is the whole pipeline. Bad extraction, noisy storage, weak ranking or stale conflict handling can each damage the final answer.</p></LessonSection>

  <LessonSection id="retrieval" onVisit={progress.markVisited} className={styles.scene}><h2>3. Retrieve the minimum useful set.</h2><MemoryShelf items={renderedMemories} query="How should I refund this user?" onSelect={item=>{const next=selected.includes(item.id)?selected.filter(x=>x!==item.id):[...selected,item.id];setSelected(next);if(next.includes("pref")&&next.includes("procedure")&&!next.includes("phone")&&next.length<=3)progress.completeTask("m14-retrieval")}}/><p>Select <b>Refund preference</b> and <b>Refund procedure</b>. Do not inject the stale phone number just because it exists.</p></LessonSection>

  <LessonSection id="conflict" onVisit={progress.markVisited} className={styles.scene}><h2>4. Repair the memory store.</h2>{conflictCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["prefer-new-verified","dedupe","delete","consolidate"].map(choice=><button className={`${styles.button} ${conflicts[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...conflicts,[i]:choice};setConflicts(next);if(conflictCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m14-conflict")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="workflow" onVisit={progress.markVisited} className={styles.scene}><h2>5. Move the refund workflow through durable states.</h2><StateMachineViewer nodes={nodes} edges={edges} active={state}/><div className={styles.controls}><button className={styles.primary} disabled={state==="completed"} onClick={advanceWorkflow}>Advance state</button><button className={styles.button} onClick={()=>{setState("received");setSeenStates(["received"]);setSideEffectDone(false);setCheckpoint(null);setRecovered(false);setCrashed(false)}}>Reset workflow</button></div><p>{seenStates.join(" → ")}</p></LessonSection>

  <LessonSection id="crash" onVisit={progress.markVisited} className={styles.scene}><h2>6. Survive a crash after a real side effect.</h2><p>Get the workflow to <b>waiting-approval</b>, save a checkpoint, advance to `refund-sent`, then crash. Recovery must not issue the refund twice.</p><div className={styles.crash}><button className={styles.button} onClick={()=>setCheckpoint(state)}>Save checkpoint ({state})</button><button className={styles.danger} disabled={!checkpoint||!sideEffectDone} onClick={crashNow}>💥 Crash after refund side effect</button><button className={styles.primary} disabled={!crashed} onClick={recover}>Recover + reconcile side effect</button></div><div className={styles.grid2}><div className={styles.card}><b>checkpoint</b><p>{checkpoint??"none"}</p></div><div className={styles.card}><b>refund side effect</b><p>{sideEffectDone?"already happened — DO NOT DUPLICATE":"not executed"}</p></div></div>{recovered&&<p className={styles.feedback}>✓ Recovery resumed from durable knowledge of the side effect rather than blindly replaying the refund.</p>}</LessonSection>

  <LessonSection id="storage" onVisit={progress.markVisited} className={styles.scene}><h2>7. Draw clean storage boundaries.</h2>{storageCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["sql","vector","redis","event-log"].map(choice=><button className={`${styles.button} ${stores[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...stores,[i]:choice};setStores(next);if(storageCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m14-storage")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain memory + state as one production architecture.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain context vs memory vs state vs weights, memory lifecycle, scoping/deletion, durable workflow state, checkpoints and idempotent recovery."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 14 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MEMORY + STATE MASTERED":"Pass is 10/12. Revisit memory lifecycle and crash-safe state."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/state-machine-lab">← State & Checkpoints</Link><Link href="/lessons/orchestration-control-room">Agent Orchestration →</Link></div>
 </main>
}
