"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentLoop } from "@/components/visualizations/agent-loop";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../harness-framework-runtime/harness-lab.module.css";

type Props={progress:LessonProgressApi};
const tools=[
{id:"read",name:"fs.read_file",mode:"read"},
{id:"search",name:"repo.search",mode:"read"},
{id:"write",name:"fs.write_file",mode:"write"},
{id:"shell",name:"shell.exec",mode:"danger"},
{id:"browser",name:"browser.open",mode:"network"},
] as const;
const errorCases=[
["HTTP 429 rate limit from read-only search API","retry"],
["Tool arguments fail JSON/schema validation before execution","repair"],
["HTTP 403: credential scope does not allow delete","stop"],
["Network timeout on idempotent GET","retry"],
] as const;
const capabilityCases=[
["Inspect package.json","filesystem"],["Run npm test inside container","shell"],["Open documentation page","browser"],["Evaluate a generated Python expression in isolated runtime","code"],
] as const;
const quiz=[
["Tool registration tells the model/runtime…",["Which named actions exist, their descriptions/schemas and execution adapters","How to change weights","How to expand context limit","How to create memory automatically"],0],
["Permission enforcement should happen…",["In application/runtime controls, not only by hoping the model follows text instructions","Only inside model weights","Only after a destructive action","Only at training time"],0],
["A retryable error example is…",["Transient rate limit/timeout on an idempotent safe call with bounded retry policy","A forbidden action with no scope","Invalid schema forever","User denied approval"],0],
["A sandbox can restrict…",["Filesystem, process, network and resource access","Only text style","Tokenizer vocabulary","Model parameter count"],0],
["Tracing helps answer…",["Which model/tool step happened, how long it took, what failed and what it cost","Only what color the UI was","Only training loss","Only embeddings"],0],
["Checkpointing a long-running agent means…",["Persist enough durable execution state to resume/recover","Saving every hidden thought forever","Increasing model size","Changing tool schemas"],0],
["Approval state should be…",["Durable and tied to the exact pending sensitive action/context","A loose chat message only","Ignored after refresh","Equivalent to model confidence"],0],
["Context/token management belongs in the harness because…",["Every model call has a finite working budget that must be assembled/trimmed/cached","It changes pretraining","It replaces tools","It is only UI"],0],
] as const;

export function HarnessRuntimeLabLesson({progress}:Props){
 const [registered,setRegistered]=useState<string[]>([]),[permissions,setPermissions]=useState<Record<string,string>>({}),[errors,setErrors]=useState<Record<number,string>>({}),[stateParts,setStateParts]=useState<string[]>([]),[sandbox,setSandbox]=useState<string[]>([]),[caps,setCaps]=useState<Record<number,string>>({}),[traces,setTraces]=useState<string[]>([]),[tokenBudget,setTokenBudget]=useState(12000),[checkpoint,setCheckpoint]=useState<string[]>([]),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({}),[loopStep,setLoopStep]=useState(0);
 const taskIds=["hr-tools","hr-permissions","hr-errors","hr-state-memory","hr-sandbox","hr-capabilities","hr-tracing","hr-checkpoint","hr-explain"],sections=["tools","permissions","errors","state-memory","sandbox","capabilities","tracing","checkpoint","explain"];
 const done=taskIds.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===9&&read===9;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const permissionDone=tools.every(t=>permissions[t.id]===(t.mode==="read"?"allow":t.mode==="write"?"confirm":t.mode==="danger"?"sandbox-confirm":"allow"));
 const errorDone=errorCases.every((x,i)=>errors[i]===x[1]), capDone=capabilityCases.every((x,i)=>caps[i]===x[1]);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["tool","permission","retry","sandbox","state","trace","token","checkpoint"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<5){setExplainFeedback("Go deeper: explain tool execution, permission enforcement, error policy, sandboxing, state, tracing/token budget and checkpoint/recovery.");return;}setExplainFeedback("Strong. You described the harness as operational control software, not a decorative wrapper around the model.");progress.completeTask("hr-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 11 · HARNESS RUNTIME LAB</span><h1>The agent needs an operating system around its decisions.</h1><p>This is where model output becomes controlled software execution: schemas, credentials, permissions, sandboxes, retries, state transitions, traces, budgets, checkpoints and approvals.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 runtime-control missions complete</TaskStamp></div><AgentLoop activeStep={loopStep} accent="#ae90ff" label="HARNESS"/></section>

  <LessonSection id="tools" onVisit={progress.markVisited} className={styles.scene}><h2>1. Register tools before the model can choose them.</h2><div className={styles.grid3}>{tools.map(tool=><button key={tool.id} className={`${styles.panel} ${registered.includes(tool.id)?styles.correct:""}`} onClick={()=>mark(tool.id,registered,setRegistered,5,"hr-tools")}><b>{tool.name}</b><p>mode: {tool.mode} · schema + description + execution adapter</p></button>)}</div><p>Tool descriptions/schemas become part of the model-facing interface. Execution adapters remain application/runtime code.</p></LessonSection>

  <LessonSection id="permissions" onVisit={progress.markVisited} className={styles.scene}><h2>2. Give each tool the minimum authority it needs.</h2>{tools.map(tool=><div className={styles.stackItem} key={tool.id}><b>{tool.name}</b><div>{["allow","confirm","sandbox-confirm","deny"].map(choice=><button key={choice} className={`${styles.button} ${permissions[tool.id]===choice?styles.correct:""}`} onClick={()=>{const next={...permissions,[tool.id]:choice};setPermissions(next);if(tools.every(t=>next[t.id]===(t.mode==="read"?"allow":t.mode==="write"?"confirm":t.mode==="danger"?"sandbox-confirm":"allow")))progress.completeTask("hr-permissions")}}>{choice}</button>)}</div></div>)}{permissionDone&&<p className={styles.feedback}>✓ Read tools are easy; writes require confirmation; shell requires sandbox + confirmation in this toy policy.</p>}</LessonSection>

  <LessonSection id="errors" onVisit={progress.markVisited} className={styles.scene}><h2>3. Error handling starts by classifying the failure.</h2>{errorCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["retry","repair","stop"].map(choice=><button key={choice} className={`${styles.button} ${errors[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...errors,[i]:choice};setErrors(next);if(errorCases.every((x,j)=>next[j]===x[1]))progress.completeTask("hr-errors")}}>{choice}</button>)}</div>)}{errorDone&&<p className={styles.feedback}>✓ Retry transient/idempotent failures with limits; repair invalid model arguments before execution; stop/escalate on forbidden authority.</p>}</LessonSection>

  <LessonSection id="state-memory" onVisit={progress.markVisited} className={styles.scene}><h2>4. Wire live state, memory retrieval and checkpoints separately.</h2><div className={styles.grid3}>{[
   ["state","TASK STATE","current file, test result, retry count, pending patch"],
   ["memory","MEMORY","selected durable facts/preferences from prior sessions"],
   ["events","EVENT LOG","model/tool transitions useful for replay/debugging"],
  ].map(([id,title,copy])=><button key={id} className={`${styles.panel} ${stateParts.includes(id)?styles.correct:""}`} onClick={()=>mark(id,stateParts,setStateParts,3,"hr-state-memory")}><b>{title}</b><p>{copy}</p></button>)}</div></LessonSection>

  <LessonSection id="sandbox" onVisit={progress.markVisited} className={styles.scene}><h2>5. Sandbox the environment, not just the prompt.</h2><div className={styles.parts}>{[
  "workspace-only filesystem","no host secrets","restricted network","CPU/memory limits","process timeout","ephemeral credentials",
  ].map(item=><button key={item} className={`${styles.part} ${sandbox.includes(item)?styles.correct:""}`} onClick={()=>mark(item,sandbox,setSandbox,6,"hr-sandbox")}>{item}</button>)}</div><p>Prompt instructions can be bypassed or misunderstood. Real security relies on actual capability boundaries enforced outside the model.</p></LessonSection>

  <LessonSection id="capabilities" onVisit={progress.markVisited} className={styles.scene}><h2>6. Filesystem, shell, browser and code execution are distinct capabilities.</h2>{capabilityCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["filesystem","shell","browser","code"].map(choice=><button key={choice} className={`${styles.button} ${caps[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...caps,[i]:choice};setCaps(next);if(capabilityCases.every((x,j)=>next[j]===x[1]))progress.completeTask("hr-capabilities")}}>{choice}</button>)}</div>)}{capDone&&<p className={styles.warning}>Each capability has different attack surface and sandbox requirements. “Computer access” is too vague for a security model.</p>}</LessonSection>

  <LessonSection id="tracing" onVisit={progress.markVisited} className={styles.scene}><h2>7. If you cannot trace the loop, you cannot debug the agent.</h2><div className={styles.machine}>{[
   ["run","RUN span"],["model","MODEL 1.8s · 3.2k tokens"],["tool","repo.search 220ms"],["model2","MODEL 1.1s · 1.6k tokens"],["write","fs.write_file 45ms"],
  ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${traces.includes(id)?styles.correct:""}`} onClick={()=>mark(id,traces,setTraces,5,"hr-tracing")}>{text}</button>{i<4&&<span className={styles.arrow}>→</span>}</span>)}</div><div className={styles.panel}><b>Context/token budget</b><input style={{width:"100%"}} type="range" min="4000" max="32000" step="1000" value={tokenBudget} onChange={e=>setTokenBudget(+e.target.value)}/><p>{tokenBudget.toLocaleString()} tokens available for instructions + history + code context + tool results + output budget.</p></div></LessonSection>

  <LessonSection id="checkpoint" onVisit={progress.markVisited} className={styles.scene}><h2>8. Long jobs need durable sessions and approval state.</h2><div className={styles.machine}>{[
   ["session","session/job ID"],["checkpoint","checkpoint state after tests"],["approval","pending approval: write migration"],["resume","resume after restart"],
  ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${checkpoint.includes(id)?styles.correct:""}`} onClick={()=>mark(id,checkpoint,setCheckpoint,4,"hr-checkpoint")}>{text}</button>{i<3&&<span className={styles.arrow}>→</span>}</span>)}</div><p>An approval should bind to the exact proposed action and state; a restart should not silently reinterpret stale approval for a different action.</p><button className={styles.button} onClick={()=>setLoopStep((loopStep+1)%6)}>Advance harness loop</button></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain what the harness protects and operates.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain tool registry/execution, permissions, errors/retries, state/memory, sandbox/capabilities, traces/tokens, checkpoints/approvals/sessions."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Harness Runtime quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine runtime rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizDone&&<p className={styles.feedback}>{quizScore>=7?"★ HARNESS RUNTIME MASTERED":"Pass is 7/8. Review capability boundaries and recovery."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/harness-framework-runtime">← Harness Cutaway</Link><Link href="/lessons/framework-atlas">Framework Atlas →</Link></div>
 </main>
}
