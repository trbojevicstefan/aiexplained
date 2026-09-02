"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../harness-framework-runtime/harness-lab.module.css";

type Props={progress:LessonProgressApi};
const groups={
 langgraph:["state graph","nodes/edges","durable flow","human checkpoints"],
 langchain:["model/tool interfaces","prompt/message abstractions","chains/agents","integration ecosystem"],
 llamaindex:["data connectors","indexes/retrievers","RAG/query engines","agent/data workflows"],
 sk:["plugins/functions","planning/orchestration","memory/connectors","enterprise app integration"],
 multi:["agent roles","message passing","delegation","team orchestration"],
 typed:["typed agents/tools","handoffs/state","validation","provider/runtime adapters"],
} as const;
const chooseCases=[
["You need an explicit long-running state graph with checkpoints and branching.","graph"],
["Your main complexity is ingesting/retrieving enterprise documents for RAG.","data"],
["You want a small typed Python agent with validated tool/input/output models.","typed"],
["You need coordinated specialist roles and handoffs.","multi"],
] as const;
const quiz=[
["A framework is valuable because it can…",["Provide reusable abstractions for tools/state/graphs/messages/agents instead of rebuilding glue every project","Replace the need for a runtime","Make models perfectly reliable","Eliminate security policy"],0],
["LangGraph is most useful as a mental example of…",["Graph/state-oriented agent workflows and durable control flow","A tokenizer","A vector-only database","A model provider"],0],
["LlamaIndex is strongly associated conceptually with…",["Data/RAG ingestion, indexing, retrieval and query/agent data workflows","GPU drivers","Image diffusion only","Browser automation only"],0],
["Framework features/API boundaries…",["Evolve; learn stable architecture concepts rather than memorizing one version's surface","Never change","Are standardized globally","Are model weights"],0],
["AutoGen/CrewAI are useful examples for thinking about…",["Multi-agent roles, collaboration/delegation and orchestration patterns","Tokenizer merges","Quantization","HNSW only"],0],
["PydanticAI is useful conceptually when thinking about…",["Typed/validated Python agent inputs, outputs and tools","Training clusters","Vector indexes only","Speech synthesis"],0],
["OpenAI Agents SDK / Google ADK are examples of…",["Developer toolkits for building/running agent applications with agent/tool/handoff/session concepts","Model weights","Databases","Operating systems"],0],
["Choosing a framework should start with…",["Required control flow, state, tools, data, language/runtime and operational needs","Which logo is hottest","Largest dependency count","Most mascots"],0],
] as const;

export function FrameworkAtlasLesson({progress}:Props){
 const [abstractions,setAbstractions]=useState<string[]>([]),[seen,setSeen]=useState<Record<string,string[]>>({}),[choices,setChoices]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const taskIds=["atlas-abstractions","atlas-langgraph","atlas-langchain","atlas-llamaindex","atlas-sk","atlas-multi-agent","atlas-typed","atlas-choose","atlas-explain"],sections=["abstractions","langgraph","langchain","llamaindex","semantic-kernel","multi-agent","typed-sdks","choose","explain"];
 const done=taskIds.filter(x=>progress.completedTasks[x]).length,read=sections.filter(x=>progress.visitedSections.has(x)).length,unlocked=done===9&&read===9;
 const mark=(key:string,value:string,need:number,task:string)=>{const current=seen[key]||[];const next=[...new Set([...current,value])];setSeen({...seen,[key]:next});if(next.length>=need)progress.completeTask(task)};
 const chooseDone=chooseCases.every((x,i)=>choices[i]===x[1]);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["framework","runtime","tool","state","graph","data","agent","validation"].filter(w=>t.includes(w)).length;if(explain.length<100||hits<4){setExplainFeedback("Go deeper: explain what framework abstractions save you from building and why framework choice should follow control-flow/data/runtime requirements.");return;}setExplainFeedback("Strong. You are using framework names as implementation examples, not as definitions of the underlying concepts.");progress.completeTask("atlas-explain")};
 const cardGroup=(key:keyof typeof groups,task:string)=><div className={styles.grid2}>{groups[key].map(item=><button key={item} className={`${styles.panel} ${(seen[key]||[]).includes(item)?styles.correct:""}`} onClick={()=>mark(key,item,groups[key].length,task)}><b>{item}</b><p>Click to inspect this conceptual responsibility.</p></button>)}</div>;
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 11 · FRAMEWORK ATLAS</span><h1>Learn the shapes. Framework names can change.</h1><p>Agent frameworks package recurring abstractions: agents, tools, messages, state, graphs, retrievers, handoffs and sessions. Their exact APIs evolve, so this atlas teaches the stable mental map first.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===9}>{done}/9 atlas regions explored</TaskStamp></div><div className={styles.cutaway}><div className={`${styles.ring} ${styles.r3}`}/><div className={`${styles.ring} ${styles.r2}`}/><div className={`${styles.ring} ${styles.r1}`}/><div className={styles.model}><AiMascot variant="star" accent="#ffe05b" mood={done>5?"excited":"happy"} size={110} label="APP"/></div><span className={`${styles.label} ${styles.l1}`}>TOOLS</span><span className={`${styles.label} ${styles.l2}`}>STATE / GRAPH</span><span className={`${styles.label} ${styles.l3}`}>DATA / HANDOFFS</span></div></section>

  <LessonSection id="abstractions" onVisit={progress.markVisited} className={styles.scene}><h2>1. Stable abstractions before product names.</h2><div className={styles.parts}>{["agent","tool","message","state","graph","handoff","retriever","session"].map(item=><button key={item} className={`${styles.part} ${abstractions.includes(item)?styles.correct:""}`} onClick={()=>{const next=[...new Set([...abstractions,item])];setAbstractions(next);if(next.length===8)progress.completeTask("atlas-abstractions")}}>{item}</button>)}</div></LessonSection>

  <LessonSection id="langgraph" onVisit={progress.markVisited} className={styles.scene}><h2>2. LangGraph — think stateful graph control flow.</h2>{cardGroup("langgraph","atlas-langgraph")}<p>Conceptual association: graph/state-machine style orchestration where durable state, branching, loops and human checkpoints are explicit. Exact APIs evolve.</p></LessonSection>

  <LessonSection id="langchain" onVisit={progress.markVisited} className={styles.scene}><h2>3. LangChain — think broad model/tool/prompt/integration abstractions.</h2>{cardGroup("langchain","atlas-langchain")}<p>Conceptual association: a broad toolkit/ecosystem for composing model calls, prompts/messages, tools, agents and integrations. Production apps may use only a small subset.</p></LessonSection>

  <LessonSection id="llamaindex" onVisit={progress.markVisited} className={styles.scene}><h2>4. LlamaIndex — think data/RAG-heavy application primitives.</h2>{cardGroup("llamaindex","atlas-llamaindex")}<p>Conceptual association: ingest/connect data, build retrieval/index/query layers, then connect those data capabilities into LLM/agent workflows.</p></LessonSection>

  <LessonSection id="semantic-kernel" onVisit={progress.markVisited} className={styles.scene}><h2>5. Semantic Kernel — think enterprise application integration + functions/plugins/orchestration.</h2>{cardGroup("sk","atlas-sk")}<p>Conceptual association: integrate AI/model capabilities into application code through functions/plugins, planning/orchestration and memory/connectors, particularly in enterprise ecosystems.</p></LessonSection>

  <LessonSection id="multi-agent" onVisit={progress.markVisited} className={styles.scene}><h2>6. AutoGen / CrewAI — think multi-agent collaboration patterns.</h2>{cardGroup("multi","atlas-multi-agent")}<p>Use these as examples for roles, conversations, teams, delegation and manager/worker patterns. Multi-agent is an architectural choice, not an automatic quality upgrade.</p></LessonSection>

  <LessonSection id="typed-sdks" onVisit={progress.markVisited} className={styles.scene}><h2>7. OpenAI Agents SDK / PydanticAI / Google ADK — think modern agent developer toolkits.</h2>{cardGroup("typed","atlas-typed")}<div className={styles.grid3}><div className={styles.panel}><b>OpenAI Agents SDK</b><p>Conceptual lens: agents, tools, handoffs, tracing/session/runtime helpers around model interactions.</p></div><div className={styles.panel}><b>PydanticAI</b><p>Conceptual lens: typed Python agent/tool dependencies and validated structured behavior.</p></div><div className={styles.panel}><b>Google ADK</b><p>Conceptual lens: agent development toolkit with agents/tools/sessions/orchestration concepts in Google's ecosystem.</p></div></div><p className={styles.warning}>Treat these as conceptual snapshots, not frozen API documentation. Always check current official docs when implementing.</p></LessonSection>

  <LessonSection id="choose" onVisit={progress.markVisited} className={styles.scene}><h2>8. Choose the abstraction that matches the problem.</h2>{chooseCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["graph","data","typed","multi"].map(choice=><button key={choice} className={`${styles.button} ${choices[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...choices,[i]:choice};setChoices(next);if(chooseCases.every((x,j)=>next[j]===x[1]))progress.completeTask("atlas-choose")}}>{choice}</button>)}</div>)}{chooseDone&&<p className={styles.feedback}>✓ Pick by control flow, state/durability, data/retrieval needs, typing/runtime and team complexity — not hype.</p>}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain why a framework is not the agent itself.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain agent/tool/state/graph abstractions and how a framework differs from the running runtime/harness."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Framework Atlas quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Explore all nine atlas regions. {done}/9 tasks · {read}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizDone&&<p className={styles.feedback}>{quizScore>=7?"★ FRAMEWORK ATLAS MASTERED":"Pass is 7/8. Revisit abstractions rather than logos."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/harness-runtime-lab">← Harness Runtime</Link><Link href="/lessons/module-11-capstone">Harness Boss Lab →</Link></div>
 </main>
}
