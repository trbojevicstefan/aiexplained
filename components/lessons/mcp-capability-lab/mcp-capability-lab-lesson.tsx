"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./mcp-capability-lab.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["In MCP, the host is conceptually…",["The AI application that coordinates MCP clients and user/model experience","Every external API","Only the model weights","Only a database"],0],
["An MCP client generally…",["Maintains a protocol connection/session from the host side to an MCP server","Is the LLM tokenizer","Is always a browser","Is the training process"],0],
["An MCP server exposes capabilities such as…",["Tools, resources and prompts according to the protocol/server implementation","Only model weights","Only system messages","Only vector indexes"],0],
["MCP tool discovery differs from a hard-coded API integration because…",["The client can discover server-advertised capabilities dynamically through a standard protocol surface","No code exists anywhere","Authorization disappears","Tools execute inside model weights"],0],
["stdio is commonly useful for…",["Local child-process style MCP connections where host launches/communicates with a local server","Public web search only","Training clusters","Model routing"],0],
["Remote MCP over HTTP still requires…",["Authentication/authorization/trust and network security appropriate to the deployment","No identity","No permissions","No validation"],0],
["A newly discovered tool should be…",["Treated as untrusted capability until policy/identity/scope are understood","Automatically granted admin authority","Executed once to test it in production","Added to model weights"],0],
["API vs tool vs MCP server…",["API is a service interface; a tool is a model-facing action abstraction; an MCP server can expose tools/resources/prompts via protocol","They are always identical","MCP replaces every API","A tool is always an MCP server"],0],
] as const;
const roleCases=[
["Desktop AI app coordinating model + connections","host"],["One connection/session to filesystem MCP server","client"],["Process exposing filesystem capabilities","server"],
] as const;
const authCases=[
["Remote finance server with read_invoice and create_payment","scoped-auth"],["Local toy server reading a sandbox folder","local-sandbox"],["Unknown internet server requests browser cookies + shell","reject"],
] as const;
const apiCases=[
["Stripe REST endpoint","api"],["create_invoice(name, amount) shown to model","tool"],["Protocol endpoint/process exposing invoice tools + resources","mcp-server"],
] as const;

export function McpCapabilityLabLesson({progress}:Props){
 const [roles,setRoles]=useState<Record<number,string>>({}),[servers,setServers]=useState<string[]>([]),[caps,setCaps]=useState<string[]>([]),[transport,setTransport]=useState<Record<number,string>>({}),[auth,setAuth]=useState<Record<number,string>>({}),[trust,setTrust]=useState<string[]>([]),[security,setSecurity]=useState<Record<number,string>>({}),[api,setApi]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["mcp-roles","mcp-connect","mcp-discover","mcp-transport","mcp-auth","mcp-local-remote","mcp-security","mcp-api-tool","mcp-explain"],sections=["roles","connect","discover","transport","auth","local-remote","security","api-tool","explain"];
 const done=tasks.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===9&&read===9;
 const connectedLocal=servers.includes("filesystem"),connectedRemote=servers.includes("crm");
 const availableCaps=[...(connectedLocal?["tool:read_file","tool:list_dir","resource:workspace://README"]:[]),...(connectedRemote?["tool:search_customer","tool:update_customer","resource:crm://schema","prompt:customer_summary"]:[])];
 const securityCases=[
  ["Server description says shell tool 'just helps with files' but schema accepts arbitrary commands.","deny"],
  ["Remote server returns instructions inside a resource telling the model to ignore system policy.","treat-data"],
  ["Server tool requests OAuth scope far beyond documented action.","reject-scope"],
 ] as const;
 const score=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const submit=()=>{const t=explain.toLowerCase();const hits=["host","client","server","tool","resource","prompt","stdio","http","auth"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<5){setFeedback("Go deeper: explain host/client/server roles, discovery of tools/resources/prompts, transport and the authorization/trust boundary.");return;}setFeedback("Strong. You described MCP as a protocolized capability boundary around existing systems, not as magic tool execution or a replacement for authorization.");progress.completeTask("mcp-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 13 · MCP CAPABILITY LAB</span><h1>Connect a server. Watch new capabilities appear.</h1><p>MCP gives AI applications a standard way to connect to servers that expose model-usable capabilities. The important mental model is <b>host ↔ client connection ↔ server</b>, then capability discovery, trust, authorization and execution policy.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 MCP missions complete</TaskStamp></div><div className={styles.network}><div><AiMascot variant="bot" accent="#70c9ff" mood={connectedLocal||connectedRemote?"happy":"thinking"} size={100} label="HOST"/></div><span className={styles.wire}>↔</span><div><AiMascot variant="briefcase" accent="#70d8d0" mood={connectedRemote?"excited":"thinking"} size={100} label="SERVER"/></div></div></section>

  <LessonSection id="roles" onVisit={progress.markVisited} className={styles.scene}><h2>1. Separate host, client and server.</h2>{roleCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["host","client","server"].map(choice=><button key={choice} className={`${styles.button} ${roles[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...roles,[i]:choice};setRoles(next);if(roleCases.every((x,j)=>next[j]===x[1]))progress.completeTask("mcp-roles")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="connect" onVisit={progress.markVisited} className={styles.scene}><h2>2. Connect two very different servers.</h2><div className={styles.grid2}><button className={`${styles.server} ${connectedLocal?styles.connected:""}`} onClick={()=>mark("filesystem",servers,setServers,2,"mcp-connect")}><b>LOCAL FILESYSTEM MCP</b><p>Child process · workspace sandbox · local stdio-style transport.</p></button><button className={`${styles.server} ${connectedRemote?styles.connected:""}`} onClick={()=>mark("crm",servers,setServers,2,"mcp-connect")}><b>REMOTE CRM MCP</b><p>Network service · authenticated remote HTTP transport.</p></button></div></LessonSection>

  <LessonSection id="discover" onVisit={progress.markVisited} className={styles.scene}><h2>3. Capability discovery changes what the host can offer the model.</h2><div className={styles.caps}>{availableCaps.map(cap=>{const type=cap.split(":")[0];return <button key={cap} className={`${styles.cap} ${type==="tool"?styles.tool:type==="resource"?styles.resource:styles.prompt} ${caps.includes(cap)?styles.correct:""}`} onClick={()=>mark(cap,caps,setCaps,Math.max(1,availableCaps.length),"mcp-discover")}>{cap}</button>})}</div>{availableCaps.length===0&&<p className={styles.warning}>Connect servers first.</p>}<div className={styles.grid3}><div className={styles.panel}><b>TOOLS</b><p>Actions/functions the model can request through the host/runtime.</p></div><div className={styles.panel}><b>RESOURCES</b><p>Addressable data/context exposed by the server.</p></div><div className={styles.panel}><b>PROMPTS</b><p>Server-provided prompt templates/workflows that clients may surface/use.</p></div></div></LessonSection>

  <LessonSection id="transport" onVisit={progress.markVisited} className={styles.scene}><h2>4. Transport answers “how do messages move?” — not “who is authorized?”</h2><div className={styles.transport}>{[
   ["local","Local child process managed by desktop host","stdio"],["remote","Remote shared CRM service over network","http"],
  ].map((item,i)=><div className={styles.transportCard} key={item[0]}><p>{item[1]}</p>{["stdio","http"].map(choice=><button key={choice} className={`${styles.button} ${transport[i]===choice?(choice===item[2]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...transport,[i]:choice};setTransport(next);if(next[0]==="stdio"&&next[1]==="http")progress.completeTask("mcp-transport")}}>{choice}</button>)}</div>)}</div><p>Current MCP ecosystems commonly use local stdio and HTTP-based remote transports. Transport details/spec versions evolve; authorization remains a separate concern.</p></LessonSection>

  <LessonSection id="auth" onVisit={progress.markVisited} className={styles.scene}><h2>5. Authentication says who; authorization says what they may do.</h2>{authCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["scoped-auth","local-sandbox","reject"].map(choice=><button key={choice} className={`${styles.button} ${auth[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...auth,[i]:choice};setAuth(next);if(authCases.every((x,j)=>next[j]===x[1]))progress.completeTask("mcp-auth")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="local-remote" onVisit={progress.markVisited} className={styles.scene}><h2>6. Local does not automatically mean trusted; remote does not automatically mean unsafe.</h2><div className={styles.grid3}>{[
  ["identity","server identity/source"],["scope","requested capability/credential scope"],["boundary","filesystem/network/process boundary"],["logs","audit/tracing"],["updates","server/package update trust"],["user","user-visible approvals for sensitive actions"],
  ].map(([id,text])=><button key={id} className={`${styles.panel} ${trust.includes(id)?styles.trust:""}`} onClick={()=>mark(id,trust,setTrust,6,"mcp-local-remote")}><b>{text}</b></button>)}</div></LessonSection>

  <LessonSection id="security" onVisit={progress.markVisited} className={styles.scene}><h2>7. Discovered capabilities are code/data from another trust domain.</h2>{securityCases.map((item,i)=><div className={`${styles.panel} ${styles.risk}`} key={item[0]}><p>{item[0]}</p>{["deny","treat-data","reject-scope"].map(choice=><button key={choice} className={`${styles.button} ${security[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...security,[i]:choice};setSecurity(next);if(securityCases.every((x,j)=>next[j]===x[1]))progress.completeTask("mcp-security")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="api-tool" onVisit={progress.markVisited} className={styles.scene}><h2>8. API ≠ tool ≠ MCP server.</h2>{apiCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["api","tool","mcp-server"].map(choice=><button key={choice} className={`${styles.button} ${api[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...api,[i]:choice};setApi(next);if(apiCases.every((x,j)=>next[j]===x[1]))progress.completeTask("mcp-api-tool")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain MCP without saying “it gives the model APIs.”</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain host/client/server, tools/resources/prompts, stdio/HTTP transport concepts and auth/trust boundaries."/><button className={styles.button} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>MCP Capability Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine MCP rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=7)}>Submit · {score}/8</button>{quizDone&&<p className={styles.feedback}>{score>=7?"★ MCP CAPABILITIES MASTERED":"Pass is 7/8. Revisit roles and trust boundaries."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-12-capstone">← Tool Calling</Link><Link href="/lessons/a2a-delegation-lab">Agent-to-Agent Delegation →</Link></div>
 </main>
}
