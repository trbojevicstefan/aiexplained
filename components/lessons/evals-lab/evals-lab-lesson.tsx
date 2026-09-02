"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./evals-lab.module.css";

type Props={progress:LessonProgressApi};
const evalCases=[
["Run a fixed set of support questions and score answer quality","eval"],["One impressive demo prompt shown on launch day","anecdote"],["Measure tool success across 500 recorded tasks","eval"],["Change prompt until one cherry-picked example looks good","anecdote"],
] as const;
const datasetCases=[
["Stable examples with expected/reference outcomes","golden"],["Public standardized task used for comparison","benchmark"],["Held-out project examples used to estimate performance","test-set"],["Examples used repeatedly to tune until they are effectively training signal","contaminated"],
] as const;
const judgeCases=[
["Domain experts rate legal-answer correctness","human"],["Another model scores rubric dimensions at scale","llm-judge"],["Reviewer chooses response A or B","pairwise"],["Assume judge model score is ground truth without validation","bad"],
] as const;
const groundingCases=[
["Answer claim is supported by retrieved source","grounded"],["Answer contradicts source while sounding fluent","unfaithful"],["Answer invents unsupported policy detail","hallucination"],["Answer accurately says evidence is insufficient","good-abstain"],
] as const;
const agentCases=[
["Selected correct tool","tool-selection"],["Used correct tool with wrong date argument","argument-accuracy"],["Recovered after transient tool failure","recovery"],["Continued looping after task complete","stopping"],["Used 18 steps when 5 were sufficient","efficiency"],
] as const;
const efficiencyCases=[
["Quality improves 1 point but cost increases 10×","tradeoff"],["Same success rate, TTFT drops 40%","better"],["Cheaper model reduces task success from 95% to 45%","bad"],["Evaluate quality, cost and latency together","good"],
] as const;
const designCases=[
["Common easy cases","include"],["Rare/high-risk edge cases","include"],["Known historical failures","include"],["Only prompts where current model already succeeds","bad"],["Production-distribution samples","include"],
] as const;
const regressionCases=[
["Tool success falls from 96% to 82% after prompt change","block"],["Cost improves 20%, quality unchanged within tolerance","allow"],["Hallucination rate exceeds safety threshold","block"],["Latency moves 2ms inside noisy tolerance","allow"],
] as const;
const quiz=[
["An eval is…",["A repeatable way to measure system behavior against defined criteria","One nice demo","Only a benchmark leaderboard","Only model training"],0],
["A golden dataset contains…",["Curated examples with trusted expected/reference outcomes or labels","Only random internet text","Only generated tokens","Only logs without labels"],0],
["LLM-as-a-judge should ideally be…",["Validated/calibrated against human or trusted judgments for the use case","Assumed perfect","Used without rubric","The only metric"],0],
["Precision =…",["TP / (TP + FP)","TP / (TP + FN)","TN / all","FP / all"],0],
["Recall =…",["TP / (TP + FN)","TP / (TP + FP)","TN / (TN + FP)","TP / all"],0],
["Groundedness asks whether…",["Claims are supported by provided/retrieved evidence","The answer is long","The model is expensive","The token count is low"],0],
["Agent evals should include tool selection, arguments, recovery and stopping behavior.",["True","False"],0],
["Cost and latency can be part of an eval suite.",["True","False"],0],
["A test set tuned against repeatedly can become contaminated as an unbiased estimate.",["True","False"],0],
["Regression gates can block deployments that violate agreed quality/safety thresholds.",["True","False"],0],
] as const;

export function EvalsLabLesson({progress}:Props){
 const [evalAns,setEvalAns]=useState<Record<number,string>>({}),[datasets,setDatasets]=useState<Record<number,string>>({}),[judges,setJudges]=useState<Record<number,string>>({}),[tp,setTp]=useState(75),[fp,setFp]=useState(10),[fn,setFn]=useState(15),[tn,setTn]=useState(100),[ground,setGround]=useState<Record<number,string>>({}),[agent,setAgent]=useState<Record<number,string>>({}),[efficiency,setEfficiency]=useState<Record<number,string>>({}),[design,setDesign]=useState<Record<number,string>>({}),[regression,setRegression]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["eval-what","eval-datasets","eval-judges","eval-classification","eval-grounding","eval-agent","eval-efficiency","eval-design","eval-regression","eval-explain"],sections=["eval","datasets","judges","classification","grounding","agent","efficiency","design","regression","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const metrics=useMemo(()=>{const accuracy=(tp+tn)/(tp+tn+fp+fn);const precision=tp/Math.max(1,tp+fp);const recall=tp/Math.max(1,tp+fn);const f1=2*precision*recall/Math.max(.0001,precision+recall);return{accuracy,precision,recall,f1}},[tp,fp,fn,tn]);
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const submit=()=>{const t=explain.toLowerCase();const hits=["eval","benchmark","golden","human","judge","precision","recall","ground","tool","cost","latency","regression"].filter(w=>t.includes(w)).length;if(explain.length<165||hits<9){setFeedback("Go deeper: explain datasets/judges, classification metrics, groundedness, agent-specific success/recovery/stopping, cost/latency and regression gates.");return;}setFeedback("Strong. You described evals as a measurement system for the whole AI product, not a single benchmark score.");progress.completeTask("eval-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 24 · AI EVALS LAB</span><h1>If you cannot measure “better,” you are prompt-engineering by vibes.</h1><p>Build repeatable datasets, choose judges, calculate precision/recall/F1, score groundedness and agent behavior, then turn metrics into deployment regression gates.</p><TaskStamp done={done===10}>{done}/10 eval missions complete</TaskStamp></div><div className={styles.scoreboard}><span>accuracy <b>{(metrics.accuracy*100).toFixed(1)}%</b></span><span>precision <b>{(metrics.precision*100).toFixed(1)}%</b></span><span>recall <b>{(metrics.recall*100).toFixed(1)}%</b></span><span>F1 <b>{(metrics.f1*100).toFixed(1)}%</b></span></div></section>

  <LessonSection id="eval" onVisit={progress.markVisited} className={styles.scene}><h2>1. Eval = repeatable measurement, not a demo.</h2>{evalCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["eval","anecdote"].map(a=><button key={a} className={`${styles.button} ${evalAns[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(evalAns,setEvalAns,evalCases,i,a,"eval-what")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="datasets" onVisit={progress.markVisited} className={styles.scene}><h2>2. Benchmark, golden set and project test set are different assets.</h2>{datasetCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["golden","benchmark","test-set","contaminated"].map(a=><button key={a} className={`${styles.button} ${datasets[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(datasets,setDatasets,datasetCases,i,a,"eval-datasets")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="judges" onVisit={progress.markVisited} className={styles.scene}><h2>3. Human, model-judge and pairwise evals trade scale for reliability/cost differently.</h2>{judgeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["human","llm-judge","pairwise","bad"].map(a=><button key={a} className={`${styles.button} ${judges[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(judges,setJudges,judgeCases,i,a,"eval-judges")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="classification" onVisit={progress.markVisited} className={styles.scene}><h2>4. Make precision/recall visible by editing the confusion matrix.</h2><div className={styles.confusion}><label>True Positive <b>{tp}</b><input type="range" min="0" max="150" value={tp} onChange={e=>{setTp(+e.target.value);progress.completeTask("eval-classification")}}/></label><label>False Positive <b>{fp}</b><input type="range" min="0" max="100" value={fp} onChange={e=>{setFp(+e.target.value);progress.completeTask("eval-classification")}}/></label><label>False Negative <b>{fn}</b><input type="range" min="0" max="100" value={fn} onChange={e=>{setFn(+e.target.value);progress.completeTask("eval-classification")}}/></label><label>True Negative <b>{tn}</b><input type="range" min="0" max="150" value={tn} onChange={e=>{setTn(+e.target.value);progress.completeTask("eval-classification")}}/></label></div><div className={styles.metricGrid}><span>accuracy<b>{(metrics.accuracy*100).toFixed(1)}%</b></span><span>precision<b>{(metrics.precision*100).toFixed(1)}%</b></span><span>recall<b>{(metrics.recall*100).toFixed(1)}%</b></span><span>F1<b>{(metrics.f1*100).toFixed(1)}%</b></span></div></LessonSection>

  <LessonSection id="grounding" onVisit={progress.markVisited} className={styles.scene}><h2>5. Fluency, correctness and evidence support are separate.</h2>{groundingCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["grounded","unfaithful","hallucination","good-abstain"].map(a=><button key={a} className={`${styles.button} ${ground[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(ground,setGround,groundingCases,i,a,"eval-grounding")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="agent" onVisit={progress.markVisited} className={styles.scene}><h2>6. Agent evals inspect the trajectory, not only the final text.</h2>{agentCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["tool-selection","argument-accuracy","recovery","stopping","efficiency"].map(a=><button key={a} className={`${styles.button} ${agent[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(agent,setAgent,agentCases,i,a,"eval-agent")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="efficiency" onVisit={progress.markVisited} className={styles.scene}><h2>7. Quality is one axis. Cost and latency are also product behavior.</h2>{efficiencyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["tradeoff","better","bad","good"].map(a=><button key={a} className={`${styles.button} ${efficiency[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(efficiency,setEfficiency,efficiencyCases,i,a,"eval-efficiency")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="design" onVisit={progress.markVisited} className={styles.scene}><h2>8. Build a suite that represents production and the places you fear.</h2>{designCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["include","bad"].map(a=><button key={a} className={`${styles.button} ${design[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(design,setDesign,designCases,i,a,"eval-design")}>{a}</button>)}</div>)}</LessonSection>

  <LessonSection id="regression" onVisit={progress.markVisited} className={styles.scene}><h2>9. Turn evals into release gates.</h2>{regressionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["block","allow"].map(a=><button key={a} className={`${styles.button} ${regression[i]===a?(a===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(regression,setRegression,regressionCases,i,a,"eval-regression")}>{a}</button>)}</div>)}<div className={styles.gates}><span className={styles.pass}>task success ≥92%</span><span className={styles.pass}>hallucination ≤2%</span><span className={styles.pass}>p95 latency ≤2s</span><span className={styles.pass}>cost/task ≤$0.06</span></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain an eval system end to end.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain eval datasets/judges, precision/recall/F1, groundedness, agent trajectory metrics, cost/latency and regression gates."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>AI Evals Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ AI EVALS MASTERED":"Pass is 9/10. Revisit classification metrics and agent trajectory evals."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-23-capstone">← AI Economics</Link><Link href="/lessons/observability-trace-lab">Observability →</Link></div>
 </main>
}
