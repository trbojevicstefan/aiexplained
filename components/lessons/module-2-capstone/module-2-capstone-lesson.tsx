"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { BossArch, archCases, defs, exam } from "./module-2-capstone-data";
import { createToyNetwork, datasetLoss, forwardToyNetwork, ToyNetwork, trainToyEpoch, XOR_DATASET } from "@/lib/toy-neural-network";
import styles from "./module-2-capstone.module.css";

type Props={progress:LessonProgressApi};
const initialNetwork=createToyNetwork(42,4);
const initialLoss=datasetLoss(initialNetwork,XOR_DATASET);
const accuracy=(network:ToyNetwork)=>XOR_DATASET.filter(p=>(forwardToyNetwork(network,p.x).output>=.5?1:0)===p.y).length/XOR_DATASET.length;

export function Module2CapstoneLesson({progress}:Props){
  const [wireWidth,setWireWidth]=useState(3);
  const [probe,setProbe]=useState(0);
  const [network,setNetwork]=useState<ToyNetwork>(()=>createToyNetwork(42,4));
  const [epochs,setEpochs]=useState(0);
  const [lr,setLr]=useState(.25);
  const [batch,setBatch]=useState(4);
  const [clip,setClip]=useState(false);
  const [normalize,setNormalize]=useState(false);
  const [dropout,setDropout]=useState(false);
  const [earlyStop,setEarlyStop]=useState(false);
  const [archAnswers,setArchAnswers]=useState<Record<number,BossArch>>({});
  const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
  const [feedback,setFeedback]=useState("");

  const loss=datasetLoss(network,XOR_DATASET);
  const acc=accuracy(network);
  const trace=forwardToyNetwork(network,XOR_DATASET[probe].x);
  const tasks=defs.filter(([,t])=>progress.completedTasks[t]).length;
  const rooms=defs.filter(([id])=>progress.visitedSections.has(id)).length;
  const examUnlocked=tasks===8&&rooms===8;
  const lights=defs.map(([,t])=>!!progress.completedTasks[t]);

  const trainRounds=(rounds:number)=>{
    let current=network;
    for(let e=0;e<rounds;e++){
      for(let i=0;i<XOR_DATASET.length;i+=batch){
        current=trainToyEpoch(current,XOR_DATASET.slice(i,i+batch),lr);
      }
    }
    setNetwork(current);
    setEpochs(v=>v+rounds);
    const nextLoss=datasetLoss(current,XOR_DATASET);
    if(nextLoss<initialLoss*.7||epochs+rounds>=320)progress.completeTask("boss-train-classifier");
  };
  const chooseArch=(i:number,a:BossArch)=>{const next={...archAnswers,[i]:a};setArchAnswers(next);if(archCases.every((c,j)=>next[j]===c.answer))progress.completeTask("boss-architecture");};
  const ship=()=>{const prereqs=defs.slice(0,7).every(([,t])=>progress.completedTasks[t]);if(prereqs){progress.completeTask("boss-ship-checkpoint");setFeedback("Checkpoint shipped. Module 2 exam unlocked after every room has also been visited.");}else setFeedback("Checkpoint blocked: clear the first seven missions before shipping.");};
  const submitExam=()=>{const score=exam.reduce((s,q,i)=>s+(quizAnswers[i]===q.c?1:0),0);const passed=score>=10;progress.saveQuiz(score,passed);setFeedback(passed?`MODULE 2 MASTERED · ${score}/12`:`${score}/12. Need 10/12 for mastery.`);};

  return <main className={styles.root}>
    <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 2 · BOSS LAB</span><h1>Ship a neural network you actually understand.</h1><p>Eight rooms. One real toy classifier. You must wire it, trace it, train it, tune it, stabilize it, protect generalization, choose architectures, and ship the checkpoint before the mastery exam opens.</p></div><div className={styles.console}><b>MISSION CONSOLE</b><div className={styles.lights}>{lights.map((on,i)=><i key={i} className={on?styles.on:""}/>)}</div><strong>{tasks}/8 missions cleared</strong><p>{rooms}/8 rooms inspected · current loss {loss.toFixed(3)}</p></div></section>

    <LessonSection id="wire-network" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-wire-network"]}>MISSION 01 · WIRE THE NETWORK</TaskStamp><h2>Configure the 2→4→1 classifier.</h2><div className={styles.network}><div className={styles.layer}><div className={styles.node}>x₁</div><div className={styles.node}>x₂</div></div><span className={styles.arrow}>→</span><div className={styles.layer}>{Array.from({length:wireWidth},(_,i)=><div className={`${styles.node} ${styles.hidden}`} key={i}>h{i+1}</div>)}</div><span className={styles.arrow}>→</span><div className={styles.layer}><div className={`${styles.node} ${styles.out}`}>ŷ</div></div></div><div className={styles.controls}><div className={styles.control}><label><span>Hidden units</span><b>{wireWidth}</b></label><input type="range" min="2" max="6" value={wireWidth} onChange={e=>setWireWidth(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(wireWidth===4)progress.completeTask("boss-wire-network");}}>Lock architecture</button></div></LessonSection>

    <LessonSection id="forward-probe" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-forward-probe"]}>MISSION 02 · FORWARD TRACE</TaskStamp><h2>Follow one example through the network.</h2><div className={styles.controls}><div className={styles.control}><label><span>Dataset point</span><b>{probe+1}</b></label><input type="range" min="0" max={XOR_DATASET.length-1} value={probe} onChange={e=>setProbe(+e.target.value)}/></div><button className={styles.button} onClick={()=>progress.completeTask("boss-forward-probe")}>Trace forward pass</button></div><div className={styles.stats}><div className={styles.stat}><span>Input</span><b>{XOR_DATASET[probe].x.map(x=>x.toFixed(2)).join(", ")}</b></div><div className={styles.stat}><span>Hidden</span><b>{trace.hiddenA.map(x=>x.toFixed(2)).join(" · ")}</b></div><div className={styles.stat}><span>Output</span><b>{trace.output.toFixed(3)}</b></div></div></LessonSection>

    <LessonSection id="train-classifier" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-train-classifier"]}>MISSION 03 · TRAIN</TaskStamp><h2>Lower real binary cross-entropy.</h2><p>The engine below runs actual mini-batch gradient updates on the same XOR-like BLOOP/ZING dataset used earlier.</p><div className={styles.controls}><button className={styles.button} onClick={()=>trainRounds(40)}>Train 40 epochs</button><button className={styles.button} onClick={()=>{setNetwork(createToyNetwork(42,4));setEpochs(0);}}>Reset weights</button></div><div className={styles.stats}><div className={styles.stat}><span>Initial loss</span><b>{initialLoss.toFixed(3)}</b></div><div className={styles.stat}><span>Current loss</span><b>{loss.toFixed(3)}</b></div><div className={styles.stat}><span>Accuracy</span><b>{Math.round(acc*100)}%</b></div></div><div className={styles.loss}><i style={{width:`${Math.min(100,loss/initialLoss*100)}%`}}/></div></LessonSection>

    <LessonSection id="optimizer-room" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-tune-optimizer"]}>MISSION 04 · OPTIMIZER</TaskStamp><h2>Choose a sane step scale and batch size.</h2><div className={styles.controls}><div className={styles.control}><label><span>Learning rate</span><b>{lr.toFixed(2)}</b></label><input type="range" min=".02" max="1.2" step=".01" value={lr} onChange={e=>setLr(+e.target.value)}/></div><div className={styles.control}><label><span>Batch size</span><b>{batch}</b></label><input type="range" min="1" max="8" step="1" value={batch} onChange={e=>setBatch(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(lr>=.1&&lr<=.5&&batch>=2&&batch<=4)progress.completeTask("boss-tune-optimizer");}}>Validate optimizer</button></div></LessonSection>

    <LessonSection id="gradient-emergency" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-gradient-health"]}>MISSION 05 · GRADIENT EMERGENCY</TaskStamp><h2>Stabilize a deep training run.</h2><p>Scenario: activation statistics drift and rare batches produce gradient norm 180.</p><div className={styles.checklist}><button className={`${styles.check} ${clip?styles.on:""}`} onClick={()=>{const n=!clip;setClip(n);if(n&&normalize)progress.completeTask("boss-gradient-health");}}>Gradient clipping</button><button className={`${styles.check} ${normalize?styles.on:""}`} onClick={()=>{const n=!normalize;setNormalize(n);if(n&&clip)progress.completeTask("boss-gradient-health");}}>Normalization</button><div className={styles.check}>Raw norm: 180</div><div className={styles.check}>Clip threshold: 5</div></div></LessonSection>

    <LessonSection id="generalization-room" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-generalization"]}>MISSION 06 · GENERALIZATION</TaskStamp><h2>Training keeps improving; validation turned upward.</h2><div className={styles.checklist}><button className={`${styles.check} ${dropout?styles.on:""}`} onClick={()=>{const n=!dropout;setDropout(n);if(n&&earlyStop)progress.completeTask("boss-generalization");}}>Add dropout pressure</button><button className={`${styles.check} ${earlyStop?styles.on:""}`} onClick={()=>{const n=!earlyStop;setEarlyStop(n);if(n&&dropout)progress.completeTask("boss-generalization");}}>Restore best validation checkpoint</button></div></LessonSection>

    <LessonSection id="architecture-room" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-architecture"]}>MISSION 07 · ARCHITECTURE</TaskStamp><h2>Match structure to problem.</h2><div className={styles.choiceGrid}>{archCases.map((c,i)=><div className={styles.case} key={c.text}><p>{c.text}</p>{(["mlp","cnn","rnn","lstm","attention","residual"] as BossArch[]).map(a=><button key={a} className={archAnswers[i]===a?(a===c.answer?styles.correct:styles.wrong):""} onClick={()=>chooseArch(i,a)}>{a}</button>)}</div>)}</div></LessonSection>

    <LessonSection id="ship-checkpoint" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["boss-ship-checkpoint"]}>MISSION 08 · SHIP</TaskStamp><h2>Freeze the model state you can defend.</h2><div className={styles.stats}><div className={styles.stat}><span>Epochs</span><b>{epochs}</b></div><div className={styles.stat}><span>Loss</span><b>{loss.toFixed(3)}</b></div><div className={styles.stat}><span>Accuracy</span><b>{Math.round(acc*100)}%</b></div></div><button className={styles.button} onClick={ship}>Ship checkpoint v2.0</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</LessonSection>

    <section className={styles.exam}><h2>Module 2 Mastery Exam</h2>{!examUnlocked?<div className={styles.locked}>Locked: clear 8/8 missions and visit all 8 rooms. Current {tasks}/8 · {rooms}/8.</div>:<>{exam.map((q,i)=><div className={styles.question} key={q.q}><strong>{i+1}. {q.q}</strong>{q.o.map((o,j)=><button key={o} className={quizAnswers[i]===j?styles.selected:""} onClick={()=>setQuizAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div>)}<button className={styles.button} onClick={submitExam}>Submit mastery exam</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</>}<div className={styles.footer}><Link href="/lessons/cnn-rnn-lstm-attention">← Architecture Museum</Link><Link href="/">Course map →</Link></div></section>
  </main>;
}
