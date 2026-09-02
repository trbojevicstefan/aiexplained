"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { AgentLoop } from "@/components/visualizations/agent-loop";
import styles from "./multi-agent-patterns.module.css";

type Props={progress:LessonProgressApi};
const topologyCases=[
["One bounded customer-support task with few tools","single"],["Manager decomposes work and assigns specialists","supervisor"],["Company-wide research org: lead → domain leads → workers","hierarchical"],["Independent peers negotiate/coordinate directly","peer"],["Large opportunistic population with local/simple coordination","swarm"],
] as const;
const specialistCases=[
["Search papers and sources","research"],["Modify repository and run tests","coding"],["Navigate websites and forms","browser"],["Inspect tables/SQL and metrics","data"],["Challenge weak conclusions","critic"],
] as const;
const patternCases=[
["Interleave reasoning/decision with tool observations","react"],["Create plan first, then execute steps and replan if needed","plan-execute"],["Generate answer, critique it, then revise","reflection"],["Try branch; if it fails constraints, return to previous decision","backtracking"],
] as const;
const dynamicCases=[
["Invoice pipeline has known fixed stages","static"],["Research question may reveal unexpected subtopics/tools","dynamic"],["Compliance approval always follows same legal process","static"],["Incident response changes plan after each observation","dynamic"],
] as const;
const handoffCases=[
["Current agent owns task until structured handoff accepted","good"],["Two workers both think they own the same write task","bad"],["Handoff includes goal, inputs, constraints, done condition","good"],["Agent says 'you handle it' with no task id/context","bad"],
] as const;
const workspaceCases=[
["Append findings as immutable artifacts with author/task id","good"],["Five agents rewrite one shared prompt string concurrently","bad"],["Use version/lease/ownership for mutable shared objects","good"],["All agents inject every other agent's raw transcript into context","bad"],
] as const;
const loopCases=[
["Agent A hands to B; B immediately hands back to A forever","step-limit"],["Three workers independently research same company","dedupe-key"],["Reflection repeats without measurable improvement","termination-criterion"],["Retry keeps invoking same failing tool forever","retry-budget"],
] as const;
const deadlockCases=[
["Agent A waits for B artifact while B waits for A artifact","cycle-detection"],["Two workers each hold one resource and wait for the other","ordered-locking"],["Task lease never expires after worker crash","lease-timeout"],["Human approval never arrives","deadline-escalation"],
] as const;
const consensusCases=[
["Several independent estimates; choose median/majority","vote"],["Two agents argue evidence then a judge evaluates","debate-judge"],["High-stakes factual claim with authoritative external verifier","verify"],["All agents share same flawed source and vote 5–0","shared-error"],
] as const;
const quiz=[
["Multi-agent systems are automatically better than single agents.",["True","False"],1],
["A supervisor/worker pattern is useful when…",["One coordinator can decompose/assign/review specialist work","Every task is tiny and deterministic","No roles exist","We want duplicate writes"],0],
["ReAct-style behavior interleaves…",["Decision/reasoning and actions/observations","Training and deployment","Only voting","Only batching"],0],
["Plan-and-execute means…",["Create an explicit plan then execute/replan steps","Always use one tool","Never change plan","Fine-tune a planner model"],0],
["A structured handoff should transfer…",["Goal/context/constraints/output expectation/ownership","Only a greeting","Every hidden transcript","No task identity"],0],
["A shared workspace needs concurrency/ownership semantics when mutable data is shared.",["True","False"],0],
["Step limits and termination criteria help prevent…",["Infinite agent loops","Tokenization","Embeddings","Authentication"],0],
["Deadlock can occur when…",["Agents/resources wait on each other in a cycle","One task completes","A model samples one token","A queue is empty"],0],
["Majority voting guarantees truth when agents share the same bad evidence.",["True","False"],1],
["A swarm is best described as…",["A broad multi-agent coordination style; usefulness depends on task/coordination design","Always the best architecture","A single transformer block","An MCP transport"],0],
] as const;

export function MultiAgentPatternsLesson({progress}:Props){
 const [topology,setTopology]=useState<Record<number,string>>({}),[specialists,setSpecialists]=useState<Record<number,string>>({}),[patterns,setPatterns]=useState<Record<number,string>>({}),[activePattern,setActivePattern]=useState(0),[dynamic,setDynamic]=useState<Record<number,string>>({}),[handoffs,setHandoffs]=useState<Record<number,string>>({}),[workspace,setWorkspace]=useState<Record<number,string>>({}),[loops,setLoops]=useState<Record<number,string>>({}),[deadlocks,setDeadlocks]=useState<Record<number,string>>({}),[consensus,setConsensus]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["multi-topologies","multi-specialists","multi-patterns","multi-dynamic","multi-handoffs","multi-workspace","multi-loops","multi-deadlock","multi-consensus","multi-explain"],sections=["topologies","specialists","patterns","dynamic","handoffs","workspace","loops","deadlock","consensus","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const submit=()=>{const t=explain.toLowerCase();const hits=["supervisor","worker","handoff","shared","loop","deadlock","plan","react","critic","vote"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: explain topology/roles, plan/ReAct/reflection, handoffs/shared workspace, loop/deadlock controls and when consensus helps or fails.");return;}setFeedback("Strong. You treated multi-agent design as coordination engineering, not as a magical intelligence multiplier.");progress.completeTask("multi-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 15 · MULTI-AGENT PATTERNS</span><h1>More agents create more coordination problems before they create more value.</h1><p>Choose topologies deliberately. Define ownership. Control loops. Prevent deadlocks. Use specialists only where decomposition and parallelism actually help.</p><TaskStamp done={done===10}>{done}/10 multi-agent missions complete</TaskStamp></div><div className={styles.team}><AiMascot variant="bot" accent="#7f83ff" size={88} mood="happy" label="LEAD"/><AiMascot variant="briefcase" accent="#6fcfff" size={76} mood="thinking" label="RESEARCH"/><AiMascot variant="tile" accent="#88e1a6" size={76} mood="happy" label="CODE"/><AiMascot variant="star" accent="#ffd85a" size={76} mood={done>7?"excited":"happy"} label="CRITIC"/></div></section>

  <LessonSection id="topologies" onVisit={progress.markVisited} className={styles.scene}><h2>1. Pick the smallest topology that fits the coordination problem.</h2>{topologyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["single","supervisor","hierarchical","peer","swarm"].map(choice=><button key={choice} className={`${styles.button} ${topology[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(topology,setTopology,topologyCases,i,choice,"multi-topologies")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="specialists" onVisit={progress.markVisited} className={styles.scene}><h2>2. Specialist agents should correspond to real capability/permission boundaries.</h2>{specialistCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["research","coding","browser","data","critic"].map(choice=><button key={choice} className={`${styles.button} ${specialists[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(specialists,setSpecialists,specialistCases,i,choice,"multi-specialists")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="patterns" onVisit={progress.markVisited} className={styles.scene}><h2>3. Four agentic control patterns solve different problems.</h2>{patternCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["react","plan-execute","reflection","backtracking"].map(choice=><button key={choice} className={`${styles.button} ${patterns[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>{solve(patterns,setPatterns,patternCases,i,choice,"multi-patterns");setActivePattern(i)}}>{choice}</button>)}</div>)}<div className={styles.loop}><AgentLoop activeStep={activePattern%6} accent="#7f83ff" label="PATTERN"/></div></LessonSection>

  <LessonSection id="dynamic" onVisit={progress.markVisited} className={styles.scene}><h2>4. Static workflow or dynamic agentic workflow?</h2>{dynamicCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["static","dynamic"].map(choice=><button key={choice} className={`${styles.button} ${dynamic[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(dynamic,setDynamic,dynamicCases,i,choice,"multi-dynamic")}>{choice}</button>)}</div>)}<p>Dynamic does not mean “better.” Fixed workflows are easier to test and audit when the path is genuinely known.</p></LessonSection>

  <LessonSection id="handoffs" onVisit={progress.markVisited} className={styles.scene}><h2>5. Every handoff transfers responsibility.</h2>{handoffCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","bad"].map(choice=><button key={choice} className={`${styles.button} ${handoffs[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(handoffs,setHandoffs,handoffCases,i,choice,"multi-handoffs")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="workspace" onVisit={progress.markVisited} className={styles.scene}><h2>6. Shared workspace is coordination state, not unlimited shared consciousness.</h2>{workspaceCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","bad"].map(choice=><button key={choice} className={`${styles.button} ${workspace[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(workspace,setWorkspace,workspaceCases,i,choice,"multi-workspace")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="loops" onVisit={progress.markVisited} className={styles.scene}><h2>7. Stop loops and duplicate work with explicit control signals.</h2>{loopCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["step-limit","dedupe-key","termination-criterion","retry-budget"].map(choice=><button key={choice} className={`${styles.button} ${loops[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(loops,setLoops,loopCases,i,choice,"multi-loops")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="deadlock" onVisit={progress.markVisited} className={styles.scene}><h2>8. Deadlock is coordination waiting that can never resolve.</h2>{deadlockCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["cycle-detection","ordered-locking","lease-timeout","deadline-escalation"].map(choice=><button key={choice} className={`${styles.button} ${deadlocks[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(deadlocks,setDeadlocks,deadlockCases,i,choice,"multi-deadlock")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="consensus" onVisit={progress.markVisited} className={styles.scene}><h2>9. Debate/voting can reduce independent errors — not shared ones.</h2>{consensusCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["vote","debate-judge","verify","shared-error"].map(choice=><button key={choice} className={`${styles.button} ${consensus[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(consensus,setConsensus,consensusCases,i,choice,"multi-consensus")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain why a multi-agent system can be worse than one strong agent.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain topology/roles, plan/ReAct/reflection, handoffs/shared workspace, infinite-loop and deadlock controls, and consensus caveats."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Multi-Agent Patterns quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ MULTI-AGENT PATTERNS MASTERED":"Pass is 9/10. Revisit topology, ownership and coordination failure modes."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/orchestration-control-room">← Orchestration Control Room</Link><Link href="/lessons/module-15-capstone">Orchestration Boss Lab →</Link></div>
 </main>
}
