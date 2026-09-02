"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { candidatesFor, generate, SamplerConfig, softmax } from "@/lib/toy-language-model";
import styles from "./module-5-capstone.module.css";

type Props={progress:LessonProgressApi};
const questions=[
 ["A logit is…",["A raw model score before probability normalization","A guaranteed fact","A token ID only","An API key"],0],
 ["Softmax primarily…",["Turns scores into a normalized probability distribution","Stores memory","Chooses a database","Counts model parameters"],0],
 ["Greedy decoding selects…",["The highest-probability candidate each step","A random expert","All candidates","The longest word"],0],
 ["Temperature mainly changes…",["The sharpness/flatness of the sampling distribution","The training dataset","The model parameter count","The tokenizer vocabulary"],0],
 ["Autoregressive generation means…",["Generated tokens are fed back into context to predict the next token","All output tokens are produced independently at once","The model searches a website","Weights update after each output token"],0],
 ["A stop sequence is…",["A serving-time condition that can terminate generation","A gradient clipping rule","A training split","A model expert"],0],
 ["Hallucination can occur because…",["The model can produce plausible continuations without an external truth guarantee","Softmax is always broken","Every model is secretly a database","Tokenization removes all facts"],0],
 ["MoE expert routing usually happens…",["Inside one model between expert submodules","Only between separate API providers","Inside the tokenizer","Inside the browser DOM"],0],
 ["System-level model routing chooses…",["Between separate models/endpoints/systems","Which neuron blinks","A train/test row","A BPE merge"],0],
 ["A foundation model is best described as…",["Broadly pretrained and adaptable to many downstream tasks","Always the largest model available","Always a chat model","A vector database"],0],
 ["A reasoning-oriented model/system may trade…",["More test-time compute for quality, increasing latency/cost","Fewer weights for more context automatically","No tokens for more memory","No inference for training"],0],
 ["A thresholded benchmark can make smooth scaling look…",["Abrupt or emergent even when the underlying score changed smoothly","Exactly linear always","Deterministic","Like retrieval"],0],
] as const;

export function Module5CapstoneLesson({progress}:Props){
 const [temp,setTemp]=useState(.8),[topK,setTopK]=useState(5),[topP,setTopP]=useState(.9),[seed,setSeed]=useState(7),[maxTokens,setMaxTokens]=useState(6),[repeat,setRepeat]=useState(1.2);
 const [samplingMoves,setSamplingMoves]=useState(0),[runs,setRuns]=useState<string[]>([]),[stopSeen,setStopSeen]=useState(false),[hallAnswer,setHallAnswer]=useState(""),[routing,setRouting]=useState<Record<number,string>>({}),[families,setFamilies]=useState<string[]>([]),[scale,setScale]=useState(34),[threshold,setThreshold]=useState(70),[scaleMoved,setScaleMoved]=useState(false),[answers,setAnswers]=useState<Record<number,number>>({});
 const [logitTemp,setLogitTemp]=useState(1),[logitTouched,setLogitTouched]=useState(false);
 const raw=[3.2,2.5,2.0,.4]; const labels=[" blue"," clear"," bright"," falling"]; const probs=softmax(raw,logitTemp);
 const config:SamplerConfig={temperature:temp,topK,topP,repetitionPenalty:repeat,seed,mode:"sample"};
 const preview=candidatesFor(["is"],config);
 const latest=runs.at(-1)??"";
 const routingCases=[
  ["Token 'integral' activates Math + Science inside one 8-expert MoE","moe"],
  ["Gateway sends code request to a separate coding model endpoint","model"],
  ["Token 'story' activates Language expert FFN branch","moe"],
  ["Product chooses SLM for classification and larger model for legal analysis","model"],
 ] as const;
 const routingDone=routingCases.every((item,i)=>routing[i]===item[1]);
 const familyCards=[
  {id:"slm",title:"Small language model",copy:"Choose when footprint, latency, local/private deployment or cost matters."},
  {id:"foundation",title:"Foundation model",copy:"Broad pretraining intended to support adaptation across many tasks."},
  {id:"chat",title:"Chat / instruct",copy:"Post-trained behavior optimized toward following instructions and dialogue."},
  {id:"reasoning",title:"Reasoning-oriented",copy:"Spend more test-time compute on deliberation/search/verification when useful."},
 ];
 const score=Math.round(38+Math.log2(scale+1)*7.2); const capability=score>=threshold;
 const tasks=["boss-logits","boss-sampling","boss-autoregressive","boss-stopping","boss-hallucination","boss-routing","boss-model-families","boss-scaling"];
 const sectionIds=["logits","sampling","autoregressive","stopping","hallucination","moe-routing","model-families","scaling"];
 const taskCount=tasks.filter(t=>progress.completedTasks[t]).length; const readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length; const unlocked=taskCount===8&&readCount===8;
 const quizScore=questions.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0); const quizComplete=Object.keys(answers).length===questions.length;

 const runGeneration=()=>{const result=generate(["is"],config,maxTokens,[" because"]);setRuns(current=>[...current.slice(-2),result.text]);if(runs.length>=1)progress.completeTask("boss-autoregressive")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 5 · BOSS LAB</span><h1>Ship a language model without fooling yourself.</h1><p>You are now the decoding engineer. Turn raw scores into probabilities, tune sampling, run an autoregressive loop, stop runaway generation, diagnose hallucination and route work at the correct architectural level.</p><TaskStamp done={taskCount===8}>{taskCount}/8 missions cleared</TaskStamp></div><div className={styles.heroMascots}><AiMascot variant="bot" accent="#69c6ff" mood={taskCount>2?"happy":"thinking"} size={110} label="LOGIT"/><AiMascot variant="star" accent="#ffe05b" mood={taskCount>5?"excited":"happy"} size={105} label="TOKEN"/><AiMascot variant="briefcase" accent="#64d7d0" mood={unlocked?"excited":"thinking"} size={108} label="ROUTER"/></div></section>

  <LessonSection id="logits" onVisit={progress.markVisited} className={styles.scene}><h2>1. Raw scores are not probabilities.</h2><p>The model emits logits. Softmax converts those relative scores into a normalized distribution. Temperature changes the sharpness before softmax; it does not retrain the model.</p><div className={styles.control}><label>Temperature <b>{logitTemp.toFixed(2)}</b></label><input type="range" min="0.25" max="2" step="0.05" value={logitTemp} onChange={e=>{setLogitTemp(+e.target.value);setLogitTouched(true)}}/></div><div className={styles.bars}>{labels.map((label,i)=><div className={styles.bar} key={label}><b>{label.trim()}</b><div className={styles.track}><i style={{width:`${probs[i]*100}%`}}/></div><span>{Math.round(probs[i]*100)}%</span></div>)}</div><button className={styles.button} disabled={!logitTouched} onClick={()=>progress.completeTask("boss-logits")}>Lock logits → softmax</button></LessonSection>

  <LessonSection id="sampling" onVisit={progress.markVisited} className={styles.scene}><h2>2. Build a decoding policy.</h2><div className={styles.grid3}><div className={styles.control}><label>Temperature <b>{temp.toFixed(1)}</b></label><input type="range" min="0.2" max="1.8" step="0.1" value={temp} onChange={e=>{setTemp(+e.target.value);setSamplingMoves(v=>v+1)}}/></div><div className={styles.control}><label>Top-K <b>{topK}</b></label><input type="range" min="1" max="7" value={topK} onChange={e=>{setTopK(+e.target.value);setSamplingMoves(v=>v+1)}}/></div><div className={styles.control}><label>Top-P <b>{topP.toFixed(2)}</b></label><input type="range" min="0.3" max="1" step="0.05" value={topP} onChange={e=>{setTopP(+e.target.value);setSamplingMoves(v=>v+1)}}/></div></div><div className={styles.bars}>{preview.map(item=><div className={styles.bar} key={item.token}><b>{item.token.trim()}</b><div className={styles.track}><i style={{width:`${item.prob*100}%`}}/></div><span>{Math.round(item.prob*100)}%</span></div>)}</div><button className={styles.button} disabled={samplingMoves<4} onClick={()=>progress.completeTask("boss-sampling")}>I shaped the candidate set</button></LessonSection>

  <LessonSection id="autoregressive" onVisit={progress.markVisited} className={styles.scene}><h2>3. Generate one token, feed it back, repeat.</h2><p>Prompt seed: <b>“The sky is”</b>. Every generated token becomes part of the context for the next step.</p><div className={styles.controls}><div className={styles.control}><label>Seed <b>{seed}</b></label><input type="range" min="1" max="30" value={seed} onChange={e=>setSeed(+e.target.value)}/></div><div className={styles.control}><label>Max output <b>{maxTokens}</b></label><input type="range" min="2" max="12" value={maxTokens} onChange={e=>setMaxTokens(+e.target.value)}/></div><button className={styles.button} onClick={runGeneration}>Generate</button></div><div className={styles.output}>The sky is{latest || " …"}</div><p>Run at least twice. With a fixed seed + same config the toy sampler is reproducible. Change the seed or policy and the path can change.</p></LessonSection>

  <LessonSection id="stopping" onVisit={progress.markVisited} className={styles.scene}><h2>4. Control repetition and stopping.</h2><div className={styles.control}><label>Repetition penalty <b>{repeat.toFixed(1)}×</b></label><input type="range" min="1" max="2.4" step="0.1" value={repeat} onChange={e=>setRepeat(+e.target.value)}/></div><div className={styles.grid2}><div className={styles.panel}><b>Max output tokens</b><p>A hard budget cap. It can stop generation even if the model has not produced EOS.</p></div><button className={styles.panel} onClick={()=>{setStopSeen(true);progress.completeTask("boss-stopping")}}><b>Stop token / sequence</b><p>This toy run stops before generating <code> because</code>. Click to acknowledge that stopping is serving logic, not training.</p></button></div>{stopSeen&&<p className={styles.feedback}>✓ You separated decoding controls from learned weights.</p>}</LessonSection>

  <LessonSection id="hallucination" onVisit={progress.markVisited} className={styles.scene}><h2>5. Why can fluent text still be false?</h2><p>Scenario: the model confidently invents a research paper title and citation that never existed. What failed?</p>{[
   ["database","The model forgot to open its hidden internal database."],
   ["generation","The model generated a plausible continuation without a truth guarantee or grounded retrieval."],
   ["temperature","Temperature mathematically forces every claim to be false."],
  ].map(([id,text])=><button key={id} className={`${styles.choice} ${hallAnswer===id?(id==="generation"?styles.correct:styles.wrong):""}`} onClick={()=>{setHallAnswer(id);if(id==="generation")progress.completeTask("boss-hallucination")}}>{text}</button>)}{hallAnswer==="generation"&&<p className={styles.feedback}>✓ Correct. Learned statistical plausibility is not the same thing as verified external truth. Retrieval/tools/evidence can be added around the model.</p>}</LessonSection>

  <LessonSection id="moe-routing" onVisit={progress.markVisited} className={styles.scene}><h2>6. Route at the right level.</h2>{routingCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p><button className={`${styles.button} ${routing[i]==="moe"?(item[1]==="moe"?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...routing,[i]:"moe"};setRouting(next);if(routingCases.every((x,j)=>next[j]===x[1]))progress.completeTask("boss-routing")}}>Inside-model MoE</button> <button className={`${styles.button} ${routing[i]==="model"?(item[1]==="model"?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...routing,[i]:"model"};setRouting(next);if(routingCases.every((x,j)=>next[j]===x[1]))progress.completeTask("boss-routing")}}>System/model routing</button></div>)}{routingDone&&<p className={styles.feedback}>✓ You kept the two routers on different architectural layers.</p>}</LessonSection>

  <LessonSection id="model-families" onVisit={progress.markVisited} className={styles.scene}><h2>7. Pick models by role, not hype.</h2><div className={styles.grid2}>{familyCards.map((card,index)=><button className={styles.panel} key={card.id} onClick={()=>{const next=[...new Set([...families,card.id])];setFamilies(next);if(next.length===4)progress.completeTask("boss-model-families")}}><AiMascot variant={(["tile","briefcase","mail","star"] as const)[index]} accent={(["#8de16f","#61d4cd","#b99cff","#ffe05b"] as const)[index]} mood={families.includes(card.id)?"excited":"thinking"} size={78} label={card.title}/><p>{card.copy}</p></button>)}</div><p>Inspect all four: {families.length}/4.</p></LessonSection>

  <LessonSection id="scaling" onVisit={progress.markVisited} className={styles.scene}><h2>8. Interpret scaling without magical thinking.</h2><div className={styles.controls}><div className={styles.control}><label>Parameters <b>{scale}B</b></label><input type="range" min="1" max="70" value={scale} onChange={e=>{setScale(+e.target.value);setScaleMoved(true)}}/></div><div className={styles.control}><label>Benchmark threshold <b>{threshold}%</b></label><input type="range" min="45" max="85" value={threshold} onChange={e=>{setThreshold(+e.target.value);setScaleMoved(true)}}/></div></div><div className={styles.threshold}><i style={{width:`${score}%`}}/></div><p className={styles.feedback}>Underlying score: <b>{score}%</b> · threshold capability flag: <b>{capability?"YES":"NO"}</b>. Moving the threshold can make a smooth curve appear to “switch on.”</p><button className={styles.button} disabled={!scaleMoved} onClick={()=>progress.completeTask("boss-scaling")}>I understand the threshold effect</button></LessonSection>

  <section className={styles.quiz}><h2>Final Module 5 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Read all eight rooms and clear every mission first. {taskCount}/8 tasks · {readCount}/8 rooms.</div>:<>{questions.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit mastery exam · {quizScore}/12</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=10?"★ MODULE 5 MASTERED — you can now decompose an LLM generation system instead of calling it magic.":"Pass is 10/12. Review logits/sampling/routing and try again."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/model-zoo-routing">← Model Zoo</Link><Link href="/">Learning map →</Link></div>
 </main>
}
