"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { AgentLoop } from "@/components/visualizations/agent-loop";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../harness-framework-runtime/harness-lab.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["The model and harness differ because…",["The model produces learned inference; the harness manages context/tools/loop/state/policy around it","They are always identical","Harness means tokenizer","Model means runtime process"],0],
["Runtime is best described as…",["The executing process/environment that runs model/tool/state transitions","Only a type definition","Only a prompt","Only model weights"],0],
["Framework is best described as…",["Developer abstractions used to construct agent/workflow applications","The final running session only","A GPU kernel only","A memory record"],0],
["An SDK usually provides…",["Programmatic client/interfaces/helpers, not necessarily the whole agent runtime","Model weights","A guaranteed agent loop","Persistent memory automatically"],0],
["Tool permission checks should be enforced…",["In runtime/application capability controls","Only in a friendly prompt","Only after execution","Only during training"],0],
["A sandbox should constrain…",["Filesystem/process/network/resources/credentials as appropriate","Only answer formatting","Only tokenizer IDs","Only vector dimensions"],0],
["A malformed tool call should usually…",["Fail validation and be repaired/rejected before side effects","Execute anyway","Become a model checkpoint","Increase temperature"],0],
["Bounded retries matter because…",["Infinite retries can multiply cost, loops and duplicate side effects","They reduce model size","They change context windows","They create embeddings"],0],
["Tracing a run should distinguish…",["Model spans, tool spans, latency/tokens/errors/state transitions","Only final answer text","Only UI clicks","Only GPU temperature"],0],
["Checkpointing is useful because…",["Long-running execution can resume/recover with durable state","It increases intelligence automatically","It replaces sandboxing","It changes tokenizer vocabulary"],0],
["Framework selection should begin with…",["Required state/control flow/data/runtime/typing/operational needs","Which logo trends today","Largest dependency tree","Highest temperature"],0],
["Harness/runtime/framework boundaries are…",["Useful conceptual roles whose real product boundaries may overlap","A universal formal protocol with identical meanings everywhere","Only marketing terms with no use","Defined by BPE"],0],
] as const;

export function Module11CapstoneLesson({progress}:Props){
 const [classify,setClassify]=useState<Record<number,string>>({}),[parts,setParts]=useState<string[]>([]),[toolPolicy,setToolPolicy]=useState<Record<string,string>>({}),[sandbox,setSandbox]=useState<string[]>([]),[errorPolicy,setErrorPolicy]=useState<Record<number,string>>({}),[traceParts,setTraceParts]=useState<string[]>([]),[tokenBudget,setTokenBudget]=useState(32000),[durability,setDurability]=useState<string[]>([]),[framework,setFramework]=useState<Record<number,string>>({}),[answers,setAnswers]=useState<Record<number,number>>({}),[loop,setLoop]=useState(0);
 const tasks=["m11-classify","m11-assemble","m11-tools","m11-sandbox","m11-errors","m11-trace","m11-durability","m11-framework"],sections=["classify","assemble","tools","sandbox","errors","trace","durability","framework"];
 const done=tasks.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===8&&read===8;
 const classificationCases=[
  ["GPT-like learned checkpoint generating the next action","model"],
  ["Worker process loading session, invoking model and tools","runtime"],
  ["Context compression + retry + permission + tool wrapper","harness"],
  ["Library exposes Agent, Tool, Graph and Handoff abstractions","framework"],
  ["Typed API client for model responses","sdk"],
 ] as const;
 const errorCases=[
  ["fs.write_file args missing required path","repair"],
  ["repo.search times out once; it is idempotent","retry"],
  ["shell requests host root access outside sandbox policy","stop"],
  ["write returns 503 after request may have reached server","idempotency"],
 ] as const;
 const frameworkCases=[
  ["Explicit durable branching state machine","graph"],
  ["RAG-heavy data ingestion/retrieval app","data"],
  ["Small typed Python tool agent","typed"],
  ["Several specialist roles delegating work","multi"],
 ] as const;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const toolsDone=toolPolicy.read==="allow"&&toolPolicy.write==="confirm"&&toolPolicy.shell==="sandbox-confirm";
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 11 · HARNESS BOSS LAB</span><h1>The model is good. The operating system around it is reckless.</h1><p>Repair a coding-agent harness before it touches a repository. Classify responsibilities, constrain tools, sandbox execution, bound retries, trace the run and make approval/session state durable.</p><TaskStamp done={done===8}>{done}/8 harness incidents repaired</TaskStamp></div><AgentLoop activeStep={loop} accent="#ae90ff" label={done===8?"SAFE":"HARNESS"}/></section>

  <LessonSection id="classify" onVisit={progress.markVisited} className={styles.scene}><h2>1. Classify every layer before debugging it.</h2>{classificationCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["model","harness","runtime","framework","sdk"].map(choice=><button key={choice} className={`${styles.button} ${classify[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...classify,[i]:choice};setClassify(next);if(classificationCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m11-classify")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="assemble" onVisit={progress.markVisited} className={styles.scene}><h2>2. The current harness only calls the model. Install the missing machinery.</h2><div className={styles.parts}>{["context manager","tool registry","state store","permission gate","error/retry policy","sandbox","tracing","checkpoint/session store"].map(part=><button key={part} className={`${styles.part} ${parts.includes(part)?styles.correct:""}`} onClick={()=>mark(part,parts,setParts,8,"m11-assemble")}>{part}</button>)}</div></LessonSection>

  <LessonSection id="tools" onVisit={progress.markVisited} className={styles.scene}><h2>3. Repair tool authority.</h2>{[
   ["read","repo.read/search","read-only"],["write","fs.write_file","write"],["shell","shell.exec","dangerous"],
  ].map(([id,name,kind])=><div className={styles.stackItem} key={id}><b>{name}</b><div>{["allow","confirm","sandbox-confirm","deny"].map(choice=><button key={choice} className={`${styles.button} ${toolPolicy[id]===choice?styles.correct:""}`} onClick={()=>{const next={...toolPolicy,[id]:choice};setToolPolicy(next);if(next.read==="allow"&&next.write==="confirm"&&next.shell==="sandbox-confirm")progress.completeTask("m11-tools")}}>{choice}</button>)}</div></div>)}{toolsDone&&<p className={styles.feedback}>✓ Read freely, gate writes, and sandbox+confirm arbitrary shell in this toy policy.</p>}</LessonSection>

  <LessonSection id="sandbox" onVisit={progress.markVisited} className={styles.scene}><h2>4. The shell currently sees the host filesystem and network.</h2><div className={styles.parts}>{["workspace-only mount","no host secrets","restricted egress","CPU/memory quota","process timeout","ephemeral scoped credentials"].map(item=><button key={item} className={`${styles.part} ${sandbox.includes(item)?styles.correct:""}`} onClick={()=>mark(item,sandbox,setSandbox,6,"m11-sandbox")}>{item}</button>)}</div><p className={styles.warning}>Prompting the model to “be careful” is not isolation. Capability boundaries belong outside the model.</p></LessonSection>

  <LessonSection id="errors" onVisit={progress.markVisited} className={styles.scene}><h2>5. Repair the error policy.</h2>{errorCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["retry","repair","stop","idempotency"].map(choice=><button key={choice} className={`${styles.button} ${errorPolicy[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...errorPolicy,[i]:choice};setErrorPolicy(next);if(errorCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m11-errors")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="trace" onVisit={progress.markVisited} className={styles.scene}><h2>6. The run says “failed.” Make it observable.</h2><div className={styles.machine}>{[
   ["run","run/session span"],["model","model span + tokens"],["tool","tool span + args/result status"],["policy","permission decision"],["error","error/retry event"],["cost","latency/cost totals"],
  ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${traceParts.includes(id)?styles.correct:""}`} onClick={()=>mark(id,traceParts,setTraceParts,6,"m11-trace")}>{text}</button>{i<5&&<span className={styles.arrow}>→</span>}</span>)}</div><div className={styles.panel}><b>Token budget</b><input style={{width:"100%"}} type="range" min="8000" max="128000" step="4000" value={tokenBudget} onChange={e=>setTokenBudget(+e.target.value)}/><p>{tokenBudget.toLocaleString()} tokens. Harness must select/trim/compress context rather than append forever.</p></div></LessonSection>

  <LessonSection id="durability" onVisit={progress.markVisited} className={styles.scene}><h2>7. Restart happens while a write approval is pending.</h2><div className={styles.machine}>{[
   ["session","stable session/job ID"],["checkpoint","durable execution checkpoint"],["approval","approval bound to exact proposed action"],["resume","resume from checkpoint after restart"],
  ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${durability.includes(id)?styles.correct:""}`} onClick={()=>mark(id,durability,setDurability,4,"m11-durability")}>{text}</button>{i<3&&<span className={styles.arrow}>→</span>}</span>)}</div><button className={styles.button} onClick={()=>setLoop((loop+1)%6)}>Advance repaired harness loop</button></LessonSection>

  <LessonSection id="framework" onVisit={progress.markVisited} className={styles.scene}><h2>8. Choose implementation shape from requirements.</h2>{frameworkCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["graph","data","typed","multi"].map(choice=><button key={choice} className={`${styles.button} ${framework[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...framework,[i]:choice};setFramework(next);if(frameworkCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m11-framework")}}>{choice}</button>)}</div>)}</LessonSection>

  <section className={styles.quiz}><h2>Module 11 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Repair all eight harness incidents. {done}/8 tasks · {read}/8 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit mastery exam · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODULE 11 MASTERED — you can separate model intelligence from the harness/runtime machinery that operates it.":"Pass is 10/12. Reopen the harness cutaway."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/framework-atlas">← Framework Atlas</Link><Link href="/">Learning map →</Link></div>
 </main>
}
