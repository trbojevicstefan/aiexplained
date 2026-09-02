"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "../reasoning-solver-arena/reasoning-solver-arena.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["Reasoning/test-time compute is spent…",["During inference to improve/verify a solution","Only during pretraining","Only during tokenization","Only in a database"],0],
["Planning is especially useful for…",["Tasks with constraints and multiple dependent steps","Every trivial classification regardless of cost","Tokenizer training","GPU cooling"],0],
["Search without a verifier can…",["Generate more choices without reliably knowing which is best","Guarantee truth","Update model weights","Eliminate cost"],0],
["PRM vs ORM differs by…",["Whether intermediate process steps or final outcomes receive the reward signal","Model size","Tokenizer family","Context length"],0],
["Best-of-N increases…",["Candidate diversity/opportunity and compute cost","Only model parameters","Only training data","Only KV cache"],0],
["Self-consistency aggregates…",["Multiple sampled reasoning paths/final answers","Training checkpoints","Tool permissions","Vector indexes"],0],
["An external exact checker is often stronger than…",["A vague self-judgment with no ground-truth signal","A GPU","A tokenizer","A context window"],0],
["More reasoning budget is always economically optimal.",["True","False"],1],
["Generator/verifier systems can fail when…",["The verifier rewards the wrong proxy","The generator outputs text","There are multiple candidates","The model has parameters"],0],
["A failed unit test can enable self-correction because…",["It provides concrete feedback about what violated the specification","It retrains the model automatically","It expands context forever","It creates reward data only"],0],
["Reasoning vs memorization should be tested with…",["Novel/held-out variants and controlled evaluation","One famous benchmark question only","Only model marketing claims","Only output length"],0],
["The final reasoning strategy should match…",["Task difficulty, error cost, latency and compute budget","One maximum setting for all tasks","Only prompt color","Only parameter count"],0],
] as const;

export function Module8CapstoneLesson({progress}:Props){
 const [budget,setBudget]=useState(1),[plan,setPlan]=useState(""),[n,setN]=useState(1),[reward,setReward]=useState(""),[aggregation,setAggregation]=useState(""),[verifier,setVerifier]=useState(""),[repair,setRepair]=useState(""),[economics,setEconomics]=useState<Record<number,string>>({}),[answers,setAnswers]=useState<Record<number,number>>({});
 const taskIds=["m8-budget","m8-plan","m8-search","m8-reward","m8-aggregate","m8-verify","m8-correct","m8-economics"],sectionIds=["budget","plan","search","reward","aggregate","verify","correct","economics"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===8&&readCount===8;
 const quality=Math.min(96,55+Math.round(Math.log2(budget+1)*12)+Math.round(Math.log2(n+1)*5));
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 const economicCases=[
  ["Autocomplete title under 100ms","fast"],["High-stakes migration plan","verify"],["Massive cheap spam classification","fast"],["Hard math task with 5s budget","deliberate"],
 ] as const;
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 8 · BOSS LAB</span><h1>Build a solver that earns its extra compute.</h1><p>Your final mission: use more inference only where it buys useful reliability. Planning, search, aggregation and verification are separate levers — combine them deliberately.</p><TaskStamp done={taskCount===8}>{taskCount}/8 reasoning systems cleared</TaskStamp></div><div className={styles.arena}><AiMascot variant="tile" accent="#8ce674" mood={budget<4?"happy":"thinking"} size={96} label="FAST"/><AiMascot variant="briefcase" accent="#6fd8d1" mood={budget>=4?"excited":"thinking"} size={96} label="PLAN"/><AiMascot variant="star" accent="#ffe05b" mood={verifier==="tests"?"excited":"happy"} size={96} label="VERIFY"/><AiMascot variant="mail" accent="#ae90ff" mood={taskCount===8?"excited":"happy"} size={96} label="SHIP"/></div></section>

  <LessonSection id="budget" onVisit={progress.markVisited} className={styles.scene}><h2>1. Allocate a reasoning budget.</h2><div className={styles.control}><label>Inference compute budget <b>{budget}×</b></label><input type="range" min="1" max="10" value={budget} onChange={e=>{setBudget(+e.target.value);if(+e.target.value>=5)progress.completeTask("m8-budget")}}/></div><div className={styles.meters}><div className={styles.meterCard}><b>Toy quality ceiling</b><div className={styles.meter}><i style={{width:`${quality}%`}}/></div><p>{quality}%</p></div><div className={styles.meterCard}><b>Latency</b><p>{(.35+budget*.45).toFixed(1)}s</p></div><div className={styles.meterCard}><b>Relative cost</b><p>{(1+budget*.55).toFixed(1)}×</p></div></div></LessonSection>

  <LessonSection id="plan" onVisit={progress.markVisited} className={styles.scene}><h2>2. A production migration needs which strategy?</h2>{[["one-shot","Answer immediately with one unverified plan."],["plan","Extract constraints → plan → execute simulation → verify rollback."],["memorize","Recall a random migration article and copy it."]].map(([id,text])=><button key={id} className={`${styles.choice} ${plan===id?(id==="plan"?styles.correct:styles.wrong):""}`} onClick={()=>{setPlan(id);if(id==="plan")progress.completeTask("m8-plan")}}>{text}</button>)}</LessonSection>

  <LessonSection id="search" onVisit={progress.markVisited} className={styles.scene}><h2>3. Generate enough candidates to make search meaningful.</h2><div className={styles.control}><label>Best-of-N candidates <b>{n}</b></label><input type="range" min="1" max="16" value={n} onChange={e=>{setN(+e.target.value);if(+e.target.value>=6)progress.completeTask("m8-search")}}/></div><div className={styles.tree}>{Array.from({length:Math.min(8,n)},(_,i)=><div key={i} className={`${styles.branch} ${i===4&&n>=6?styles.good:i%3===0?styles.bad:""}`}><b>Candidate {i+1}</b><p>{i===4&&n>=6?"passes all constraints":"needs verification"}</p></div>)}</div></LessonSection>

  <LessonSection id="reward" onVisit={progress.markVisited} className={styles.scene}><h2>4. You can inspect every intermediate math step. Which reward signal?</h2>{[["prm","Use a process reward / step scorer."],["orm","Only score the final answer."],["none","Do not evaluate anything."]].map(([id,text])=><button key={id} className={`${styles.choice} ${reward===id?(id==="prm"?styles.correct:styles.wrong):""}`} onClick={()=>{setReward(id);if(id==="prm")progress.completeTask("m8-reward")}}>{text}</button>)}</LessonSection>

  <LessonSection id="aggregate" onVisit={progress.markVisited} className={styles.scene}><h2>5. Five independent solution paths vote 18, 18, 18, 17, 18.</h2>{[["majority","Aggregate by majority/self-consistency → 18."],["first","Always take path 1 because it was first."],["longest","Choose the longest path regardless of answer."]].map(([id,text])=><button key={id} className={`${styles.choice} ${aggregation===id?(id==="majority"?styles.correct:styles.wrong):""}`} onClick={()=>{setAggregation(id);if(id==="majority")progress.completeTask("m8-aggregate")}}>{text}</button>)}<p className={styles.warning}>Agreement increases confidence only if the samples have sufficiently independent error modes. Shared systematic error can win the vote.</p></LessonSection>

  <LessonSection id="verify" onVisit={progress.markVisited} className={styles.scene}><h2>6. Pick the strongest verifier available.</h2>{[["vibes","Ask the generator: “Does this look correct?”"],["length","Reward the longest answer."],["tests","Run exact unit tests + schema checks + migration constraints."]].map(([id,text])=><button key={id} className={`${styles.choice} ${verifier===id?(id==="tests"?styles.correct:styles.wrong):""}`} onClick={()=>{setVerifier(id);if(id==="tests")progress.completeTask("m8-verify")}}>{text}</button>)}</LessonSection>

  <LessonSection id="correct" onVisit={progress.markVisited} className={styles.scene}><h2>7. The chosen candidate fails the rollback test.</h2>{[["ignore","Ship anyway."],["repeat","Regenerate the same plan without using test evidence."],["feedback","Feed the exact failed constraint back into revision, generate a corrected plan, rerun the verifier."]].map(([id,text])=><button key={id} className={`${styles.choice} ${repair===id?(id==="feedback"?styles.correct:styles.wrong):""}`} onClick={()=>{setRepair(id);if(id==="feedback")progress.completeTask("m8-correct")}}>{text}</button>)}</LessonSection>

  <LessonSection id="economics" onVisit={progress.markVisited} className={styles.scene}><h2>8. Spend compute where error cost justifies it.</h2>{economicCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["fast","deliberate","verify"].map(choice=><button key={choice} className={`${styles.button} ${economics[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...economics,[i]:choice};setEconomics(next);if(economicCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m8-economics")}}>{choice}</button>)}</div>)}</LessonSection>

  <section className={styles.quiz}><h2>Module 8 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Clear all eight reasoning-system rooms. {taskCount}/8 tasks · {readCount}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit mastery exam · {quizScore}/12</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=10?"★ MODULE 8 MASTERED — you can treat reasoning as configurable inference/search/verification compute.":"Pass is 10/12. Revisit verifier quality and compute trade-offs."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/search-verification-lab">← Search & Verification</Link><Link href="/">Learning map →</Link></div>
 </main>
}
