"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { AiMascot, AiMascotVariant } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { Expert, quiz, routeTable, scaling } from "./model-zoo-data";
import styles from "./model-zoo-routing.module.css";

type Props = { progress: LessonProgressApi };
type AnswerMap = Record<number, number>;

const expertMeta: Record<Expert, { label: string; variant: AiMascotVariant; accent: string }> = {
  code: { label: "CODE", variant: "tile", accent: "#8eea73" },
  math: { label: "MATH", variant: "star", accent: "#ffe14f" },
  language: { label: "LANG", variant: "mail", accent: "#b99cff" },
  science: { label: "SCI", variant: "briefcase", accent: "#65d8d2" },
};

const routingCases = [
  { text: "Inside one 8-expert MoE model, token 'integral' activates Math + Science experts.", answer: "moe" },
  { text: "A product gateway sends a coding request to Model C instead of Model A.", answer: "model" },
  { text: "A token router activates only two FFN experts for this token position.", answer: "moe" },
  { text: "An orchestration service chooses a cheap SLM for classification and a larger model for legal analysis.", answer: "model" },
] as const;

const familyCopy = {
  base: { title: "Base / pretrained", example: "The moon orbits… → statistically likely continuation", note: "Optimized first for the pretraining objective, not automatically for polite instruction following." },
  instruct: { title: "Instruct", example: "Summarize this in 3 bullets. → follows the requested format", note: "Post-training shifts behavior toward following explicit instructions." },
  chat: { title: "Chat", example: "User / assistant turns → conversational response", note: "Conversation formatting, helpfulness and dialogue behavior are usually added through post-training and system design." },
} as const;

function ProgressQuiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const answered = Object.keys(answers).length === quiz.length;
  const score = quiz.reduce((sum, item, index) => sum + (answers[index] === item.c ? 1 : 0), 0);
  const pass = score >= 6;

  return (
    <section className={styles.quiz}>
      <h2>Model Zoo mastery check</h2>
      {!unlocked ? <div className={styles.locked}>🔒 Finish all 10 scenes and activities before the quiz opens.</div> : (
        <>
          {quiz.map((item, qi) => (
            <div className={styles.question} key={item.q}>
              <strong>{qi + 1}. {item.q}</strong>
              {item.o.map((option, oi) => (
                <button key={option} className={answers[qi] === oi ? styles.selected : ""} onClick={() => setAnswers((current) => ({ ...current, [qi]: oi }))}>{option}</button>
              ))}
              {answers[qi] !== undefined && <small>{answers[qi] === item.c ? "✓ Correct" : `Not quite. Correct: ${item.o[item.c]}`}</small>}
            </div>
          ))}
          <button className={styles.button} disabled={!answered} onClick={() => progress.saveQuiz(score, pass)}>Submit · {score}/{quiz.length}</button>
          {answered && <p className={styles.feedback}>{pass ? "★ MODEL ZOO MASTERED — you can distinguish parameters, MoE routing and system-level model routing." : "Review the routing levels and model families, then try again. Pass is 6/7."}</p>}
        </>
      )}
    </section>
  );
}

export function ModelZooRoutingLesson({ progress }: Props) {
  const [width, setWidth] = useState(512);
  const [layers, setLayers] = useState(12);
  const [parameterTouched, setParameterTouched] = useState(false);
  const [computeMode, setComputeMode] = useState<"dense" | "sparse">("dense");
  const [seenCompute, setSeenCompute] = useState<string[]>([]);
  const [expertCount, setExpertCount] = useState(8);
  const [topK, setTopK] = useState(2);
  const [moeTouched, setMoeTouched] = useState(false);
  const [token, setToken] = useState("function");
  const [seenTokens, setSeenTokens] = useState<string[]>([]);
  const [routingAnswers, setRoutingAnswers] = useState<Record<number, string>>({});
  const [seenSizes, setSeenSizes] = useState<string[]>([]);
  const [family, setFamily] = useState<keyof typeof familyCopy>("base");
  const [seenFamilies, setSeenFamilies] = useState<string[]>([]);
  const [reasoningBudget, setReasoningBudget] = useState(1);
  const [reasoningTouched, setReasoningTouched] = useState(false);
  const [scaleIndex, setScaleIndex] = useState(2);
  const [threshold, setThreshold] = useState(60);
  const [scaleTouched, setScaleTouched] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [explainFeedback, setExplainFeedback] = useState("");

  const approxParameters = useMemo(() => Math.round((12 * width * width * layers) / 1_000_000), [width, layers]);
  const activeParams = Math.round(approxParameters * (computeMode === "dense" ? 1 : Math.max(.12, topK / expertCount)));
  const routes = routeTable[token];
  const selectedExperts = routes.slice(0, topK).map(([name]) => name);
  const scalePoint = scaling[scaleIndex];
  const capability = scalePoint.score >= threshold;

  const markSeen = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((current) => current.includes(value) ? current : [...current, value]);

  const routingCorrect = routingCases.every((item, index) => routingAnswers[index] === item.answer);

  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["parameter", "expert", "token", "model", "router", "inside", "between"].filter((word) => text.includes(word)).length;
    if (explanation.trim().length < 70 || hits < 4) {
      setExplainFeedback("Go deeper: define learned parameters, then distinguish expert routing inside one MoE from routing between separate models.");
      return;
    }
    setExplainFeedback("Strong. You separated the model's internal sparse routing from system-level model choice.");
    progress.completeTask("explain-model-zoo");
  };

  const tasks = ["inspect-llm-parameters","compare-dense-sparse","inspect-moe","route-moe-experts","compare-routing-levels","compare-model-sizes","compare-base-instruct-chat","inspect-reasoning-models","inspect-scaling-emergence","explain-model-zoo"];
  const taskCount = tasks.filter((task) => progress.completedTasks[task]).length;
  const sectionIds = ["parameters","dense-sparse","moe","expert-router","routing-levels","model-sizes","posttrain-families","reasoning-models","scaling","explain-zoo"];
  const readCount = sectionIds.filter((id) => progress.visitedSections.has(id)).length;
  const quizUnlocked = taskCount === tasks.length && readCount === sectionIds.length;

  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>MODULE 5 · MODEL ZOO</span>
          <h1>One word: “model.” Many very different machines.</h1>
          <p>Open the cages. Count learned parameters, wake sparse experts, route tokens, compare SLMs and foundation models, and separate <b>MoE routing inside a model</b> from <b>model routing between systems</b>.</p>
          <DepthSwitch value={progress.depth} onChange={progress.setDepth} />
          <TaskStamp done={taskCount === tasks.length}>{taskCount}/{tasks.length} model-zoo missions complete</TaskStamp>
        </div>
        <div className={styles.zoo}>
          <div className={styles.animals}>
            {(Object.keys(expertMeta) as Expert[]).map((expert) => {
              const meta = expertMeta[expert];
              return <div className={styles.animal} key={expert}><AiMascot variant={meta.variant} accent={meta.accent} mood={selectedExperts.includes(expert) ? "excited" : "happy"} size={92} label={meta.label} /></div>;
            })}
          </div>
        </div>
      </section>

      <LessonSection id="parameters" onVisit={progress.markVisited} className={styles.scene}>
        <h2>1. Parameter count: how many learned number knobs?</h2>
        <p>A parameter is a learned numeric value in the model. “7B parameters” describes learned scale, not seven billion facts stored as database rows.</p>
        <div className={styles.controls}>
          <div className={styles.control}><label>Hidden width <b>{width}</b></label><input type="range" min="256" max="2048" step="256" value={width} onChange={(e) => { setWidth(+e.target.value); setParameterTouched(true); }} /></div>
          <div className={styles.control}><label>Transformer blocks <b>{layers}</b></label><input type="range" min="6" max="48" step="6" value={layers} onChange={(e) => { setLayers(+e.target.value); setParameterTouched(true); }} /></div>
        </div>
        <div className={styles.stats}><div className={styles.stat}><span>Toy estimate</span><b>{approxParameters}M</b></div><div className={styles.stat}><span>Width² effect</span><b>{width}²</b></div><div className={styles.stat}><span>Blocks</span><b>{layers}</b></div></div>
        <button className={styles.button} disabled={!parameterTouched} onClick={() => progress.completeTask("inspect-llm-parameters")}>Lock the parameter mental model</button>
      </LessonSection>

      <LessonSection id="dense-sparse" onVisit={progress.markVisited} className={styles.scene}>
        <h2>2. Dense compute vs sparse compute</h2>
        <p><b>Total parameters</b> and <b>active parameters per token</b> are not always the same number. Sparse architectures can own many experts while activating only a subset for each token.</p>
        <div className={styles.grid2}>
          {(["dense","sparse"] as const).map((mode) => <button key={mode} className={`${styles.panel} ${computeMode === mode ? styles.correct : ""}`} onClick={() => { setComputeMode(mode); markSeen(mode, setSeenCompute); if ([...seenCompute, mode].filter((v,i,a)=>a.indexOf(v)===i).length===2) progress.completeTask("compare-dense-sparse"); }}><strong>{mode === "dense" ? "DENSE" : "SPARSE / MoE-like"}</strong><p>{mode === "dense" ? "Broadly, the dense FFN participates for every token in that layer." : `Only selected experts participate for a token. Current toy active fraction ≈ ${Math.round((topK/expertCount)*100)}%.`}</p></button>)}
        </div>
        <div className={styles.stats}><div className={styles.stat}><span>Total learned</span><b>{approxParameters}M</b></div><div className={styles.stat}><span>Active toy estimate</span><b>{activeParams}M</b></div><div className={styles.stat}><span>Mode</span><b>{computeMode}</b></div></div>
      </LessonSection>

      <LessonSection id="moe" onVisit={progress.markVisited} className={styles.scene}>
        <h2>3. Open a Mixture of Experts</h2>
        <p>Think of expert modules as specialized FFN branches. A router produces scores and activates a small top-k subset for the current token.</p>
        <div className={styles.controls}>
          <div className={styles.control}><label>Experts <b>{expertCount}</b></label><input type="range" min="4" max="16" step="4" value={expertCount} onChange={(e)=>{setExpertCount(+e.target.value);setMoeTouched(true)}} /></div>
          <div className={styles.control}><label>Active top-k <b>{topK}</b></label><input type="range" min="1" max="4" value={topK} onChange={(e)=>{setTopK(+e.target.value);setMoeTouched(true)}} /></div>
        </div>
        <div className={styles.stats}><div className={styles.stat}><span>Experts owned</span><b>{expertCount}</b></div><div className={styles.stat}><span>Experts used/token</span><b>{topK}</b></div><div className={styles.stat}><span>Active fraction</span><b>{Math.round(topK/expertCount*100)}%</b></div></div>
        <button className={styles.button} disabled={!moeTouched || expertCount < 8} onClick={() => progress.completeTask("inspect-moe")}>I opened the sparse model</button>
      </LessonSection>

      <LessonSection id="expert-router" onVisit={progress.markVisited} className={styles.scene}>
        <h2>4. Route tokens to experts</h2>
        <div className={styles.tokenRow}>{Object.keys(routeTable).map((word)=><button className={styles.token} key={word} onClick={()=>{setToken(word);const next=[...new Set([...seenTokens,word])];setSeenTokens(next);if(next.length===4)progress.completeTask("route-moe-experts")}}>{word}</button>)}</div>
        <div className={styles.experts}>
          {(Object.keys(expertMeta) as Expert[]).map((expert) => {
            const meta=expertMeta[expert]; const score=routes.find(([name])=>name===expert)?.[1]??0; const active=selectedExperts.includes(expert);
            return <motion.div className={`${styles.expert} ${active ? styles.active : ""}`} key={expert} animate={active ? { y:[0,-6,0], scale:[1,1.05,1] } : {}}><AiMascot variant={meta.variant} accent={meta.accent} mood={active?"excited":"neutral"} size={78}/><strong>{meta.label}</strong><small>{Math.round(score*100)} router score</small></motion.div>;
          })}
        </div>
        <p>Inspect all four tokens: <b>{seenTokens.length}/4</b>. The router is part of this one model; it is not calling four separate model APIs.</p>
      </LessonSection>

      <LessonSection id="routing-levels" onVisit={progress.markVisited} className={styles.scene}>
        <h2>5. Do not confuse two routing levels</h2>
        <div className={styles.grid2}>{routingCases.map((item,index)=><div className={styles.case} key={item.text}><p>{item.text}</p>{["moe","model"].map(choice=><button key={choice} className={routingAnswers[index]===choice ? (choice===item.answer?styles.correct:styles.wrong) : ""} onClick={()=>{const next={...routingAnswers,[index]:choice};setRoutingAnswers(next);if(routingCases.every((c,i)=>next[i]===c.answer))progress.completeTask("compare-routing-levels")}}>{choice === "moe" ? "Inside-model MoE routing" : "System/model routing"}</button>)}</div>)}</div>
        {routingCorrect && <p className={styles.feedback}>✓ Correct. One picks submodules inside a model; the other chooses between separate models/endpoints/systems.</p>}
      </LessonSection>

      <LessonSection id="model-sizes" onVisit={progress.markVisited} className={styles.scene}>
        <h2>6. SLM, large model, foundation model</h2>
        <p>Size and role are different axes. “Small language model” describes scale/footprint relatively; “foundation model” describes broad pretraining and adaptability.</p>
        <div className={styles.grid3}>{[
          {id:"slm",title:"SLM",variant:"tile" as AiMascotVariant,accent:"#8eea73",copy:"Smaller footprint; useful where latency, cost or local deployment matter."},
          {id:"foundation",title:"Foundation model",variant:"briefcase" as AiMascotVariant,accent:"#62d9d0",copy:"Broadly pretrained base that can support many downstream tasks and post-training paths."},
          {id:"large",title:"Large model",variant:"star" as AiMascotVariant,accent:"#ffdc4d",copy:"More parameters/compute capacity; not automatically the right model for every product task."},
        ].map(card=><button key={card.id} className={styles.panel} onClick={()=>{const next=[...new Set([...seenSizes,card.id])];setSeenSizes(next);if(next.length===3)progress.completeTask("compare-model-sizes")}}><AiMascot variant={card.variant} accent={card.accent} mood={seenSizes.includes(card.id)?"happy":"thinking"} size={92} label={card.title}/><p>{card.copy}</p></button>)}</div>
      </LessonSection>

      <LessonSection id="posttrain-families" onVisit={progress.markVisited} className={styles.scene}>
        <h2>7. Base → instruct → chat behavior</h2>
        <div className={styles.controls}>{(Object.keys(familyCopy) as (keyof typeof familyCopy)[]).map(name=><button className={styles.button} key={name} onClick={()=>{setFamily(name);const next=[...new Set([...seenFamilies,name])];setSeenFamilies(next);if(next.length===3)progress.completeTask("compare-base-instruct-chat")}}>{familyCopy[name].title}</button>)}</div>
        <div className={styles.panel}><strong>{familyCopy[family].title}</strong><p>{familyCopy[family].example}</p><small>{familyCopy[family].note}</small></div>
      </LessonSection>

      <LessonSection id="reasoning-models" onVisit={progress.markVisited} className={styles.scene}>
        <h2>8. Reasoning models spend more test-time compute</h2>
        <p>Reasoning-oriented systems can deliberately spend more internal steps/search/verification before the answer. That creates a quality ↔ latency ↔ cost trade-off.</p>
        <div className={styles.control}><label>Deliberation budget <b>{reasoningBudget}×</b></label><input type="range" min="1" max="8" value={reasoningBudget} onChange={(e)=>{setReasoningBudget(+e.target.value);setReasoningTouched(true)}} /></div>
        <div className={styles.stats}><div className={styles.stat}><span>Toy quality</span><b>{Math.min(96,61+reasoningBudget*5)}%</b></div><div className={styles.stat}><span>Latency</span><b>{(0.7+reasoningBudget*.42).toFixed(1)}s</b></div><div className={styles.stat}><span>Relative cost</span><b>{(1+reasoningBudget*.55).toFixed(1)}×</b></div></div>
        <button className={styles.button} disabled={!reasoningTouched || reasoningBudget < 4} onClick={()=>progress.completeTask("inspect-reasoning-models")}>Accept the trade-off</button>
      </LessonSection>

      <LessonSection id="scaling" onVisit={progress.markVisited} className={styles.scene}>
        <h2>9. Scaling laws — and why “emergence” needs nuance</h2>
        <p>Performance can improve smoothly with scale while a benchmark reports a binary capability only after a threshold is crossed. A smooth curve can therefore look like a sudden jump.</p>
        <div className={styles.controls}><div className={styles.control}><label>Model size <b>{scalePoint.p}B</b></label><input type="range" min="0" max={scaling.length-1} value={scaleIndex} onChange={(e)=>{setScaleIndex(+e.target.value);setScaleTouched(true)}} /></div><div className={styles.control}><label>Capability threshold <b>{threshold}%</b></label><input type="range" min="45" max="80" value={threshold} onChange={(e)=>{setThreshold(+e.target.value);setScaleTouched(true)}} /></div></div>
        <div className={styles.curve}><div className={styles.threshold} style={{bottom:`${threshold}%`}} />{scaling.map(point=><i key={point.p} style={{left:`${(Math.log(point.p+1)/Math.log(71))*96}%`,bottom:`${point.score}%`}} />)}</div>
        <p className={styles.feedback}>Current score {scalePoint.score}% → threshold capability: <b>{capability ? "YES" : "NO"}</b>. The underlying score itself is still {scalePoint.score}.</p>
        <button className={styles.button} disabled={!scaleTouched} onClick={()=>progress.completeTask("inspect-scaling-emergence")}>I see the threshold illusion</button>
      </LessonSection>

      <LessonSection id="explain-zoo" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}>
        <h2>10. Explain the zoo without buzzwords</h2>
        <textarea value={explanation} onChange={(e)=>setExplanation(e.target.value)} placeholder="Explain: what is a model parameter, what does an MoE router choose, and how is that different from choosing between separate models?" />
        <button className={styles.button} onClick={submitExplain}>Check my explanation</button>
        {explainFeedback && <p className={styles.feedback}>{explainFeedback}</p>}
      </LessonSection>

      <ProgressQuiz progress={progress} unlocked={quizUnlocked} />
      <div className={styles.footer}><Link href="/lessons/next-token-sampling">← Next-token machine</Link><Link href="/lessons/module-5-capstone">Module 5 Boss Lab →</Link></div>
    </main>
  );
}
