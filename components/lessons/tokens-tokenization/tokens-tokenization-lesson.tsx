"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { TokenMode, defs, myths, quiz, tokenId, tokenize, tokenizerA, tokenizerB } from "./tokenizer-data";
import styles from "./tokens-tokenization.module.css";

type Props={progress:LessonProgressApi};
const bpeStates=[["l","o","w","e","r"],["lo","w","e","r"],["low","e","r"],["low","er"],["lower"]];

export function TokensTokenizationLesson({progress}:Props){
  const [text,setText]=useState("Artificial intelligence is unbelievable!");
  const [mode,setMode]=useState<TokenMode>("subword");
  const [seenModes,setSeenModes]=useState<TokenMode[]>([]);
  const [showIds,setShowIds]=useState(false);
  const [special,setSpecial]=useState(false);
  const [bpeStep,setBpeStep]=useState(0);
  const [compareText,setCompareText]=useState("Artificial intelligence needs tokenization.");
  const [compared,setCompared]=useState(false);
  const [limit,setLimit]=useState(8);
  const [mythAnswers,setMythAnswers]=useState<Record<number,boolean>>({});
  const [explanation,setExplanation]=useState("");
  const [feedback,setFeedback]=useState("");
  const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
  const [quizFeedback,setQuizFeedback]=useState("");

  const tokens=tokenize(text,mode);
  const withSpecial=special?["<BOS>",...tokens,"<EOS>"]:tokens;
  const a=tokenizerA(compareText),b=tokenizerB(compareText);
  const over=Math.max(0,tokens.length-limit);
  const tasks=defs.filter(([,t])=>progress.completedTasks[t]).length;
  const rooms=defs.filter(([id])=>progress.visitedSections.has(id)).length;
  const unlocked=tasks===9&&rooms===9;
  const copy={simple:"Models do not receive your sentence as a magical string of meaning. A tokenizer breaks text into discrete pieces, and those pieces are mapped to vocabulary IDs.",real:"Tokenization is a model-specific preprocessing scheme. Word, character, byte and subword choices trade vocabulary size against sequence length; subword tokenizers learn reusable pieces and map them to discrete IDs.",expert:"Tokenizer behavior is part of the model interface: normalization, pre-tokenization, vocabulary and merge/model rules determine the discrete symbol sequence. IDs are categorical indices; semantic geometry only appears after embedding lookup."} as const;

  const chooseMode=(m:TokenMode)=>{setMode(m);const next=seenModes.includes(m)?seenModes:[...seenModes,m];setSeenModes(next);if(next.length===4)progress.completeTask("compare-token-units");};
  const answerMyth=(i:number,v:boolean)=>{const next={...mythAnswers,[i]:v};setMythAnswers(next);if(myths.every((m,j)=>next[j]===m.answer))progress.completeTask("destroy-token-myths");};
  const explain=()=>{const t=explanation.toLowerCase();const hits=["token","vocab","id","subword","merge","model","context","byte","word"].filter(k=>t.includes(k));if(explanation.trim().length<110||hits.length<4){setFeedback("Explain what the tokenizer outputs, why IDs are vocabulary indices, and why different tokenizers/context limits can produce different sequences.");return;}setFeedback("Strong. You separated tokenization from embeddings and from human-visible words.");progress.completeTask("explain-tokenization");};
  const submitQuiz=()=>{const score=quiz.reduce((s,q,i)=>s+(quizAnswers[i]===q.c?1:0),0);const passed=score>=6;progress.saveQuiz(score,passed);setQuizFeedback(passed?`Passed ${score}/7.`:`${score}/7. Need 6/7.`);};

  return <main className={styles.root}>
    <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 3 · TOKENIZER LAB</span><h1>Break language into model pieces.</h1><p>{copy[progress.depth]}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.machine}><b>TEXT IN</b><div className={styles.slot}/><div className={styles.chips}>{tokenizerA("AI models tokenize text").map((t,i)=><span className={styles.chip} key={i}>{t}</span>)}</div><p>{tasks}/9 tokenizer experiments complete</p></div></section>

    <LessonSection id="split-text" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["split-text-into-tokens"]}>01 · TEXT → TOKENS</TaskStamp><h2>Type text and cut it into pieces.</h2><input className={styles.input} value={text} onChange={e=>setText(e.target.value)} /><div className={styles.tokenRow}>{tokens.map((t,i)=><span className={styles.token} key={`${t}-${i}`}>{JSON.stringify(t)}</span>)}</div><button className={styles.button} onClick={()=>{if(text.trim().length>=8&&tokens.length>=2)progress.completeTask("split-text-into-tokens");}}>Confirm token sequence</button></LessonSection>

    <LessonSection id="strategy" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-token-units"]}>02 · DIFFERENT UNITS</TaskStamp><h2>Word, character, byte or subword?</h2><p>Inspect all four. Smaller units shrink vocabulary needs but usually lengthen the sequence; larger reusable subwords can shorten common text.</p><div className={styles.controls}>{(["word","char","byte","subword"] as TokenMode[]).map(m=><button key={m} className={`${styles.strategy} ${mode===m?styles.active:""}`} onClick={()=>chooseMode(m)}>{m}</button>)}</div><div className={styles.tokenRow}>{tokens.slice(0,40).map((t,i)=><span className={styles.token} key={i}>{t}</span>)}</div><p>Token count in this mode: <b>{tokens.length}</b> · modes inspected: {seenModes.length}/4</p></LessonSection>

    <LessonSection id="vocab-ids" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-token-ids"]}>03 · VOCABULARY IDs</TaskStamp><h2>Each token maps to a discrete index.</h2><p>The integer is an address in a vocabulary, not a semantic measurement. ID 40000 is not “more meaningful” than ID 40.</p><button className={styles.button} onClick={()=>{setShowIds(true);progress.completeTask("inspect-token-ids");}}>Look up token IDs</button><div className={styles.tokenRow}>{tokens.map((t,i)=><span className={styles.token} key={i}>{t}{showIds&&<small>ID {tokenId(t)}</small>}</span>)}</div></LessonSection>

    <LessonSection id="special-tokens" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-special-tokens"]}>04 · SPECIAL TOKENS</TaskStamp><h2>Add boundary markers the model can recognize.</h2><p>BOS/EOS are reserved symbols used by some model/tokenizer schemes to mark structure such as beginning or end of sequence.</p><button className={styles.button} onClick={()=>{setSpecial(true);progress.completeTask("inspect-special-tokens");}}>Add &lt;BOS&gt; and &lt;EOS&gt;</button><div className={styles.tokenRow}>{withSpecial.map((t,i)=><span className={styles.token} key={i}>{t}<small>ID {t==="<BOS>"?1:t==="<EOS>"?2:tokenId(t)}</small></span>)}</div></LessonSection>

    <LessonSection id="bpe-lab" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["run-bpe-merges"]}>05 · BPE INTUITION</TaskStamp><h2>Merge adjacent pieces into reusable subwords.</h2><p>This toy merge sequence starts from characters of “lower”. Real BPE-like tokenizers learn many merge rules from corpus statistics.</p><div className={styles.bpe}>{bpeStates[bpeStep].map((p,i)=><span key={i}>{p}</span>)}</div><div className={styles.controls}><button className={styles.button} onClick={()=>setBpeStep(s=>Math.max(0,s-1))}>Undo</button><button className={styles.button} onClick={()=>setBpeStep(s=>{const n=Math.min(bpeStates.length-1,s+1);if(n===bpeStates.length-1)progress.completeTask("run-bpe-merges");return n;})}>Apply next merge →</button></div><p>Merge step {bpeStep}/{bpeStates.length-1}</p></LessonSection>

    <LessonSection id="different-tokenizers" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["compare-tokenizers"]}>06 · SAME TEXT, DIFFERENT TOKENIZER</TaskStamp><h2>Token boundaries are vocabulary-dependent.</h2><input className={styles.input} value={compareText} onChange={e=>{setCompareText(e.target.value);setCompared(false);}}/><button className={styles.button} onClick={()=>{setCompared(true);progress.completeTask("compare-tokenizers");}}>Compare A vs B</button>{compared&&<div className={styles.grid2}><div className={styles.panel}><h3>Tokenizer A · {a.length} tokens</h3><div className={styles.tokenRow}>{a.map((t,i)=><span className={styles.token} key={i}>{t}</span>)}</div></div><div className={styles.panel}><h3>Tokenizer B · {b.length} tokens</h3><div className={styles.tokenRow}>{b.map((t,i)=><span className={styles.token} key={i}>{t}</span>)}</div></div></div>}</LessonSection>

    <LessonSection id="context-limit" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["hit-token-limit"]}>07 · TOKEN LIMIT</TaskStamp><h2>Context windows count model positions, not your intuition about words.</h2><div className={styles.controls}><button className={styles.button} onClick={()=>setText("Artificial intelligence tokenization makes context windows fill faster than word counts suggest.")}>Load longer text</button><label className={styles.strategy}>Limit <input type="range" min="3" max="20" value={limit} onChange={e=>setLimit(+e.target.value)}/> {limit}</label><button className={styles.button} onClick={()=>{if(over>0)progress.completeTask("hit-token-limit");}}>Test limit</button></div><div className={styles.tokenRow}>{tokens.map((t,i)=><span key={i} className={`${styles.token} ${i>=limit?styles.overflow:""}`}>{t}</span>)}</div><div className={styles.meter}><i style={{width:`${Math.min(100,tokens.length/limit*100)}%`}}/></div><p>{tokens.length} tokens · limit {limit} · overflow {over}</p></LessonSection>

    <LessonSection id="token-myths" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["destroy-token-myths"]}>08 · DESTROY THE MYTHS</TaskStamp><h2>Tokens are not just “words with numbers”.</h2><div className={styles.myths}>{myths.map((m,i)=><div className={styles.myth} key={m.text}><p>{m.text}</p><button className={mythAnswers[i]===true?(m.answer?styles.correct:styles.wrong):""} onClick={()=>answerMyth(i,true)}>True</button><button className={mythAnswers[i]===false?(!m.answer?styles.correct:styles.wrong):""} onClick={()=>answerMyth(i,false)}>False</button></div>)}</div></LessonSection>

    <LessonSection id="explain-tokenization" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><TaskStamp done={!!progress.completedTasks["explain-tokenization"]}>09 · EXPLAIN IT BACK</TaskStamp><h2>What happens between text and token IDs?</h2><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="A tokenizer has a vocabulary and rules..."/><button className={styles.button} onClick={explain}>Check explanation</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</LessonSection>

    <section className={styles.quiz}><h2>Tokenizer Check</h2>{!unlocked?<div className={styles.locked}>Locked: {tasks}/9 tasks · {rooms}/9 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q.q}><strong>{i+1}. {q.q}</strong>{q.o.map((o,j)=><button key={o} className={quizAnswers[i]===j?styles.selected:""} onClick={()=>setQuizAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div>)}<button className={styles.button} onClick={submitQuiz}>Submit quiz</button>{quizFeedback&&<div className={styles.feedback}>{quizFeedback}</div>}</>}<div className={styles.footer}><Link href="/lessons/module-2-capstone">← Module 2 Boss Lab</Link><Link href="/">Course map →</Link></div></section>
  </main>;
}
