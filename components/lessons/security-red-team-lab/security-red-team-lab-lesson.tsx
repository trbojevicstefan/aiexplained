"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentIdentityCard } from "@/components/mascots/agent-identity-card";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { PermissionDecision, PermissionGate } from "@/components/visualizations/permission-gate";
import styles from "./security-red-team-lab.module.css";

type Props={progress:LessonProgressApi};
const tasks=["sec-surface","sec-direct","sec-indirect","sec-exfiltration","sec-poisoning","sec-agency","sec-permissions","sec-secrets","sec-threat-model","sec-explain"] as const;
const sections=["surface","direct","indirect","exfiltration","poisoning","agency","permissions","secrets","threat-model","explain"] as const;
const surfaces=[
 ["prompt","⌨","Prompt / user input","Instructions directly supplied by a user.","medium"],
 ["retrieval","▤","Retrieved content","Web pages, docs, RAG chunks and tool results can contain hostile instructions.","high"],
 ["tools","⌁","Tool execution","Read/write/delete/network/financial actions cross from text into the world.","critical"],
 ["memory","◇","Persistent memory","Bad facts or instructions can survive into future sessions.","high"],
 ["credentials","◈","Credentials","Tokens, OAuth scopes and secrets determine blast radius.","critical"],
 ["mcp","↔","Remote capability servers","Discovered tools/resources originate in another trust domain.","high"],
] as const;
const directCases=[
 ["User asks for a summary of the current policy.","normal"],
 ["User text attempts to override higher-priority application policy and requests hidden configuration.","injection"],
 ["User asks to reformat an answer as a table.","normal"],
] as const;
const indirectCases=[
 ["A retrieved web page contains text instructing the agent to ignore its task and send private data elsewhere.","untrusted-data"],
 ["A CRM tool result contains a customer note with embedded instructions telling the assistant to change permissions.","untrusted-data"],
 ["The application developer explicitly configures an approved system rule.","trusted-instruction"],
] as const;
const poisonCases=[
 ["A malicious document is inserted into the knowledge base so it outranks the real policy.","rag"],
 ["An extracted user memory stores an attacker-supplied instruction as if it were a durable preference.","memory"],
 ["A tool description understates a destructive side effect, causing unsafe selection.","tool"],
 ["A newly connected capability server advertises a broad shell-like action as a harmless file helper.","mcp"],
] as const;
const secretCases=[
 ["customer_email = ana@example.com","redact"],
 ["trace_id = 91af…","keep"],
 ["Authorization: Bearer secret-token","drop"],
 ["model = reasoning-large","keep"],
 ["raw bank-account number","redact"],
] as const;
const threats=[
 ["identity","◉","WHO","Who is the user/service/agent asking?"],
 ["asset","◆","WHAT","What data, action or credential is valuable?"],
 ["entry","→","ENTRY","Where can untrusted input enter?"],
 ["boundary","▥","BOUNDARY","Where does trust/privilege change?"],
 ["impact","!","IMPACT","What is the realistic blast radius?"],
 ["control","◈","CONTROL","Which preventive/detective control contains it?"],
] as const;
const quiz=[
 ["Indirect prompt injection is dangerous because…",["Untrusted retrieved/tool content can contain instructions that the system may mistakenly treat as authoritative","It changes model weights automatically","It only affects training","It requires a malicious tokenizer"],0],
 ["Least privilege means…",["Grant only the minimum scopes/actions needed for the task","Give the agent admin access so it never fails","Hide all tools from the runtime","Use a larger model"],0],
 ["A tool returning untrusted web content should generally be treated as…",["Data/evidence, not a higher-priority instruction source","A new system prompt","A credential","A model parameter"],0],
 ["Excessive agency primarily increases…",["Blast radius when the system can take broad actions without enough boundaries","Embedding dimension","Training speed","Tokenizer vocabulary"],0],
 ["RAG poisoning changes…",["The evidence available to retrieval/generation","The GPU clock speed","The user password automatically","The model architecture"],0],
 ["Memory poisoning can be especially persistent because…",["Bad information may be retrieved in later sessions","It always fine-tunes weights","It disables OAuth","It only affects one token"],0],
 ["A high-risk write action should often…",["Require stronger authorization/approval than a read action","Use fewer tokens only","Skip validation","Be hidden from logs"],0],
 ["Credentials should be…",["Scoped, isolated and preferably short-lived where possible","Placed in model prompts","Stored in public RAG chunks","Shared by every tenant"],0],
 ["A malicious MCP/tool server should be treated as…",["A separate trust domain whose identity, scopes and capabilities must be evaluated","Automatically trusted after discovery","Part of model weights","Equivalent to harmless text"],0],
 ["Secret detection belongs…",["At relevant input/output/log/tool boundaries, not only in the final answer","Only during pretraining","Only on the homepage","Nowhere if the model is aligned"],0],
 ["Security controls should preserve usefulness by…",["Matching controls to risk and scope instead of simply disabling everything","Allowing everything","Blocking all read tools","Removing authentication"],0],
 ["A threat model connects…",["Assets, entry points, trust boundaries, impact and controls","Only UI colors","Only token counts","Only model size"],0],
] as const;

export function SecurityRedTeamLabLesson({progress}:Props){
 const [seenSurface,setSeenSurface]=useState<string[]>([]),[direct,setDirect]=useState<Record<number,string>>({}),[indirect,setIndirect]=useState<Record<number,string>>({}),[exfil,setExfil]=useState<PermissionDecision>("allow"),[exfilChecked,setExfilChecked]=useState(false),[poison,setPoison]=useState<Record<number,string>>({}),[scope,setScope]=useState(10),[agencyChecked,setAgencyChecked]=useState(false),[gateDecision,setGateDecision]=useState<PermissionDecision>("allow"),[gateChecked,setGateChecked]=useState(false),[secrets,setSecrets]=useState<Record<number,string>>({}),[threatsSeen,setThreatsSeen]=useState<string[]>([]),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===tasks.length&&read===sections.length;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const seeSurface=(id:string)=>{const next=[...new Set([...seenSurface,id])];setSeenSurface(next);if(next.length===surfaces.length)progress.completeTask("sec-surface")};
 const classifyDirect=(i:number,v:string)=>{const next={...direct,[i]:v};setDirect(next);if(directCases.every((c,index)=>next[index]===c[1]))progress.completeTask("sec-direct")};
 const classifyIndirect=(i:number,v:string)=>{const next={...indirect,[i]:v};setIndirect(next);if(indirectCases.every((c,index)=>next[index]===c[1]))progress.completeTask("sec-indirect")};
 const checkExfil=()=>{setExfilChecked(true);if(exfil==="deny")progress.completeTask("sec-exfiltration")};
 const classifyPoison=(i:number,v:string)=>{const next={...poison,[i]:v};setPoison(next);if(poisonCases.every((c,index)=>next[index]===c[1]))progress.completeTask("sec-poisoning")};
 const checkAgency=()=>{setAgencyChecked(true);if(scope<=3)progress.completeTask("sec-agency")};
 const checkGate=()=>{setGateChecked(true);if(gateDecision==="approval")progress.completeTask("sec-permissions")};
 const classifySecret=(i:number,v:string)=>{const next={...secrets,[i]:v};setSecrets(next);if(secretCases.every((c,index)=>next[index]===c[1]))progress.completeTask("sec-secrets")};
 const seeThreat=(id:string)=>{const next=[...new Set([...threatsSeen,id])];setThreatsSeen(next);if(next.length===threats.length)progress.completeTask("sec-threat-model")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["trust","permission","scope","injection","tool","memory","credential","retrieval","approval","boundary"].filter(w=>t.includes(w)).length;if(explain.trim().length<130||hits<6){setFeedback("Go deeper: connect untrusted input to trust boundaries, least privilege, tool/action scopes, persistent memory/retrieval poisoning and approval for sensitive actions.");return}setFeedback("Strong. You framed agent security as controlling trust, capabilities and blast radius — not as hoping the model ignores every malicious instruction.");progress.completeTask("sec-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 25 · SECURITY RED-TEAM CONTROL ROOM</span><h1>The model is not the only thing attackers can influence.</h1><p>Agent security is about the whole system: <b>what enters context, what gets retrieved, what persists, which tools exist, which credentials they use and what the runtime allows to happen.</b> You will contain failures by shrinking trust and privilege boundaries.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===10}>{done}/10 security missions complete</TaskStamp></div><div className={styles.heroRight}><AgentIdentityCard name="Sentinel" role="SECURITY GUARDIAN" status={done===10?"HARDENED":done>3?"CONTAINING":"RED TEAM ACTIVE"} detail="Sentinel does not trust text because it looks authoritative. It checks origin, scope and action risk." variant="bot" accent="#ff7373" active={done<10}/><PermissionGate action="payments.create_transfer" scope="finance.write" reason="Agent says invoice should be paid" risk="critical" decision="approval" accent="#ff7373" compact/></div></section>

  <LessonSection id="surface" onVisit={progress.markVisited} className={styles.scene}><h2>1. Map the attack surface around the model.</h2><p>Click every surface. Security failures can originate in data, tools, memory and credentials even when the model itself behaves exactly as prompted.</p><div className={styles.grid3}>{surfaces.map(([id,icon,title,detail,risk])=><button key={id} className={`${styles.surface} ${seenSurface.includes(id)?styles.surfaceOn:""}`} onClick={()=>seeSurface(id)}><span>{icon}</span><b>{title}</b><p>{detail}</p><i className={styles.surfaceRisk}>{risk}</i></button>)}</div></LessonSection>

  <LessonSection id="direct" onVisit={progress.markVisited} className={styles.scene}><h2>2. Direct prompt injection is an instruction-conflict problem.</h2><p>Classify the user messages. A defensive system should preserve higher-priority application policy and avoid exposing protected configuration just because user text asks for it.</p>{directCases.map((c,i)=><div className={styles.case} key={c[0]}><p>{c[0]}</p><div className={styles.trustBar}>{["normal","injection"].map(v=><button key={v} className={`${styles.button} ${direct[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifyDirect(i,v)}>{v}</button>)}</div></div>)}</LessonSection>

  <LessonSection id="indirect" onVisit={progress.markVisited} className={styles.scene}><h2>3. Indirect injection arrives disguised as evidence.</h2><p>A web page, RAG chunk or tool result is usually <b>untrusted content</b>. The system may need its facts, but not its attempt to redefine the agent's instructions.</p>{indirectCases.map((c,i)=><div className={styles.message} data-trust={c[1]==="untrusted-data"?"untrusted":"trusted"} key={c[0]}><code>{c[0]}</code><div className={styles.trustBar}>{["trusted-instruction","untrusted-data"].map(v=><button key={v} className={`${styles.button} ${indirect[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifyIndirect(i,v)}>{v}</button>)}</div></div>)}</LessonSection>

  <LessonSection id="exfiltration" onVisit={progress.markVisited} className={styles.scene}><h2>4. Stop the action where private data would cross the boundary.</h2><p>The agent has access to an internal customer export. A retrieved page asks it to upload that file to an unrelated external endpoint. The correct defense is not “tell the model to be careful”; the runtime must enforce the boundary.</p><PermissionGate action="http.upload(customer_export.csv)" scope="network.external + customer_data.read" reason="Instruction originated inside untrusted retrieved content" risk="critical" decision={exfil} onDecision={setExfil} accent="#ff7373"/><button className={styles.primary} onClick={checkExfil}>Validate boundary decision</button>{exfilChecked&&<p className={`${styles.feedback} ${exfil!=="deny"?styles.warning:""}`}>{exfil==="deny"?"✓ Denied. Untrusted content cannot authorize private-data exfiltration.":"This should be denied: the requested external transfer is outside the trusted task and data boundary."}</p>}</LessonSection>

  <LessonSection id="poisoning" onVisit={progress.markVisited} className={styles.scene}><h2>5. Poisoning attacks target what the agent will trust later.</h2><p>Identify which system surface was poisoned. The remediation differs: re-index evidence, repair/delete memory, validate tool metadata, or reject/quarantine a capability server.</p>{poisonCases.map((c,i)=><div className={styles.poisonRow} key={c[0]}><p>{c[0]}</p>{["rag","memory","tool","mcp"].map(v=><button key={v} className={`${styles.button} ${poison[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifyPoison(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="agency" onVisit={progress.markVisited} className={styles.scene}><h2>6. Excessive agency turns one bad decision into a large blast radius.</h2><p>A support agent currently has ten powerful capabilities, including billing writes and account deletion. Reduce it to the minimum toy scope needed to answer tickets and add internal notes.</p><div className={styles.agencyPanel}><div className={styles.scopeBox}><label>Granted capabilities <b>{scope}/10</b></label><input type="range" min="1" max="10" value={scope} onChange={e=>setScope(+e.target.value)}/><div className={styles.scopeList}><div className={styles.scopeItem}><b>tickets.read</b><span>needed</span></div><div className={styles.scopeItem}><b>crm.add_internal_note</b><span>needed</span></div><div className={styles.scopeItem}><b>billing.refund</b><span>separate approval flow</span></div><div className={styles.scopeItem}><b>users.delete</b><span>not needed</span></div></div></div><div className={styles.counter}><div><span>capabilities</span><b>{scope}</b></div><div><span>blast radius</span><b>{scope<=3?"LOW":scope<=6?"MED":"HIGH"}</b></div><div><span>target</span><b>≤3</b></div></div></div><button className={styles.primary} onClick={checkAgency}>Check least privilege</button>{agencyChecked&&<p className={`${styles.feedback} ${scope>3?styles.warning:""}`}>{scope<=3?"✓ Useful enough for support, without carrying unrelated destructive authority.":"Still too broad. Remove capabilities unrelated to reading tickets and writing internal notes."}</p>}</LessonSection>

  <LessonSection id="permissions" onVisit={progress.markVisited} className={styles.scene}><h2>7. Read, write and destructive actions should not share one trust level.</h2><p>The user asked for a report. The agent now proposes deleting the source records after export. Choose the correct policy.</p><PermissionGate action="records.delete_many" scope="customer_records.delete" reason="Cleanup suggested by agent; deletion was not requested by user" risk="critical" decision={gateDecision} onDecision={setGateDecision} accent="#ff9b62"/><button className={styles.primary} onClick={checkGate}>Validate permission policy</button>{gateChecked&&<p className={`${styles.feedback} ${gateDecision!=="approval"?styles.warning:""}`}>{gateDecision==="approval"?"✓ Correct toy policy: destructive action is not silently executed. It requires an explicit approval path.":"For this lesson, require explicit approval. The user asked for export, not silent deletion."}</p>}</LessonSection>

  <LessonSection id="secrets" onVisit={progress.markVisited} className={styles.scene}><h2>8. Secrets and PII need controls before they reach logs, prompts or external tools.</h2><p>Classify each telemetry field. “Redact” means preserve enough structure for debugging while masking sensitive value; “drop” means the value should not be retained at this boundary.</p>{secretCases.map((c,i)=><div className={styles.secretRow} key={c[0]}><code>{c[0]}</code>{["keep","redact","drop"].map(v=><button key={v} className={`${styles.button} ${secrets[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>classifySecret(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="threat-model" onVisit={progress.markVisited} className={styles.scene}><h2>9. Build a threat model before you build a list of filters.</h2><p>Click all six questions. A useful threat model ties a valuable asset and entry point to a trust boundary, impact and concrete control.</p><div className={styles.threatMap}>{threats.map(([id,icon,title,detail])=><button key={id} className={`${styles.threat} ${threatsSeen.includes(id)?styles.threatOn:""}`} onClick={()=>seeThreat(id)}><span>{icon}</span><b>{title}</b><small>{detail}</small></button>)}</div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>10. Explain why “the model is aligned” is not a complete security architecture.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain untrusted input, trust boundaries, retrieval/memory/tool poisoning, credential scope, least privilege, approvals and blast radius."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Security Red-Team mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Harden every boundary first. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.answer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ SECURITY BOUNDARIES MASTERED":"Pass is 10/12. Revisit trust boundaries and least privilege."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-24-capstone">← Evals & Observability</Link><Link href="/lessons/guardrails-sandbox-lab">Guardrails & Sandbox →</Link></div>
 </main>
}
