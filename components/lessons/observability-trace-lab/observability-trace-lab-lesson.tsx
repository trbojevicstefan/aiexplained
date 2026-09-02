"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { TraceSpan, TraceTimeline } from "@/components/visualizations/trace-timeline";
import styles from "./observability-trace-lab.module.css";

type Props={progress:LessonProgressApi};
const baseSpans:TraceSpan[]=[
{id:"run",kind:"agent",name:"support.agent.run",start:0,duration:1840,status:"warning",tokens:0,cost:0,detail:"Root agent run for customer renewal question."},
{id:"retrieval",parent:"run",kind:"retrieval",name:"knowledge.retrieve",start:80,duration:210,status:"warning",tokens:0,cost:.0003,detail:"Retrieved policy_v2 instead of current policy_v4 because version filter was missing."},
{id:"plan",parent:"run",kind:"llm",name:"llm.plan",start:320,duration:520,status:"ok",tokens:2100,cost:.0081,detail:"Model planned CRM lookup after reading retrieved context."},
{id:"crm",parent:"run",kind:"tool",name:"crm.lookup_customer",start:870,duration:260,status:"ok",tokens:0,cost:.002,detail:"Customer account lookup succeeded."},
{id:"answer",parent:"run",kind:"llm",name:"llm.final_answer",start:1160,duration:680,status:"warning",tokens:2900,cost:.014,detail:"Final answer faithfully used the stale retrieved policy, creating a factual product error."},
];
const signalCases=[
["One JSON event: tool timeout at 14:03:11","log"],["p95 TTFT over 5 minutes","metric"],["One end-to-end run with nested LLM/tool spans","trace"],["Error count per minute","metric"],
] as const;
const spanCases=[
["Named timed operation with start/end/status/attributes","span"],["Parent/child relationships form a trace","trace"],["trace_id links spans from same distributed request","trace-id"],["A span must contain the full prompt text to be useful","false"],
] as const;
const llmCases=[
["model name/version","attribute"],["input/output token counts","attribute"],["latency and cost","attribute"],["raw sensitive prompt copied forever with no policy","bad"],
] as const;
const toolCases=[
["tool name + safe arguments metadata + status","tool-span"],["retrieval query/index/filter/version metadata","retrieval-span"],["external API latency/status code","tool-span"],["No trace for tool calls because final answer succeeded","bad"],
] as const;
const tokenCases=[
["Input token count","tokens"],["Output token count","tokens"],["Estimated cost by span/run","cost"],["TTFT / duration","latency"],
] as const;
const privacyCases=[
["Redact API keys before telemetry export","redact"],["Hash/pseudonymize user id where appropriate","minimize"],["Store all customer prompts indefinitely by default","bad"],["Sample or store derived metadata instead of raw content where possible","minimize"],
] as const;
const dashboardCases=[
["p95 tool latency jumps 3×","alert"],["agent success rate falls below 90%","alert"],["daily token cost trend","dashboard"],["one trace contains a specific wrong retrieval","trace-debug"],
] as const;
const quiz=[
["A log is best thought of as…",["A discrete event/record","An aggregate time series only","A complete distributed causal tree only","A model weight"],0],
["A metric is best for…",["Aggregated numeric trends/alerts over time","Exact full run causality only","Prompt writing","Model training"],0],
["A trace is best for…",["Following one request/run across nested operations","Only average latency","Only daily spend","Only source files"],0],
["OpenTelemetry spans commonly contain…",["Name, timestamps/duration, status, attributes and trace/parent linkage","Only final answer text","Only GPU weights","Only user password"],0],
["LLM telemetry can include…",["Model/version, token counts, latency, cost and safe request metadata","Only CSS","Only provider logo","Only tokenizer file"],0],
["Tool spans help diagnose…",["External-call failures/latency/arguments/results at the action layer","Only training loss","Only model size","Only frontend color"],0],
["Raw prompt/context logging may create privacy/security risk.",["True","False"],0],
["Replay/debugging means…",["Reconstructing or re-running a recorded execution with controlled inputs/config where appropriate","Training on every log automatically","Deleting traces","Only refreshing page"],0],
["A final answer can be fluent while the trace reveals stale retrieval upstream.",["True","False"],0],
["Metrics and traces are interchangeable and one should replace the other.",["True","False"],1],
] as const;

export function ObservabilityTraceLabLesson({progress}:Props){
 const [signals,setSignals]=useState<Record<number,string>>({}),[spanAnswers,setSpanAnswers]=useState<Record<number,string>>({}),[llm,setLlm]=useState<Record<number,string>>({}),[tools,setTools]=useState<Record<number,string>>({}),[tokenAnswers,setTokenAnswers]=useState<Record<number,string>>({}),[privacy,setPrivacy]=useState<Record<number,string>>({}),[active,setActive]=useState("run"),[selected,setSelected]=useState<TraceSpan>(baseSpans[0]),[debugged,setDebugged]=useState(false),[replayed,setReplayed]=useState(false),[fixed,setFixed]=useState(false),[dashboards,setDashboards]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["obs-signals","obs-spans","obs-llm","obs-tools","obs-tokens","obs-privacy","obs-debug","obs-replay","obs-dashboards","obs-explain"],sections=["signals","spans","llm","tools","tokens","privacy","debug","replay","dashboards","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const spans=useMemo(()=>fixed?baseSpans.map(s=>s.id==="retrieval"?{...s,status:"ok" as const,detail:"Current policy_v4 retrieved with explicit tenant/version filter."}:s.id==="answer"?{...s,status:"ok" as const,detail:"Final answer grounded in current policy_v4."}:s):baseSpans,[fixed]);
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const selectSpan=(span:TraceSpan)=>{setActive(span.id);setSelected(span);if(span.id==="retrieval"&&!fixed){setDebugged(true);progress.completeTask("obs-debug")}};
 const submit=()=>{const t=explain.toLowerCase();const hits=["log","metric","trace","span","opentelemetry","llm","tool","token","cost","privacy","replay","alert"].filter(w=>t.includes(w)).length;if(explain.length<165||hits<9){setFeedback("Go deeper: distinguish logs/metrics/traces, define spans/trace linkage, LLM/tool/retrieval telemetry, token/cost data, privacy controls, replay and alerts.");return;}setFeedback("Strong. You described observability as correlated signals for understanding behavior, not just a pile of console logs.");progress.completeTask("obs-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 24 · OBSERVABILITY TRACE LAB</span><h1>The final answer is wrong. Find the exact span where reality diverged.</h1><p>Open one complete agent run, distinguish logs/metrics/traces, inspect nested spans and trace stale retrieval upstream instead of blaming the final LLM step.</p><TaskStamp done={done===10}>{done}/10 observability missions complete</TaskStamp></div><TraceTimeline spans={spans} active={active} onSelect={selectSpan}/></section>

  <LessonSection id="signals" onVisit={progress.markVisited} className={styles.scene}><h2>1. Logs, metrics and traces answer different questions.</h2>{signalCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["log","metric","trace"].map(a=><button key={a} className={`${styles.button} ${signals[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(signals,setSignals,signalCases,i,a,"obs-signals")}>{a}</button>)}</div>)}<div className={styles.three}><div><b>LOG</b><span>what event happened?</span></div><div><b>METRIC</b><span>how much/how often over time?</span></div><div><b>TRACE</b><span>where did this one request spend time/fail?</span></div></div></LessonSection>

  <LessonSection id="spans" onVisit={progress.markVisited} className={styles.scene}><h2>2. A trace is built from spans.</h2>{spanCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["span","trace","trace-id","false"].map(a=><button key={a} className={`${styles.button} ${spanAnswers[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(spanAnswers,setSpanAnswers,spanCases,i,a,"obs-spans")}>{a}</button>)}</div>)}<TraceTimeline spans={spans} active={active} onSelect={selectSpan}/></LessonSection>

  <LessonSection id="llm" onVisit={progress.markVisited} className={styles.scene}><h2>3. Instrument LLM calls like real operations.</h2>{llmCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["attribute","bad"].map(a=><button key={a} className={`${styles.button} ${llm[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(llm,setLlm,llmCases,i,a,"obs-llm")}>{a}</button>)}</div>)}<div className={styles.spanCard}><b>llm.final_answer</b><code>model=atlas-large · input_tokens=2100 · output_tokens=800 · duration=680ms · cost=$0.014</code></div></LessonSection>

  <LessonSection id="tools" onVisit={progress.markVisited} className={styles.scene}><h2>4. Retrieval/tool calls need their own spans or you lose causality.</h2>{toolCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["tool-span","retrieval-span","bad"].map(a=><button key={a} className={`${styles.button} ${tools[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(tools,setTools,toolCases,i,a,"obs-tools")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="tokens" onVisit={progress.markVisited} className={styles.scene}><h2>5. Token/cost/latency telemetry makes expensive spans visible.</h2>{tokenCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["tokens","cost","latency"].map(a=><button key={a} className={`${styles.button} ${tokenAnswers[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(tokenAnswers,setTokenAnswers,tokenCases,i,a,"obs-tokens")}>{a}</button>)}</div>)}<div className={styles.costs}><span>plan 2100 tok · $0.0081</span><span>CRM $0.0020</span><span>final 2900 tok · $0.0140</span><b>run ≈ $0.0244</b></div></LessonSection>

  <LessonSection id="privacy" onVisit={progress.markVisited} className={styles.scene}><h2>6. Observability must not become a new data-exfiltration system.</h2>{privacyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["redact","minimize","bad"].map(a=><button key={a} className={`${styles.button} ${privacy[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(privacy,setPrivacy,privacyCases,i,a,"obs-privacy")}>{a}</button>)}</div>)}<p>Production logging policy should specify what content can be recorded, redacted, sampled, retained and who can access it.</p></LessonSection>

  <LessonSection id="debug" onVisit={progress.markVisited} className={styles.scene}><h2>7. Find the first bad span, not the last visible symptom.</h2><TraceTimeline spans={spans} active={active} onSelect={selectSpan}/><div className={styles.inspect}><b>{selected.name}</b><span>{selected.status}</span><p>{selected.detail}</p></div>{debugged&&!fixed&&<button className={styles.primary} onClick={()=>{setFixed(true);progress.completeTask("obs-debug")}}>Fix retrieval filter: policy_version=current</button>}{fixed&&<p className={styles.feedback}>✓ Upstream retrieval fixed. Downstream answer span becomes healthy because the model now receives correct evidence.</p>}</LessonSection>

  <LessonSection id="replay" onVisit={progress.markVisited} className={styles.scene}><h2>8. Replay lets you test a fix against the same recorded situation.</h2><button className={styles.primary} disabled={!fixed} onClick={()=>{setReplayed(true);progress.completeTask("obs-replay")}}>Replay run with same user/task + fixed retrieval config</button>{replayed&&<TraceTimeline spans={spans.map(s=>({...s,status:"ok" as const}))} active="answer"/>}<p>A faithful replay may pin model/prompt/tool/data versions where practical. Live external systems can make exact reproduction impossible, so good traces record the configuration needed to explain differences.</p></LessonSection>

  <LessonSection id="dashboards" onVisit={progress.markVisited} className={styles.scene}><h2>9. Metrics tell you when to investigate; traces tell you where.</h2>{dashboardCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["alert","dashboard","trace-debug"].map(a=><button key={a} className={`${styles.button} ${dashboards[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(dashboards,setDashboards,dashboardCases,i,a,"obs-dashboards")}>{a}</button>)}</div>)}<div className={styles.metrics}><span>agent success<b>91.4%</b></span><span>p95 latency<b>2.1s</b></span><span>tool errors<b>1.8%</b></span><span>cost/task<b>$0.041</b></span></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain how observability turns “it failed” into evidence.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain logs/metrics/traces, spans/OpenTelemetry, LLM/tool/retrieval telemetry, token/cost data, privacy controls, replay and dashboards/alerts."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Observability Trace Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ AI OBSERVABILITY MASTERED":"Pass is 9/10. Revisit logs vs metrics vs traces."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/evals-lab">← Evals</Link><Link href="/lessons/module-24-capstone">Trace Detective Boss →</Link></div>
 </main>
}
