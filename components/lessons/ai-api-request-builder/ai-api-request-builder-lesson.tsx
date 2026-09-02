"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ApiRequestBuilder, ApiRequestConfig } from "@/components/visualizations/api-request-builder";
import styles from "./ai-api-request-builder.module.css";

type Props={progress:LessonProgressApi};
const httpCases=[
["POST /v1/responses with JSON body","request"],["HTTP 200","success"],["HTTP 429","rate-limit"],["HTTP 500","server-error"],["GET a static model metadata resource","get"],
] as const;
const jsonCases=[
["{\"model\":\"atlas\",\"temperature\":0.2}","valid-json"],["{model: atlas,}","invalid-json"],["[1,2,3]","valid-json"],["undefined","not-json"],
] as const;
const authCases=[
["Static secret issued by provider for server-to-server API access","api-key"],["Authorization: Bearer <token>","bearer"],["User authorizes app to access their calendar with scopes","oauth"],["Put secret key in public browser JavaScript bundle","bad"],
] as const;
const requestCases=[
["Which model/end-point behavior to use","model"],["System/user conversation content","messages"],["External callable capabilities","tools"],["Randomness/output controls","generation"],["Desired structured response contract","response-format"],
] as const;
const websocketCases=[
["Long-lived bidirectional realtime audio/control channel","websocket"],["Server streams text deltas one-way over HTTP response","sse"],["One ordinary JSON request/response","http"],["Third-party server calls our URL after job finishes","webhook"],
] as const;
const limitCases=[
["429 with Retry-After header","backoff"],["400 invalid JSON schema","fix-request"],["Transient 503","retry"],["Write request timed out after possible side effect","reconcile-idempotent"],
] as const;
const webhookCases=[
["Transcription provider POSTs completion to our callback URL","webhook"],["Our browser polls every second forever","polling"],["Verify webhook signature/source","verify"],["Webhook event may be delivered more than once","idempotent"],
] as const;
const asyncCases=[
["Submit long-running job, receive job id, check/callback later","async"],["Send thousands of offline evaluation inputs as batch","batch"],["Need token-by-token interactive response now","stream"],["Tiny synchronous classification request","sync"],
] as const;
const quiz=[
["HTTP POST is commonly used when…",["Sending a request body to create/execute an operation","Only reading static metadata","Only streaming audio","Only authenticating users"],0],
["JSON is…",["A structured data serialization format used in many APIs","An authentication protocol","A model architecture","A vector index"],0],
["Bearer token usually appears in…",["Authorization header","CSS file","Model weights","HTML title"],0],
["OAuth is useful when…",["A user delegates scoped access to another application","Only a server owns one static API key","No identity exists","A model samples text"],0],
["An LLM request can include…",["Model, messages/instructions, tools, generation controls and response-format settings","Only a prompt string always","Only model weights","Only embeddings"],0],
["SSE is useful for…",["Streaming server events/deltas over an HTTP response","Bidirectional low-latency control from both sides only","Storing secrets","Building graphs"],0],
["WebSockets provide…",["A persistent bidirectional connection","Only static downloads","Only OAuth","Only batch jobs"],0],
["A 429 response usually indicates…",["Rate limiting","Perfect success","Invalid CSS","Model training completion"],0],
["Webhook handlers should often be idempotent because…",["Events can be retried or delivered more than once","JSON cannot be parsed","Models always hallucinate","SSE is bidirectional"],0],
["Batch APIs are useful for…",["Large offline/non-interactive workloads where immediate per-item latency is less important","Realtime barge-in voice","One mouse click","Session cookies"],0],
] as const;

export function AiApiRequestBuilderLesson({progress}:Props){
 const [http,setHttp]=useState<Record<number,string>>({}),[json,setJson]=useState<Record<number,string>>({}),[auth,setAuth]=useState<Record<number,string>>({}),[config,setConfig]=useState<ApiRequestConfig>({model:"atlas-large",stream:false,temperature:.2,tools:false,structured:false}),[requestSeen,setRequestSeen]=useState<string[]>([]),[phase,setPhase]=useState<"request"|"stream"|"done">("request"),[websocket,setWebsocket]=useState<Record<number,string>>({}),[limits,setLimits]=useState<Record<number,string>>({}),[webhooks,setWebhooks]=useState<Record<number,string>>({}),[async,setAsync]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["api-http","api-json","api-auth","api-request","api-stream","api-websocket","api-limits","api-webhooks","api-async","api-explain"],sections=["http","json","auth","request","stream","websocket","limits","webhooks","async","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const touchRequest=(part:string,patch:Partial<ApiRequestConfig>)=>{setConfig(current=>({...current,...patch}));const next=[...new Set([...requestSeen,part])];setRequestSeen(next);if(["model","messages","tools","generation","response-format"].every(x=>next.includes(x)))progress.completeTask("api-request")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["http","json","auth","bearer","oauth","model","message","tool","stream","sse","websocket","rate","retry","webhook","batch"].filter(w=>t.includes(w)).length;if(explain.length<160||hits<9){setFeedback("Go deeper: explain HTTP/JSON/auth, request body fields, SSE vs WebSocket, rate limits/retries, webhooks and async/batch APIs.");return;}setFeedback("Strong. You described the API transport/runtime layer separately from the intelligence inside the model.");progress.completeTask("api-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 20 · AI API REQUEST BUILDER</span><h1>An API call is a contract over a transport — not magic telepathy with a model.</h1><p>Build the HTTP request, protect credentials, choose streaming behavior, handle rate limits and understand when jobs should be synchronous, streaming, async, batched or webhook-driven.</p><TaskStamp done={done===10}>{done}/10 API missions complete</TaskStamp></div><div><ApiRequestBuilder config={config} phase={phase}/></div></section>

  <LessonSection id="http" onVisit={progress.markVisited} className={styles.scene}><h2>1. Read the HTTP envelope.</h2>{httpCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["request","success","rate-limit","server-error","get"].map(choice=><button key={choice} className={`${styles.button} ${http[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(http,setHttp,httpCases,i,choice,"api-http")}>{choice}</button>)}</div>)}<div className={styles.httpLine}><b>METHOD</b><span>POST</span><b>PATH</b><span>/v1/responses</span><b>STATUS</b><span>200 / 4xx / 5xx</span></div></LessonSection>

  <LessonSection id="json" onVisit={progress.markVisited} className={styles.scene}><h2>2. JSON is the request body's common language.</h2>{jsonCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["valid-json","invalid-json","not-json"].map(choice=><button key={choice} className={`${styles.button} ${json[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(json,setJson,jsonCases,i,choice,"api-json")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="auth" onVisit={progress.markVisited} className={styles.scene}><h2>3. Authentication answers who/what may call the service.</h2>{authCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["api-key","bearer","oauth","bad"].map(choice=><button key={choice} className={`${styles.button} ${auth[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(auth,setAuth,authCases,i,choice,"api-auth")}>{choice}</button>)}</div>)}<div className={styles.secret}>Authorization: Bearer <b>••••••••••••</b><span>Keep secrets in server-side secret storage, not public frontend bundles or prompts.</span></div></LessonSection>

  <LessonSection id="request" onVisit={progress.markVisited} className={styles.scene}><h2>4. Build the LLM request piece by piece.</h2><div className={styles.controls}><label>Model<select value={config.model} onChange={e=>touchRequest("model",{model:e.target.value})}><option>atlas-large</option><option>spark-small</option><option>reason-pro</option></select></label><label>Temperature <b>{config.temperature.toFixed(1)}</b><input type="range" min="0" max="1.5" step="0.1" value={config.temperature} onChange={e=>touchRequest("generation",{temperature:+e.target.value})}/></label><button className={config.tools?styles.active:""} onClick={()=>touchRequest("tools",{tools:!config.tools})}>Tools {config.tools?"ON":"OFF"}</button><button onClick={()=>{touchRequest("messages",{});}}>Inspect messages</button><button className={config.structured?styles.active:""} onClick={()=>touchRequest("response-format",{structured:!config.structured})}>Response schema {config.structured?"ON":"OFF"}</button></div><ApiRequestBuilder config={config} phase={phase}/><p>Inspect/build all five fields: {requestSeen.length}/5.</p></LessonSection>

  <LessonSection id="stream" onVisit={progress.markVisited} className={styles.scene}><h2>5. Stream deltas with SSE when one-way server output should arrive incrementally.</h2><div className={styles.controls}><button className={styles.primary} onClick={()=>{setConfig(c=>({...c,stream:true}));setPhase("stream");progress.completeTask("api-stream")}}>Start SSE stream</button><button className={styles.button} onClick={()=>{setConfig(c=>({...c,stream:false}));setPhase("done")}}>Normal response</button></div><ApiRequestBuilder config={config} phase={phase}/><p>Server-Sent Events are one-way server→client event streams over HTTP. They are a natural fit for text/token deltas and progress events.</p></LessonSection>

  <LessonSection id="websocket" onVisit={progress.markVisited} className={styles.scene}><h2>6. WebSocket is for a persistent two-way channel.</h2>{websocketCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["websocket","sse","http","webhook"].map(choice=><button key={choice} className={`${styles.button} ${websocket[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(websocket,setWebsocket,websocketCases,i,choice,"api-websocket")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="limits" onVisit={progress.markVisited} className={styles.scene}><h2>7. Retry by failure class, not because “API failed.”</h2>{limitCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["backoff","fix-request","retry","reconcile-idempotent"].map(choice=><button key={choice} className={`${styles.button} ${limits[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(limits,setLimits,limitCases,i,choice,"api-limits")}>{choice}</button>)}</div>)}<p>Rate limits often need exponential backoff/jitter or provider-specified delay. Permanent validation failures should not be retried unchanged. Ambiguous side-effect timeouts need reconciliation/idempotency.</p></LessonSection>

  <LessonSection id="webhooks" onVisit={progress.markVisited} className={styles.scene}><h2>8. Webhook: let the remote service call you back.</h2>{webhookCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["webhook","polling","verify","idempotent"].map(choice=><button key={choice} className={`${styles.button} ${webhooks[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(webhooks,setWebhooks,webhookCases,i,choice,"api-webhooks")}>{choice}</button>)}</div>)}<div className={styles.callback}><span>REMOTE JOB</span><b>POST →</b><span>https://our.app/webhooks/transcription</span><b>verify signature + event id</b></div></LessonSection>

  <LessonSection id="async" onVisit={progress.markVisited} className={styles.scene}><h2>9. Choose sync, stream, async or batch by latency and workload shape.</h2>{asyncCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["async","batch","stream","sync"].map(choice=><button key={choice} className={`${styles.button} ${async[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(async,setAsync,asyncCases,i,choice,"api-async")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain an AI API call end to end.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain HTTP + JSON + auth, request structure, SSE/WebSocket, rate limits/retries, webhooks and async/batch choices."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>AI API Request Builder quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.feedback}>{quizScore>=9?"★ AI API TRANSPORT MASTERED":"Pass is 9/10. Revisit streaming/auth/retry behavior."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-19-capstone">← Knowledge Systems</Link><Link href="/lessons/structured-output-lab">Structured Outputs →</Link></div>
 </main>
}
