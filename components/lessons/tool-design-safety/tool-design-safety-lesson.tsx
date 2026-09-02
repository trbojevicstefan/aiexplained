"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../tool-call-lifecycle/tool-call-lifecycle.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["A strong tool description should…",["Tell the model what the tool does, when to use it, important constraints and output expectations","Be vague so the model explores","Hide side effects","Only repeat the name"],0],
["Tool granularity should optimize for…",["Clear capabilities, schemas, permission boundaries and model selection—not one universal size","Always one giant tool","Always thousands of tiny tools","Only shortest names"],0],
["An idempotent operation means…",["Repeating the same request has the same intended effect rather than duplicating side effects","It always succeeds","It is read-only only","It uses JSON"],0],
["GET/search operations are generally…",["Lower side-effect risk than writes/deletes, though data sensitivity still matters","Always harmless","Always destructive","Always confirmation-required"],0],
["Deleting production data should usually…",["Require strong authorization/confirmation and narrow scope","Be retried infinitely","Be exposed under a vague tool name","Run on model confidence alone"],0],
["A timeout protects…",["The runtime from waiting indefinitely on a tool call","The tokenizer vocabulary","Model weights","Embedding dimensions"],0],
["Rate-limit handling should…",["Respect provider limits with bounded backoff/retry or queueing","Spam requests faster","Hide every error","Change system prompts"],0],
["Tool outputs should ideally…",["Be structured, bounded, explicit about success/errors and easy for the next step to reason about","Return unbounded random prose only","Hide errors","Always include secrets"],0],
] as const;
const descriptionCases=[
 {bad:"search",good:"Search the customer CRM by name/email. Read-only. Use when resolving an existing customer before creating a new record. Returns customer_id, name and email."},
 {bad:"do_calendar",good:"Create a calendar event after approval. Requires start_time, duration_min and attendee_email. This writes external state."},
 {bad:"run",good:"Execute an allowlisted command inside the isolated workspace sandbox. No host filesystem or unrestricted network access."},
];
const idempotencyCases=[
 ["GET /customers/123","yes"],["PUT /profile/123 with full desired state","usually"],["POST /payments create charge without idempotency key","no"],["DELETE /temporary-cache/key where absence is acceptable","usually"],
] as const;
const riskCases=[
 ["crm.search_contacts","read"],["calendar.create_event","write"],["db.delete_customer","destructive"],["fs.read_file","read"],["email.send","write"],
] as const;
const categoryCases=[
 ["Search current public information","web"],["Click through an authenticated site UI","browser"],["Run a SQL query","database"],["Inspect repository files","filesystem"],["Execute tests","shell"],["Create a calendar meeting","calendar"],["Send Slack message","messaging"],["Call an arbitrary REST endpoint","http-api"],
] as const;

export function ToolDesignSafetyLesson({progress}:Props){
 const [descriptions,setDescriptions]=useState<number[]>([]),[granularity,setGranularity]=useState(""),[idempotency,setIdempotency]=useState<Record<number,string>>({}),[risk,setRisk]=useState<Record<number,string>>({}),[confirm,setConfirm]=useState<Record<string,string>>({}),[timeout,setTimeout]=useState(10),[retry,setRetry]=useState(2),[rate,setRate]=useState(""),[categories,setCategories]=useState<Record<number,string>>({}),[output,setOutput]=useState<string[]>([]),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["design-descriptions","design-granularity","design-idempotency","design-risk","design-confirmation","design-timeouts","design-categories","design-reliability","design-explain"],sections=["descriptions","granularity","idempotency","risk","confirmation","timeouts","categories","reliability","explain"];
 const done=tasks.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===9&&read===9;
 const idemDone=idempotencyCases.every((x,i)=>idempotency[i]===x[1]),riskDone=riskCases.every((x,i)=>risk[i]===x[1]),catDone=categoryCases.every((x,i)=>categories[i]===x[1]);
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const markDesc=(i:number)=>{const next=[...new Set([...descriptions,i])];setDescriptions(next);if(next.length===descriptionCases.length)progress.completeTask("design-descriptions")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["description","schema","idempot","read","write","confirm","timeout","rate","output"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<5){setExplainFeedback("Go deeper: cover descriptions/schemas, granularity, idempotency, risk/confirmation, timeouts/rate limits and structured outputs.");return;}setExplainFeedback("Strong. You treated tool design as an API+security+reliability problem that directly shapes agent behavior.");progress.completeTask("design-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><span className={styles.eyebrow}>MODULE 12 · TOOL DESIGN</span><h1>A bad tool interface makes a smart model look stupid — or dangerous.</h1><p>Models select tools from the interfaces you give them. Names, descriptions, schemas, side-effect boundaries and error contracts become part of the agent's decision environment.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 tool-design missions complete</TaskStamp><div className={styles.grid3}><AiMascot variant="tile" accent="#8de574" mood={done>2?"happy":"thinking"} size={92} label="READ"/><AiMascot variant="briefcase" accent="#70d8d0" mood={done>5?"happy":"thinking"} size={92} label="WRITE"/><AiMascot variant="mail" accent="#ff8d78" mood={done===9?"excited":"thinking"} size={92} label="RISK"/></div></section>

  <LessonSection id="descriptions" onVisit={progress.markVisited} className={styles.scene}><h2>1. Tool descriptions are routing instructions.</h2>{descriptionCases.map((item,i)=><div className={styles.grid2} key={item.bad}><div className={`${styles.panel} ${styles.wrong}`}><b>BAD</b><p><code>{item.bad}</code></p><p>Too vague to distinguish intent, side effects or expected output.</p></div><button className={`${styles.panel} ${descriptions.includes(i)?styles.correct:""}`} onClick={()=>markDesc(i)}><b>REPAIR</b><p>{item.good}</p></button></div>)}</LessonSection>

  <LessonSection id="granularity" onVisit={progress.markVisited} className={styles.scene}><h2>2. One “god tool” is easy for developers and terrible for reasoning/security.</h2>{[
   ["god","workspace.do_everything(action:string, payload:any)"],
   ["balanced","crm.search_customer · crm.update_customer · crm.archive_customer"],
   ["micro","3,000 tools for every tiny field getter/setter"],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${granularity===id?(id==="balanced"?styles.correct:styles.wrong):""}`} onClick={()=>{setGranularity(id);if(id==="balanced")progress.completeTask("design-granularity")}}>{text}</button>)}<p>Good granularity makes intent, schemas, permissions and side effects legible. There is no universal exact number of tools.</p></LessonSection>

  <LessonSection id="idempotency" onVisit={progress.markVisited} className={styles.scene}><h2>3. Retries are safe only when you understand side effects.</h2>{idempotencyCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["yes","usually","no"].map(choice=><button key={choice} className={`${styles.button} ${idempotency[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...idempotency,[i]:choice};setIdempotency(next);if(idempotencyCases.every((x,j)=>next[j]===x[1]))progress.completeTask("design-idempotency")}}>{choice}</button>)}</div>)}{idemDone&&<p className={styles.feedback}>✓ Write APIs often need an idempotency key or other duplicate-prevention strategy before automatic retry.</p>}</LessonSection>

  <LessonSection id="risk" onVisit={progress.markVisited} className={styles.scene}><h2>4. Classify the side-effect surface.</h2>{riskCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["read","write","destructive"].map(choice=><button key={choice} className={`${styles.button} ${risk[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...risk,[i]:choice};setRisk(next);if(riskCases.every((x,j)=>next[j]===x[1]))progress.completeTask("design-risk")}}>{choice}</button>)}</div>)}{riskDone&&<p className={styles.feedback}>Side-effect class can drive approval, logging, credential scope and retry policy.</p>}</LessonSection>

  <LessonSection id="confirmation" onVisit={progress.markVisited} className={styles.scene}><h2>5. Confirmation policy should match consequence, not model confidence.</h2>{[
   ["read","Read CRM contact","auto"],["email","Send external email","confirm"],["delete","Delete production customer record","strong-confirm"],
  ].map(([id,text])=><div className={styles.panel} key={id}><p>{text}</p>{["auto","confirm","strong-confirm"].map(choice=><button key={choice} className={`${styles.button} ${confirm[id]===choice?styles.correct:""}`} onClick={()=>{const next={...confirm,[id]:choice};setConfirm(next);if(next.read==="auto"&&next.email==="confirm"&&next.delete==="strong-confirm")progress.completeTask("design-confirmation")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="timeouts" onVisit={progress.markVisited} className={styles.scene}><h2>6. Reliability policy is part of the tool contract.</h2><div className={styles.grid2}><div className={styles.field}><b>timeout</b><input type="number" min="1" max="60" value={timeout} onChange={e=>setTimeout(+e.target.value)}/></div><div className={styles.field}><b>max retries</b><input type="number" min="0" max="5" value={retry} onChange={e=>setRetry(+e.target.value)}/></div></div>{[
   ["respect","On HTTP 429, respect retry-after/backoff and bounded retry."],
   ["spam","Retry instantly 100 times."],
   ["hide","Convert 429 into fake success."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${rate===id?(id==="respect"?styles.correct:styles.wrong):""}`} onClick={()=>{setRate(id);if(id==="respect"&&timeout>=3&&retry<=4)progress.completeTask("design-timeouts")}}>{text}</button>)}</LessonSection>

  <LessonSection id="categories" onVisit={progress.markVisited} className={styles.scene}><h2>7. Tool categories imply different execution environments.</h2>{categoryCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["web","browser","database","filesystem","shell","calendar","messaging","http-api"].map(choice=><button key={choice} className={`${styles.button} ${categories[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...categories,[i]:choice};setCategories(next);if(categoryCases.every((x,j)=>next[j]===x[1]))progress.completeTask("design-categories")}}>{choice}</button>)}</div>)}{catDone&&<p className={styles.feedback}>✓ Web search, browser automation, shell execution and database access should not share one vague permission bucket.</p>}</LessonSection>

  <LessonSection id="reliability" onVisit={progress.markVisited} className={styles.scene}><h2>8. Make tool outputs easy to reason about.</h2><div className={styles.grid3}>{[
  ["status","explicit status/error code"],["data","bounded structured data"],["source","source/IDs/timestamps where relevant"],["retryable","retryable flag or error class"],["side","side-effect/result ID for writes"],["secret","no accidental secret leakage"],
  ].map(([id,text])=><button key={id} className={`${styles.panel} ${output.includes(id)?styles.correct:""}`} onClick={()=>{const next=[...new Set([...output,id])];setOutput(next);if(next.length===6)progress.completeTask("design-reliability")}}><b>{text}</b></button>)}</div><div className={styles.code}>{`{\n  "ok": true,\n  "event_id": "evt_91",\n  "created": true,\n  "retryable": false,\n  "timestamp": "2026-09-02T18:00:00Z"\n}`}</div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain good tool design like an API engineer.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Cover descriptions/schemas, granularity, idempotency, read/write/destructive risk, confirmations, timeout/rate limits and structured outputs."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Tool Design & Safety quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine tool-design rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=7)}>Submit · {score}/8</button>{quizDone&&<p className={styles.feedback}>{score>=7?"★ TOOL DESIGN MASTERED":"Pass is 7/8. Review idempotency and side-effect policy."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/tool-call-lifecycle">← Tool Call Lifecycle</Link><Link href="/lessons/module-12-capstone">Tool Calling Boss Lab →</Link></div>
 </main>
}
