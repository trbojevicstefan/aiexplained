"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentIdentityCard } from "@/components/mascots/agent-identity-card";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { PermissionDecision, PermissionGate } from "@/components/visualizations/permission-gate";
import { SandboxBoundary } from "@/components/visualizations/sandbox-boundary";
import styles from "../security-red-team-lab/security-red-team-lab.module.css";

type Props={progress:LessonProgressApi};
const tasks=["m25-incident","m25-injection","m25-poisoning","m25-permissions","m25-secrets","m25-sandbox","m25-limits","m25-approval","m25-audit","m25-explain"] as const;
const sections=["incident","injection","poisoning","permissions","secrets","sandbox","limits","approval","audit","explain"] as const;
const quiz=[
 ["The most robust response to indirect prompt injection is to…",["Treat retrieved/tool content as untrusted data and enforce action policy outside the model","Ask the model to promise harder","Give retrieved text system priority","Disable authentication"],0],
 ["A compromised memory record should…",["Be quarantined/removed or corrected and prevented from silently authorizing future actions","Be promoted to system prompt","Become a tool schema","Be copied to all users"],0],
 ["Least privilege reduces…",["Blast radius if a decision or component is compromised","Context length","GPU latency","Embedding dimensions"],0],
 ["Secrets should generally be passed to tools…",["Through isolated credential mechanisms rather than model-visible prompts when possible","In public context","Inside RAG chunks","In user-visible logs"],0],
 ["Sandboxing is valuable even with strong model policies because…",["It enforces resource/network/filesystem boundaries independently of model behavior","It improves tokenization","It fine-tunes the model","It replaces OAuth"],0],
 ["A high-impact write should often use…",["Explicit authorization/approval and auditability","Unlimited retries","No schema","No logs"],0],
 ["Rate/step/cost limits contain…",["Runaway behavior and resource exhaustion","Only prompt injection","Only hallucination","Only retrieval errors"],0],
 ["Audit logs should avoid…",["Unnecessary plaintext secrets and sensitive data","Trace IDs","Tool names","Latency values"],0],
 ["RAG and memory poisoning differ mainly in…",["Which trusted knowledge/persistence surface is corrupted","Whether a GPU is used","Whether output is JSON","Which font is displayed"],0],
 ["Security is strongest when…",["Identity, trust, permissions, isolation, budgets and detection reinforce one another","One prompt contains every rule","All tools are always enabled","Everything is silently auto-approved"],0],
 ["A tool description is part of the security surface because…",["Misleading capability metadata can influence unsafe tool selection/expectations","It changes CUDA","It determines token IDs","It encrypts credentials"],0],
 ["A secure agent is best described as…",["Useful authority bounded by explicit trust, scopes and runtime controls","A model that never uses tools","A model with no context","A system with no users"],0],
] as const;
const poisonItems=[
 ["Retrieved policy chunk contains an embedded instruction to export internal customer data.","quarantine"],
 ["Persistent memory says 'always approve refunds' even though user never expressed that preference.","delete"],
 ["Verified current policy document from trusted source.","keep"],
 ["Capability server changed its tool behavior after an unsigned/unreviewed update.","quarantine"],
] as const;
const secretItems=[
 ["OAuth access token printed inside model-visible tool result","drop"],
 ["customer_email inside an audit log where identity is unnecessary","redact"],
 ["trace_id","keep"],
 ["short-lived credential handle/reference","keep"],
] as const;
const auditItems=[
 ["tool name + scope + decision + approver + timestamp","keep"],
 ["raw access token","drop"],
 ["prompt injection detector result","keep"],
 ["full unredacted customer export","drop"],
] as const;

export function Module25CapstoneLesson({progress}:Props){
 const [incident,setIncident]=useState(false),[trustFixed,setTrustFixed]=useState(false),[poison,setPoison]=useState<Record<number,string>>({}),[permission,setPermission]=useState<PermissionDecision>("allow"),[permissionChecked,setPermissionChecked]=useState(false),[secrets,setSecrets]=useState<Record<number,string>>({}),[network,setNetwork]=useState<"none"|"restricted"|"open">("open"),[filesystem,setFilesystem]=useState<"none"|"workspace"|"host">("host"),[shell,setShell]=useState<"none"|"allowlist"|"unrestricted">("unrestricted"),[sandboxChecked,setSandboxChecked]=useState(false),[steps,setSteps]=useState(50),[cost,setCost]=useState(60),[limitsChecked,setLimitsChecked]=useState(false),[approval,setApproval]=useState<PermissionDecision>("allow"),[approvalChecked,setApprovalChecked]=useState(false),[audit,setAudit]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const classifyPoison=(i:number,v:string)=>{const next={...poison,[i]:v};setPoison(next);if(poisonItems.every((c,index)=>next[index]===c[1]))progress.completeTask("m25-poisoning")};
 const classifySecret=(i:number,v:string)=>{const next={...secrets,[i]:v};setSecrets(next);if(secretItems.every((c,index)=>next[index]===c[1]))progress.completeTask("m25-secrets")};
 const classifyAudit=(i:number,v:string)=>{const next={...audit,[i]:v};setAudit(next);if(auditItems.every((c,index)=>next[index]===c[1]))progress.completeTask("m25-audit")};
 const checkPermission=()=>{setPermissionChecked(true);if(permission==="deny")progress.completeTask("m25-permissions")};
 const checkSandbox=()=>{setSandboxChecked(true);if(network==="restricted"&&filesystem==="workspace"&&shell==="allowlist")progress.completeTask("m25-sandbox")};
 const checkLimits=()=>{setLimitsChecked(true);if(steps<=15&&cost<=12)progress.completeTask("m25-limits")};
 const checkApproval=()=>{setApprovalChecked(true);if(approval==="approval")progress.completeTask("m25-approval")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["trust","injection","memory","permission","credential","sandbox","limit","approval","audit","scope"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: explain trust separation, poisoned knowledge/memory, least privilege, credential isolation, sandboxing, budgets, approvals and auditable decisions.");return}setFeedback("Strong. You designed multiple independent controls so one bad message or model decision cannot silently become unlimited authority.");progress.completeTask("m25-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 25 · SECURITY ESCAPE ROOM</span><h1>The agent is compromised. Contain it before it acts.</h1><p>A support agent followed hostile text from retrieved content, stored a bad durable memory and now has broad credentials plus a wide execution boundary. Repair the <b>system</b>, not just the wording of its prompt.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===10}>{done}/10 containment locks closed</TaskStamp></div><div className={styles.heroRight}><AgentIdentityCard name="Sentinel" role="INCIDENT COMMANDER" status={done===10?"CONTAINED":incident?"INCIDENT LIVE":"AWAITING ALERT"} detail="Close trust, privilege and execution boundaries until the same malicious input can no longer create a dangerous action." variant="bot" accent="#ff7373" active={incident&&done<10}/><SandboxBoundary network={network} filesystem={filesystem} shell={shell} cpu={60} memory={1024} timeout={60} active={incident} accent="#ff7373"/></div></section>

  <LessonSection id="incident" onVisit={progress.markVisited} className={styles.scene}><h2>1. Open the incident report.</h2><div className={styles.grid3}><div className={styles.card}><b>ENTRY</b><p>Untrusted policy page inserted hostile instructions into retrieved content.</p></div><div className={styles.card}><b>PERSISTENCE</b><p>A bad instruction was stored as durable memory.</p></div><div className={styles.card}><b>AUTHORITY</b><p>Agent holds broad external write + host-like execution access.</p></div></div><button className={styles.primary} onClick={()=>{setIncident(true);progress.completeTask("m25-incident")}}>Start containment</button></LessonSection>

  <LessonSection id="injection" onVisit={progress.markVisited} className={styles.scene}><h2>2. Repair the trust boundary.</h2><div className={styles.message} data-trust="untrusted"><code>Retrieved web content: [business facts] + text attempting to redefine the agent's instructions and request private-data transfer.</code></div><div className={styles.grid3}><button className={`${styles.button} ${trustFixed?styles.good:""}`} onClick={()=>{setTrustFixed(true);progress.completeTask("m25-injection")}}>Treat retrieved content as untrusted evidence</button><button className={styles.button}>Promote it to system instruction</button><button className={styles.button}>Give it temporary admin scope</button></div>{trustFixed&&<p className={styles.feedback}>✓ Facts may be used as evidence; embedded instructions do not gain authority from where they were retrieved.</p>}</LessonSection>

  <LessonSection id="poisoning" onVisit={progress.markVisited} className={styles.scene}><h2>3. Clean poisoned retrieval and memory surfaces.</h2>{poisonItems.map((c,i)=><div className={styles.poisonRow} key={c[0]}><p>{c[0]}</p>{["keep","delete","quarantine"].map(v=><button key={v} className={`${styles.button} ${poison[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifyPoison(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="permissions" onVisit={progress.markVisited} className={styles.scene}><h2>4. Shrink authority the current task never needed.</h2><PermissionGate action="external.upload(customer_export)" scope="customer_data.read + network.external.write" reason="Requested only by untrusted retrieved content" risk="critical" decision={permission} onDecision={setPermission} accent="#ff7373"/><button className={styles.primary} onClick={checkPermission}>Validate permission</button>{permissionChecked&&<p className={`${styles.feedback} ${permission!=="deny"?styles.warning:""}`}>{permission==="deny"?"✓ Denied outside-task exfiltration path.":"This action should be denied; neither the user nor trusted task authorized it."}</p>}</LessonSection>

  <LessonSection id="secrets" onVisit={progress.markVisited} className={styles.scene}><h2>5. Remove secrets from model-visible and logging surfaces.</h2>{secretItems.map((c,i)=><div className={styles.secretRow} key={c[0]}><code>{c[0]}</code>{["keep","redact","drop"].map(v=><button key={v} className={`${styles.button} ${secrets[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifySecret(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="sandbox" onVisit={progress.markVisited} className={styles.scene}><h2>6. Replace broad execution access with a constrained workspace.</h2><div className={styles.grid3}><div className={styles.card}><b>NETWORK</b>{(["none","restricted","open"] as const).map(v=><button key={v} className={`${styles.button} ${network===v?styles.selected:""}`} onClick={()=>setNetwork(v)}>{v}</button>)}</div><div className={styles.card}><b>FILESYSTEM</b>{(["none","workspace","host"] as const).map(v=><button key={v} className={`${styles.button} ${filesystem===v?styles.selected:""}`} onClick={()=>setFilesystem(v)}>{v}</button>)}</div><div className={styles.card}><b>COMMANDS</b>{(["none","allowlist","unrestricted"] as const).map(v=><button key={v} className={`${styles.button} ${shell===v?styles.selected:""}`} onClick={()=>setShell(v)}>{v}</button>)}</div></div><SandboxBoundary network={network} filesystem={filesystem} shell={shell} cpu={60} memory={1024} timeout={60} active accent="#9785ff"/><button className={styles.primary} onClick={checkSandbox}>Validate boundary</button>{sandboxChecked&&<p className={`${styles.feedback} ${!(network==="restricted"&&filesystem==="workspace"&&shell==="allowlist")?styles.warning:""}`}>{network==="restricted"&&filesystem==="workspace"&&shell==="allowlist"?"✓ Work remains possible inside explicit network/filesystem/command boundaries.":"Choose restricted network, workspace-only files and an allowlisted command surface."}</p>}</LessonSection>

  <LessonSection id="limits" onVisit={progress.markVisited} className={styles.scene}><h2>7. Bound repeated failure.</h2><div className={styles.grid2}><div className={styles.card}><label>max steps <b>{steps}</b></label><input style={{width:"100%"}} type="range" min="5" max="60" value={steps} onChange={e=>setSteps(+e.target.value)}/></div><div className={styles.card}><label>max run cost <b>${cost}</b></label><input style={{width:"100%"}} type="range" min="2" max="80" value={cost} onChange={e=>setCost(+e.target.value)}/></div></div><button className={styles.primary} onClick={checkLimits}>Validate limits</button>{limitsChecked&&<p className={`${styles.feedback} ${!(steps<=15&&cost<=12)?styles.warning:""}`}>{steps<=15&&cost<=12?"✓ Bounded run: compromise cannot loop indefinitely or spend without limit.":"Tighten to ≤15 steps and ≤$12 for this toy incident."}</p>}</LessonSection>

  <LessonSection id="approval" onVisit={progress.markVisited} className={styles.scene}><h2>8. Put a human at the consequence boundary.</h2><PermissionGate action="billing.refund(amount=1200)" scope="billing.write" reason="Agent believes customer qualifies for exception" risk="critical" decision={approval} onDecision={setApproval} accent="#ffe163"/><button className={styles.primary} onClick={checkApproval}>Validate approval policy</button>{approvalChecked&&<p className={`${styles.feedback} ${approval!=="approval"?styles.warning:""}`}>{approval==="approval"?"✓ Sensitive financial write pauses for explicit confirmation.":"Require approval for this high-impact write."}</p>}</LessonSection>

  <LessonSection id="audit" onVisit={progress.markVisited} className={styles.scene}><h2>9. Preserve enough evidence to investigate without preserving secrets.</h2>{auditItems.map((c,i)=><div className={styles.secretRow} key={c[0]}><code>{c[0]}</code>{["keep","drop"].map(v=><button key={v} className={`${styles.button} ${audit[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifyAudit(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>10. Explain why the repaired system is safer even if the model sees the same hostile content again.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Connect trust separation, retrieval/memory cleanup, least privilege, credential isolation, sandbox, limits, human approval and auditability."/><button className={styles.primary} onClick={submitExplain}>Check architecture</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 25 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Close every containment lock first. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.answer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODULE 25 MASTERED — useful authority, bounded by independent controls.":"Pass is 10/12. Revisit trust boundaries and runtime containment."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/guardrails-sandbox-lab">← Guardrails & Sandbox</Link><Link href="/">Return to AI Explained →</Link></div>
 </main>
}
