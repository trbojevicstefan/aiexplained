"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./harness-lab.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["Agent harness is best understood as…",["The operational machinery wrapped around a model to run an agent: context/tools/loop/state/permissions/errors etc.","Only the model weights","Only a UI","Only a vector DB"],0],
["Runtime refers to…",["The executing environment/process/session machinery that actually runs model calls, tools and state transitions","Only an SDK type definition","Only a prompt template","Only training"],0],
["Framework refers to…",["Developer abstractions/libraries used to build agent/workflow applications","The GPU process only","The final model checkpoint","A memory record"],0],
["Harness/framework/runtime boundaries are…",["Useful concepts but not universally standardized product labels; implementations can overlap","Globally fixed by one standard","Always identical","Defined by the tokenizer"],0],
["An SDK typically provides…",["Programmatic interfaces/types/helpers to call a service/library","The whole autonomous agent runtime necessarily","Model weights","Training corpus"],0],
["Context management belongs naturally to…",["The harness/runtime layer around model calls","Only pretraining","Only the database","Only the user"],0],
["Tool registration/execution belongs…",["Around the model in application/runtime machinery","Inside model weights only","Inside tokenization only","Inside embeddings only"],0],
["A framework can be replaced while…",["The same underlying model/tool concepts still exist","Agents stop needing runtime","All state becomes memory","Permissions disappear"],0],
] as const;
const classifyCases=[
["A library exposes `Agent`, `Tool`, `StateGraph` and handoff abstractions.","framework"],
["A running worker owns session state, invokes the model and executes tool calls.","runtime"],
["A wrapper compresses context, retries model calls and gates shell access.","harness"],
["Typed client methods call a provider's responses API.","sdk"],
] as const;

export function HarnessFrameworkRuntimeLesson({progress}:Props){
 const [naked,setNaked]=useState(false),[harnessParts,setHarnessParts]=useState<string[]>([]),[runtimeSeen,setRuntimeSeen]=useState<string[]>([]),[frameworkSeen,setFrameworkSeen]=useState<string[]>([]),[sdkSeen,setSdkSeen]=useState<string[]>([]),[classify,setClassify]=useState<Record<number,string>>({}),[ctxTools,setCtxTools]=useState<string[]>([]),[stateMemory,setStateMemory]=useState<string[]>([]),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const taskIds=["hfr-naked","hfr-harness","hfr-runtime","hfr-framework","hfr-sdk","hfr-classify","hfr-context-tools","hfr-state-memory","hfr-explain"],sections=["naked","harness","runtime","framework","sdk","classify","context-tools","state-memory","explain"];
 const done=taskIds.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===9&&read===9;
 const mark=(v:string,current:string[],setter:(x:string[])=>void,n:number,task:string)=>{const next=[...new Set([...current,v])];setter(next);if(next.length>=n)progress.completeTask(task)};
 const classificationDone=classifyCases.every((x,i)=>classify[i]===x[1]);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["model","harness","runtime","framework","sdk","tool","context","state"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<5){setExplainFeedback("Go deeper: put the model in the center, explain operational harness/runtime around it, then explain framework/SDK as developer-facing abstractions/interfaces.");return;}setExplainFeedback("Strong. You kept the conceptual boundaries useful without pretending these terms are standardized identically across every product.");progress.completeTask("hfr-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 11 · HARNESS CUTAWAY</span><h1>Open the agent and separate the layers.</h1><p>These terms overlap in real products, so learn them as <b>roles</b>, not logos. The model supplies learned inference. Harness/runtime machinery makes it operate as an agent. Frameworks and SDKs help developers construct or call those systems.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 cutaway missions complete</TaskStamp></div><div className={styles.cutaway}><div className={`${styles.ring} ${styles.r3}`}/><div className={`${styles.ring} ${styles.r2}`}/><div className={`${styles.ring} ${styles.r1}`}/><span className={`${styles.label} ${styles.l1}`}>HARNESS</span><span className={`${styles.label} ${styles.l2}`}>RUNTIME</span><span className={`${styles.label} ${styles.l3}`}>FRAMEWORK / SDK</span><div className={styles.model}><AiMascot variant="bot" accent="#70c9ff" mood={done>4?"excited":"thinking"} size={112} label="MODEL"/></div></div></section>

  <LessonSection id="naked" onVisit={progress.markVisited} className={styles.scene}><h2>1. Naked model: intelligence without the operating machinery.</h2><div className={styles.grid2}><div className={styles.panel}><b>MODEL HAS</b><p>learned weights · tokenizer/model interface · inference behavior</p></div><button className={`${styles.panel} ${naked?styles.correct:""}`} onClick={()=>{setNaked(true);progress.completeTask("hfr-naked")}}><b>MODEL DOES NOT AUTOMATICALLY HAVE</b><p>your persistent session store, tool credentials, retry policy, shell sandbox, approval workflow or job checkpointing.</p></button></div></LessonSection>

  <LessonSection id="harness" onVisit={progress.markVisited} className={styles.scene}><h2>2. Harness = the machinery that lets the model operate as an agent.</h2><div className={styles.parts}>{["prompt/context builder","tool registry","agent loop","permissions","retries/errors","memory/state adapters","sandbox","tracing"].map(part=><button key={part} className={`${styles.part} ${harnessParts.includes(part)?styles.correct:""}`} onClick={()=>mark(part,harnessParts,setHarnessParts,8,"hfr-harness")}>{part}</button>)}</div><p>“Harness” is common engineering language, not one universally standardized protocol. Think: everything wrapped around the model that turns predictions into a controlled ongoing process.</p></LessonSection>

  <LessonSection id="runtime" onVisit={progress.markVisited} className={styles.scene}><h2>3. Runtime = where the agent actually runs.</h2><div className={styles.machine}>{[
  ["session","load session/task state"],["model","call model"],["tool","execute allowed tool"],["event","record result/event"],["loop","schedule next step or stop"],
 ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${runtimeSeen.includes(id)?styles.correct:""}`} onClick={()=>mark(id,runtimeSeen,setRuntimeSeen,5,"hfr-runtime")}>{text}</button>{i<4&&<span className={styles.arrow}>→</span>}</span>)}</div><p>A runtime may be a local CLI process, server worker, container, browser worker or distributed service. “Harness” and “runtime” often overlap because the harness code executes inside the runtime.</p></LessonSection>

  <LessonSection id="framework" onVisit={progress.markVisited} className={styles.scene}><h2>4. Framework = reusable developer abstractions.</h2><div className={styles.grid3}>{[
  ["agent","Agent abstraction","Model + instructions + tools + handoffs."],["graph","Graph/workflow abstraction","Nodes, edges, state transitions, durable flow."],["tool","Tool abstraction","Schema, description, execution adapter, errors."],
 ].map(([id,title,copy])=><button className={`${styles.panel} ${frameworkSeen.includes(id)?styles.correct:""}`} key={id} onClick={()=>mark(id,frameworkSeen,setFrameworkSeen,3,"hfr-framework")}><b>{title}</b><p>{copy}</p></button>)}</div><p>A framework can provide runtime components too. The distinction is conceptual: framework describes the developer building blocks/API surface; runtime is the execution happening now.</p></LessonSection>

  <LessonSection id="sdk" onVisit={progress.markVisited} className={styles.scene}><h2>5. SDK/library = programmatic interfaces, usually narrower than “the whole agent system.”</h2><div className={styles.grid3}>{[
  ["client","Provider client","responses.create(...), models, streams, errors"],["types","Typed schemas","request/response/tool argument types"],["helpers","Helpers","pagination, auth headers, retries or utilities"],
 ].map(([id,title,copy])=><button className={`${styles.panel} ${sdkSeen.includes(id)?styles.correct:""}`} key={id} onClick={()=>mark(id,sdkSeen,setSdkSeen,3,"hfr-sdk")}><b>{title}</b><p>{copy}</p></button>)}</div></LessonSection>

  <LessonSection id="classify" onVisit={progress.markVisited} className={styles.scene}><h2>6. Classify by responsibility, not branding.</h2>{classifyCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["harness","runtime","framework","sdk"].map(choice=><button key={choice} className={`${styles.button} ${classify[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...classify,[i]:choice};setClassify(next);if(classifyCases.every((x,j)=>next[j]===x[1]))progress.completeTask("hfr-classify")}}>{choice}</button>)}</div>)}{classificationDone&&<p className={styles.feedback}>✓ A single real product may occupy several boxes. Ask “what responsibility is this component performing?”</p>}</LessonSection>

  <LessonSection id="context-tools" onVisit={progress.markVisited} className={styles.scene}><h2>7. Harness owns the glue between context and actions.</h2><div className={styles.machine}>{[
  ["collect","collect instructions/history/RAG/tool results"],["trim","select/trim/compress context"],["register","register available tool schemas"],["validate","validate model tool request"],["execute","execute through runtime adapter"],["return","append result to next context"],
 ].map(([id,text],i)=><span key={id}><button className={`${styles.node} ${ctxTools.includes(id)?styles.correct:""}`} onClick={()=>mark(id,ctxTools,setCtxTools,6,"hfr-context-tools")}>{text}</button>{i<5&&<span className={styles.arrow}>→</span>}</span>)}</div></LessonSection>

  <LessonSection id="state-memory" onVisit={progress.markVisited} className={styles.scene}><h2>8. Harness connects live state to persistent memory stores.</h2><div className={styles.grid3}>{[
  ["state","TASK STATE","Current job, selected tool, retry count, pending approval."],["memory","MEMORY ADAPTER","Persist/retrieve selected user/agent memories across runs."],["checkpoint","CHECKPOINT","Snapshot durable execution state so a long task can resume."],
 ].map(([id,title,copy])=><button className={`${styles.panel} ${stateMemory.includes(id)?styles.correct:""}`} key={id} onClick={()=>mark(id,stateMemory,setStateMemory,3,"hfr-state-memory")}><b>{title}</b><p>{copy}</p></button>)}</div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain model vs harness vs runtime vs framework vs SDK.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Put each layer in your own words and explain where tools/context/state fit."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Harness / Framework / Runtime quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 9 cutaway rooms. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizDone&&<p className={styles.feedback}>{quizScore>=7?"★ LAYERS MASTERED":"Pass is 7/8. Reopen the cutaway."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-10-capstone">← Agent module</Link><Link href="/lessons/harness-runtime-lab">Harness Runtime Lab →</Link></div>
 </main>
}
