"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./module-7-capstone.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["Pretraining and SFT differ mainly in…",["Dataset/objective format and target behavior, though both use gradient optimization","SFT never changes weights","Pretraining uses no loss","SFT is retrieval"],0],
["Evaluation contamination should be handled…",["Before claiming benchmark generalization","By increasing temperature","By adding more system prompts","Only after deployment"],0],
["Data parallelism is most directly about…",["Replicating model workers over different data/batch shards","Splitting one matrix only","Splitting tokenizer vocabulary","RAG chunking"],0],
["DPO needs…",["Preference pairs such as chosen/rejected outputs","Only next-token crawl data","Only tool traces","Only GPU topology"],0],
["QLoRA is useful when…",["You want parameter-efficient adaptation around a quantized frozen base under memory constraints","You need to pretrain from scratch","You need a vector DB","You need a bigger context window"],0],
["Catastrophic forgetting is detected by…",["Testing retained old capabilities after new training","Only training loss","Only model size","Only token count"],0],
["Distillation usually targets…",["A smaller/student model that imitates useful teacher behavior","A larger tokenizer","A vector index","A prompt cache"],0],
["Model merging always preserves both parents perfectly.",["True","False"],1],
["Checkpoints are useful for…",["Resume, rollback, evaluation and later post-training","Only rendering UI","Only prompt injection","Only tokenization"],0],
["QAT differs from naive post-training quantization because…",["Training accounts for simulated quantization effects","It uses no weights","It is only RAG","It changes system prompts"],0],
["Reward optimization can fail when…",["The reward proxy is imperfect and the policy exploits it","The model has a tokenizer","The output is JSON","The batch is shuffled"],0],
["The best post-training method depends on…",["Available supervision, desired behavior, compute/memory and evaluation targets","A single universal winner","Only parameter count","Only model provider"],0],
] as const;

export function Module7CapstoneLesson({progress}:Props){
 const [data,setData]=useState<Record<string,boolean>>({}),[prob,setProb]=useState(.2),[cluster,setCluster]=useState<Record<number,string>>({}),[sft,setSft]=useState<string[]>([]),[pref,setPref]=useState(""),[peft,setPeft]=useState(""),[newTrain,setNewTrain]=useState(0),[retention,setRetention]=useState(0),[ship,setShip]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const taskIds=["m7-data","m7-objective","m7-cluster","m7-sft","m7-preferences","m7-peft","m7-retain","m7-ship"];
 const sectionIds=["data","objective","cluster","sft","preferences","peft","retain","ship"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===8&&readCount===8;
 const loss=-Math.log(Math.max(.001,prob));
 const oldSkill=Math.max(22,94-newTrain*.65+retention*.45),newSkill=Math.min(97,42+newTrain*.58);
 const clusterCases=[
  ["Different batches, same replicated model","data"],
  ["Split one huge tensor/matmul across devices","tensor"],
  ["Early layers on stage A, later layers on stage B","pipeline"],
 ] as const;
 const clusterDone=clusterCases.every((x,i)=>cluster[i]===x[1]);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 7 · BOSS LAB</span><h1>Take one model from raw corpus to shippable checkpoint.</h1><p>Every room changes a different part of the lifecycle. Your job is to stop using “training” as one fuzzy word and choose the correct data, objective, distributed strategy and adaptation method at each stage.</p><TaskStamp done={taskCount===8}>{taskCount}/8 control-room missions cleared</TaskStamp></div><div className={styles.controlRoom}><AiMascot variant="briefcase" accent="#68d8d0" mood={taskCount>1?"happy":"thinking"} size={105} label="DATA"/><AiMascot variant="star" accent="#ffe05b" mood={taskCount>4?"happy":"thinking"} size={105} label="TRAIN"/><AiMascot variant="tile" accent="#91e575" mood={taskCount===8?"excited":"happy"} size={105} label="SHIP"/></div></section>

  <LessonSection id="data" onVisit={progress.markVisited} className={styles.scene}><h2>1. Sanitize the corpus before optimization.</h2><p>Mark each item KEEP or REMOVE.</p>{[
   ["clean","Clean technical documentation","keep"],
   ["duplicate","50 exact copies of the same article","remove"],
   ["benchmark","Held-out benchmark answer key","remove"],
   ["spam","SEO keyword spam page","remove"],
  ].map(([id,text,correct])=><div className={styles.panel} key={id}><p>{text}</p>{["keep","remove"].map(choice=><button key={choice} className={`${styles.button} ${data[id]!==undefined&&((data[id]&&choice==="keep")||(!data[id]&&choice==="remove"))?(((data[id]?"keep":"remove")===correct)?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...data,[id]:choice==="keep"};setData(next);const good=next.clean===true&&next.duplicate===false&&next.benchmark===false&&next.spam===false;if(good)progress.completeTask("m7-data")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="objective" onVisit={progress.markVisited} className={styles.scene}><h2>2. Lower predictive cross-entropy.</h2><div className={styles.control}><label>Probability on correct next token <b>{Math.round(prob*100)}%</b></label><input type="range" min="0.02" max="0.98" step="0.02" value={prob} onChange={e=>{setProb(+e.target.value);if(+e.target.value>.8)progress.completeTask("m7-objective")}}/></div><div className={styles.meter}><i style={{width:`${Math.min(100,loss/4*100)}%`}}/></div><p>Loss = -log(p_target) = <b>{loss.toFixed(3)}</b>. Pretraining still means gradients update weights to reduce a predictive objective at enormous scale.</p></LessonSection>

  <LessonSection id="cluster" onVisit={progress.markVisited} className={styles.scene}><h2>3. Map the training job onto hardware.</h2>{clusterCases.map((item,i)=><div className={styles.panel} key={item[0]}><p>{item[0]}</p>{["data","tensor","pipeline"].map(choice=><button key={choice} className={`${styles.button} ${cluster[i]===choice?(choice===item[1]?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...cluster,[i]:choice};setCluster(next);if(clusterCases.every((x,j)=>next[j]===x[1]))progress.completeTask("m7-cluster")}}>{choice}</button>)}</div>)}{clusterDone&&<p className={styles.feedback}>✓ Real large training often combines several parallelism dimensions.</p>}</LessonSection>

  <LessonSection id="sft" onVisit={progress.markVisited} className={styles.scene}><h2>4. Turn the base checkpoint into an instruction follower.</h2><div className={styles.grid3}>{[
   ["json","Extract customer info → exact JSON target"],
   ["summary","Summarize document → concise bullet target"],
   ["safe","Credential request → safe boundary-preserving target"],
  ].map(([id,text])=><button className={`${styles.panel} ${sft.includes(id)?styles.correct:""}`} key={id} onClick={()=>{const next=[...new Set([...sft,id])];setSft(next);if(next.length===3)progress.completeTask("m7-sft")}}><b>DEMONSTRATION</b><p>{text}</p></button>)}</div><p>SFT uses supervised target responses. It is not the same data shape as preference pairs.</p></LessonSection>

  <LessonSection id="preferences" onVisit={progress.markVisited} className={styles.scene}><h2>5. You have chosen/rejected pairs. Which tool matches?</h2>{[["sft","SFT only — ignore which response was preferred"],["dpo","DPO-style preference optimization"],["pretrain","Restart pretraining from scratch"]].map(([id,text])=><button key={id} className={`${styles.choice} ${pref===id?(id==="dpo"?styles.correct:styles.wrong):""}`} onClick={()=>{setPref(id);if(id==="dpo")progress.completeTask("m7-preferences")}}>{text}</button>)}</LessonSection>

  <LessonSection id="peft" onVisit={progress.markVisited} className={styles.scene}><h2>6. One GPU, limited memory, domain adaptation needed.</h2>{[["full","Full-precision full fine-tune every base parameter"],["qlora","Quantized frozen base + LoRA adapters / QLoRA-style approach"],["nothing","No adaptation is ever possible"]].map(([id,text])=><button key={id} className={`${styles.choice} ${peft===id?(id==="qlora"?styles.correct:styles.wrong):""}`} onClick={()=>{setPeft(id);if(id==="qlora")progress.completeTask("m7-peft")}}>{text}</button>)}</LessonSection>

  <LessonSection id="retain" onVisit={progress.markVisited} className={styles.scene}><h2>7. Improve the new domain without deleting the old one.</h2><div className={styles.grid2}><div className={styles.control}><label>New-domain training <b>{newTrain}%</b></label><input type="range" min="0" max="100" value={newTrain} onChange={e=>setNewTrain(+e.target.value)}/></div><div className={styles.control}><label>Replay/retention mix <b>{retention}%</b></label><input type="range" min="0" max="100" value={retention} onChange={e=>{setRetention(+e.target.value);if(newTrain>65&&+e.target.value>35)progress.completeTask("m7-retain")}}/></div></div><div className={styles.grid2}><div className={styles.panel}><b>Old capability</b><div className={styles.meter}><i style={{width:`${oldSkill}%`}}/></div><p>{Math.round(oldSkill)}%</p></div><div className={styles.panel}><b>New domain</b><div className={styles.meter}><i style={{width:`${newSkill}%`}}/></div><p>{Math.round(newSkill)}%</p></div></div>{newTrain>65&&retention<15&&<p className={styles.warning}>You caused catastrophic forgetting. Training loss on the new domain alone would not reveal this.</p>}</LessonSection>

  <LessonSection id="ship" onVisit={progress.markVisited} className={styles.scene}><h2>8. Which artifact do you ship?</h2><div className={styles.pipeline}><span className={styles.node}>clean corpus</span><span className={styles.arrow}>→</span><span className={styles.node}>pretrained checkpoint</span><span className={styles.arrow}>→</span><span className={styles.node}>SFT/preferences</span><span className={styles.arrow}>→</span><span className={styles.node}>PEFT/merge/distill</span></div>{[["training","The latest checkpoint with no held-out evaluation"],["evaluated","An evaluated checkpoint/artifact that meets target capability, safety, retention and deployment constraints"],["largest","Whichever checkpoint has the most parameters"]].map(([id,text])=><button key={id} className={`${styles.choice} ${ship===id?(id==="evaluated"?styles.correct:styles.wrong):""}`} onClick={()=>{setShip(id);if(id==="evaluated")progress.completeTask("m7-ship")}}>{text}</button>)}</LessonSection>

  <section className={styles.quiz}><h2>Module 7 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Clear all eight lifecycle missions. {taskCount}/8 tasks · {readCount}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit mastery exam · {quizScore}/12</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=10?"★ MODULE 7 MASTERED — you can now separate pretraining, post-training, PEFT and model-compression choices.":"Pass is 10/12. Review the lifecycle."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/efficient-adaptation">← Efficient Adaptation</Link><Link href="/">Learning map →</Link></div>
 </main>
}
