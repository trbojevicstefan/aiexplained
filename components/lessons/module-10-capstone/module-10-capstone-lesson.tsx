"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentLoop } from "@/components/visualizations/agent-loop";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../what-is-agent/what-is-agent.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["Agent = model plus…",["Runtime loop, goals/state/tools/environment/permissions and supporting system machinery","Only a persona prompt","Only a vector DB","Only a browser"],0],
["A tool write should happen…",["After schema/policy/permission validation and any required approval","Whenever the model mentions it","During pretraining","Only after a retry loop"],0],
["The runtime owns…",["Execution loop/state/tool orchestration and enforcement around model calls","The learned weights only","The tokenizer vocabulary only","All user memory automatically"],0],
["Task state can include…",["Pending approval, selected slot, retry count","All training data","Only user preferences","Only tool definitions"],0],
["Persistent memory is best used for…",["Selected durable information useful in future sessions/tasks","Every transient tool result forever","All hidden reasoning","Every retry counter"],0],
["Unbounded autonomy is risky because…",["Tool permissions/credentials can turn model mistakes into real-world side effects","Models cannot emit text","It lowers token count","It removes embeddings"],0],
["A workflow is preferable when…",["The control path is known and deterministic behavior is desired","You always want dynamic replanning","No APIs exist","You need infinite loops"],0],
["An agent is useful when…",["The next action depends on observations/results and cannot be fully predetermined cheaply","Every process should be an agent","Only the prompt is long","There are no tools"],0],
["Tool failure handling should include…",["Timeouts/retries/backoff/idempotency/limits as appropriate","Infinite retries","Ignoring errors","Updating model weights"],0],
["Completion requires…",["A goal/stop criterion checked by the runtime/system","A final period in the model text","A tool call always","A memory write"],0],
["A tool result becomes useful to the model after…",["The runtime injects/represents it in the next context/state","It secretly changes weights","It becomes a system prompt automatically","It retrains embeddings"],0],
["The safest mental model is…",["The model proposes decisions inside a controlled software system","The model itself is the whole production agent","Every LLM API is automatically an agent","Agents need no policy"],0],
] as const;

export function Module10CapstoneLesson({progress}:Props){
 const [parts,setParts]=useState<string[]>([]),[goal,setGoal]=useState(""),[step,setStep]=useState(0),[state,setState]=useState<Record<number,string>>({}),[permission,setPermission]=useState(""),[failure,setFailure]=useState(""),[stop,setStop]=useState(""),[diagnose,setDiagnose]=useState<Record<number,string>>({}),[answers,setAnswers]=useState<Record<number,number>>({});
 const required=["goal","state","tools","runtime-loop","permissions","environment"];
 const taskIds=["m10-components","m10-goal","m10-loop","m10-state","m10-permission","m10-recovery","m10-stop","m10-diagnose"],sectionIds=["components","goal","loop","state","permission","recovery","stop","diagnose"];
 const done=taskIds.filter(x=>progress.completedTasks[x]).length,read=sectionIds.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===8&&read===8;
 const stateCases=[
  ["15:30 is free","state"],["write approval pending","state"],["Alex prefers 30-minute meetings","memory"],
 ] as const;
 const diagnoseCases=[
  ["Every invoice follows exactly Parse → Validate → Post → Email.","workflow"],
  ["Research system searches, reads results, decides whether another source is needed, then stops when evidence is sufficient.","agent"],
  ["A model answers a question with text and has no external actions or persistent loop.","chatbot"],
 ] as const;
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const add=(p:string)=>{const next=[...new Set([...parts,p])];setParts(next);if(required.every(x=>next.includes(x)))progress.completeTask("m10-components")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 10 · AGENT BOSS LAB</span><h1>Ship a real agent, not a chatbot in a trench coat.</h1><p>Your starting system has an LLM and a UI. Everything that makes it safely pursue a multi-step goal is missing. Install the runtime pieces, run the loop, recover from failure and stop cleanly.</p><TaskStamp done={done===8}>{done}/8 agent-system missions cleared</TaskStamp></div><AgentLoop activeStep={step} accent="#70c9ff" label={done===8?"READY":"BUILD"}/></section>

  <LessonSection id="components" onVisit={progress.markVisited} className={styles.scene}><h2>1. Install the missing system pieces.</h2><div className={styles.parts}>{[...required,"bigger-model","more-temperature"].map(p=><button key={p} className={`${styles.part} ${parts.includes(p)?styles.correct:""}`} onClick={()=>add(p)}>{p}</button>)}</div><p>The model is already present. Your job is to add the software around it.</p></LessonSection>

  <LessonSection id="goal" onVisit={progress.markVisited} className={styles.scene}><h2>2. Turn “manage my calendar” into an operational goal.</h2>{[
   ["good","Schedule Alex for one free 30-minute slot tomorrow after 15:00; no double-book; require approval before event creation."],
   ["vague","Make my calendar better."],
   ["max","Do whatever is necessary forever."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${goal===id?(id==="good"?styles.correct:styles.wrong):""}`} onClick={()=>{setGoal(id);if(id==="good")progress.completeTask("m10-goal")}}>{text}</button>)}</LessonSection>

  <LessonSection id="loop" onVisit={progress.markVisited} className={styles.scene}><h2>3. Run a complete loop cycle.</h2><div className={styles.task}>{[
   "OBSERVE goal + calendar state",
   "DECIDE calendar.search_free_busy",
   "ACT: emit structured tool call",
   "ENVIRONMENT executes API call",
   "RESULT: 15:30 and 16:00 are free",
   "UPDATE state and decide next action",
  ][step]}</div><button className={styles.button} onClick={()=>{const next=Math.min(5,step+1);setStep(next);if(next===5)progress.completeTask("m10-loop")}}>Advance loop</button></LessonSection>

  <LessonSection id="state" onVisit={progress.markVisited} className={styles.scene}><h2>4. Store the right information in the right place.</h2>{stateCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["state","memory"].map(choice=><button key={choice} className={`${styles.button} ${state[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...state,[i]:choice};setState(next);if(stateCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m10-state")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="permission" onVisit={progress.markVisited} className={styles.scene}><h2>5. Proposed action: create_event at 15:30.</h2>{[
   ["approve","Pause and request user approval because policy marks calendar writes as confirmation-required."],
   ["silent","Write it immediately because confidence is 97%."],
   ["scope","Give the agent permanent admin access to every calendar."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${permission===id?(id==="approve"?styles.correct:styles.wrong):""}`} onClick={()=>{setPermission(id);if(id==="approve")progress.completeTask("m10-permission")}}>{text}</button>)}</LessonSection>

  <LessonSection id="recovery" onVisit={progress.markVisited} className={styles.scene}><h2>6. Calendar API returns HTTP 503.</h2>{[
   ["bounded","Classify transient error → bounded retry with backoff; preserve idempotency; stop/escalate after budget."],
   ["infinite","Retry forever at full speed."],
   ["pretend","Pretend the event succeeded and tell the user it was booked."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${failure===id?(id==="bounded"?styles.correct:styles.wrong):""}`} onClick={()=>{setFailure(id);if(id==="bounded")progress.completeTask("m10-recovery")}}>{text}</button>)}</LessonSection>

  <LessonSection id="stop" onVisit={progress.markVisited} className={styles.scene}><h2>7. Tool result: event created, invite accepted.</h2>{[
   ["complete","Mark goal complete, persist only needed outcome, return final answer and end loop."],
   ["keep","Keep searching calendars forever because tools are still available."],
   ["delete","Delete and recreate the event to verify autonomy."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${stop===id?(id==="complete"?styles.correct:styles.wrong):""}`} onClick={()=>{setStop(id);if(id==="complete")progress.completeTask("m10-stop")}}>{text}</button>)}</LessonSection>

  <LessonSection id="diagnose" onVisit={progress.markVisited} className={styles.scene}><h2>8. Classify the architecture honestly.</h2>{diagnoseCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["chatbot","workflow","agent"].map(choice=><button key={choice} className={`${styles.button} ${diagnose[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...diagnose,[i]:choice};setDiagnose(next);if(diagnoseCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m10-diagnose")}}>{choice}</button>)}</div>)}</LessonSection>

  <section className={styles.quiz}><h2>Module 10 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Clear all eight agent-system missions. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit mastery exam · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODULE 10 MASTERED — you can now decompose an agent into model, runtime, state, actions and policy.":"Pass is 10/12. Revisit the loop and execution boundary."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/agent-loop-builder">← Agent Loop Builder</Link><Link href="/">Learning map →</Link></div>
 </main>
}
