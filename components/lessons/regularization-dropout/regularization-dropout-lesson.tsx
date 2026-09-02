"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { baseWeights, cases, clamp, defs, Intervention, norm, quiz } from "./regularization-data";
import styles from "./regularization-dropout.module.css";

type Props={progress:LessonProgressApi};

export function RegularizationDropoutLesson({progress}:Props){
  const [complexity,setComplexity]=useState(6);
  const [lambda,setLambda]=useState(.18);
  const [l2Steps,setL2Steps]=useState(0);
  const [dropRate,setDropRate]=useState(.35);
  const [maskSeed,setMaskSeed]=useState(0);
  const [maskRuns,setMaskRuns]=useState(0);
  const [mode,setMode]=useState<"train"|"infer">("train");
  const [seenModes,setSeenModes]=useState<("train"|"infer")[]>([]);
  const [checkpoint,setCheckpoint]=useState(5);
  const [width,setWidth]=useState(20);
  const [dataSize,setDataSize]=useState(150);
  const [answers,setAnswers]=useState<Record<number,Intervention>>({});
  const [recipe,setRecipe]=useState({l2:false,dropout:false,early:false,augment:false});
  const [explanation,setExplanation]=useState("");
  const [feedback,setFeedback]=useState("");
  const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
  const [quizFeedback,setQuizFeedback]=useState("");

  const trainAcc=clamp(67+complexity*1.75,0,99.6);
  const valAcc=clamp(73+Math.min(complexity,8)*1.75-Math.max(0,complexity-8)*2.15,45,90);
  const gap=Math.max(0,trainAcc-valAcc);
  const decay=Math.max(.35,1-lambda*.12);
  const weights=baseWeights.map(w=>w*decay**l2Steps);
  const mask=useMemo(()=>Array.from({length:8},(_,i)=>(((i*37+maskSeed*53+17)%100)/100)>=dropRate),[maskSeed,dropRate]);
  const bestEpoch=14;
  const valLoss=(e:number)=>.38+((e-bestEpoch)**2)/150;
  const trainLoss=(e:number)=>1.18*Math.exp(-e/8)+.08;
  const capacityGap=clamp((width/64)*34-Math.log10(dataSize/50+1)*12,0,36);
  const selected=Object.values(recipe).filter(Boolean).length;
  const recipeGap=clamp(28-(recipe.l2?6:0)-(recipe.dropout?7:0)-(recipe.early?7:0)-(recipe.augment?8:0)+(selected===4?3:0),2,30);
  const tasks=defs.filter(([,task])=>progress.completedTasks[task]).length;
  const rooms=defs.filter(([id])=>progress.visitedSections.has(id)).length;
  const unlocked=tasks===9&&rooms===9;

  const depthCopy={simple:"Regularization makes memorization harder so the network must learn patterns that travel to new examples.",real:"L2 penalizes large weights, dropout samples subnetworks during training, and early stopping chooses a checkpoint using validation performance.",expert:"Regularization constrains effective capacity or the optimization trajectory: weight decay biases parameter norms, dropout injects multiplicative noise, and early stopping is an implicit trajectory regularizer."} as const;

  const inspectMode=(next:"train"|"infer")=>{setMode(next);const seen=seenModes.includes(next)?seenModes:[...seenModes,next];setSeenModes(seen);if(seen.length===2)progress.completeTask("compare-dropout-modes");};
  const diagnose=(i:number,a:Intervention)=>{const next={...answers,[i]:a};setAnswers(next);if(cases.every((c,j)=>next[j]===c.answer))progress.completeTask("choose-regularizer");};
  const toggle=(k:keyof typeof recipe)=>{const next={...recipe,[k]:!recipe[k]};setRecipe(next);const n=Object.values(next).filter(Boolean).length;const g=clamp(28-(next.l2?6:0)-(next.dropout?7:0)-(next.early?7:0)-(next.augment?8:0)+(n===4?3:0),2,30);if(n>=3&&g<=10)progress.completeTask("build-regularization-recipe");};
  const explain=()=>{const t=explanation.toLowerCase();const hits=["validation","weight","dropout","training","early","memor","capacity"].filter(k=>t.includes(k));if(explanation.trim().length<100||hits.length<4){setFeedback("Explain the train/validation gap and what L2, dropout and early stopping each change.");return;}setFeedback("Strong: regularization is controlled pressure, not a magic accuracy booster.");progress.completeTask("explain-regularization");};
  const submitQuiz=()=>{const score=quiz.reduce((s,q,i)=>s+(quizAnswers[i]===q.c?1:0),0);const passed=score>=6;progress.saveQuiz(score,passed);setQuizFeedback(passed?`Passed ${score}/7.`:`${score}/7. Need 6/7.`);};

  return <main className={styles.root}>
    <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 2 · REGULARIZATION GREENHOUSE</span><h1>Grow patterns. Prune memorization.</h1><p>{depthCopy[progress.depth]}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.plant}><div><small>GENERALIZATION GREENHOUSE</small><h3>{tasks}/9 interventions</h3></div><div className={styles.vines}>{[35,78,115,92,128].map((h,i)=><i key={i} style={{height:h}}/>)}</div><span>{rooms}/9 rooms inspected</span></div></section>

    <LessonSection id="overfit-gap" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["create-overfit-gap"]}>01 · OVERFIT IT</TaskStamp><h2>Make training accuracy lie.</h2><p>Increase capacity until training keeps improving while validation falls.</p><div className={styles.controls}><div className={styles.control}><label><span>Complexity</span><b>{complexity}</b></label><input type="range" min="1" max="20" value={complexity} onChange={e=>setComplexity(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(complexity>=14&&gap>20)progress.completeTask("create-overfit-gap");}}>Inspect gap</button></div><div className={styles.stats}><div className={styles.stat}><span>Train</span><b>{trainAcc.toFixed(1)}%</b></div><div className={styles.stat}><span>Validation</span><b>{valAcc.toFixed(1)}%</b></div><div className={styles.stat}><span>Gap</span><b>{gap.toFixed(1)}</b></div></div><div className={styles.gapBar}><i style={{width:`${Math.min(100,gap*3)}%`}}/></div></LessonSection>

    <LessonSection id="l2-pruning" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["apply-l2-decay"]}>02 · L2 DECAY</TaskStamp><h2>Make large weights expensive.</h2><div className={styles.controls}><div className={styles.control}><label><span>λ</span><b>{lambda.toFixed(2)}</b></label><input type="range" min=".02" max=".5" step=".01" value={lambda} onChange={e=>setLambda(+e.target.value)}/></div><button className={styles.button} onClick={()=>{const next=l2Steps+1;setL2Steps(next);if(next>=5&&norm(baseWeights.map(w=>w*decay**next))<norm(baseWeights)*.85)progress.completeTask("apply-l2-decay");}}>Optimizer step + L2</button></div><div className={styles.weights}>{weights.map((w,i)=><div key={i} className={styles.weight} style={{height:`${45+Math.abs(w)*34}px`}}>{w.toFixed(2)}</div>)}</div><p>Weight norm: {norm(weights).toFixed(2)} · steps: {l2Steps}</p></LessonSection>

    <LessonSection id="dropout-masks" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["sample-dropout-masks"]}>03 · DROPOUT</TaskStamp><h2>Train a temporary subnetwork each pass.</h2><div className={styles.controls}><div className={styles.control}><label><span>Drop rate</span><b>{Math.round(dropRate*100)}%</b></label><input type="range" min=".1" max=".7" step=".05" value={dropRate} onChange={e=>setDropRate(+e.target.value)}/></div><button className={styles.button} onClick={()=>{setMaskSeed(s=>s+1);setMaskRuns(r=>{const n=r+1;if(n>=3&&dropRate>=.25&&dropRate<=.6)progress.completeTask("sample-dropout-masks");return n;});}}>New mask</button></div><div className={styles.units}>{mask.map((on,i)=><div key={i} className={`${styles.unit} ${on?"":styles.off}`}>H{i+1}</div>)}</div><p>Masks sampled: {maskRuns}</p></LessonSection>

    <LessonSection id="train-vs-infer" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-dropout-modes"]}>04 · TRAIN VS INFERENCE</TaskStamp><h2>Dropout is mode-dependent.</h2><div className={styles.toggles}><button className={mode==="train"?styles.active:""} onClick={()=>inspectMode("train")}>Training</button><button className={mode==="infer"?styles.active:""} onClick={()=>inspectMode("infer")}>Inference</button></div><div className={styles.panel}><p>{mode==="train"?"Random masks are active and surviving activations use the chosen scaling convention.":"The full network is active; ordinary inference does not randomly delete units on every request."}</p></div></LessonSection>

    <LessonSection id="early-stop" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["choose-early-stop"]}>05 · EARLY STOPPING</TaskStamp><h2>Save the best validation checkpoint.</h2><div className={styles.controls}><div className={styles.control}><label><span>Epoch</span><b>{checkpoint}</b></label><input type="range" min="1" max="30" value={checkpoint} onChange={e=>setCheckpoint(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(Math.abs(checkpoint-bestEpoch)<=1)progress.completeTask("choose-early-stop");}}>Save checkpoint</button></div><div className={styles.stats}><div className={styles.stat}><span>Train loss</span><b>{trainLoss(checkpoint).toFixed(3)}</b></div><div className={styles.stat}><span>Val loss</span><b>{valLoss(checkpoint).toFixed(3)}</b></div><div className={styles.stat}><span>Best val</span><b>{bestEpoch}</b></div></div></LessonSection>

    <LessonSection id="capacity-data" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["balance-capacity-data"]}>06 · CAPACITY VS DATA</TaskStamp><h2>Regularization cannot invent evidence.</h2><div className={styles.controls}><div className={styles.control}><label><span>Hidden width</span><b>{width}</b></label><input type="range" min="4" max="64" value={width} onChange={e=>setWidth(+e.target.value)}/></div><div className={styles.control}><label><span>Examples</span><b>{dataSize}</b></label><input type="range" min="50" max="2000" step="50" value={dataSize} onChange={e=>setDataSize(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(capacityGap<12&&width>=10&&dataSize>=400)progress.completeTask("balance-capacity-data");}}>Check balance</button></div><p>Estimated train→validation gap: <b>{capacityGap.toFixed(1)}</b></p></LessonSection>

    <LessonSection id="regularizer-choice" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["choose-regularizer"]}>07 · DIAGNOSE FIRST</TaskStamp><h2>Match intervention to failure.</h2><div className={styles.choiceGrid}>{cases.map((c,i)=><div key={c.text} className={styles.case}><p>{c.text}</p><div className={styles.choices}>{(["l2","dropout","early","data"] as Intervention[]).map(a=><button key={a} className={answers[i]===a?(a===c.answer?styles.correct:styles.wrong):""} onClick={()=>diagnose(i,a)}>{a}</button>)}</div></div>)}</div></LessonSection>

    <LessonSection id="recipe" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["build-regularization-recipe"]}>08 · BUILD A RECIPE</TaskStamp><h2>Combine controls without strangling learning.</h2><div className={styles.toggles}>{(Object.keys(recipe) as (keyof typeof recipe)[]).map(k=><button key={k} className={recipe[k]?styles.active:""} onClick={()=>toggle(k)}>{k}</button>)}</div><div className={styles.recipeMeter}><strong>Estimated gap: {recipeGap.toFixed(1)} pts</strong><p>{selected===4?"More tricks is not automatically better; validate for underfitting.":selected>=3&&recipeGap<=10?"Good candidate recipe. Validation data decides.":"Keep tuning."}</p></div></LessonSection>

    <LessonSection id="explain-regularization" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><TaskStamp done={!!progress.completedTasks["explain-regularization"]}>09 · EXPLAIN IT BACK</TaskStamp><h2>Why can worse training fit produce a better model?</h2><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="A model can overfit when..."/><button className={styles.button} onClick={explain}>Check explanation</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</LessonSection>

    <section className={styles.quiz}><h2>Regularization Check</h2>{!unlocked?<div className={styles.locked}>Locked: {tasks}/9 tasks · {rooms}/9 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q.q}><strong>{i+1}. {q.q}</strong>{q.o.map((o,j)=><button key={o} className={quizAnswers[i]===j?styles.selected:""} onClick={()=>setQuizAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div>)}<button className={styles.button} onClick={submitQuiz}>Submit quiz</button>{quizFeedback&&<div className={styles.feedback}>{quizFeedback}</div>}</>}<div className={styles.footer}><Link href="/lessons/gradient-health-normalization">← Gradient health</Link><Link href="/">Course map →</Link></div></section>
  </main>;
}
