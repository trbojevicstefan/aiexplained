"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./search-verification-lab.module.css";

type Props={progress:LessonProgressApi};
const quiz=[
["A process reward model (PRM) scores…",["Intermediate reasoning/solution steps or trajectories","Only final answers","Only tokens by frequency","Only model size"],0],
["An outcome reward model (ORM) scores…",["Final outcomes/answers rather than every intermediate step","Only hidden layers","Only tool calls","Only prompts"],0],
["Tree search helps by…",["Exploring multiple branches and pruning/selecting promising paths","Changing pretrained weights","Extending tokenizer vocabulary","Caching PDFs"],0],
["Best-of-N means…",["Generate N candidates then select/score among them","Train N models from scratch","Use N GPUs only","Use N prompts as memory"],0],
["Majority voting can fail when…",["Most candidates share the same systematic error","The answer is popular","There are multiple GPUs","The context is short"],0],
["Self-consistency typically…",["Samples multiple reasoning paths and aggregates answers","Updates model weights online","Creates a vector DB","Requires an agent tool"],0],
["Reasoning vs memorization is hard to distinguish from…",["A single correct answer without controlled evaluation or novel variants","A training log","A GPU metric","A JSON schema"],0],
["A verifier is only useful when…",["Its signal correlates with the actual property we care about","It always agrees with the generator","It rewards length","It sees no criteria"],0],
] as const;
const memoryCases=[
{text:"Exact famous riddle repeated verbatim from a benchmark; model answers instantly.",answer:"uncertain"},
{text:"Novel arithmetic values generated after training, with intermediate result checked by calculator.",answer:"evidence-reasoning"},
{text:"Model recites a known quote word-for-word.",answer:"memorization-likely"},
] as const;
const verifierCases=[
{text:"Verifier rewards answers that pass unit tests and schema constraints.",answer:"good"},
{text:"Verifier gives +1 for longer answers, but task quality is unrelated to length.",answer:"bad"},
{text:"Verifier checks exact arithmetic against a calculator result.",answer:"good"},
{text:"Verifier is the same generator asked “is this good?” with no external criteria.",answer:"weak"},
] as const;

export function SearchVerificationLabLesson({progress}:Props){
 const [rewardMode,setRewardMode]=useState<"prm"|"orm">("orm"),[rewardSeen,setRewardSeen]=useState<string[]>([]),[depth,setDepth]=useState(1),[branch,setBranch]=useState(""),[totSteps,setTotSteps]=useState<string[]>([]),[bestN,setBestN]=useState(1),[bestTouched,setBestTouched]=useState(false),[voteCount,setVoteCount]=useState(3),[majoritySeen,setMajoritySeen]=useState(false),[consistency,setConsistency]=useState(1),[memory,setMemory]=useState<Record<number,string>>({}),[verifier,setVerifier]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[explainFeedback,setExplainFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const taskIds=["verify-prm-orm","verify-tree-search","verify-tot","verify-best-n","verify-majority","verify-self-consistency","verify-memorization","verify-failure","verify-explain"];
 const sectionIds=["prm-orm","tree-search","tree-thoughts","best-of-n","majority","self-consistency","memorization","verifier-failure","explain"];
 const taskCount=taskIds.filter(id=>progress.completedTasks[id]).length,readCount=sectionIds.filter(id=>progress.visitedSections.has(id)).length,unlocked=taskCount===9&&readCount===9;
 const candidateScores=useMemo(()=>Array.from({length:Math.min(12,bestN)},(_,i)=>Math.round(48+((i*37+bestN*11)%47))),[bestN]);
 const bestScore=Math.max(...candidateScores);
 const votes=useMemo(()=>Array.from({length:voteCount},(_,i)=>["42","42","41","42","39"][i%5]),[voteCount]);
 const vote42=votes.filter(v=>v==="42").length;
 const selfAnswers=useMemo(()=>Array.from({length:consistency},(_,i)=>i%5===3?"17":"18"),[consistency]);
 const self18=selfAnswers.filter(v=>v==="18").length;
 const memoryDone=memoryCases.every((x,i)=>memory[i]===x.answer),verifierDone=verifierCases.every((x,i)=>verifier[i]===x.answer);
 const quizScore=quiz.reduce((s,q,i)=>s+(answers[i]===q[2]?1:0),0),quizComplete=Object.keys(answers).length===quiz.length;
 const markSeen=(value:string,current:string[],setter:(v:string[])=>void,need:number,task:string)=>{const next=[...new Set([...current,value])];setter(next);if(next.length>=need)progress.completeTask(task)};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["search","branch","prm","orm","candidate","verify","majority","consistency"].filter(w=>t.includes(w)).length;if(explain.length<90||hits<4){setExplainFeedback("Go deeper: explain search branches, PRM vs ORM, Best-of-N/aggregation and why verifier quality matters.");return;}setExplainFeedback("Strong. You separated generating more candidate computation from the mechanism used to score/select it.");progress.completeTask("verify-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 8 · SEARCH & VERIFICATION</span><h1>More candidates only help if you can tell good from bad.</h1><p>Search expands possibilities. Reward/process signals guide paths. Verifiers choose or reject candidates. Majority voting and self-consistency aggregate samples — but none of these techniques are stronger than the signal used to judge success.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={taskCount===9}>{taskCount}/9 verification missions complete</TaskStamp></div><div className={styles.stage}><AiMascot variant="briefcase" accent="#6ed8d1" mood={depth>2?"excited":"thinking"} size={102} label="SEARCH"/><AiMascot variant="star" accent="#ffe05b" mood={verifierDone?"excited":"happy"} size={102} label="JUDGE"/><AiMascot variant="mail" accent="#ad90ff" mood={consistency>4?"happy":"thinking"} size={98} label="VOTE"/></div></section>

  <LessonSection id="prm-orm" onVisit={progress.markVisited} className={styles.scene}><h2>1. Score the path or only the destination?</h2><div className={styles.grid2}>{(["prm","orm"] as const).map(mode=><button key={mode} className={`${styles.panel} ${rewardMode===mode?styles.correct:""}`} onClick={()=>{setRewardMode(mode);markSeen(mode,rewardSeen,setRewardSeen,2,"verify-prm-orm")}}><b>{mode.toUpperCase()}</b><p>{mode==="prm"?"Process reward: score intermediate steps/trajectory quality.":"Outcome reward: score the final answer/result."}</p></button>)}</div><div className={styles.equation}>{rewardMode==="prm"?"step 1: +0.8\nstep 2: +0.6\nstep 3: -0.7 ← bad turn detected early\nfinal path score: low":"final answer passes exact checker: +1\n(no direct supervision on which intermediate step was strong or weak)"}</div></LessonSection>

  <LessonSection id="tree-search" onVisit={progress.markVisited} className={styles.scene}><h2>2. Search a tree instead of betting on one path.</h2><div className={styles.control}><label>Search depth <b>{depth}</b></label><input type="range" min="1" max="5" value={depth} onChange={e=>{setDepth(+e.target.value);if(+e.target.value>=4)progress.completeTask("verify-tree-search")}}/></div><div className={styles.tree}>{[
   ["A","Direct shortcut",depth>=2?"bad":""],["B","Decompose constraints",depth>=3?"good":""],["C","Guess from pattern",depth>=2?"bad":""],["D","Search then verify",depth>=4?"good":""],
  ].map(([id,text,state])=><div key={id} className={`${styles.node} ${state==="good"?styles.good:state==="bad"?styles.bad:""}`}><b>Branch {id}</b><p>{text}</p><small>{depth>=4&&id==="D"?"verified leaf":"candidate"}</small></div>)}</div><p>Search budget creates branches; scoring/pruning decides where to spend the next unit of compute.</p></LessonSection>

  <LessonSection id="tree-thoughts" onVisit={progress.markVisited} className={styles.scene}><h2>3. Tree-of-Thoughts intuition: propose → evaluate → expand/prune.</h2><div className={styles.grid3}>{[
   ["propose","PROPOSE","Generate several higher-level candidate moves."],
   ["evaluate","EVALUATE","Score candidates against constraints or a heuristic."],
   ["expand","EXPAND / PRUNE","Continue promising branches; stop weak ones."],
  ].map(([id,title,copy])=><button className={`${styles.panel} ${totSteps.includes(id)?styles.correct:""}`} key={id} onClick={()=>markSeen(id,totSteps,setTotSteps,3,"verify-tot")}><b>{title}</b><p>{copy}</p></button>)}</div><p>This is a search pattern, not a claim that a model literally has human “thought bubbles.”</p></LessonSection>

  <LessonSection id="best-of-n" onVisit={progress.markVisited} className={styles.scene}><h2>4. Best-of-N: buy more lottery tickets, then use a judge.</h2><div className={styles.control}><label>Candidates N <b>{bestN}</b></label><input type="range" min="1" max="12" value={bestN} onChange={e=>{setBestN(+e.target.value);setBestTouched(true);if(+e.target.value>=6)progress.completeTask("verify-best-n")}}/></div><div className={styles.votes}>{candidateScores.map((score,i)=><span className={styles.vote} key={i}>#{i+1} · {score}</span>)}</div><p>Best verifier score available: <b>{bestScore}</b>. Compute/cost scales roughly with more candidate generation + judging. Best-of-N is only as good as the selector.</p>{bestTouched&&<p className={styles.feedback}>Candidate diversity can improve the ceiling; it does not guarantee the selector identifies truth.</p>}</LessonSection>

  <LessonSection id="majority" onVisit={progress.markVisited} className={styles.scene}><h2>5. Majority vote: agreement is evidence, not proof.</h2><div className={styles.control}><label>Sampled answers <b>{voteCount}</b></label><input type="range" min="3" max="15" value={voteCount} onChange={e=>{setVoteCount(+e.target.value);setMajoritySeen(true);if(+e.target.value>=9)progress.completeTask("verify-majority")}}/></div><div className={styles.votes}>{votes.map((v,i)=><span className={styles.vote} key={i}>{v}</span>)}</div><p>Answer 42 receives {vote42}/{voteCount} votes. If all samples inherit the same misconception, majority can confidently select the wrong answer.</p></LessonSection>

  <LessonSection id="self-consistency" onVisit={progress.markVisited} className={styles.scene}><h2>6. Self-consistency: sample diverse solution paths, aggregate final answers.</h2><div className={styles.control}><label>Reasoning paths sampled <b>{consistency}</b></label><input type="range" min="1" max="12" value={consistency} onChange={e=>{setConsistency(+e.target.value);if(+e.target.value>=7)progress.completeTask("verify-self-consistency")}}/></div><div className={styles.votes}>{selfAnswers.map((v,i)=><span className={styles.vote} key={i}>path {i+1} → {v}</span>)}</div><p>18 receives {self18}/{consistency} paths. This can improve some reasoning tasks, but adds sampling cost and is not the same as checking against an external ground truth.</p></LessonSection>

  <LessonSection id="memorization" onVisit={progress.markVisited} className={styles.scene}><h2>7. Correct answer ≠ proof of reasoning.</h2>{memoryCases.map((item,i)=><div className={styles.panel} key={item.text}><p>{item.text}</p>{["memorization-likely","evidence-reasoning","uncertain"].map(choice=><button key={choice} className={`${styles.button} ${memory[i]===choice?(choice===item.answer?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...memory,[i]:choice};setMemory(next);if(memoryCases.every((x,j)=>next[j]===x.answer))progress.completeTask("verify-memorization")}}>{choice}</button>)}</div>)}{memoryDone&&<p className={styles.feedback}>✓ Distinguishing reasoning from memorization needs controlled evaluation: novel variants, held-out tasks, intervention and verification — not vibes from one answer.</p>}</LessonSection>

  <LessonSection id="verifier-failure" onVisit={progress.markVisited} className={styles.scene}><h2>8. The verifier can become the new failure point.</h2>{verifierCases.map((item,i)=><div className={styles.panel} key={item.text}><p>{item.text}</p>{["good","weak","bad"].map(choice=><button key={choice} className={`${styles.button} ${verifier[i]===choice?(choice===item.answer?styles.correct:styles.wrong):""}`} onClick={()=>{const next={...verifier,[i]:choice};setVerifier(next);if(verifierCases.every((x,j)=>next[j]===x.answer))progress.completeTask("verify-failure")}}>{choice}</button>)}</div>)}{verifierDone&&<p className={styles.warning}>Optimization pressure follows the metric. A bad proxy can reward wrong behavior extremely efficiently.</p>}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>9. Explain search + verification back.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain PRM vs ORM, tree search, Best-of-N, majority/self-consistency and why verifier quality matters."/><button className={styles.button} onClick={submitExplain}>Check explanation</button>{explainFeedback&&<p className={styles.feedback}>{explainFeedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Search & Verification quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all nine labs. {taskCount}/9 tasks · {readCount}/9 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(current=>({...current,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.button} disabled={!quizComplete} onClick={()=>progress.saveQuiz(quizScore,quizScore>=7)}>Submit · {quizScore}/8</button>{quizComplete&&<p className={styles.feedback}>{quizScore>=7?"★ SEARCH & VERIFICATION MASTERED":"Pass is 7/8. Review reward and verifier signals."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/reasoning-solver-arena">← Solver Arena</Link><Link href="/lessons/module-8-capstone">Module 8 Boss Lab →</Link></div>
 </main>
}
