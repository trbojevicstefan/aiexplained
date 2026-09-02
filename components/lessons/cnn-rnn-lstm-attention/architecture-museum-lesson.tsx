"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { Arch, cases, defs, quiz } from "./architecture-museum-data";
import styles from "./architecture-museum.module.css";

type Props={progress:LessonProgressApi};
const image=[0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1];
const kernel=[1,0,-1,1,0,-1,1,0,-1];
const sequence=[.8,-.4,.6,.2,-.7,.9];
const tokens=["The","robot","picked","up","the","red","cube","because","it","was","light"];
const attn=[.03,.04,.03,.03,.03,.08,.54,.04,.12,.03,.03];
const recurrenceStates=sequence.reduce<number[]>((arr,x)=>{const prev=arr.length?arr[arr.length-1]:0;arr.push(Math.tanh(.75*prev+x));return arr;},[]);

export function ArchitectureMuseumLesson({progress}:Props){
  const [visitedArch,setVisitedArch]=useState<Arch[]>([]);
  const [kernelPos,setKernelPos]=useState(0);
  const [seenKernel,setSeenKernel]=useState<number[]>([]);
  const [rnnStep,setRnnStep]=useState(0);
  const [distance,setDistance]=useState(5);
  const [forget,setForget]=useState(.8);
  const [inputGate,setInputGate]=useState(.5);
  const [outputGate,setOutputGate]=useState(.7);
  const [gateTouched,setGateTouched]=useState<string[]>([]);
  const [attentionOn,setAttentionOn]=useState(false);
  const [archAnswers,setArchAnswers]=useState<Record<number,Arch>>({});
  const [explanation,setExplanation]=useState("");
  const [feedback,setFeedback]=useState("");
  const [quizAnswers,setQuizAnswers]=useState<Record<number,number>>({});
  const [quizFeedback,setQuizFeedback]=useState("");

  const row=Math.floor(kernelPos/3),col=kernelPos%3;
  const conv=useMemo(()=>kernel.reduce((sum,k,i)=>{const kr=Math.floor(i/3),kc=i%3;return sum+k*image[(row+kr)*5+(col+kc)];},0),[row,col]);
  const retention=.78**distance;
  const cPrev=.7,candidate=.9;
  const cell=forget*cPrev+inputGate*candidate;
  const hidden=outputGate*Math.tanh(cell);
  const tasks=defs.filter(([,t])=>progress.completedTasks[t]).length;
  const rooms=defs.filter(([id])=>progress.visitedSections.has(id)).length;
  const unlocked=tasks===9&&rooms===9;
  const copy={simple:"Different neural architectures bake in different assumptions: CNNs reuse local filters, RNNs carry state, LSTMs gate memory, and attention lets positions look directly at other positions.",real:"Architecture changes the information path. Convolution uses locality and weight sharing; recurrence serializes state; LSTM adds gated memory; attention creates content-dependent direct interactions between positions.",expert:"These are inductive biases and computational graphs. CNNs exploit translation structure, recurrent models impose sequential state transitions, LSTMs alter recurrent memory dynamics with gates, while attention shortens dependency paths and enables substantially more parallel sequence processing during training."} as const;

  const inspectArch=(a:Arch)=>{const next=visitedArch.includes(a)?visitedArch:[...visitedArch,a];setVisitedArch(next);if(next.length===4)progress.completeTask("inspect-architecture-biases");};
  const slide=(p:number)=>{setKernelPos(p);const next=seenKernel.includes(p)?seenKernel:[...seenKernel,p];setSeenKernel(next);if(next.length>=3)progress.completeTask("inspect-weight-sharing");};
  const touchGate=(name:string,value:number,setter:(x:number)=>void)=>{setter(value);const next=gateTouched.includes(name)?gateTouched:[...gateTouched,name];setGateTouched(next);if(next.length===3)progress.completeTask("control-lstm-gates");};
  const choose=(i:number,a:Arch)=>{const next={...archAnswers,[i]:a};setArchAnswers(next);if(cases.every((c,j)=>next[j]===c.answer))progress.completeTask("choose-sequence-architecture");};
  const explain=()=>{const t=explanation.toLowerCase();const hits=["cnn","local","rnn","state","lstm","gate","attention","direct","parallel"].filter(k=>t.includes(k));if(explanation.trim().length<120||hits.length<5){setFeedback("Explain the information path for CNN, RNN/LSTM and attention, plus why attention helps long-range language dependencies and parallel training.");return;}setFeedback("Strong. You compared architectural biases instead of declaring one architecture universally superior.");progress.completeTask("explain-architecture-evolution");};
  const submitQuiz=()=>{const score=quiz.reduce((s,q,i)=>s+(quizAnswers[i]===q.c?1:0),0);const passed=score>=6;progress.saveQuiz(score,passed);setQuizFeedback(passed?`Passed ${score}/7.`:`${score}/7. Need 6/7.`);};

  return <main className={styles.root}>
    <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 2 · ARCHITECTURE MUSEUM</span><h1>Different paths through data.</h1><p>{copy[progress.depth]}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.museum}><div className={styles.rooms}>{(["cnn","rnn","lstm","attention"] as Arch[]).map(a=><button key={a} className={styles.room} onClick={()=>inspectArch(a)}>{a.toUpperCase()}<br/><small>{visitedArch.includes(a)?"inspected":"open room"}</small></button>)}</div></div></section>

    <LessonSection id="biases" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-architecture-biases"]}>01 · INDUCTIVE BIASES</TaskStamp><h2>Open all four architecture rooms.</h2><div className={styles.grid2}><div className={styles.panel}><b>CNN</b><p>Local receptive fields + shared filters.</p><b>RNN</b><p>State moves sequentially through time.</p></div><div className={styles.panel}><b>LSTM</b><p>Gated recurrent memory.</p><b>Attention</b><p>Content-dependent direct interactions across positions.</p></div></div></LessonSection>

    <LessonSection id="cnn-kernel" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["run-convolution"]}>02 · CONVOLUTION</TaskStamp><h2>Slide one 3×3 detector over an image.</h2><div className={styles.grid2}><div><div className={styles.imageGrid}>{image.map((v,i)=>{const r=Math.floor(i/5),c=i%5;const hot=r>=row&&r<row+3&&c>=col&&c<col+3;return <div key={i} className={`${styles.pixel} ${hot?styles.hot:""}`}>{v}</div>})}</div></div><div><div className={styles.kernel}>{kernel.map((v,i)=><span key={i}>{v}</span>)}</div><p className={styles.state}>kernel · patch = <b>{conv}</b></p><div className={styles.controls}><div className={styles.control}><label><span>Window position</span><b>{kernelPos+1}/9</b></label><input type="range" min="0" max="8" value={kernelPos} onChange={e=>slide(+e.target.value)}/></div><button className={styles.button} onClick={()=>progress.completeTask("run-convolution")}>Run dot product</button></div></div></div></LessonSection>

    <LessonSection id="weight-sharing" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-weight-sharing"]}>03 · WEIGHT SHARING</TaskStamp><h2>The detector moves. Its weights stay the same.</h2><p>Visit at least three spatial positions. The same nine kernel numbers are reused instead of learning a new detector for every pixel location.</p><div className={styles.controls}>{[0,2,4,6,8].map(p=><button className={styles.button} key={p} onClick={()=>slide(p)}>Position {p+1}</button>)}</div><p>Unique positions inspected: {seenKernel.length} · kernel parameters: 9, not 9×positions.</p></LessonSection>

    <LessonSection id="rnn-state" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["run-rnn-state"]}>04 · RECURRENT STATE</TaskStamp><h2>Carry one hidden state through time.</h2><div className={styles.sequence}>{sequence.map((x,i)=><div key={i} className={`${styles.token} ${i===rnnStep?styles.active:""}`}><b>x{i+1}</b><br/>{x.toFixed(1)}<br/><small>h={recurrenceStates[i].toFixed(2)}</small></div>)}</div><div className={styles.controls}><button className={styles.button} onClick={()=>setRnnStep(s=>Math.max(0,s-1))}>←</button><button className={styles.button} onClick={()=>setRnnStep(s=>{const n=Math.min(sequence.length-1,s+1);if(n===sequence.length-1)progress.completeTask("run-rnn-state");return n;})}>Next recurrent step →</button></div><p className={styles.state}>h_t = tanh(0.75·h_(t-1) + x_t) · current h = {recurrenceStates[rnnStep].toFixed(4)}</p></LessonSection>

    <LessonSection id="long-memory" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["stress-rnn-memory"]}>05 · LONG DEPENDENCIES</TaskStamp><h2>Stretch the recurrent path.</h2><div className={styles.controls}><div className={styles.control}><label><span>Distance</span><b>{distance} steps</b></label><input type="range" min="1" max="40" value={distance} onChange={e=>setDistance(+e.target.value)}/></div><button className={styles.button} onClick={()=>{if(distance>=20&&retention<.01)progress.completeTask("stress-rnn-memory");}}>Measure retained gradient proxy</button></div><div className={styles.stats}><div className={styles.stat}><span>Per-step factor</span><b>0.78</b></div><div className={styles.stat}><span>Path length</span><b>{distance}</b></div><div className={styles.stat}><span>Retention</span><b>{retention.toExponential(2)}</b></div></div></LessonSection>

    <LessonSection id="lstm-gates" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["control-lstm-gates"]}>06 · LSTM MEMORY CELL</TaskStamp><h2>Gate what to keep, write and reveal.</h2><div className={styles.gates}><div className={styles.gate}><label>Forget f = {forget.toFixed(2)}</label><input type="range" min="0" max="1" step=".05" value={forget} onChange={e=>touchGate("forget",+e.target.value,setForget)}/></div><div className={styles.gate}><label>Input i = {inputGate.toFixed(2)}</label><input type="range" min="0" max="1" step=".05" value={inputGate} onChange={e=>touchGate("input",+e.target.value,setInputGate)}/></div><div className={styles.gate}><label>Output o = {outputGate.toFixed(2)}</label><input type="range" min="0" max="1" step=".05" value={outputGate} onChange={e=>touchGate("output",+e.target.value,setOutputGate)}/></div></div><p className={styles.state}>c_t = f·c_prev + i·candidate = {cell.toFixed(3)} · h_t = o·tanh(c_t) = {hidden.toFixed(3)}</p></LessonSection>

    <LessonSection id="attention-path" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["inspect-attention-path"]}>07 · ATTENTION PATH</TaskStamp><h2>Let “it” look directly at “cube”.</h2><p>Click to reveal a toy attention distribution for the token “it”. Attention does not need to compress every previous token into one recurrent state before the interaction.</p><button className={styles.button} onClick={()=>{setAttentionOn(true);progress.completeTask("inspect-attention-path");}}>Reveal attention weights</button><div className={styles.attention}>{tokens.map((t,i)=><span key={i} className={attentionOn&&attn[i]>.1?styles.high:""}>{t}{attentionOn?` ${(attn[i]*100).toFixed(0)}%`:""}</span>)}</div><p className={styles.state}>Recurrent path from “cube” to “it”: multiple ordered transitions. Attention interaction: direct score/value path inside the layer. This shorter dependency path plus parallel position processing is a major reason transformers dominate modern LLM training.</p></LessonSection>

    <LessonSection id="architecture-choice" onVisit={progress.markVisited} className={styles.scene}><TaskStamp done={!!progress.completedTasks["choose-sequence-architecture"]}>08 · CHOOSE THE BIAS</TaskStamp><h2>Pick the architecture that matches the structure.</h2><div className={styles.choiceGrid}>{cases.map((c,i)=><div className={styles.case} key={c.text}><p>{c.text}</p>{(["cnn","rnn","lstm","attention"] as Arch[]).map(a=><button key={a} className={archAnswers[i]===a?(a===c.answer?styles.correct:styles.wrong):""} onClick={()=>choose(i,a)}>{a}</button>)}</div>)}</div></LessonSection>

    <LessonSection id="explain-evolution" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><TaskStamp done={!!progress.completedTasks["explain-architecture-evolution"]}>09 · EXPLAIN IT BACK</TaskStamp><h2>Why did attention replace much recurrence in modern LLMs?</h2><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="CNNs exploit locality... RNNs carry state... LSTMs... Attention..."/><button className={styles.button} onClick={explain}>Check explanation</button>{feedback&&<div className={styles.feedback}>{feedback}</div>}</LessonSection>

    <section className={styles.quiz}><h2>Architecture Museum Check</h2>{!unlocked?<div className={styles.locked}>Locked: {tasks}/9 tasks · {rooms}/9 rooms.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q.q}><strong>{i+1}. {q.q}</strong>{q.o.map((o,j)=><button key={o} className={quizAnswers[i]===j?styles.selected:""} onClick={()=>setQuizAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div>)}<button className={styles.button} onClick={submitQuiz}>Submit quiz</button>{quizFeedback&&<div className={styles.feedback}>{quizFeedback}</div>}</>}<div className={styles.footer}><Link href="/lessons/residual-mlp">← Residuals & MLPs</Link><Link href="/">Course map →</Link></div></section>
  </main>;
}
