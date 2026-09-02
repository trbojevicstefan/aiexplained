"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentLoop } from "@/components/visualizations/agent-loop";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./what-is-agent.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["An LLM by itself is an agent when…",["Not necessarily; an agent also needs runtime/system machinery for goals/actions/loop/environment","Always","Only if it is large","Only if it has a long context window"],0],
["A workflow differs from an agent because…",["A workflow usually follows predefined control flow, while an agent can choose next actions dynamically within its policy","Workflows have no APIs","Agents never use workflows","They are identical"],0],
["Agent state means…",["The current execution/task situation the runtime tracks","All model training data","Only long-term memory","Only the user prompt"],0],
["A tool gives an agent…",["An external action/capability executed outside the model","More model parameters","Automatic persistent memory","A new tokenizer"],0],
["Autonomy should be constrained by…",["Permissions, policy, budgets and approval rules appropriate to the action","Nothing","Only temperature","Only context length"],0],
["An agent runtime typically…",["Runs the loop, manages context/state/tools/errors/permissions and calls the model","Is only the neural-network weights","Is only a database","Is only a prompt"],0],
["A completion condition matters because…",["The loop needs to know when the goal is satisfied or when to stop/escalate","It changes pretraining","It creates embeddings","It replaces permissions"],0],
["Tool results usually re-enter the agent as…",["Observed data/context/state used for the next decision","Automatic weight updates","A new system prompt with higher authority","A tokenizer merge"],0],
] as const;

export function WhatIsAgentLesson({progress}:Props){
 const [systems,setSystems]=useState<string[]>([]),[goal,setGoal]=useState(""),[environment,setEnvironment]=useState<string[]>([]),[stateActions,setStateActions]=useState<Record<number,string>>({}),[parts,setParts]=useState<string[]>([]),[permission,setPermission]=useState(""),[runtime,setRuntime]=useState<Record<number,string>>({}),[stop,setStop]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({}),[loopStep,setLoopStep]=useState(0);
 const taskIds=["agent-compare","agent-goal","agent-environment","agent-state-actions","agent-tools-memory","agent-autonomy","agent-policy-runtime","agent-stop","agent-explain"],sectionIds=["compare","goal","environment","state-actions","tools-memory","autonomy","policy-runtime","stop","explain"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===9&&readCount===9;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const stateCases=[
  ["Calendar API says 14:00 is busy.","replan"],["User asks for a 30-minute slot after 15:00.","constraint"],["Agent sends invite successfully.","update"],
 ] as const;
 const runtimeCases=[
  ["Allowed: read calendar. Write event only after user confirmation.","policy"],["Store current task ID, selected slot and tool results.","runtime"],["Model predicts: next action should call calendar.search.","model"],
 ] as const;
 const stopCases=[
  ["Meeting event created and attendee confirmed.","complete"],["Calendar tool fails 5 times and retry budget is exhausted.","escalate"],["Agent has called search 40 times with no new information.","stop"],
 ] as const;
 const stateDone=stateCases.every((x,i)=>stateActions[i]===x[1]), runtimeDone=runtimeCases.every((x,i)=>runtime[i]===x[1]), stopDone=stopCases.every((x,i)=>stop[i]===x[1]);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["goal","tool","state","memory","loop","permission","runtime","environment"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<4){setExplainFeedback("Go deeper: define the goal, environment/actions, state, tools, permissions and the runtime loop around the model.");return;}setExplainFeedback("Strong. You described the agent as a system around a model, not as a magical property of the LLM itself.");progress.completeTask("agent-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 10 · WHAT IS AN AGENT?</span><h1>An agent is not just an LLM with a confident prompt.</h1><p>A useful mental model: <b>Agent = Model + Goal/Instructions + Context/State + Tools + Memory + Loop + Environment + Permissions/Policy.</b> The model helps decide; the runtime makes the system persist, act, observe and stop.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={taskCount===9}>{taskCount}/9 agent-foundation missions complete</TaskStamp></div><AgentLoop activeStep={loopStep} accent="#70c9ff" label="AGENT"/></section>

  <LessonSection id="compare" onVisit={progress.markVisited} className={styles.scene}><h2>1. Same request, three different machines.</h2><div className={styles.task}>“Find a free 30-minute slot after 15:00 tomorrow and schedule Alex.”</div><div className={styles.grid3}>{[
   ["chat","CHATBOT","Suggests how the user could inspect a calendar. It cannot act unless the surrounding system gives it tools/actions."],
   ["workflow","WORKFLOW","A fixed flow might always: lookup user → search slots → create event → send email."],
   ["agent","AGENT","Observes the goal/state, chooses a next action, inspects the result, replans if needed and stops when the goal/limits say so."],
  ].map(([id,title,copy])=><button className={`${styles.panel} ${systems.includes(id)?styles.correct:""}`} key={id} onClick={()=>mark(id,systems,setSystems,3,"agent-compare")}><b>{title}</b><p>{copy}</p></button>)}</div></LessonSection>

  <LessonSection id="goal" onVisit={progress.markVisited} className={styles.scene}><h2>2. Give the agent a goal it can actually evaluate.</h2>{[
   ["vague","Be helpful with my calendar."],["good","Schedule Alex for one free 30-minute slot after 15:00 tomorrow; do not double-book; ask before writing the event."],["impossible","Make everyone happy forever."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${goal===id?(id==="good"?styles.correct:styles.wrong):""}`} onClick={()=>{setGoal(id);if(id==="good")progress.completeTask("agent-goal")}}>{text}</button>)}<p>Goals become operational when success, constraints and permitted actions are testable.</p></LessonSection>

  <LessonSection id="environment" onVisit={progress.markVisited} className={styles.scene}><h2>3. The agent acts inside an environment.</h2><p>Select the external surfaces required for this calendar task.</p><div className={styles.grid3}>{[
   ["calendar","Calendar state/API"],["contacts","Alex's saved contact identity"],["clock","Current date/time/timezone"],["stripe","Stripe billing account"],["github","Git repository"],
  ].map(([id,text])=><button key={id} className={`${styles.panel} ${environment.includes(id)?styles.correct:""}`} onClick={()=>{const next=environment.includes(id)?environment.filter(x=>x!==id):[...environment,id];setEnvironment(next);if(["calendar","contacts","clock"].every(x=>next.includes(x))&&!next.includes("stripe")&&!next.includes("github"))progress.completeTask("agent-environment")}}><b>{text}</b></button>)}</div><p>Environment = the world the runtime can observe or affect: APIs, filesystem, browser, database, user, clock, network, etc.</p></LessonSection>

  <LessonSection id="state-actions" onVisit={progress.markVisited} className={styles.scene}><h2>4. State tells the loop where it is; actions change what happens next.</h2>{stateCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["constraint","replan","update"].map(choice=><button key={choice} className={`${styles.button} ${stateActions[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...stateActions,[i]:choice};setStateActions(next);if(stateCases.every((x,j)=>next[j]===x[1]))progress.completeTask("agent-state-actions")}}>{choice}</button>)}</div>)}{stateDone&&<p className={styles.feedback}>✓ State is not the same as memory. It can be the live execution facts needed to continue this task.</p>}</LessonSection>

  <LessonSection id="tools-memory" onVisit={progress.markVisited} className={styles.scene}><h2>5. Tools act. Memory persists useful information.</h2><div className={styles.grid2}>{[
   ["tool","calendar.search_free_busy","Tool: perform an external read/action."],["tool2","calendar.create_event","Tool: perform an external write."],["memory","Alex prefers 30-minute meetings","Memory: persisted fact that may be retrieved into future context."],["context","Tool result: 15:30 is free","Context/state: current evidence for this run."],
  ].map(([id,title,copy])=><button className={`${styles.panel} ${parts.includes(id)?styles.correct:""}`} key={id} onClick={()=>mark(id,parts,setParts,4,"agent-tools-memory")}><b>{title}</b><p>{copy}</p></button>)}</div></LessonSection>

  <LessonSection id="autonomy" onVisit={progress.markVisited} className={styles.scene}><h2>6. Autonomy is a permission budget, not a personality trait.</h2><div className={styles.permission}><button className={`${styles.panel} ${permission==="safe"?styles.safe:""}`} onClick={()=>{setPermission("safe");progress.completeTask("agent-autonomy")}}><b>BOUNDED</b><p>Read calendar freely. Before creating/deleting events, require confirmation. Maximum 8 tool steps. No email to unknown recipients.</p></button><button className={`${styles.panel} ${permission==="danger"?styles.danger:""}`} onClick={()=>setPermission("danger")}><b>UNBOUNDED</b><p>All tools, all scopes, unlimited steps, destructive writes without approval.</p></button></div><p>The same model can power a low-autonomy assistant or high-autonomy agent depending on the surrounding policy and credentials.</p></LessonSection>

  <LessonSection id="policy-runtime" onVisit={progress.markVisited} className={styles.scene}><h2>7. Model, policy and runtime are three different layers.</h2>{runtimeCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["model","policy","runtime"].map(choice=><button key={choice} className={`${styles.button} ${runtime[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...runtime,[i]:choice};setRuntime(next);if(runtimeCases.every((x,j)=>next[j]===x[1]))progress.completeTask("agent-policy-runtime")}}>{choice}</button>)}</div>)}{runtimeDone&&<p className={styles.feedback}>✓ The model proposes/represents decisions; policy constrains allowed behavior; runtime executes the loop and state transitions.</p>}</LessonSection>

  <LessonSection id="stop" onVisit={progress.markVisited} className={styles.scene}><h2>8. Agents need stop conditions as much as they need goals.</h2>{stopCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["complete","stop","escalate"].map(choice=><button key={choice} className={`${styles.button} ${stop[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...stop,[i]:choice};setStop(next);if(stopCases.every((x,j)=>next[j]===x[1]))progress.completeTask("agent-stop")}}>{choice}</button>)}</div>)}{stopDone&&<div className={styles.feedback}>✓ Goal satisfied → complete. Budget/loop exhausted → stop. Recoverable-but-blocked uncertainty → escalate/human.</div>}<button className={styles.button} onClick={()=>setLoopStep((loopStep+1)%6)}>Advance agent loop visualizer</button></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain an agent without saying “LLM that can do stuff.”</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Define model, goal, environment, state, tools, memory, loop/runtime, permissions and stop conditions."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>What Is an Agent? quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 9 agent-foundation rooms. {taskCount}/9 tasks · {readCount}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=7?"★ AGENT FOUNDATIONS MASTERED":"Pass is 7/8. Revisit runtime, tools and state."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-9-capstone">← RAG module</Link><Link href="/lessons/agent-loop-builder">Agent Loop Builder →</Link></div>
 </main>
}
