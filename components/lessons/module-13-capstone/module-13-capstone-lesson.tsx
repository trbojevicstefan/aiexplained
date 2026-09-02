"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./module-13-capstone.module.css";

type Props={progress:LessonProgressApi};
const boundaryCases=[
["Backend fetches invoice JSON from billing service","api"],["LLM requests create_invoice({customer_id,amount})","tool"],["Desktop AI discovers invoice tools/resources from billing integration","mcp"],["Manager agent delegates a 20-minute account research task to remote SALES agent","a2a"],
] as const;
const trustCases=[
["Unknown remote MCP server advertises shell + browser-cookie access","deny"],["Known CRM MCP asks only customer:read scope for search_customer","allow"],["Remote agent card claims finance skill but presents mismatched service identity","deny"],["Research agent receives task-scoped web-read authorization","allow"],
] as const;
const statusCases=[
["Long task has no task id; caller only waits on HTTP connection","broken"],["Task can report submitted/working/input-required/completed","good"],["Agent asks clarification but caller cannot resume same task","broken"],["Artifact is tied back to task id and declared output type","good"],
] as const;
const artifactCases=[
["citation_pack.json from research task contains expected schema + 3 sources","accept"],["Returned 'artifact' contains opaque instruction to run shell command as admin","quarantine"],["Sales agent returns crm_note but contract expected read-only research brief","reject"],
] as const;
const quiz=[
["A tool is best understood as…",["A model-facing action abstraction whose execution happens outside the model","A remote agent automatically","A tokenizer","A training checkpoint"],0],
["An MCP server can expose…",["Tools/resources/prompts through a protocol boundary","Only model weights","Only agent cards","Only databases"],0],
["MCP capability discovery removes the need for authorization.",["True","False"],1],
["A2A-style delegation is most useful when…",["One agent/service hands a task to another autonomous/specialized agent service","A backend calls one REST endpoint","A tokenizer emits IDs","A model runs one attention head"],0],
["Agent Card capability claims should be treated as…",["Discoverable metadata that still needs identity/trust verification","Proof of unlimited authority","Training labels","A password"],0],
["A long-running remote task benefits from…",["Task identity, status, resumable messages and completion artifacts","A single blocking chat bubble only","No failure state","No contract"],0],
["API, tool, MCP and A2A are four names for the same layer.",["True","False"],1],
["A marketplace can help discovery but still requires…",["Identity, authorization, contracts and result evaluation","No security","No schemas","No runtime"],0],
["A returned artifact should be…",["Validated against expected task/output contract before downstream use","Blindly trusted because another agent produced it","Stored in model weights","Executed automatically"],0],
["Remote MCP transport and A2A transport both still cross…",["Trust/network/identity boundaries","No security boundary","Only tokenization","Only training data"],0],
["MCP is primarily agent-to-agent task delegation.",["True","False"],1],
["The cleanest architecture keeps protocol boundary and business policy…",["Separate: protocol transports/discovery; runtime policy decides trust/scope/actions","Identical","Inside model weights","Undefined"],0],
] as const;

export function Module13CapstoneLesson({progress}:Props){
 const [boundaries,setBoundaries]=useState<Record<number,string>>({}),[mcp,setMcp]=useState<string[]>([]),[trust,setTrust]=useState<Record<number,string>>({}),[contract,setContract]=useState<string[]>([]),[statuses,setStatuses]=useState<Record<number,string>>({}),[artifacts,setArtifacts]=useState<Record<number,string>>({}),[architecture,setArchitecture]=useState<string[]>([]),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m13-map","m13-mcp","m13-trust","m13-delegate","m13-status","m13-artifact","m13-architecture","m13-explain"],sections=["map","mcp","trust","delegate","status","artifact","architecture","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const collect=(value:string,current:string[],setter:(next:string[])=>void,required:string[],task:string)=>{const next=[...new Set([...current,value])];setter(next);if(required.every(x=>next.includes(x)))progress.completeTask(task)};
 const contractParts=["goal","input","constraints","auth-scope","output","task-id"];
 const architectureParts=["user-app","host-runtime","mcp-client","mcp-server","manager-agent","remote-agent","artifact-validator"];
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["api","tool","mcp","host","server","agent","task","artifact","identity","author"].filter(w=>t.includes(w)).length;if(explain.trim().length<130||hits<6){setFeedback("Go deeper: place API, tool, MCP host/client/server and A2A task delegation on different layers, including identity/authorization and artifact validation.");return;}setFeedback("Strong. You separated protocol mechanics from runtime policy and kept A2A task delegation distinct from model tool calling.");progress.completeTask("m13-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 13 · PROTOCOL BOSS LAB</span><h1>Stop calling every connection an “AI protocol.”</h1><p>Build the architecture from four distinct boundaries: <b>API → tool abstraction → MCP capability protocol → agent-to-agent task delegation</b>. Then repair trust, status and artifacts before the final exam.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><div className={styles.party}><AiMascot variant="bot" accent="#7787ff" size={94} mood="happy" label="HOST"/><AiMascot variant="briefcase" accent="#71ddc9" size={94} mood="thinking" label="MCP"/><AiMascot variant="star" accent="#ffd850" size={94} mood={done>5?"excited":"happy"} label="A2A"/></div></section>

  <LessonSection id="map" onVisit={progress.markVisited} className={styles.scene}><h2>1. Map the four boundaries.</h2><div className={styles.grid2}>{boundaryCases.map((item,i)=><div className={styles.card} key={item[0]}><p>{item[0]}</p>{["api","tool","mcp","a2a"].map(choice=><button key={choice} className={`${styles.button} ${boundaries[i]===choice?(choice===item[1]?styles.good:styles.bad):""}`} onClick={()=>{const next={...boundaries,[i]:choice};setBoundaries(next);if(boundaryCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m13-map")}}>{choice.toUpperCase()}</button>)}</div>)}</div></LessonSection>

  <LessonSection id="mcp" onVisit={progress.markVisited} className={styles.scene}><h2>2. Wire an MCP capability boundary.</h2><p>The host needs a client connection, a server, discovered capabilities and policy around those capabilities.</p><div className={styles.chips}>{["host","client-session","server","tools/resources/prompts","transport","authorization"].map(x=><button key={x} className={mcp.includes(x)?styles.on:""} onClick={()=>collect(x,mcp,setMcp,["host","client-session","server","tools/resources/prompts","transport","authorization"],"m13-mcp")}>{x}</button>)}</div></LessonSection>

  <LessonSection id="trust" onVisit={progress.markVisited} className={styles.scene}><h2>3. Repair trust and scope.</h2>{trustCases.map((item,i)=><div className={styles.card} key={item[0]}><p>{item[0]}</p>{["allow","deny"].map(choice=><button className={`${styles.button} ${trust[i]===choice?(choice===item[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...trust,[i]:choice};setTrust(next);if(trustCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m13-trust")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="delegate" onVisit={progress.markVisited} className={styles.scene}><h2>4. Build an A2A task contract.</h2><div className={styles.chips}>{contractParts.map(x=><button key={x} className={contract.includes(x)?styles.on:""} onClick={()=>collect(x,contract,setContract,contractParts,"m13-delegate")}>{x}</button>)}</div><pre className={styles.code}>{`task: research_account\ngoal: ...\ninput: ...\nconstraints: ...\nauth_scope: web:read\noutput: citation_pack\ntask_id: task_42`}</pre></LessonSection>

  <LessonSection id="status" onVisit={progress.markVisited} className={styles.scene}><h2>5. Diagnose the remote task lifecycle.</h2>{statusCases.map((item,i)=><div className={styles.card} key={item[0]}><p>{item[0]}</p>{["good","broken"].map(choice=><button className={`${styles.button} ${statuses[i]===choice?(choice===item[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...statuses,[i]:choice};setStatuses(next);if(statusCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m13-status")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="artifact" onVisit={progress.markVisited} className={styles.scene}><h2>6. Validate artifacts before they become new context or actions.</h2>{artifactCases.map((item,i)=><div className={styles.card} key={item[0]}><p>{item[0]}</p>{["accept","quarantine","reject"].map(choice=><button className={`${styles.button} ${artifacts[i]===choice?(choice===item[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>{const next={...artifacts,[i]:choice};setArtifacts(next);if(artifactCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m13-artifact")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="architecture" onVisit={progress.markVisited} className={styles.scene}><h2>7. Assemble the full stack.</h2><p>Click every architectural layer, then read the arrows:</p><div className={styles.arch}>{architectureParts.map((x,i)=><button key={x} className={architecture.includes(x)?styles.activeArch:""} onClick={()=>collect(x,architecture,setArchitecture,architectureParts,"m13-architecture")}><span>{i+1}</span>{x}</button>)}</div><div className={styles.flow}>USER APP → HOST/RUNTIME → MCP CLIENT ↔ MCP SERVER · MANAGER AGENT → REMOTE AGENT → ARTIFACT VALIDATOR → WORKFLOW</div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the protocol stack without collapsing the layers.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain API vs tool vs MCP vs A2A, then identity/authorization, task lifecycle and artifact validation."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 13 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ PROTOCOL STACK MASTERED":"Pass is 10/12. Revisit MCP trust and A2A task lifecycle."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/a2a-delegation-lab">← A2A Delegation</Link><Link href="/lessons/memory-palace">Memory & State →</Link></div>
 </main>
}
