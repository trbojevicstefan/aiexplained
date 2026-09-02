"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./gradient-health-normalization.module.css";

type Props = { progress: LessonProgressApi };
type Diagnosis = "vanishing" | "exploding" | "clip" | "layernorm";

const sectionDefs = [
  { id: "gradient-chain", taskId: "test-gradient-chain" },
  { id: "vanishing", taskId: "create-vanishing" },
  { id: "exploding", taskId: "create-exploding" },
  { id: "saturation", taskId: "inspect-saturation-chain" },
  { id: "clipping", taskId: "clip-gradient" },
  { id: "normalize", taskId: "normalize-activations" },
  { id: "batch-vs-layer", taskId: "compare-normalization-axes" },
  { id: "normalization-traps", taskId: "diagnose-normalization" },
  { id: "explain-gradient-health", taskId: "explain-gradient-health" },
] as const;

const quizQuestions = [
  { q: "Why can gradients vanish in a deep chain?", options: ["Gradients are always rounded to zero", "Many local derivatives below 1 multiply into a tiny number", "The loss disappears after one epoch", "Batch size becomes too large"], correct: 1 },
  { q: "What does gradient clipping primarily protect against?", options: ["Exploding update magnitudes", "Overfitting by itself", "Missing labels", "Slow data loading"], correct: 0 },
  { q: "A saturated sigmoid has a local derivative that is usually…", options: ["Very large", "Close to zero", "Exactly one", "Unrelated to its input"], correct: 1 },
  { q: "LayerNorm in a transformer-like vector usually normalizes across…", options: ["Examples in the batch", "Feature dimensions within one example/token", "Training epochs", "Optimizer states"], correct: 1 },
  { q: "BatchNorm and LayerNorm are identical because both produce mean 0 and variance 1.", options: ["True", "False"], correct: 1 },
  { q: "If every layer contributes a derivative around 1.3, increasing depth tends to…", options: ["Explode the gradient product", "Force it to zero", "Make the network deterministic", "Remove the need for loss"], correct: 0 },
  { q: "Normalization is best understood as…", options: ["A universal cure for every optimization problem", "A way to control activation statistics; architecture, initialization and optimizer still matter", "A replacement for backpropagation", "A way to create labels"], correct: 1 },
] as const;

const diagnosisCases: { text: string; answer: Diagnosis }[] = [
  { text: "Layer 18 gets gradient 0.0000008 while the output layer gets 0.42.", answer: "vanishing" },
  { text: "Gradient norm jumps from 2.3 to 910 and the next update destroys the loss.", answer: "exploding" },
  { text: "Most steps are healthy, but rare batches produce enormous norms. Add a hard update guardrail.", answer: "clip" },
  { text: "A transformer token vector should be normalized without depending on which other examples share the batch.", answer: "layernorm" },
];

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const std = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length);
};
const normalize = (xs: number[]) => {
  const m = mean(xs);
  const s = Math.max(std(xs), 1e-8);
  return xs.map((x) => (x - m) / s);
};
const chainProduct = (factor: number, depth: number) => factor ** depth;
const fmt = (value: number) => Math.abs(value) < 0.001 || Math.abs(value) > 999 ? value.toExponential(2) : value.toFixed(4);

export function GradientHealthNormalizationLesson({ progress }: Props) {
  const [chainDepth, setChainDepth] = useState(8);
  const [chainFactor, setChainFactor] = useState(0.92);
  const [chainRan, setChainRan] = useState(false);
  const [vanishDepth, setVanishDepth] = useState(12);
  const [vanishFactor, setVanishFactor] = useState(0.55);
  const [explodeDepth, setExplodeDepth] = useState(12);
  const [explodeFactor, setExplodeFactor] = useState(1.45);
  const [satZ, setSatZ] = useState(0);
  const [clipRaw, setClipRaw] = useState(18);
  const [clipThreshold, setClipThreshold] = useState(5);
  const [clipApplied, setClipApplied] = useState(false);
  const [normalized, setNormalized] = useState(false);
  const [seenAxes, setSeenAxes] = useState<("batch" | "layer")[]>([]);
  const [axis, setAxis] = useState<"batch" | "layer">("batch");
  const [diagnoses, setDiagnoses] = useState<Record<number, Diagnosis>>({});
  const [explanation, setExplanation] = useState("");
  const [explainFeedback, setExplainFeedback] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFeedback, setQuizFeedback] = useState("");

  const chain = chainProduct(chainFactor, chainDepth);
  const vanish = chainProduct(vanishFactor, vanishDepth);
  const exploding = chainProduct(explodeFactor, explodeDepth);
  const sigmoid = 1 / (1 + Math.exp(-satZ));
  const sigmoidDerivative = sigmoid * (1 - sigmoid);
  const clipped = Math.sign(clipRaw) * Math.min(Math.abs(clipRaw), clipThreshold);
  const rawActivations = [8, 10, 12, 14, 16, 18];
  const normalizedActivations = normalize(rawActivations);

  const matrix = [
    [4, 7, 10, 13],
    [6, 9, 12, 15],
    [18, 16, 14, 12],
    [22, 19, 16, 13],
  ];
  const matrixDisplay = useMemo(() => {
    if (axis === "layer") return matrix.map((row) => normalize(row));
    return matrix.map((row, r) => row.map((_, c) => normalize(matrix.map((x) => x[c]))[r]));
  }, [axis]);

  const tasksDone = sectionDefs.filter((s) => progress.completedTasks[s.taskId]).length;
  const sectionsRead = sectionDefs.filter((s) => progress.visitedSections.has(s.id)).length;
  const quizUnlocked = tasksDone === sectionDefs.length && sectionsRead === sectionDefs.length;

  const depthCopy = {
    simple: "Backprop sends a learning signal backward. In deep stacks that signal can fade away, blow up, or become unstable. We can measure it and add safeguards.",
    real: "Backprop multiplies local derivatives through the computation graph. Products far below 1 vanish; products above 1 can explode. Normalization controls activation statistics, while clipping caps unusually large gradient norms.",
    expert: "Gradient health is a Jacobian-product problem. Saturating nonlinearities, initialization and depth affect singular-value propagation; normalization changes intermediate statistics, while clipping constrains update magnitude without repairing the underlying Jacobian geometry.",
  } as const;

  const runAxis = (next: "batch" | "layer") => {
    setAxis(next);
    setSeenAxes((current) => current.includes(next) ? current : [...current, next]);
    const nextSeen = seenAxes.includes(next) ? seenAxes : [...seenAxes, next];
    if (nextSeen.length === 2) progress.completeTask("compare-normalization-axes");
  };

  const chooseDiagnosis = (index: number, answer: Diagnosis) => {
    const next = { ...diagnoses, [index]: answer };
    setDiagnoses(next);
    if (diagnosisCases.every((item, i) => next[i] === item.answer)) progress.completeTask("diagnose-normalization");
  };

  const submitExplanation = () => {
    const text = explanation.toLowerCase();
    const hits = ["gradient", "chain", "derivative", "vanish", "explode", "normal", "clip", "depth"].filter((word) => text.includes(word));
    if (explanation.trim().length < 110 || hits.length < 4) {
      setExplainFeedback("Go deeper: explain the multiplied derivative chain, why depth can shrink/blow up the signal, and what normalization/clipping actually change.");
      return;
    }
    setExplainFeedback("Strong. You separated the source of gradient-health problems from the tools used to stabilize training.");
    progress.completeTask("explain-gradient-health");
  };

  const submitQuiz = () => {
    const score = quizQuestions.reduce((total, q, i) => total + (quizAnswers[i] === q.correct ? 1 : 0), 0);
    const passed = score >= 6;
    progress.saveQuiz(score, passed);
    setQuizFeedback(passed ? `Passed: ${score}/7. Gradient ER cleared.` : `${score}/7. Need 6/7 — inspect the missed mechanisms and retry.`);
  };

  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>MODULE 2 · NEURAL NETWORK EMERGENCY ROOM</span>
          <h1>Keep the gradient alive.</h1>
          <p>{depthCopy[progress.depth]}</p>
          <DepthSwitch value={progress.depth} onChange={progress.setDepth} />
        </div>
        <div className={styles.monitor}>
          <span>BACKPROP VITAL SIGNS</span>
          <div className={styles.pulse} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <strong>{tasksDone}/9 interventions cleared</strong>
          <span>{sectionsRead}/9 rooms inspected</span>
        </div>
      </section>

      <LessonSection id="gradient-chain" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["test-gradient-chain"])}>ACTIVITY 01 · CHAIN PRODUCT</TaskStamp>
        <h2>Every layer multiplies the backward signal.</h2>
        <p>Start with gradient 1.0. Pretend each layer contributes the same local derivative. Watch the product after depth layers.</p>
        <div className={styles.controls}>
          <div className={styles.control}><label><span>Depth</span><b>{chainDepth}</b></label><input type="range" min="2" max="24" value={chainDepth} onChange={(e) => setChainDepth(Number(e.target.value))} /></div>
          <div className={styles.control}><label><span>Local derivative</span><b>{chainFactor.toFixed(2)}</b></label><input type="range" min="0.2" max="1.5" step="0.01" value={chainFactor} onChange={(e) => setChainFactor(Number(e.target.value))} /></div>
          <button className={styles.button} onClick={() => { setChainRan(true); progress.completeTask("test-gradient-chain"); }}>Run backward chain</button>
        </div>
        {chainRan && <><div className={styles.formula}>1.0 × {chainFactor.toFixed(2)}^{chainDepth} = <b>{fmt(chain)}</b></div><div className={styles.chain}>{Array.from({ length: chainDepth }, (_, i) => { const value = chainFactor ** (i + 1); const state = value < .02 ? styles.danger : value > 20 ? styles.danger : value > .15 && value < 5 ? styles.healthy : styles.warning; return <div key={i} className={`${styles.chainCell} ${state}`}><span>L{i + 1}</span><b>{fmt(value)}</b></div>; })}</div></>}
      </LessonSection>

      <LessonSection id="vanishing" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["create-vanishing"])}>ACTIVITY 02 · VANISHING</TaskStamp>
        <h2>Make the early layers stop hearing the loss.</h2>
        <p>If every backward step keeps only part of the signal, depth compounds the shrinkage.</p>
        <div className={styles.grid2}><div className={styles.panel}><div className={styles.controls}><div className={styles.control}><label><span>Depth</span><b>{vanishDepth}</b></label><input type="range" min="4" max="24" value={vanishDepth} onChange={(e) => setVanishDepth(Number(e.target.value))} /></div><div className={styles.control}><label><span>Derivative</span><b>{vanishFactor.toFixed(2)}</b></label><input type="range" min="0.25" max="0.95" step="0.01" value={vanishFactor} onChange={(e) => setVanishFactor(Number(e.target.value))} /></div></div><button className={styles.button} onClick={() => { if (vanish < .01) progress.completeTask("create-vanishing"); }}>Test vanishing condition</button></div><div className={`${styles.panel} ${styles.dark}`}><span>Gradient reaching earliest layer</span><strong style={{fontSize:44,display:"block",margin:"12px 0"}}>{fmt(vanish)}</strong><p>{vanish < .01 ? "Critical: the learning signal is effectively disappearing." : "Still audible. Add depth or use a smaller local derivative."}</p></div></div>
      </LessonSection>

      <LessonSection id="exploding" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["create-exploding"])}>ACTIVITY 03 · EXPLODING</TaskStamp>
        <h2>Now overload the backward circuit.</h2>
        <p>Local amplification above 1 can compound just as violently in the opposite direction.</p>
        <div className={styles.controls}><div className={styles.control}><label><span>Depth</span><b>{explodeDepth}</b></label><input type="range" min="4" max="24" value={explodeDepth} onChange={(e) => setExplodeDepth(Number(e.target.value))} /></div><div className={styles.control}><label><span>Derivative</span><b>{explodeFactor.toFixed(2)}</b></label><input type="range" min="1.02" max="1.8" step="0.01" value={explodeFactor} onChange={(e) => setExplodeFactor(Number(e.target.value))} /></div><button className={styles.button} onClick={() => { if (exploding > 50) progress.completeTask("create-exploding"); }}>Stress the chain</button></div>
        <div className={styles.statRow}><div className={styles.stat}><span>Start</span><b>1.0</b></div><div className={styles.stat}><span>After {explodeDepth} layers</span><b>{fmt(exploding)}</b></div><div className={styles.stat}><span>Status</span><b>{exploding > 50 ? "OVERLOAD" : "stable-ish"}</b></div></div>
      </LessonSection>

      <LessonSection id="saturation" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["inspect-saturation-chain"])}>ACTIVITY 04 · SATURATION</TaskStamp>
        <h2>A neuron can kill the chain locally.</h2>
        <p>Push a sigmoid far into either tail. Its output becomes confident, but its derivative approaches zero — so backward signal gets multiplied by almost nothing.</p>
        <div className={styles.controls}><div className={styles.control}><label><span>Pre-activation z</span><b>{satZ.toFixed(1)}</b></label><input type="range" min="-8" max="8" step="0.1" value={satZ} onChange={(e) => setSatZ(Number(e.target.value))} /></div><button className={styles.button} onClick={() => { if (Math.abs(satZ) >= 4 && sigmoidDerivative < .02) progress.completeTask("inspect-saturation-chain"); }}>Inspect local derivative</button></div>
        <div className={styles.statRow}><div className={styles.stat}><span>sigmoid(z)</span><b>{sigmoid.toFixed(4)}</b></div><div className={styles.stat}><span>σ′(z)</span><b>{sigmoidDerivative.toFixed(5)}</b></div><div className={styles.stat}><span>Gradient gate</span><b>{sigmoidDerivative < .02 ? "almost shut" : "open"}</b></div></div>
      </LessonSection>

      <LessonSection id="clipping" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["clip-gradient"])}>ACTIVITY 05 · CLIPPING</TaskStamp>
        <h2>Install an emergency limiter.</h2>
        <p>Clipping does not explain or cure the source of an exploding gradient. It caps the update magnitude so one bad step cannot wreck the parameters.</p>
        <div className={styles.controls}><div className={styles.control}><label><span>Raw gradient norm</span><b>{clipRaw}</b></label><input type="range" min="1" max="50" value={clipRaw} onChange={(e) => { setClipRaw(Number(e.target.value)); setClipApplied(false); }} /></div><div className={styles.control}><label><span>Clip threshold</span><b>{clipThreshold}</b></label><input type="range" min="1" max="20" value={clipThreshold} onChange={(e) => { setClipThreshold(Number(e.target.value)); setClipApplied(false); }} /></div><button className={styles.button} onClick={() => { setClipApplied(true); if (Math.abs(clipRaw) > clipThreshold) progress.completeTask("clip-gradient"); }}>Apply clipping</button></div>
        <div className={styles.grid2}><div className={styles.panel}><span>Before</span><div className={styles.meter}><i style={{width:`${Math.min(100, Math.abs(clipRaw) * 2)}%`}} /></div><b>{clipRaw.toFixed(1)}</b></div><div className={styles.panel}><span>After</span><div className={styles.meter}><i style={{width:`${Math.min(100, Math.abs(clipApplied ? clipped : clipRaw) * 2)}%`}} /></div><b>{(clipApplied ? clipped : clipRaw).toFixed(1)}</b></div></div>
      </LessonSection>

      <LessonSection id="normalize" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["normalize-activations"])}>ACTIVITY 06 · NORMALIZE</TaskStamp>
        <h2>Re-center a drifting activation stream.</h2>
        <p>Normalization controls intermediate statistics. Here we standardize a tiny activation vector to approximately mean 0 and standard deviation 1.</p>
        <div className={styles.sampleRow}>{(normalized ? normalizedActivations : rawActivations).map((x, i) => <span key={i} className={`${styles.sample} ${normalized ? styles.after : ""}`}>{x.toFixed(2)}</span>)}</div>
        <div className={styles.statRow}><div className={styles.stat}><span>Mean</span><b>{mean(normalized ? normalizedActivations : rawActivations).toFixed(3)}</b></div><div className={styles.stat}><span>Std</span><b>{std(normalized ? normalizedActivations : rawActivations).toFixed(3)}</b></div><div className={styles.stat}><span>State</span><b>{normalized ? "normalized" : "shifted"}</b></div></div>
        <div className={styles.controls}><button className={styles.button} onClick={() => { setNormalized(true); progress.completeTask("normalize-activations"); }}>Normalize activations</button><button className={styles.button} onClick={() => setNormalized(false)}>Restore raw</button></div>
      </LessonSection>

      <LessonSection id="batch-vs-layer" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["compare-normalization-axes"])}>ACTIVITY 07 · WHICH AXIS?</TaskStamp>
        <h2>BatchNorm and LayerNorm look similar — but normalize different groups.</h2>
        <p>Each row is one example/token; each column is one feature. Inspect both axes. Blue marks a BatchNorm-style column reference; violet marks a LayerNorm-style row reference.</p>
        <div className={styles.axisButtons}><button className={axis === "batch" ? styles.active : ""} onClick={() => runAxis("batch")}>BatchNorm: across batch per feature</button><button className={axis === "layer" ? styles.active : ""} onClick={() => runAxis("layer")}>LayerNorm: across features per example</button></div>
        <div className={`${styles.matrix} ${axis === "batch" ? styles.batch : styles.layer}`}>{matrixDisplay.flat().map((x, i) => <span key={i}>{x.toFixed(2)}</span>)}</div>
        <p className={styles.formula}>{axis === "batch" ? "For each feature column: use statistics from multiple examples in the batch." : "For each example/token row: use statistics from its own feature dimensions."}</p>
      </LessonSection>

      <LessonSection id="normalization-traps" onVisit={progress.markVisited} className={styles.scene}>
        <TaskStamp done={Boolean(progress.completedTasks["diagnose-normalization"])}>ACTIVITY 08 · TRIAGE</TaskStamp>
        <h2>Choose the right intervention.</h2>
        <p>Normalization is not a magic “make training good” button. Diagnose the actual failure signal first.</p>
        <div className={styles.diagnosis}>{diagnosisCases.map((item, i) => <div className={styles.case} key={item.text}><p><strong>CASE {i + 1}</strong><br />{item.text}</p><div className={styles.choices}>{(["vanishing","exploding","clip","layernorm"] as Diagnosis[]).map((choice) => { const selected = diagnoses[i] === choice; const className = selected ? (choice === item.answer ? styles.correct : styles.wrong) : ""; return <button key={choice} className={className} onClick={() => chooseDiagnosis(i, choice)}>{choice}</button>; })}</div></div>)}</div>
      </LessonSection>

      <LessonSection id="explain-gradient-health" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}>
        <TaskStamp done={Boolean(progress.completedTasks["explain-gradient-health"])}>ACTIVITY 09 · FEYNMAN CHECK</TaskStamp>
        <h2>Explain why deep networks can have unhealthy gradients.</h2>
        <p>Use your own words. Distinguish the multiplied derivative chain from stabilization tools such as normalization and clipping.</p>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="In backprop, each layer contributes a local derivative..." />
        <button className={styles.button} onClick={submitExplanation}>Check explanation</button>
        {explainFeedback && <div className={styles.feedback}>{explainFeedback}</div>}
      </LessonSection>

      <section className={styles.quiz}>
        <h2>Gradient Health Check</h2>
        {!quizUnlocked ? <div className={styles.locked}>Locked: finish all 9 interventions and visit all 9 rooms. Current: {tasksDone}/9 tasks · {sectionsRead}/9 rooms.</div> : <>{quizQuestions.map((q, i) => <div className={styles.question} key={q.q}><strong>{i + 1}. {q.q}</strong>{q.options.map((option, j) => <button key={option} className={quizAnswers[i] === j ? styles.selected : ""} onClick={() => setQuizAnswers((current) => ({ ...current, [i]: j }))}>{option}</button>)}</div>)}<button className={styles.button} onClick={submitQuiz}>Submit quiz</button>{quizFeedback && <div className={styles.feedback}>{quizFeedback}</div>}</>}
        <div className={styles.footerNav}><Link href="/lessons/sgd-batches-epochs">← SGD, batches & epochs</Link><Link href="/">Course map →</Link></div>
      </section>
    </main>
  );
}
