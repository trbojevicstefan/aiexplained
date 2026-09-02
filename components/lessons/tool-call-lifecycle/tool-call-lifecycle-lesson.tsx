"use client";

import Link from "next/link";
import { useState } from "react";
import { ToolCallInspector } from "@/components/visualizations/tool-call-inspector";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./tool-call-lifecycle.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["A tool definition normally includes…",["Name, description and parameter/schema information","Only model weights","Only a button color","Only a URL string with no contract"],0],
["The model usually 'calls' a tool by…",["Producing a structured tool/function-call request that the runtime handles","Opening the network socket directly from learned weights","Updating its parameters","Writing to long-term memory automatically"],0],
["JSON Schema helps…",["Describe/validate argument structure and types","Guarantee the external API succeeds","Train the model","Create embeddings"],0],
["Tool execution normally happens…",["Outside the model in application/runtime code","Inside the tokenizer","Inside the attention matrix only","Inside model weights"],0],
["A tool result should…",["Return to the runtime/context for the next model decision or final answer","Automatically become a system message","Always be persisted forever","Retrain the model"],0],
["Sequential tool calls are appropriate when…",["Later calls depend on earlier results","All calls are independent","No tool exists","You want lower accuracy"],0],
["Parallel tool calls are appropriate when…",["Independent calls can run concurrently without needing each other's outputs","Call B requires call A's ID","Writes may conflict","Every task by default"],0],
["Timeouts and tool errors should…",["Be surfaced to the runtime with bounded retry/repair/stop logic","Be hidden from the agent always","Trigger infinite retries","Change tokenizer vocabulary"],0],
] as const;

export function ToolCallLifecycleLesson({progress}:Props){
 const [fields,setFields]=useState<string[]>([]),[tool,setTool]=useState(""),[date,setDate]=useState(""),[after,setAfter]=useState(""),[duration,setDuration]=useState(""),[activeStep,setActiveStep]=useState(0),[resultSeen,setResultSeen]=useState(false),[seq,setSeq]=useState<string[]>([]),[parallel,setParallel]=useState<string[]>([]),[errors,setErrors]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["tool-definition","tool-selection","tool-arguments","tool-lifecycle","tool-result","tool-sequential","tool-parallel","tool-errors","tool-explain"],sections=["definition","selection","arguments","lifecycle","result","sequential","parallel","errors","explain"];
 const done=tasks.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===9&&read===9;
 const validArgs=date.length>0&&after.length>0&&duration==="30";
 const seqTarget=["search","choose","create","notify"];
 const errorCases=[
  ["Arguments omit required `date` field","repair"],["Calendar GET times out once","retry"],["Create-event call receives 403 permission denied","stop"],["Search tool takes longer than configured timeout","timeout"],
 ] as const;
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const add=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const addSeq=(x:string)=>{if(seq.includes(x))return;const next=[...seq,x];setSeq(next);if(seqTarget.every((v,i)=>next[i]===v))progress.completeTask("tool-sequential")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["schema","arguments","runtime","execute","result","context","parallel","sequential"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<4){setExplainFeedback("Go deeper: define the tool contract, explain the model's structured proposal, runtime validation/execution and result returning to context. Mention sequential vs parallel calls.");return;}setExplainFeedback("Strong. You kept model selection/proposal separate from actual tool execution and result handling.");progress.completeTask("tool-explain")};
 const inspector={
  definition:`calendar.search_free_busy\n{ date: string, after: string, duration_min: number }`,
  proposal:`{\n  "name":"calendar.search_free_busy",\n  "arguments":{\n    "date":"${date||"?"}",\n    "after":"${after||"?"}",\n    "duration_min":${duration||"?"}\n  }\n}`,
  validation:validArgs?"✓ schema valid\n✓ read permission allowed":"✕ missing/invalid required fields",
  execution:activeStep>=3&&validArgs?"Calendar adapter executes authenticated API request":"waiting for validated call",
  result:resultSeen?`{ "free_slots":["15:30","16:00"] }\n→ append as tool result`:`waiting for tool result`,
 };
 return <main className={styles.root}>
  <section className={styles.hero}><span className={styles.eyebrow}>MODULE 12 · TOOL CALLING</span><h1>The model proposes. Your software executes.</h1><p>Tool calling is a contract between probabilistic model output and deterministic application code. Learn the definition, structured arguments, validation boundary, external execution and result cycle before you let an agent touch real systems.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 tool-call missions complete</TaskStamp><ToolCallInspector activeStep={activeStep} data={inspector} accent="#70c9ff" label="TOOL"/></section>

  <LessonSection id="definition" onVisit={progress.markVisited} className={styles.scene}><h2>1. A tool is an interface contract, not a vague capability.</h2><div className={styles.grid3}>{[
   ["name","NAME","calendar.search_free_busy"],["description","DESCRIPTION","Find free calendar slots; read-only; returns times."],["schema","JSON SCHEMA","date:string · after:string · duration_min:number"],
  ].map(([id,title,copy])=><button key={id} className={`${styles.panel} ${fields.includes(id)?styles.correct:""}`} onClick={()=>add(id,fields,setFields,3,"tool-definition")}><b>{title}</b><p>{copy}</p></button>)}</div><p>Descriptions guide tool selection. Schemas constrain argument shape. Neither replaces server-side authorization or validation.</p></LessonSection>

  <LessonSection id="selection" onVisit={progress.markVisited} className={styles.scene}><h2>2. Be the model: choose the next tool.</h2><div className={styles.code}>USER: Find a free 30-minute slot tomorrow after 15:00. Do not create anything yet.</div>{[
   ["search","calendar.search_free_busy · read available slots"],["create","calendar.create_event · writes an event"],["email","email.send · sends a message"],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${tool===id?(id==="search"?styles.correct:styles.wrong):""}`} onClick={()=>{setTool(id);if(id==="search"){setActiveStep(1);progress.completeTask("tool-selection")}}}>{text}</button>)}</LessonSection>

  <LessonSection id="arguments" onVisit={progress.markVisited} className={styles.scene}><h2>3. Construct arguments that satisfy the schema.</h2><div className={styles.field}><b>date:string</b><input value={date} onChange={e=>setDate(e.target.value)} placeholder="tomorrow"/></div><div className={styles.field}><b>after:string</b><input value={after} onChange={e=>setAfter(e.target.value)} placeholder="15:00"/></div><div className={styles.field}><b>duration_min:number</b><select value={duration} onChange={e=>setDuration(e.target.value)}><option value="">choose</option><option value="15">15</option><option value="30">30</option><option value="60">60</option></select></div><button className={styles.button} disabled={!validArgs} onClick={()=>{setActiveStep(2);progress.completeTask("tool-arguments")}}>Validate arguments</button>{!validArgs&&<p className={styles.warning}>The runtime should not execute malformed arguments just because the model emitted them confidently.</p>}</LessonSection>

  <LessonSection id="lifecycle" onVisit={progress.markVisited} className={styles.scene}><h2>4. Move across the execution boundary.</h2><ToolCallInspector activeStep={activeStep} data={inspector} accent="#70c9ff" label="CALL"/><button className={styles.button} disabled={!validArgs||activeStep<2} onClick={()=>{setActiveStep(3);progress.completeTask("tool-lifecycle")}}>Execute through calendar adapter</button><p>At this step, application code uses credentials/network/API client. The language model did not directly open the calendar service from its weights.</p></LessonSection>

  <LessonSection id="result" onVisit={progress.markVisited} className={styles.scene}><h2>5. Tool results become new evidence for the next model turn.</h2><button className={styles.button} disabled={activeStep<3} onClick={()=>{setResultSeen(true);setActiveStep(4);progress.completeTask("tool-result")}}>Return tool result</button>{resultSeen&&<><div className={styles.code}>{`TOOL RESULT\n{ "free_slots": ["15:30", "16:00"] }`}</div><p className={styles.feedback}>The model can now answer, ask the user which slot they prefer, or propose a write tool according to policy.</p></>}</LessonSection>

  <LessonSection id="sequential" onVisit={progress.markVisited} className={styles.scene}><h2>6. Sequential calls when later actions depend on earlier results.</h2><p>Click these in dependency order.</p><div className={styles.pipeline}>{[
   ["search","search availability"],["choose","choose 15:30 from result"],["create","create event using chosen slot"],["notify","notify using created event ID"],
  ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${seq.includes(id)?styles.correct:""}`} onClick={()=>addSeq(id)}>{seq.includes(id)?`${seq.indexOf(id)+1}. `:""}{text}</button>{i<3&&<span className={styles.arrow}>→</span>}</span>)}</div>{seq.length>0&&!seqTarget.every((v,i)=>seq[i]===v)&&<button className={styles.button} onClick={()=>setSeq([])}>Reset dependency order</button>}</LessonSection>

  <LessonSection id="parallel" onVisit={progress.markVisited} className={styles.scene}><h2>7. Parallel calls when results are independent.</h2><div className={styles.parallel}><button className={`${styles.lane} ${parallel.includes("weather")?styles.correct:""}`} onClick={()=>add("weather",parallel,setParallel,2,"tool-parallel")}><b>weather.get(city=Belgrade)</b><p>Independent read.</p></button><button className={`${styles.lane} ${parallel.includes("fx")?styles.correct:""}`} onClick={()=>add("fx",parallel,setParallel,2,"tool-parallel")}><b>fx.get(EUR,RSD)</b><p>Independent read.</p></button></div><p>Do not parallelize calls with data dependencies or conflicting side effects simply because concurrency sounds faster.</p></LessonSection>

  <LessonSection id="errors" onVisit={progress.markVisited} className={styles.scene}><h2>8. Tool errors belong to the runtime loop.</h2>{errorCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["repair","retry","stop","timeout"].map(choice=><button key={choice} className={`${styles.button} ${errors[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...errors,[i]:choice};setErrors(next);if(errorCases.every((x,j)=>next[j]===x[1]))progress.completeTask("tool-errors")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain one tool call end-to-end.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Definition/schema → model selects tool + arguments → runtime validates permission/schema → external code executes → result returns to context → next decision. Mention sequential vs parallel calls."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Tool Call Lifecycle quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine tool-call rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=7)}>Submit · {score}/8</button>{quizDone&&<p className={styles.feedback}>{score>=7?"★ TOOL CALL LIFECYCLE MASTERED":"Pass is 7/8. Revisit the runtime execution boundary."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-11-capstone">← Harness module</Link><Link href="/lessons/tool-design-safety">Tool Design & Safety →</Link></div>
 </main>
}
