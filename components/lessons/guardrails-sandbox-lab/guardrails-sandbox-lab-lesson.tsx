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
const tasks=["guard-layers","guard-input","guard-output","guard-tools","guard-budgets","guard-sandbox","guard-commands","guard-human","guard-explain"] as const;
const sections=["layers","input","output","tools","budgets","sandbox","commands","human","explain"] as const;
const defenseLayers=[
 ["identity","◉","Identity & auth","Who is requesting the action?"],["context","▤","Input trust","What content is untrusted evidence vs instruction?"],["schema","{ }","Validation","Does structured input/output match contract?"],["policy","◈","Action policy","Is this tool/action allowed at this risk?"],["sandbox","▥","Isolation","What can executed code/process actually reach?"],["observe","⌁","Audit & eval","Can we detect and explain a bad run?"]
] as const;
const inputCases=[
 ["User pastes a normal invoice and asks for a summary.","allow"],["Retrieved text contains an instruction to reveal protected configuration.","treat-as-data"],["Input contains a credential-looking secret in a field that will be logged.","redact"],["User requests an action outside their authenticated tenant.","deny"]
] as const;
const outputCases=[
 ["JSON response is missing required `customer_id`.","schema"],["Answer contains a secret-like token copied from tool output.","secret"],["Model proposes a financial action beyond the requested amount.","policy"],["Natural-language summary is stylistically awkward but safe and factual.","accept"]
] as const;
const commandCases=[
 ["read workspace test results","allow"],["write patch inside checked-out repo","allow"],["modify files outside assigned workspace","deny"],["open arbitrary outbound network connection","deny"],["run approved test command with resource limits","allow"]
] as const;
const humanCases=[
 ["Search public docs","allow"],["Read user's own calendar availability","allow"],["Send external email as user","approval"],["Delete customer records","approval"],["Transfer money","approval"]
] as const;
const quiz=[
 ["Defense in depth means…",["Use multiple independent controls around different boundaries","Write one perfect system prompt","Disable all tools","Trust the model's refusal only"],0],
 ["Schema validation is useful because…",["It checks structure/types before downstream execution","It guarantees factual truth","It replaces authorization","It encrypts secrets"],0],
 ["An output guardrail can…",["Detect secrets/PII or policy violations before data leaves the system","Change pretraining data","Replace a GPU","Create OAuth scopes"],0],
 ["A sandbox primarily limits…",["What executed code/processes can access and consume","Which next token is likely","Embedding similarity","Training labels"],0],
 ["Network isolation and filesystem isolation are…",["Separate containment boundaries","The same setting","Only UI concepts","Model parameters"],0],
 ["Step/cost limits help contain…",["Runaway loops and unexpectedly expensive behavior","Tokenizer drift","Image resolution only","Dataset leakage only"],0],
 ["A destructive action often deserves…",["Stronger policy/approval than read-only actions","No logs","More context but no authorization","Unlimited retries"],0],
 ["Allowlisting executable commands is…",["A narrower capability policy than unrestricted shell access","A prompt style","An embedding method","A retrieval metric"],0],
 ["Human-in-the-loop is most useful when…",["Consequences/risk justify explicit confirmation or review","Every token is generated","The model is small","The UI is dark"],0],
 ["Guardrails should be tested with evals because…",["Controls can over-block or under-block and need measurable behavior","Guardrails cannot fail","Evals replace runtime controls","Only prompts need testing"],0],
 ["A sandbox with host filesystem + unrestricted network is…",["A broad blast-radius configuration","Automatically safest","Equivalent to no tools","A retrieval index"],0],
 ["The goal of security controls is…",["Useful capability with bounded authority and observable failures","Zero functionality","Maximum tool count","Hide all traces"],0],
] as const;

export function GuardrailsSandboxLabLesson({progress}:Props){
 const [layers,setLayers]=useState<string[]>([]),[input,setInput]=useState<Record<number,string>>({}),[output,setOutput]=useState<Record<number,string>>({}),[toolDecision,setToolDecision]=useState<PermissionDecision>("allow"),[toolChecked,setToolChecked]=useState(false),[steps,setSteps]=useState(30),[cost,setCost]=useState(25),[rate,setRate]=useState(120),[budgetChecked,setBudgetChecked]=useState(false),[network,setNetwork]=useState<"none"|"restricted"|"open">("open"),[filesystem,setFilesystem]=useState<"none"|"workspace"|"host">("host"),[shell,setShell]=useState<"none"|"allowlist"|"unrestricted">("unrestricted"),[sandboxChecked,setSandboxChecked]=useState(false),[commands,setCommands]=useState<Record<number,string>>({}),[human,setHuman]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===tasks.length&&read===sections.length;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const seeLayer=(id:string)=>{const next=[...new Set([...layers,id])];setLayers(next);if(next.length===defenseLayers.length)progress.completeTask("guard-layers")};
 const chooseInput=(i:number,v:string)=>{const next={...input,[i]:v};setInput(next);if(inputCases.every((c,index)=>next[index]===c[1]))progress.completeTask("guard-input")};
 const chooseOutput=(i:number,v:string)=>{const next={...output,[i]:v};setOutput(next);if(outputCases.every((c,index)=>next[index]===c[1]))progress.completeTask("guard-output")};
 const checkTool=()=>{setToolChecked(true);if(toolDecision==="approval")progress.completeTask("guard-tools")};
 const checkBudgets=()=>{setBudgetChecked(true);if(steps<=12&&cost<=10&&rate<=60)progress.completeTask("guard-budgets")};
 const checkSandbox=()=>{setSandboxChecked(true);if(network==="restricted"&&filesystem==="workspace"&&shell==="allowlist")progress.completeTask("guard-sandbox")};
 const chooseCommand=(i:number,v:string)=>{const next={...commands,[i]:v};setCommands(next);if(commandCases.every((c,index)=>next[index]===c[1]))progress.completeTask("guard-commands")};
 const chooseHuman=(i:number,v:string)=>{const next={...human,[i]:v};setHuman(next);if(humanCases.every((c,index)=>next[index]===c[1]))progress.completeTask("guard-human")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["input","output","schema","tool","sandbox","network","filesystem","limit","approval","eval"].filter(w=>t.includes(w)).length;if(explain.trim().length<130||hits<6){setFeedback("Go deeper: describe independent input/output/tool guardrails, schema validation, sandbox boundaries, budgets and approval/eval layers.");return}setFeedback("Strong. You described defense in depth as multiple controls that constrain different failure modes instead of relying on one perfect prompt.");progress.completeTask("guard-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 25 · GUARDRAILS & SANDBOX LAB</span><h1>Don't ask the agent to stay inside the lines. Build the lines.</h1><p>Guardrails constrain inputs, outputs and actions. Sandboxes constrain <b>what executed code can physically reach</b>. Budgets constrain how long and how expensively a run can continue.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 containment missions complete</TaskStamp></div><div className={styles.heroRight}><AgentIdentityCard name="Cage" role="SANDBOX OPERATOR" status={done===9?"CONTAINED":done>4?"HARDENING":"BOUNDARY OPEN"} detail="Useful agents need capabilities. Production agents need those capabilities bounded by enforceable runtime controls." variant="tile" accent="#9785ff" active={done<9}/><SandboxBoundary network={network} filesystem={filesystem} shell={shell} cpu={60} memory={1024} timeout={60} active accent="#9785ff"/></div></section>

  <LessonSection id="layers" onVisit={progress.markVisited} className={styles.scene}><h2>1. Defense in depth: one control can fail without becoming total compromise.</h2><div className={styles.grid3}>{defenseLayers.map(([id,icon,title,detail])=><button className={`${styles.surface} ${layers.includes(id)?styles.surfaceOn:""}`} key={id} onClick={()=>seeLayer(id)}><span>{icon}</span><b>{title}</b><p>{detail}</p></button>)}</div></LessonSection>

  <LessonSection id="input" onVisit={progress.markVisited} className={styles.scene}><h2>2. Input guardrails care about origin, scope and sensitivity.</h2>{inputCases.map((c,i)=><div className={styles.poisonRow} key={c[0]}><p>{c[0]}</p>{["allow","treat-as-data","redact","deny"].map(v=><button key={v} className={`${styles.button} ${input[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>chooseInput(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="output" onVisit={progress.markVisited} className={styles.scene}><h2>3. Output validation is more than moderation.</h2><p>Structured systems can validate schema, secrets and action policy before an output crosses into another system.</p>{outputCases.map((c,i)=><div className={styles.poisonRow} key={c[0]}><p>{c[0]}</p>{["schema","secret","policy","accept"].map(v=><button key={v} className={`${styles.button} ${output[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>chooseOutput(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="tools" onVisit={progress.markVisited} className={styles.scene}><h2>4. Tool guardrails sit immediately before consequence.</h2><PermissionGate action="email.send(to=external_customer)" scope="email.write.external" reason="Agent generated a customer response" risk="high" decision={toolDecision} onDecision={setToolDecision} accent="#ff9b62"/><button className={styles.primary} onClick={checkTool}>Validate tool gate</button>{toolChecked&&<p className={`${styles.feedback} ${toolDecision!=="approval"?styles.warning:""}`}>{toolDecision==="approval"?"✓ High-impact external write requires approval in this toy policy.":"Use an approval gate for this exercise: the action speaks externally as the user/company."}</p>}</LessonSection>

  <LessonSection id="budgets" onVisit={progress.markVisited} className={styles.scene}><h2>5. Bound the loop before a failure becomes a bill or incident.</h2><div className={styles.grid3}><div className={styles.card}><label>max agent steps <b>{steps}</b></label><input style={{width:"100%"}} type="range" min="3" max="40" value={steps} onChange={e=>setSteps(+e.target.value)}/></div><div className={styles.card}><label>max run cost <b>${cost}</b></label><input style={{width:"100%"}} type="range" min="1" max="40" value={cost} onChange={e=>setCost(+e.target.value)}/></div><div className={styles.card}><label>tool calls / min <b>{rate}</b></label><input style={{width:"100%"}} type="range" min="10" max="180" step="10" value={rate} onChange={e=>setRate(+e.target.value)}/></div></div><button className={styles.primary} onClick={checkBudgets}>Check containment budgets</button>{budgetChecked&&<p className={`${styles.feedback} ${!(steps<=12&&cost<=10&&rate<=60)?styles.warning:""}`}>{steps<=12&&cost<=10&&rate<=60?"✓ Bounded toy run: limited steps, spend and call rate.":"Tighten all three boundaries: ≤12 steps, ≤$10 toy budget and ≤60 calls/min."}</p>}</LessonSection>

  <LessonSection id="sandbox" onVisit={progress.markVisited} className={styles.scene}><h2>6. Build a coding-agent sandbox that can work without owning the host.</h2><div className={styles.grid3}><div className={styles.card}><b>NETWORK</b>{(["none","restricted","open"] as const).map(v=><button key={v} className={`${styles.button} ${network===v?styles.selected:""}`} onClick={()=>setNetwork(v)}>{v}</button>)}</div><div className={styles.card}><b>FILESYSTEM</b>{(["none","workspace","host"] as const).map(v=><button key={v} className={`${styles.button} ${filesystem===v?styles.selected:""}`} onClick={()=>setFilesystem(v)}>{v}</button>)}</div><div className={styles.card}><b>COMMAND POLICY</b>{(["none","allowlist","unrestricted"] as const).map(v=><button key={v} className={`${styles.button} ${shell===v?styles.selected:""}`} onClick={()=>setShell(v)}>{v}</button>)}</div></div><SandboxBoundary network={network} filesystem={filesystem} shell={shell} cpu={60} memory={1024} timeout={60} active accent="#9785ff"/><button className={styles.primary} onClick={checkSandbox}>Validate sandbox</button>{sandboxChecked&&<p className={`${styles.feedback} ${!(network==="restricted"&&filesystem==="workspace"&&shell==="allowlist")?styles.warning:""}`}>{network==="restricted"&&filesystem==="workspace"&&shell==="allowlist"?"✓ Agent can work in its assigned repo and approved network/command surface without broad host access.":"For this exercise choose restricted network, workspace filesystem and an allowlisted command surface."}</p>}</LessonSection>

  <LessonSection id="commands" onVisit={progress.markVisited} className={styles.scene}><h2>7. Capability allowlists should describe what the job actually needs.</h2>{commandCases.map((c,i)=><div className={styles.case} key={c[0]}><p>{c[0]}</p>{["allow","deny"].map(v=><button key={v} className={`${styles.button} ${commands[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>chooseCommand(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="human" onVisit={progress.markVisited} className={styles.scene}><h2>8. Human-in-the-loop belongs where consequence changes.</h2>{humanCases.map((c,i)=><div className={styles.case} key={c[0]}><p>{c[0]}</p>{["allow","approval"].map(v=><button key={v} className={`${styles.button} ${human[i]===v?(v===c[1]?styles.good:styles.bad):""}`} onClick={()=>chooseHuman(i,v)}>{v}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain why guardrails and sandboxing are different layers.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain input/output/schema/tool guardrails, step/cost/rate limits, network/filesystem/process sandboxing, approvals and evals."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Guardrails & Sandbox mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Contain the full system first. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.answer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ DEFENSE IN DEPTH MASTERED":"Pass is 10/12. Revisit sandbox boundaries and action gating."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/security-red-team-lab">← Red-Team Control Room</Link><Link href="/lessons/module-25-capstone">Security Boss Lab →</Link></div>
 </main>
}
