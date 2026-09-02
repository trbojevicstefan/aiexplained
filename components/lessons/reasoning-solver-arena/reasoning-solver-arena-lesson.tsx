"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./reasoning-solver-arena.module.css";

type Props={progress:LessonProgressApi};
const tradeCases=[
{text:"Autocomplete a short email subject in <100ms.",answer:"fast"},
{text:"Solve a difficult math puzzle where a wrong answer is expensive but 4 seconds is acceptable.",answer:"deliberate"},
{text:"Classify millions of obvious support messages cheaply.",answer:"fast"},
{text:"Generate a migration plan and verify constraints before touching production.",answer:"verify"},
] as const;
const quiz=[
["Test-time compute means…",["Compute spent while solving/generating at inference time","Only pretraining GPU hours","Only tokenizer work","Only storage"],0],
["More reasoning budget guarantees correctness.",["True","False"],1],
["Planning can help because…",["It decomposes a task before execution, reducing some long-horizon mistakes","It retrains weights","It removes all uncertainty","It is the same as RAG"],0],
["Generator + verifier means…",["One process/model proposes candidates and another pass/process checks them","Two tokenizers merge","A vector DB stores answers","A prompt cache chooses models"],0],
["Self-correction is most reliable when…",["There is useful feedback/evidence/tests to detect the mistake","The model simply repeats itself forever","Temperature is always 2","No verification signal exists"],0],
["Reasoning tokens are best understood as…",["Provider/model-specific internal inference compute accounting; not necessarily a user-visible chain-of-thought transcript","A permanent memory store","Only whitespace tokens","A vector index"],0],
["Increasing Best-of-N generally changes…",["Quality opportunity plus latency/cost because more candidates are generated/evaluated","Model parameter count","Tokenizer vocabulary","Training corpus"],0],
["The right reasoning budget depends on…",["Task difficulty, error cost, latency budget and money/compute budget","One universal maximum","Only prompt length","Only model name"],0],
] as const;

export function ReasoningSolverArenaLesson({progress}:Props){
 const [modes,setModes]=useState<string[]>([]),[budget,setBudget]=useState(1),[budgetTouched,setBudgetTouched]=useState(false),[plan,setPlan]=useState<string[]>([]),[candidates,setCandidates]=useState(1),[searchTouched,setSearchTouched]=useState(false),[verified,setVerified]=useState(""),[bug,setBug]=useState(""),[criticPasses,setCriticPasses]=useState(0),[trade,setTrade]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const taskIds=["reasoning-meaning","reasoning-budget","reasoning-plan","reasoning-search","reasoning-verify","reasoning-correct","reasoning-critic","reasoning-tradeoff","reasoning-explain"];
 const sectionIds=["reasoning","budget","plan","search","verify","self-correct","critic","tradeoff","explain"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===9&&readCount===9;
 const quality=Math.min(94,58+Math.round(Math.log2(budget+1)*11)); const latency=.35+budget*.42; const cost=1+budget*.48;
 const candidateQuality=Math.min(96,57+Math.round(Math.log2(candidates+1)*10));
 const planTarget=["understand","constraints","solve","check"];
 const planDone=planTarget.every((x,i)=>plan[i]===x);
 const tradeDone=tradeCases.every((x,i)=>trade[i]===x.answer);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 const markMode=(mode:string)=>{const next=[...new Set([...modes,mode])];setModes(next);if(next.length===3)progress.completeTask("reasoning-meaning")};
 const addPlan=(item:string)=>{if(plan.includes(item))return;const next=[...plan,item];setPlan(next);if(planTarget.every((x,i)=>next[i]===x))progress.completeTask("reasoning-plan")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["inference","compute","plan","search","verify","cost","latency","candidate"].filter(w=>t.includes(w)).length;if(explain.length<90||hits<4){setExplainFeedback("Go deeper: define test-time compute and explain why planning/search/verification can improve some tasks while increasing latency and cost.");return;}setExplainFeedback("Strong. You described reasoning as an inference strategy/trade-off, not a magical guarantee or a visible transcript requirement.");progress.completeTask("reasoning-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 8 · SOLVER ARENA</span><h1>Same problem. Different amount of thinking time.</h1><p>Modern reasoning systems can spend more inference compute on planning, search, candidate generation and verification. The key question is not “does it think?” but <b>what extra computation is being spent, how is it checked, and is the quality gain worth the latency/cost?</b></p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={taskCount===9}>{taskCount}/9 solver missions complete</TaskStamp></div><div className={styles.arena}><AiMascot variant="tile" accent="#8ce674" mood="happy" size={94} label="FAST"/><AiMascot variant="briefcase" accent="#6fd8d1" mood={budget>3?"excited":"thinking"} size={94} label="PLANNER"/><AiMascot variant="mail" accent="#b192ff" mood={criticPasses>1?"excited":"thinking"} size={94} label="CRITIC"/><AiMascot variant="star" accent="#ffe05b" mood={verified==="c"?"excited":"happy"} size={94} label="VERIFY"/></div></section>

  <LessonSection id="reasoning" onVisit={progress.markVisited} className={styles.scene}><h2>1. “Reasoning” is an overloaded product/research word.</h2><p>For this course, treat it operationally: the system spends additional inference steps/compute to plan, search, transform intermediate state, check candidates or verify an answer before returning it. Providers may account for internal <b>reasoning tokens</b>, but those are not necessarily exposed as a readable chain-of-thought transcript.</p><div className={styles.grid3}>{[
   ["instant","INSTANT","One pass / low test-time budget."],
   ["deliberate","DELIBERATE","Spend more internal compute before final output."],
   ["verified","VERIFIED","Generate then check against constraints/tests/evidence."],
  ].map(([id,title,copy])=><button className={`${styles.panel} ${modes.includes(id)?styles.correct:""}`} key={id} onClick={()=>markMode(id)}><b>{title}</b><p>{copy}</p></button>)}</div></LessonSection>

  <LessonSection id="budget" onVisit={progress.markVisited} className={styles.scene}><h2>2. Spend test-time compute and watch the bill move.</h2><div className={styles.control}><label>Deliberation/search budget <b>{budget}×</b></label><input type="range" min="1" max="10" value={budget} onChange={e=>{setBudget(+e.target.value);setBudgetTouched(true);if(+e.target.value>=5)progress.completeTask("reasoning-budget")}}/></div><div className={styles.meters}><div className={styles.meterCard}><b>Toy solve quality</b><div className={styles.meter}><i style={{width:`${quality}%`}}/></div><p>{quality}%</p></div><div className={styles.meterCard}><b>Latency</b><div className={styles.meter}><i style={{width:`${Math.min(100,latency/5*100)}%`}}/></div><p>{latency.toFixed(1)}s</p></div><div className={styles.meterCard}><b>Relative cost</b><div className={styles.meter}><i style={{width:`${Math.min(100,cost/6*100)}%`}}/></div><p>{cost.toFixed(1)}×</p></div></div>{budgetTouched&&<p className={styles.warning}>Toy curve only. Real tasks have diminishing returns, regressions and model-specific behavior. More compute is not a correctness guarantee.</p>}</LessonSection>

  <LessonSection id="plan" onVisit={progress.markVisited} className={styles.scene}><h2>3. Build an explicit execution plan.</h2><p>Task: “Migrate a database with ≤5 minutes downtime.” Put the visible planning scaffold in a sane order.</p><div className={styles.grid4}>{[
   ["understand","Understand current topology"],["constraints","Extract constraints + rollback target"],["solve","Choose migration steps"],["check","Verify plan against downtime/rollback"],
  ].map(([id,text])=><button key={id} className={`${styles.panel} ${plan.includes(id)?styles.correct:""}`} onClick={()=>addPlan(id)}><b>{plan.includes(id)?`${plan.indexOf(id)+1}. `:""}{text}</b></button>)}</div>{plan.length>0&&!planDone&&<button className={styles.button} onClick={()=>setPlan([])}>Reset order</button>}{planDone&&<p className={styles.feedback}>✓ Planning is useful when it exposes constraints before execution. It does not need to reveal a model's private internal chain of thought.</p>}</LessonSection>

  <LessonSection id="search" onVisit={progress.markVisited} className={styles.scene}><h2>4. Search: create more than one candidate path.</h2><div className={styles.control}><label>Candidate solutions / Best-of-N <b>{candidates}</b></label><input type="range" min="1" max="16" value={candidates} onChange={e=>{setCandidates(+e.target.value);setSearchTouched(true);if(+e.target.value>=6)progress.completeTask("reasoning-search")}}/></div><div className={styles.tree}>{Array.from({length:Math.min(8,candidates)},(_,i)=><div className={`${styles.branch} ${i===Math.min(8,candidates)-2&&candidates>=5?styles.good:i%3===0?styles.bad:""}`} key={i}><b>Path {i+1}</b><p>{i===Math.min(8,candidates)-2&&candidates>=5?"passes constraints":"candidate"}</p></div>)}</div><p>More candidates increase the chance that a strong solution exists, but only help if selection/verification can recognize it. Toy opportunity score: <b>{candidateQuality}%</b>.</p></LessonSection>

  <LessonSection id="verify" onVisit={progress.markVisited} className={styles.scene}><h2>5. A verifier needs a checkable signal.</h2><p>Problem: Which migration plan respects ≤5 min downtime and includes rollback?</p>{[
   ["a","Plan A: 18-minute write lock; no rollback."],
   ["b","Plan B: 4-minute cutover; rollback not tested."],
   ["c","Plan C: replicated shadow DB, 3-minute cutover, tested rollback."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${verified===id?(id==="c"?styles.correct:styles.wrong):""}`} onClick={()=>{setVerified(id);if(id==="c")progress.completeTask("reasoning-verify")}}>{text}</button>)}{verified==="c"&&<p className={styles.feedback}>✓ Verification worked because the acceptance criteria were explicit and inspectable.</p>}</LessonSection>

  <LessonSection id="self-correct" onVisit={progress.markVisited} className={styles.scene}><h2>6. Self-correction needs feedback, not vibes.</h2><div className={styles.equation}>draft SQL: UPDATE users SET tier='pro';{"\n"}test: FAIL — 14,322 rows changed; expected 18 targeted IDs</div>{[
   ["repeat","Ask the model to confidently repeat the same SQL."],
   ["repair","Use the failed test as evidence, constrain by target IDs, generate a revised query, rerun the test."],
   ["ignore","Ignore test output because the draft looked plausible."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${bug===id?(id==="repair"?styles.correct:styles.wrong):""}`} onClick={()=>{setBug(id);if(id==="repair")progress.completeTask("reasoning-correct")}}>{text}</button>)}</LessonSection>

  <LessonSection id="critic" onVisit={progress.markVisited} className={styles.scene}><h2>7. Generator → critic → revision.</h2><p>Run critique passes over a toy deployment plan. A critic can spot issues the generator missed, but critics can also be wrong.</p><div className={styles.steps}>{["Draft: deploy directly to 100% traffic.","Critic: no canary, rollback or metric threshold.","Revision: 5% canary + error budget check + rollback trigger.","Verifier: simulated canary passes thresholds."].slice(0,1+criticPasses).map((text,i)=><div className={`${styles.step} ${i===criticPasses?styles.active:""}`} key={text}>{i+1}. {text}</div>)}</div><button className={styles.button} disabled={criticPasses>=3} onClick={()=>{const next=Math.min(3,criticPasses+1);setCriticPasses(next);if(next>=3)progress.completeTask("reasoning-critic")}}>Run next critique/revision pass</button></LessonSection>

  <LessonSection id="tradeoff" onVisit={progress.markVisited} className={styles.scene}><h2>8. Do not spend 20× compute on a 5-cent decision.</h2>{tradeCases.map((item,i)=><div className={styles.panel} key={item.text}><p>{item.text}</p>{["fast","deliberate","verify"].map(choice=><button key={choice} className={`${styles.button} ${trade[i]===choice?(choice===item.answer?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...trade,[i]:choice};setTrade(next);if(tradeCases.every((x,j)=>next[j]===x.answer))progress.completeTask("reasoning-tradeoff")}}>{choice}</button>)}</div>)}{tradeDone&&<p className={styles.feedback}>✓ Reasoning budget is a product/economic decision as well as a capability decision.</p>}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain reasoning without anthropomorphizing it.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain test-time compute, planning/search, verification, self-correction and the quality/latency/cost trade-off."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Reasoning Solver Arena quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 9 solver rooms. {taskCount}/9 tasks · {readCount}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=7?"★ SOLVER ARENA MASTERED":"Pass is 7/8. Review verification and test-time compute."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-7-capstone">← Training module</Link><Link href="/lessons/search-verification-lab">Search & Verification Lab →</Link></div>
 </main>
}
