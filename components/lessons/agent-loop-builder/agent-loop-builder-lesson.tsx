"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AgentIdentityCard } from "@/components/mascots/agent-identity-card";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { AgentLoop } from "@/components/visualizations/agent-loop";
import { ToolCallInspector } from "@/components/visualizations/tool-call-inspector";
import styles from "./agent-loop-builder.module.css";

type Props = { progress: LessonProgressApi };
const taskIds=["loop-naked-model","loop-assemble","loop-observe","loop-decide","loop-execute","loop-result","loop-state-memory","loop-approval","loop-explain"] as const;
const sectionIds=["naked-model","assemble","observe","decide","execute","result","state-memory","approval","explain"] as const;
const parts=[
 {id:"goal",icon:"◎",title:"GOAL",detail:"What successful completion means."},
 {id:"context",icon:"▤",title:"CONTEXT",detail:"What the model can see right now."},
 {id:"tools",icon:"⌁",title:"TOOLS",detail:"External actions the runtime may execute."},
 {id:"state",icon:"◇",title:"STATE",detail:"Where this run currently stands."},
 {id:"permissions",icon:"◈",title:"PERMISSIONS",detail:"What actions are allowed or gated."},
 {id:"runtime",icon:"↻",title:"LOOP / RUNTIME",detail:"Keeps observing, executing and deciding when to stop."},
] as const;
const observations=["Goal: book a 30-minute call","User constraint: Friday afternoon","Current state: no slot chosen","Tools: calendar.search + calendar.create_event"] as const;
const stateCases=[
 ["The current run is waiting for user approval before creating the event.","state"],
 ["The user prefers 30-minute meetings across future sessions.","memory"],
 ["calendar.search returned 15:30 and 16:30 for this turn.","context"],
 ["The current job has already retried the search once.","state"],
] as const;
const quiz=[
 ["What turns a model into an agent system?",["Only a longer prompt","Goal/context + tools + state + permissions + runtime loop","A vector DB only","A bigger parameter count"],1],
 ["Who normally executes a tool call?",["The model weights themselves","External runtime/application code","The tokenizer","The embedding table"],1],
 ["After a tool runs, its result commonly…",["Returns to context/state so the model can choose the next step","Fine-tunes the model automatically","Becomes a permanent memory automatically","Deletes the goal"],0],
 ["State and memory are identical.",["True","False"],1],
 ["For a write action like create_event, a permission gate can…",["Require approval before execution","Change model weights","Replace the tool schema","Remove the user"],0],
 ["A retry budget primarily prevents…",["Unbounded repeated failures","Tokenization","Embedding similarity","Model pretraining"],0],
 ["The agent loop should stop when…",["A completion/termination condition is satisfied or a safety/budget boundary ends the run","It has used exactly one tool","The model always says done","The browser closes"],0],
 ["A chatbot can describe an action without being able to execute it.",["True","False"],0],
] as const;

export function AgentLoopBuilderLesson({ progress }: Props) {
 const [nakedRan,setNakedRan]=useState(false);
 const [assembled,setAssembled]=useState<string[]>([]);
 const [seenObs,setSeenObs]=useState<string[]>([]);
 const [decision,setDecision]=useState("");
 const [toolStep,setToolStep]=useState(0);
 const [seenToolSteps,setSeenToolSteps]=useState<number[]>([]);
 const [resultChoice,setResultChoice]=useState("");
 const [classes,setClasses]=useState<Record<number,string>>({});
 const [approval,setApproval]=useState(false);
 const [retryBudget,setRetryBudget]=useState(6);
 const [timeout,setTimeoutValue]=useState(120);
 const [explain,setExplain]=useState("");
 const [feedback,setFeedback]=useState("");
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const done=taskIds.filter(id=>progress.completedTasks[id]).length;
 const read=sectionIds.filter(id=>progress.visitedSections.has(id)).length;
 const unlocked=done===taskIds.length&&read===sectionIds.length;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0);
 const quizDone=Object.keys(answers).length===quiz.length;
 const loopStep=useMemo(()=>{if(!nakedRan)return 0;if(seenObs.length<observations.length)return 0;if(decision!=="search")return 1;if(seenToolSteps.length<5)return Math.min(4,toolStep+1);if(resultChoice!=="context")return 4;if(!approval)return 5;return 0},[nakedRan,seenObs,decision,seenToolSteps,toolStep,resultChoice,approval]);
 const toolData={definition:'calendar.search({ date, duration, daypart })',proposal:'{"date":"Friday","duration":30,"daypart":"afternoon"}',validation:'schema valid · read-only scope allowed',execution:'calendar API → search free/busy',result:'{"slots":["15:30","16:30"]}'};
 const togglePart=(id:string)=>{const next=assembled.includes(id)?assembled.filter(x=>x!==id):[...assembled,id];setAssembled(next);if(parts.every(p=>next.includes(p.id)))progress.completeTask("loop-assemble")};
 const seeObservation=(item:string)=>{const next=[...new Set([...seenObs,item])];setSeenObs(next);if(next.length===observations.length)progress.completeTask("loop-observe")};
 const chooseDecision=(value:string)=>{setDecision(value);if(value==="search")progress.completeTask("loop-decide")};
 const inspectTool=(step:number)=>{setToolStep(step);const next=[...new Set([...seenToolSteps,step])];setSeenToolSteps(next);if(next.length===5)progress.completeTask("loop-execute")};
 const classify=(index:number,value:string)=>{const next={...classes,[index]:value};setClasses(next);if(stateCases.every((item,i)=>next[i]===item[1]))progress.completeTask("loop-state-memory")};
 const validatePolicy=()=>{if(approval&&retryBudget<=3&&timeout<=60)progress.completeTask("loop-approval")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["goal","context","tool","runtime","result","state","memory","permission","stop"].filter(w=>t.includes(w)).length;if(explain.trim().length<120||hits<6){setFeedback("Go deeper: explain goal/context, model decision, external tool execution, returned result, state/memory, permissions and how the loop stops.");return}setFeedback("Strong. You separated the model from the runtime machinery that turns repeated decisions and external actions into an agent.");progress.completeTask("loop-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 10 · AGENT LOOP BUILDER</span><h1>Start with a model. Build the machinery around it.</h1><p>A naked LLM can propose text. An agent system adds a goal, live context, actions, execution state, permissions and a runtime that keeps the cycle moving until the task is actually done.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===taskIds.length}>{done}/9 agent-building missions complete</TaskStamp></div><div className={styles.heroStage}><AgentIdentityCard name="Nova" role="SCHEDULING AGENT" status={done>7?"READY TO SHIP":done>2?"ASSEMBLING":"NAKED MODEL"} detail="Watch the same model gain operational capabilities as you add the surrounding system." accent="#ff8a5b" variant="bot" active={done>1&&done<9}/><AgentLoop activeStep={loopStep} accent="#ff8a5b" label="NOVA"/></div></section>
  <LessonSection id="naked-model" onVisit={progress.markVisited} className={styles.scene}><h2>1. A naked model can suggest. It cannot magically act.</h2><p>User: <b>“Book me a 30-minute call Friday afternoon.”</b></p><div className={styles.grid2}><div className={styles.card}><b>MODEL ONLY</b><p>{nakedRan?'“I can suggest checking your calendar for Friday afternoon, then creating an event.”':'Press run to see what the model can do without a runtime or tools.'}</p></div><div className={styles.card}><b>WORLD STATE</b><p>Calendar is unchanged. No API was called. No slot was reserved.</p></div></div><button className={styles.primary} onClick={()=>{setNakedRan(true);progress.completeTask("loop-naked-model")}}>Run the naked model</button></LessonSection>
  <LessonSection id="assemble" onVisit={progress.markVisited} className={styles.scene}><h2>2. Assemble the six pieces around the model.</h2><p>Click every missing piece. None of these pieces is “inside the LLM” by default.</p><div className={styles.machine}>{parts.map(part=><button key={part.id} className={`${styles.part} ${assembled.includes(part.id)?styles.partOn:""}`} onClick={()=>togglePart(part.id)}><span>{part.icon}</span><b>{part.title}</b><small>{part.detail}</small></button>)}</div><TaskStamp done={progress.completedTasks["loop-assemble"]}>assembled {assembled.length}/6 system pieces</TaskStamp></LessonSection>
  <LessonSection id="observe" onVisit={progress.markVisited} className={styles.scene}><h2>3. OBSERVE means build the current decision context.</h2><p>An agent decision is based on what the runtime puts in front of the model now — goal, user constraints, current state, tool definitions and prior results.</p><div className={styles.observationRack}>{observations.map(item=><button key={item} className={`${styles.obs} ${seenObs.includes(item)?styles.obsOn:""}`} onClick={()=>seeObservation(item)}>{item}</button>)}</div></LessonSection>
  <LessonSection id="decide" onVisit={progress.markVisited} className={styles.scene}><h2>4. DECIDE: what action should come next?</h2><p>No free slot has been observed yet. Choose the correct next action.</p><div className={styles.decision}><button className={`${styles.button} ${decision==="create"?styles.bad:""}`} onClick={()=>chooseDecision("create")}><b>calendar.create_event</b><p>Guess 15:30 and write immediately.</p></button><button className={`${styles.button} ${decision==="search"?styles.good:""}`} onClick={()=>chooseDecision("search")}><b>calendar.search</b><p>Read free/busy first, then decide using actual tool output.</p></button></div></LessonSection>
  <LessonSection id="execute" onVisit={progress.markVisited} className={styles.scene}><h2>5. ACT does not mean the model itself touched the calendar.</h2><p>Walk the full call. The model proposes a structured request; runtime code validates it; external code/API executes it; the result comes back.</p><ToolCallInspector activeStep={toolStep} accent="#70c9ff" data={toolData} label="CALENDAR"/><div className={styles.timeline}>{[0,1,2,3,4].map(step=><button key={step} className={`${styles.stepChip} ${seenToolSteps.includes(step)?styles.stepOn:""}`} onClick={()=>inspectTool(step)}>inspect {step+1}</button>)}</div></LessonSection>
  <LessonSection id="result" onVisit={progress.markVisited} className={styles.scene}><h2>6. The tool result must re-enter the loop.</h2><p><code>calendar.search</code> returned <b>15:30 and 16:30</b>. What should happen next?</p><div className={styles.grid3}>{[["ignore","Ignore it and ask the original question again"],["weights","Train the model weights with these slots"],["context","Put the result into current context/state, then ask the model for the next decision"]].map(([value,label])=><button key={value} className={`${styles.button} ${resultChoice===value?(value==="context"?styles.good:styles.bad):""}`} onClick={()=>{setResultChoice(value);if(value==="context")progress.completeTask("loop-result")}}>{label}</button>)}</div></LessonSection>
  <LessonSection id="state-memory" onVisit={progress.markVisited} className={styles.scene}><h2>7. State, memory and context solve different persistence problems.</h2><div className={styles.classify}>{stateCases.map((item,i)=><div className={styles.classRow} key={item[0]}><p>{item[0]}</p>{["state","memory","context"].map(choice=><button key={choice} className={`${styles.button} ${classes[i]===choice?(choice===item[1]?styles.good:styles.bad):""}`} onClick={()=>classify(i,choice)}>{choice}</button>)}</div>)}</div></LessonSection>
  <LessonSection id="approval" onVisit={progress.markVisited} className={styles.scene}><h2>8. Permissions and retry budgets are part of the loop, not an afterthought.</h2><p>The next action is a write: <code>calendar.create_event</code>. Configure a production-safe toy policy, then validate it.</p><div className={styles.policy}><div className={styles.policyPanel}><div className={styles.toggle}><span><b>Human approval for write</b></span><button className={approval?styles.on:""} onClick={()=>setApproval(v=>!v)}><i/></button></div><div className={styles.range}><label>Retry budget <b>{retryBudget}</b></label><input type="range" min="0" max="8" value={retryBudget} onChange={e=>setRetryBudget(+e.target.value)}/></div></div><div className={styles.policyPanel}><div className={styles.range}><label>Tool timeout <b>{timeout}s</b></label><input type="range" min="15" max="180" step="15" value={timeout} onChange={e=>setTimeoutValue(+e.target.value)}/></div><div className={styles.stats}><div className={styles.stat}><span>write gate</span><b>{approval?"ON":"OFF"}</b></div><div className={styles.stat}><span>retries</span><b>{retryBudget}</b></div><div className={styles.stat}><span>timeout</span><b>{timeout}s</b></div></div></div></div><button className={styles.primary} onClick={validatePolicy}>Validate agent policy</button>{approval&&retryBudget<=3&&timeout<=60&&<p className={styles.feedback}>✓ Sensible toy policy: write gated, retries bounded, timeout bounded.</p>}</LessonSection>
  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain the loop without calling the LLM “the whole agent.”</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain goal/context → model decision → tool request → external runtime execution → result → state/context update → permissions/retries → repeat or stop. Mention where memory differs."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>
  <section className={styles.quiz}><h2>Agent Loop Builder mastery quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Finish all nine scenes and tasks first. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.answer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=7)}>Submit · {score}/8</button>{quizDone&&<p className={styles.feedback}>{score>=7?"★ AGENT LOOP MASTERED":"Pass is 7/8. Revisit execution boundaries and state/memory."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/agent-foundations">← Agent foundations</Link><Link href="/lessons/module-10-capstone">Agent Boss Lab →</Link></div>
 </main>;
}
