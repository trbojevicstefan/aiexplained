"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ArchitectureChoice, cases, clamp, defs, quiz } from "./residual-mlp-data";
import styles from "./residual-mlp.module.css";

type Props={progress:LessonProgressApi};

export function ResidualMlpLesson({progress}:Props){
  const [width,setWidth]=useState(4);
  const [depth,setDepth]=useState(3);
  const [plainFactor,setPlainFactor]=useState(.82);
  const [residualScale,setResidualScale]=useState(.18);
  const [builtResidual,setBuiltResidual]=useState(false);
  const [seenInfo,setSeenInfo]=useState<string[]>([]);
  const [seenGrad,setSeenGrad]=useState<string[]>([]);
  const [limitAnswers,setLimitAnswers]=useState<Record<number,boolean>>({});
  const [archAnswers,setArchAnswers]=useState<Record<number,ArchitectureChoice>>({});
  const [explanation,setExplanation]=useState("");
  const [feedback,setFeedback]=useState("");
  const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
  const [quizFeedback,setQuizFeedback]=useState("");

  const parameterProxy=(width*width*Math.max(1,depth-1))+width*3;
  const plainSignal=plainFactor**depth;
  const residualSignal=(1+residualScale)**depth;
  const plainGradient=plainFactor**depth;
  const residualGradient=(1+residualScale*.35)**depth;
  const tasks=defs.filter(([,task])=>progress.completedTasks[task]).length;
  const rooms=defs.filter(([id])=>progress.visitedSections.has(id)).length;
  const unlocked=tasks===9&&rooms===9;
  const depthCopy={simple:"An MLP passes information through dense layers. A residual connection adds a shortcut so a block can learn a correction instead of rebuilding the whole signal.",real:"Dense MLPs compose affine transformations and nonlinearities. Residual blocks compute x + F(x), creating a direct identity path that can make very deep networks easier to optimize.",expert:"Residual parameterization changes the optimization geometry by expressing blocks as perturbations around identity. The skip path contributes an additive Jacobian term, improving signal and gradient transport through deep compositions."} as const;

  const seeInfo=(kind:string)=>{const next=seenInfo.includes(kind)?seenInfo:[...seenInfo,kind];setSeenInfo(next);if(next.length===2)progress.completeTask("compare-information-paths");};
  const seeGrad=(kind:string)=>{const next=seenGrad.includes(kind)?seenGrad:[...seenGrad,kind];setSeenGrad(next);if(next.length===2)progress.completeTask("compare-gradient-paths");};
  const chooseLimit=(i:number,a:boolean)=>{const expected=[false,false,true,true];const next={...limitAnswers,[i]:a};setLimitAnswers(next);if(expected.every((v,j)=>next[j]===v))progress.completeTask("diagnose-residual-limits");};
  const chooseArch=(i:number,a:ArchitectureChoice)=>{const next={...archAnswers,[i]:a};setArchAnswers(next);if(cases.every((c,j)=>next[j]===c.answer))progress.completeTask("choose-architecture");};
  const explain=()=>{const t=explanation.toLowerCase();const hits=["dense","mlp","identity","skip","gradient","residual","correction","depth"].filter(k=>t.includes(k));if(explanation.trim().length<100||hits.length<4){setFeedback("Explain both pieces: what a dense MLP does, and why x + F(x) changes information/gradient paths in deep stacks.");return;}setFeedback("Strong. You explained residuals as a parameterization and path, not as a magic extra wire.");progress.completeTask("explain-residual");};
  const submitQuiz=()=>{const score=quiz.reduce((s,q,i)=>s+(quizAnswers[i]===q.c?1:0),0);const passed=score>=6;progress.saveQuiz(score,passed);setQuizFeedback(passed?`Passed ${score}/7.`:`${score}/7. Need 6/7.`);};

  return <main className={styles.root}>
    <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 2 · DEEP NETWORK BRIDGE</span><h1>Make depth easier to cross.</h1><p>{depthCopy[progress.depth]}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.bridge}><small>PLAIN PATH</small><div className={styles.bridgeRow}>{[1,2,3,4,5].map(n=><div key={n} className={styles.block}>F{n}</div>)}</div><small>RESIDUAL PATH</small><div className={styles.skip}/><div className={styles.bridgeRow}>{[1,2,3,4,5].map(n=><div key={n} className={styles.block}>F{n}</div>)}</div></div></section>

    <LessonSection id="dense-anatomy" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["build-dense-mlp"]}>01 · DENSE MLP</TaskStamp><h2>Build a fully connected stack.</h2><p>Each hidden unit receives learned influence from all units in the previous dense layer.</p><div className={styles.network}>{Array.from({length:depth+2},(_,i)=><div key={i} className={styles.layer}><b>{i===0?"INPUT":i===depth+1?"OUTPUT":`H${i}`}</b><div className={styles.neurons}>{Array.from({length:i===0?2:i===depth+1?1:Math.min(width,8)},(_,j)=><i key={j}/>)}</div></div>)}</div><button className={styles.button} onClick={()=>progress.completeTask("build-dense-mlp")}>Confirm dense connectivity</button></LessonSection>

    <LessonSection id="width-depth" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["explore-width-depth"]}>02 · WIDTH VS DEPTH</TaskStamp><h2>Two different ways to add capacity.</h2><div className={styles.controls}><div className={styles.control}><label><span>Width</span><b>{width}</b></label><input type="range" min="2" max="16" value={width} onChange={e=>setWidth(+e.target.value)}/></div><div className={styles.control}><label><span>Depth</span><b>{depth}</b></label><input type="range" min="1" max="16" value={depth} onChange={e=>setDepth(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(width>=8&&depth>=6)progress.completeTask("explore-width-depth");}}>Measure architecture</button></div><div className={styles.stats}><div className={styles.stat}><span>Width</span><b>{width}</b></div><div className={styles.stat}><span>Depth</span><b>{depth}</b></div><div className={styles.stat}><span>Parameter proxy</span><b>{parameterProxy}</b></div></div></LessonSection>

    <LessonSection id="plain-chain" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["stress-plain-stack"]}>03 · PLAIN DEEP CHAIN</TaskStamp><h2>Force every signal through every block.</h2><div className={styles.controls}><div className={styles.control}><label><span>Depth</span><b>{depth}</b></label><input type="range" min="2" max="30" value={depth} onChange={e=>setDepth(+e.target.value)}/></div><div className={styles.control}><label><span>Per-block signal factor</span><b>{plainFactor.toFixed(2)}</b></label><input type="range" min=".45" max=".98" step=".01" value={plainFactor} onChange={e=>setPlainFactor(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(depth>=16&&plainSignal<.08)progress.completeTask("stress-plain-stack");}}>Stress stack</button></div><div className={styles.formula}>{plainFactor.toFixed(2)}^{depth} = <b>{plainSignal.toExponential(2)}</b></div></LessonSection>

    <LessonSection id="residual-block" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["build-residual-block"]}>04 · RESIDUAL BLOCK</TaskStamp><h2>Add the identity shortcut.</h2><p>The block output becomes <b>y = x + F(x)</b>. If F(x) is small, the block can stay close to identity.</p><div className={styles.controls}><div className={styles.control}><label><span>Residual correction scale</span><b>{residualScale.toFixed(2)}</b></label><input type="range" min="0" max=".8" step=".02" value={residualScale} onChange={e=>setResidualScale(+e.target.value)}/></div><button className={styles.button} onClick={()=>{setBuiltResidual(true);progress.completeTask("build-residual-block");}}>Connect x → +</button></div>{builtResidual&&<div className={styles.formula}>input x ─────────────┐<br/>input x → F(x) → + → output<br/>                     └ identity path</div>}</LessonSection>

    <LessonSection id="information-path" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-information-paths"]}>05 · INFORMATION PATH</TaskStamp><h2>Compare what survives depth.</h2><div className={styles.controls}><button className={styles.button} onClick={()=>seeInfo("plain")}>Inspect plain stack</button><button className={styles.button} onClick={()=>seeInfo("residual")}>Inspect residual stack</button></div><div className={styles.stats}><div className={styles.stat}><span>Plain signal</span><b>{clamp(plainSignal,0,9).toFixed(3)}</b></div><div className={styles.stat}><span>Residual-path proxy</span><b>{clamp(residualSignal,0,99).toFixed(3)}</b></div><div className={styles.stat}><span>Identity path</span><b>{builtResidual?"OPEN":"closed"}</b></div></div></LessonSection>

    <LessonSection id="gradient-path" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-gradient-paths"]}>06 · GRADIENT PATH</TaskStamp><h2>The shortcut also exists backward.</h2><p>In a simplified residual Jacobian, the identity term contributes a direct additive route instead of making the gradient depend only on a long product of transformations.</p><div className={styles.controls}><button className={styles.button} onClick={()=>seeGrad("plain")}>Backprop plain</button><button className={styles.button} onClick={()=>seeGrad("residual")}>Backprop residual</button></div><div className={styles.stats}><div className={styles.stat}><span>Plain proxy</span><b>{plainGradient.toExponential(2)}</b></div><div className={styles.stat}><span>Residual proxy</span><b>{residualGradient.toFixed(3)}</b></div><div className={styles.stat}><span>Depth</span><b>{depth}</b></div></div></LessonSection>

    <LessonSection id="residual-limits" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["diagnose-residual-limits"]}>07 · LIMITS</TaskStamp><h2>Residuals help optimization. They do not solve everything.</h2><div className={styles.choiceGrid}>{["Residuals eliminate the need for good data.","Residuals guarantee zero overfitting.","Residuals can improve gradient/information paths in deep stacks.","Residual blocks can approximate identity if F(x) is small."].map((text,i)=><div className={styles.case} key={text}><p>{text}</p><button className={limitAnswers[i]===true?(i>=2?styles.correct:styles.wrong):""} onClick={()=>chooseLimit(i,true)}>True</button><button className={limitAnswers[i]===false?(i<2?styles.correct:styles.wrong):""} onClick={()=>chooseLimit(i,false)}>False</button></div>)}</div></LessonSection>

    <LessonSection id="architecture-choice" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["choose-architecture"]}>08 · ARCHITECTURE CHOICE</TaskStamp><h2>Use the simplest structure that fits the job.</h2><div className={styles.choiceGrid}>{cases.map((c,i)=><div key={c.text} className={styles.case}><p>{c.text}</p>{(["mlp","residual"] as ArchitectureChoice[]).map(a=><button key={a} className={archAnswers[i]===a?(a===c.answer?styles.correct:styles.wrong):""} onClick={()=>chooseArch(i,a)}>{a}</button>)}</div>)}</div></LessonSection>

    <LessonSection id="explain-residual" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><TaskStamp done={!!progress.completedTasks["explain-residual"]}>09 · EXPLAIN IT BACK</TaskStamp><h2>Why does x + F(x) help a deep network?</h2><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="A dense MLP... A residual block..."/><button className={styles.button} onClick={explain}>Check explanation</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</LessonSection>

    <section className={styles.quiz}><h2>Residual & MLP Check</h2>{!unlocked?<div className={styles.locked}>Locked: {tasks}/9 tasks · {rooms}/9 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q.q}><strong>{i+1}. {q.q}</strong>{q.o.map((o,j)=><button key={o} className={quizAnswers[i]===j?styles.selected:""} onClick={()=>setQuizAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div>)}<button className={styles.button} onClick={submitQuiz}>Submit quiz</button>{quizFeedback&&<div className={styles.feedback}>{quizFeedback}</div>}</>}<div className={styles.footer}><Link href="/lessons/regularization-dropout">← Regularization</Link><Link href="/">Course map →</Link></div></section>
  </main>;
}
