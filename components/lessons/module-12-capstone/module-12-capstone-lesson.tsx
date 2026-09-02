"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolCallInspector } from "@/components/visualizations/tool-call-inspector";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../tool-call-lifecycle/tool-call-lifecycle.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["Tool selection quality depends heavily on…",["Clear names/descriptions/schemas and useful context","Only model parameter count","Only UI animation","Only embedding dimensions"],0],
["Server-side schema validation matters because…",["Model-generated arguments can be malformed or unsafe","Models never make schema mistakes","It changes pretraining","It creates tools automatically"],0],
["A write tool should be authorized based on…",["User/service identity, scope, policy and approval requirements","Model confidence alone","Temperature","Token count"],0],
["Calls B and C may run in parallel when…",["They are independent and do not require each other's results or conflict in side effects","B needs C's ID","Both write the same record","One is malformed"],0],
["A create-payment/create-event retry should consider…",["Idempotency/duplicate-side-effect protection","Only increasing timeout forever","Removing validation","Hiding errors"],0],
["Tool results should include…",["Clear success/error state plus structured data and identifiers useful to the next step","Only prose","Secrets","A new system prompt"],0],
["A 403 authorization error should usually…",["Stop/escalate rather than blindly retrying","Retry forever","Be converted to success","Update model weights"],0],
["A transient 429 on an idempotent read can often…",["Use bounded backoff/retry respecting limits","Be ignored","Trigger delete","Change the schema"],0],
["A function/tool call is not…",["Proof the external action succeeded; execution result must be observed","A structured model output","Part of an agent loop","Something a runtime can validate"],0],
["Read/write/destructive classification helps determine…",["Permissions, confirmation, retry and audit policy","Tokenizer vocabulary","Attention heads","Model architecture"],0],
["One giant `do_everything(any)` tool is risky because…",["Intent, schema and permission boundaries become vague","It is always faster","It guarantees correctness","It cannot execute"],0],
["The strongest mental model is…",["Model proposes a typed action; runtime validates/authorizes/executes; result returns for the next decision","Model weights directly become every API","Tool descriptions replace authorization","A tool call is the same as memory"],0],
] as const;

export function Module12CapstoneLesson({progress}:Props){
 const [selected,setSelected]=useState(""),[schema,setSchema]=useState<string[]>([]),[email,setEmail]=useState(""),[duration,setDuration]=useState(""),[approval,setApproval]=useState(""),[deps,setDeps]=useState(""),[idem,setIdem]=useState(""),[result,setResult]=useState<string[]>([]),[cats,setCats]=useState<Record<number,string>>({}),[answers,setAnswers]=useState<Record<number,number>>({}),[active,setActive]=useState(0);
 const tasks=["m12-select","m12-schema","m12-arguments","m12-permission","m12-dependencies","m12-idempotency","m12-result","m12-diagnose"],sections=["select","schema","arguments","permission","dependencies","idempotency","result","diagnose"];
 const done=tasks.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===8&&read===8;
 const catCases=[
  ["Search CRM contact","database"],["Open authenticated booking website","browser"],["Run unit tests","shell"],["Send Slack confirmation","messaging"],
 ] as const;
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const inspector={definition:`calendar.create_event\nrequired: attendee_email, start_time, duration_min\nside_effect: write`,proposal:`{\n "attendee_email":"${email||"?"}",\n "start_time":"15:30",\n "duration_min":${duration||"?"}\n}`,validation:email.includes("@")&&duration==="30"&&approval==="confirm"?"✓ schema valid\n✓ approval present":"waiting for valid args + approval",execution:active>=3?"Calendar adapter writes event with idempotency key":"not executed",result:result.length>=4?`{ ok:true, event_id:"evt_91", created:true, retryable:false }`:`waiting for normalized result`};
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 return <main className={styles.root}>
  <section className={styles.hero}><span className={styles.eyebrow}>MODULE 12 · TOOL CALLING BOSS LAB</span><h1>The plan looks plausible. The side effects are not.</h1><p>Fix a CRM → calendar → confirmation workflow one execution boundary at a time. The model can suggest actions; only your validated runtime gets to make them real.</p><TaskStamp done={done===8}>{done}/8 tool incidents repaired</TaskStamp><ToolCallInspector activeStep={active} data={inspector} accent="#70c9ff" label={done===8?"SAFE":"FIX"}/></section>

  <LessonSection id="select" onVisit={progress.markVisited} className={styles.scene}><h2>1. Request: “Find Alex in CRM.” Which tool?</h2>{[
   ["search","crm.search_contacts(name='Alex')"],["create","crm.create_contact(name='Alex')"],["delete","crm.delete_contact(id='?')"],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${selected===id?(id==="search"?styles.correct:styles.wrong):""}`} onClick={()=>{setSelected(id);if(id==="search")progress.completeTask("m12-select")}}>{text}</button>)}</LessonSection>

  <LessonSection id="schema" onVisit={progress.markVisited} className={styles.scene}><h2>2. The create-event tool schema is vague. Install the missing contract.</h2><div className={styles.grid3}>{[
   ["types","typed fields: attendee_email:string · start_time:string · duration_min:number"],
   ["required","required fields + validation constraints"],
   ["side","description marks write side effect + approval requirement"],
  ].map(([id,text])=><button key={id} className={`${styles.panel} ${schema.includes(id)?styles.correct:""}`} onClick={()=>mark(id,schema,setSchema,3,"m12-schema")}><b>{text}</b></button>)}</div></LessonSection>

  <LessonSection id="arguments" onVisit={progress.markVisited} className={styles.scene}><h2>3. Repair the malformed arguments.</h2><div className={styles.field}><b>attendee_email</b><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="alex@example.com"/></div><div className={styles.field}><b>duration_min</b><select value={duration} onChange={e=>{setDuration(e.target.value);if(email.includes("@")&&e.target.value==="30")progress.completeTask("m12-arguments")}}><option value="">choose</option><option value="thirty">"thirty"</option><option value="30">30</option></select></div>{email.includes("@")&&duration==="30"&&<p className={styles.feedback}>✓ Argument types satisfy the repaired schema.</p>}</LessonSection>

  <LessonSection id="permission" onVisit={progress.markVisited} className={styles.scene}><h2>4. Calendar creation is a write.</h2>{[
   ["confirm","Require explicit approval for this exact event before execution."],
   ["silent","Execute because the model selected a valid time."],
   ["admin","Grant permanent calendar-admin authority to simplify the agent."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${approval===id?(id==="confirm"?styles.correct:styles.wrong):""}`} onClick={()=>{setApproval(id);if(id==="confirm"){setActive(2);progress.completeTask("m12-permission")}}}>{text}</button>)}</LessonSection>

  <LessonSection id="dependencies" onVisit={progress.markVisited} className={styles.scene}><h2>5. Which calls may run together?</h2>{[
   ["correct","Parallel: read CRM + read free/busy if both inputs already known. Sequential: create event after slot selection, then notify using created event ID."],
   ["wrong","Parallelize search, create_event and notify all at once."],
   ["wrong2","Create event before free/busy result arrives."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${deps===id?(id==="correct"?styles.correct:styles.wrong):""}`} onClick={()=>{setDeps(id);if(id==="correct")progress.completeTask("m12-dependencies")}}>{text}</button>)}</LessonSection>

  <LessonSection id="idempotency" onVisit={progress.markVisited} className={styles.scene}><h2>6. The create-event request times out after the server may have received it.</h2>{[
   ["key","Retry only with the same idempotency/request key or first query operation status so duplicate events are prevented."],
   ["blind","Retry 10 times with fresh create requests."],
   ["success","Assume success and fabricate an event ID."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${idem===id?(id==="key"?styles.correct:styles.wrong):""}`} onClick={()=>{setIdem(id);if(id==="key"){setActive(3);progress.completeTask("m12-idempotency")}}}>{text}</button>)}</LessonSection>

  <LessonSection id="result" onVisit={progress.markVisited} className={styles.scene}><h2>7. Normalize the write result for the next decision.</h2><div className={styles.grid2}>{[
   ["status","ok / error status"],["id","event_id"],["created","created boolean / side-effect status"],["retry","retryable/error class"],
  ].map(([id,text])=><button key={id} className={`${styles.panel} ${result.includes(id)?styles.correct:""}`} onClick={()=>{const next=[...new Set([...result,id])];setResult(next);if(next.length===4){setActive(4);progress.completeTask("m12-result")}}}><b>{text}</b></button>)}</div></LessonSection>

  <LessonSection id="diagnose" onVisit={progress.markVisited} className={styles.scene}><h2>8. Keep capability categories explicit.</h2>{catCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["database","browser","shell","messaging"].map(choice=><button key={choice} className={`${styles.button} ${cats[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...cats,[i]:choice};setCats(next);if(catCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m12-diagnose")}}>{choice}</button>)}</div>)}</LessonSection>

  <section className={styles.quiz}><h2>Module 12 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Repair all eight tool incidents. {done}/8 tasks · {read}/8 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit mastery exam · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODULE 12 MASTERED — you can now reason from tool contract to side effect safely.":"Pass is 10/12. Revisit schemas, idempotency and execution boundaries."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/tool-design-safety">← Tool Design & Safety</Link><Link href="/">Learning map →</Link></div>
 </main>
}
