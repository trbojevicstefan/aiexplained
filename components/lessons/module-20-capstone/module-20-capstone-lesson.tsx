"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ApiRequestBuilder, ApiRequestConfig } from "@/components/visualizations/api-request-builder";
import { BookingOutput, SchemaValidator, validateBooking } from "@/components/visualizations/schema-validator";
import styles from "./module-20-capstone.module.css";

type Props={progress:LessonProgressApi};
const transportCases=[
["Create a model response from a JSON body","POST"],["Fetch read-only model metadata","GET"],["429 response","rate-limit"],["503 response","transient-server"],
] as const;
const authCases=[
["Server stores provider key in secret manager and sends it in Authorization header","good"],["Browser bundle contains provider secret","bad"],["User grants scoped calendar access through OAuth","oauth"],["Webhook callback verifies provider signature","verify"],
] as const;
const deliveryCases=[
["Interactive token-by-token text in chat","stream"],["Tiny classification needed immediately","sync"],["Long video job returns job id and completes later","async"],["50,000 offline eval prompts overnight","batch"],["Third-party notifies us after async completion","webhook"],
] as const;
const actionCases=[
["Return extracted invoice fields to our application","structured-output"],["Create calendar event in external system","tool-call"],["Return booking status + event id after execution","structured-output"],["Send an email","tool-call"],
] as const;
const quiz=[
["A production AI API integration starts with…",["A transport/auth/request contract around the model call","Only a prompt string","Only a model name","Only CSS"],0],
["Provider secrets should normally live…",["In server-side secret storage/runtime boundaries","In public frontend JavaScript","Inside user prompts","Inside CSS variables"],0],
["OAuth is especially useful when…",["A user delegates scoped access to their account/resources","No user identity exists","Only static server secret is needed","A tokenizer runs"],0],
["SSE is a good fit for…",["Incremental server-to-client response events/deltas","Persistent bidirectional realtime control only","Database schema migration","Model training"],0],
["WebSocket is useful for…",["Long-lived bidirectional communication","Only one static GET","Only batch jobs","Only JSON validation"],0],
["Valid JSON can still fail application expectations because…",["Its fields/types/schema may be wrong","JSON guarantees business correctness","JSON cannot contain strings","Parsing fixes semantics"],0],
["JSON Schema can constrain…",["Structure, required fields and types","Truth of every business claim","Provider credentials","GPU temperature"],0],
["A structured-output validation failure should usually…",["Enter bounded repair/retry or controlled error handling","Trigger destructive action first","Loop forever","Be ignored"],0],
["A 401 authentication failure is best fixed by…",["Fixing credentials/auth configuration","Retrying model JSON formatting forever","Increasing temperature","Changing schema"],0],
["Tool calls and structured outputs differ because…",["One requests external execution; the other returns machine-readable data","They are always identical","Both are webhooks","Both are model weights"],0],
["Webhook consumers should often be idempotent.",["True","False"],0],
["Schema-valid data may still need domain/business validation.",["True","False"],0],
] as const;

export function Module20CapstoneLesson({progress}:Props){
 const [transport,setTransport]=useState<Record<number,string>>({}),[auth,setAuth]=useState<Record<number,string>>({}),[config,setConfig]=useState<ApiRequestConfig>({model:"atlas-large",stream:false,temperature:.2,tools:false,structured:false}),[requestParts,setRequestParts]=useState<string[]>([]),[delivery,setDelivery]=useState<Record<number,string>>({}),[output,setOutput]=useState<BookingOutput>({status:"booked",start:"2026-09-04T10:00:00+02:00",duration_minutes:"30"}),[schemaSeen,setSchemaSeen]=useState(false),[repaired,setRepaired]=useState(false),[actions,setActions]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m20-transport","m20-auth","m20-request","m20-delivery","m20-schema","m20-repair","m20-action","m20-explain"],sections=["transport","auth","request","delivery","schema","repair","action","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const errors=validateBooking(output);
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const touchRequest=(part:string,patch:Partial<ApiRequestConfig>)=>{setConfig(current=>({...current,...patch}));const next=[...new Set([...requestParts,part])];setRequestParts(next);if(["model","messages","tools","generation","schema"].every(x=>next.includes(x)))progress.completeTask("m20-request")};
 const repair=()=>{setOutput({status:"booked",event_id:"evt_908",start:"2026-09-04T10:00:00+02:00",duration_minutes:30});setRepaired(true);progress.completeTask("m20-repair")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["http","auth","oauth","json","model","message","tool","stream","async","batch","schema","validate","retry","webhook"].filter(w=>t.includes(w)).length;if(explain.length<165||hits<9){setFeedback("Go deeper: explain transport/auth, model request fields, delivery mode, schema/typed validation, repair policy, tool-call vs data output and webhook/retry behavior.");return;}setFeedback("Strong. You described a production AI API integration as a layered contract: transport, auth, model request, delivery, validation and external-action boundaries.");progress.completeTask("m20-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 20 · API CONTRACT BOSS LAB</span><h1>Build an API integration that fails safely.</h1><p>A model call only becomes a product primitive when transport, credentials, streaming, schema validation, retries and action boundaries are explicit.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><ApiRequestBuilder config={config} phase={config.stream?"stream":"done"}/></section>

  <LessonSection id="transport" onVisit={progress.markVisited} className={styles.scene}><h2>1. Build the HTTP envelope and classify responses.</h2>{transportCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["POST","GET","rate-limit","transient-server"].map(choice=><button key={choice} className={`${styles.button} ${transport[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(transport,setTransport,transportCases,i,choice,"m20-transport")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="auth" onVisit={progress.markVisited} className={styles.scene}><h2>2. Put credentials in the runtime boundary, not model context.</h2>{authCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","bad","oauth","verify"].map(choice=><button key={choice} className={`${styles.button} ${auth[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(auth,setAuth,authCases,i,choice,"m20-auth")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="request" onVisit={progress.markVisited} className={styles.scene}><h2>3. Assemble all request layers.</h2><div className={styles.controls}><label>Model<select value={config.model} onChange={e=>touchRequest("model",{model:e.target.value})}><option>atlas-large</option><option>spark-small</option><option>reason-pro</option></select></label><button onClick={()=>touchRequest("messages",{})}>Inspect messages</button><button className={config.tools?styles.active:""} onClick={()=>touchRequest("tools",{tools:!config.tools})}>Tools {config.tools?"ON":"OFF"}</button><label>Temperature <b>{config.temperature.toFixed(1)}</b><input type="range" min="0" max="1.5" step="0.1" value={config.temperature} onChange={e=>touchRequest("generation",{temperature:+e.target.value})}/></label><button className={config.structured?styles.active:""} onClick={()=>touchRequest("schema",{structured:!config.structured})}>Schema {config.structured?"ON":"OFF"}</button></div><ApiRequestBuilder config={config} phase={config.stream?"stream":"done"}/><p>Request pieces inspected: {requestParts.length}/5.</p></LessonSection>

  <LessonSection id="delivery" onVisit={progress.markVisited} className={styles.scene}><h2>4. Pick delivery mechanics by workload shape.</h2>{deliveryCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["sync","stream","async","batch","webhook"].map(choice=><button key={choice} className={`${styles.button} ${delivery[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>{solve(delivery,setDelivery,deliveryCases,i,choice,"m20-delivery");if(choice==="stream")setConfig(x=>({...x,stream:true}))}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="schema" onVisit={progress.markVisited} className={styles.scene}><h2>5. Valid JSON is not enough. Enforce the expected shape.</h2><SchemaValidator value={output}/><button className={styles.primary} onClick={()=>{setSchemaSeen(true);setConfig(x=>({...x,structured:true}));progress.completeTask("m20-schema")}}>Enable JSON Schema contract</button>{schemaSeen&&<p className={styles.feedback}>The current output parses as JSON but fails type validation because <code>duration_minutes</code> is a string.</p>}</LessonSection>

  <LessonSection id="repair" onVisit={progress.markVisited} className={styles.scene}><h2>6. Repair malformed output with a bounded policy.</h2><SchemaValidator value={output}/><div className={styles.controls}><button className={styles.button} onClick={()=>{setOutput({status:"booked",start:"Friday",duration_minutes:"30"});setRepaired(false)}}>Inject malformed output</button><button className={styles.primary} disabled={errors.length===0} onClick={repair}>Regenerate / repair to schema</button></div>{repaired&&errors.length===0&&<p className={styles.feedback}>✓ Structure repaired. A real application should also validate date semantics and business rules before acting.</p>}</LessonSection>

  <LessonSection id="action" onVisit={progress.markVisited} className={styles.scene}><h2>7. Separate returning data from asking the runtime to act.</h2>{actionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["structured-output","tool-call"].map(choice=><button key={choice} className={`${styles.button} ${actions[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(actions,setActions,actionCases,i,choice,"m20-action")}>{choice}</button>)}</div>)}<div className={styles.split}><div><b>MODEL RETURNS DATA</b><span>schema → parse → validate → app logic</span></div><div><b>MODEL REQUESTS ACTION</b><span>tool schema → validate → permissions → external execution</span></div></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the full production contract.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain HTTP/auth/OAuth, request fields, sync/stream/async/batch/webhooks, JSON/schema/types, repair/retry and tool-call vs structured-data boundaries."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 20 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit · {quizScore}/12</button>{quizDone&&<p className={styles.feedback}>{quizScore>=10?"★ AI API + STRUCTURED OUTPUTS MASTERED":"Pass is 10/12. Revisit authentication, delivery modes and validation boundaries."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/structured-output-lab">← Structured Outputs</Link><Link href="/lessons/model-provider-map">Model Providers →</Link></div>
 </main>
}
