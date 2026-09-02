"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { XOR_DATASET, binaryCrossEntropy, createToyNetwork, datasetLoss, forwardToyNetwork, sigmoid } from "@/lib/toy-neural-network";
import { applyToyGradients, computeToyGradients, gradientL2Norm, scalarBackpropTrace } from "@/lib/toy-neural-network-gradients";
import styles from "./loss-gradients-backprop.module.css";

type Props = { progress: LessonProgressApi };
type RateZone = "tiny" | "useful" | "wild";
type BackPhase = "loss" | "output" | "hidden" | "first-weight";

const sections = [
  { id: "loss", taskId: "compare-loss" },
  { id: "loss-landscape", taskId: "walk-loss-landscape" },
  { id: "gradient", taskId: "inspect-gradient" },
  { id: "learning-rate", taskId: "test-learning-rate" },
  { id: "gradient-descent", taskId: "run-gradient-descent" },
  { id: "chain-rule", taskId: "trace-chain-rule" },
  { id: "backprop", taskId: "run-backprop" },
  { id: "real-network-gradients", taskId: "inspect-real-gradients" },
  { id: "explain-backprop", taskId: "explain-backprop" },
] as const;

const scalarData = [
  { x: -1.0, y: 0 as const },
  { x: -0.55, y: 0 as const },
  { x: 0.55, y: 1 as const },
  { x: 1.0, y: 1 as const },
];

function scalarDatasetLoss(weight: number) {
  return scalarData.reduce((sum, row) => sum + binaryCrossEntropy(sigmoid(weight * row.x), row.y), 0) / scalarData.length;
}

function numericalGradient(weight: number, epsilon = 0.01) {
  return (scalarDatasetLoss(weight + epsilon) - scalarDatasetLoss(weight - epsilon)) / (2 * epsilon);
}

const quizQuestions = [
  { q: "What is a loss function for?", options: ["Turning prediction error into an optimization objective", "Storing weights", "Choosing the CSS theme", "Creating train/test rows"], correct: 0, why: "Training needs a scalar objective that says how bad current predictions are under the chosen task objective." },
  { q: "What does a gradient tell us?", options: ["How loss changes locally with respect to parameters", "The final class label", "How many examples exist", "The model provider"], correct: 0, why: "A gradient contains partial derivatives: local sensitivity of loss to each parameter." },
  { q: "Why update w ← w − η∇L?", options: ["Subtracting the gradient moves locally downhill for a sufficiently suitable step size", "The gradient is always the answer", "It deletes the dataset", "Minus signs are conventional only"], correct: 0, why: "The gradient points toward local increase; subtracting it aims toward local decrease." },
  { q: "What is learning rate η?", options: ["A step-size hyperparameter for parameter updates", "A learned weight", "A label", "A test metric"], correct: 0, why: "Learning rate controls how far an optimizer moves along the update direction." },
  { q: "What is backpropagation?", options: ["An efficient application of the chain rule that computes gradients backward through a computation graph", "The optimizer itself", "The forward pass", "Random initialization"], correct: 0, why: "Backprop computes derivatives. An optimizer then decides how to use them to update parameters." },
  { q: "Does backprop update weights by itself?", options: ["No — it computes gradients; an optimizer/update rule applies them", "Yes, always", "Only for CNNs", "Only at inference"], correct: 0, why: "Separating gradient computation from the optimizer is a key mental model." },
  { q: "Why can a huge learning rate fail?", options: ["Steps can overshoot low-loss regions or diverge", "It makes gradients disappear from math", "It always underfits", "It turns BCE into MSE"], correct: 0, why: "A useful direction can still fail when step size is too large." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function SlopeBot({ downhill = true }: { downhill?: boolean }) {
  return <motion.div className={styles.slopeBot} animate={{ rotate: downhill ? [0, -5, 0] : [0, 5, 0], y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}><div><i/><i/><strong>∇</strong><span>{downhill ? "↓" : "↑"}</span></div><b>GRAD</b></motion.div>;
}

function ChainNode({ label, value, hot = false }: { label: string; value: string; hot?: boolean }) {
  return <motion.div className={`${styles.chainNode} ${hot ? styles.chainHot : ""}`} animate={{ scale: hot ? [1, 1.08, 1] : 1 }} transition={{ duration: 1.2 }}><span>{label}</span><strong>{value}</strong></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quizQuestions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  const passed = score >= 6;
  if (!unlocked) return <div className={styles.quizLock}>⛰️🔒<h3>Backprop exam locked.</h3><p>Walk downhill and send the credit signal backward first.</p></div>;
  return <div className={styles.quiz}>{quizQuestions.map((q, i) => <section key={q.q}><h3><span>{i + 1}</span>{q.q}</h3><div>{q.options.map((option, j) => <button disabled={submitted} className={`${answers[i] === j ? styles.selected : ""} ${submitted && j === q.correct ? styles.correct : ""} ${submitted && answers[i] === j && j !== q.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [i]: j }))} key={option}>{option}</button>)}</div>{submitted && <p>{q.why}</p>}</section>)}{!submitted ? <button disabled={Object.keys(answers).length !== quizQuestions.length} onClick={() => { setSubmitted(true); progress.saveQuiz(score, passed); }}>CHECK THE GRADIENT →</button> : <div className={`${styles.quizResult} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><p>{passed ? "You can separate loss, gradient, backprop and optimizer update." : "Pass is 6/7. Walk the landscape again."}</p>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</div>}</div>;
}

export function LossGradientsBackpropLesson({ progress }: Props) {
  const [target, setTarget] = useState<0 | 1>(1);
  const [prediction, setPrediction] = useState(.5);
  const [lossCases, setLossCases] = useState<string[]>([]);
  const [landscapeW, setLandscapeW] = useState(-2.4);
  const [landscapeZones, setLandscapeZones] = useState<string[]>([]);
  const [gradientW, setGradientW] = useState(-1.7);
  const [gradientSigns, setGradientSigns] = useState<string[]>([]);
  const [rate, setRate] = useState(.3);
  const [rateZones, setRateZones] = useState<RateZone[]>([]);
  const [rateHistory, setRateHistory] = useState<{ w: number; loss: number }[]>([]);
  const [gdW, setGdW] = useState(-2.5);
  const [gdHistory, setGdHistory] = useState<{ w: number; loss: number }[]>([]);
  const [chainPhase, setChainPhase] = useState<BackPhase>("loss");
  const [chainSeen, setChainSeen] = useState<BackPhase[]>([]);
  const [w1, setW1] = useState(.7);
  const [w2, setW2] = useState(-.9);
  const [backSteps, setBackSteps] = useState(0);
  const [toyNetwork, setToyNetwork] = useState(() => createToyNetwork(9, 4));
  const [realGradSeen, setRealGradSeen] = useState<string[]>([]);
  const [realStepRate, setRealStepRate] = useState(.5);
  const [realBeforeAfter, setRealBeforeAfter] = useState<{ before: number; after: number } | null>(null);
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const bce = binaryCrossEntropy(prediction, target);
  const mse = (prediction - target) ** 2;
  const landscapeLoss = scalarDatasetLoss(landscapeW);
  const localGrad = numericalGradient(gradientW);
  const leftLoss = scalarDatasetLoss(gradientW - .15);
  const rightLoss = scalarDatasetLoss(gradientW + .15);
  const gdGrad = numericalGradient(gdW);
  const chain = scalarBackpropTrace({ x: .8, y: 1, w1, b1: .1, w2, b2: -.1 });
  const toyGradients = computeToyGradients(toyNetwork, XOR_DATASET);
  const toyGradNorm = gradientL2Norm(toyGradients);
  const toyLoss = datasetLoss(toyNetwork, XOR_DATASET);

  const landscapePoints = useMemo(() => Array.from({ length: 81 }, (_, index) => {
    const w = -4 + index * .1;
    return { w, loss: scalarDatasetLoss(w) };
  }), []);
  const maxLandscapeLoss = Math.max(...landscapePoints.map(point => point.loss));

  const recordLoss = () => {
    const zone = prediction < .2 ? `${target}-low` : prediction > .8 ? `${target}-high` : `${target}-mid`;
    setLossCases(current => current.includes(zone) ? current : [...current, zone]);
  };
  const recordLandscape = () => {
    const zone = landscapeW < -1 ? "left" : landscapeW > 1 ? "right" : "middle";
    setLandscapeZones(current => current.includes(zone) ? current : [...current, zone]);
  };
  const recordGradient = () => {
    const sign = localGrad < -.03 ? "negative" : localGrad > .03 ? "positive" : "flat";
    setGradientSigns(current => current.includes(sign) ? current : [...current, sign]);
  };
  const runRateExperiment = () => {
    const zone: RateZone = rate < .08 ? "tiny" : rate > 4 ? "wild" : "useful";
    setRateZones(current => current.includes(zone) ? current : [...current, zone]);
    let w = -2.5;
    const history = [{ w, loss: scalarDatasetLoss(w) }];
    for (let step = 0; step < 10; step++) {
      w -= rate * numericalGradient(w);
      history.push({ w, loss: scalarDatasetLoss(w) });
      if (!Number.isFinite(w) || Math.abs(w) > 20) break;
    }
    setRateHistory(history);
  };
  const gdStep = () => {
    const nextW = gdW - .8 * gdGrad;
    setGdHistory(current => [...current, { w: gdW, loss: scalarDatasetLoss(gdW) }].slice(-12));
    setGdW(nextW);
  };
  const chooseChainPhase = (phase: BackPhase) => {
    setChainPhase(phase);
    setChainSeen(current => current.includes(phase) ? current : [...current, phase]);
  };
  const backpropStep = () => {
    const lr = .7;
    setW2(value => value - lr * chain.dL_dw2);
    setW1(value => value - lr * chain.dL_dw1);
    setBackSteps(value => value + 1);
  };
  const inspectRealGradient = (id: string) => setRealGradSeen(current => current.includes(id) ? current : [...current, id]);
  const applyRealStep = () => {
    const before = datasetLoss(toyNetwork, XOR_DATASET);
    const next = applyToyGradients(toyNetwork, toyGradients, realStepRate);
    const after = datasetLoss(next, XOR_DATASET);
    setToyNetwork(next);
    setRealBeforeAfter({ before, after });
  };

  useEffect(() => { if (["0-low", "0-high", "1-low", "1-high"].every(zone => lossCases.includes(zone))) progress.completeTask("compare-loss"); }, [lossCases, progress]);
  useEffect(() => { if (["left", "middle", "right"].every(zone => landscapeZones.includes(zone))) progress.completeTask("walk-loss-landscape"); }, [landscapeZones, progress]);
  useEffect(() => { if (["negative", "positive", "flat"].filter(zone => gradientSigns.includes(zone)).length >= 2) progress.completeTask("inspect-gradient"); }, [gradientSigns, progress]);
  useEffect(() => { if (["tiny", "useful", "wild"].every(zone => rateZones.includes(zone as RateZone))) progress.completeTask("test-learning-rate"); }, [rateZones, progress]);
  useEffect(() => { if (gdHistory.length >= 6 && scalarDatasetLoss(gdW) < scalarDatasetLoss(-2.5) * .45) progress.completeTask("run-gradient-descent"); }, [gdHistory, gdW, progress]);
  useEffect(() => { if (["loss", "output", "hidden", "first-weight"].every(phase => chainSeen.includes(phase as BackPhase))) progress.completeTask("trace-chain-rule"); }, [chainSeen, progress]);
  useEffect(() => { if (backSteps >= 6 && chain.loss < .35) progress.completeTask("run-backprop"); }, [backSteps, chain.loss, progress]);
  useEffect(() => { if (realGradSeen.length >= 6 && realBeforeAfter && realBeforeAfter.after < realBeforeAfter.before) progress.completeTask("inspect-real-gradients"); }, [realGradSeen, realBeforeAfter, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["loss", "prediction", "target", "gradient", "slope", "learning rate", "backprop", "chain", "derivative", "optimizer", "weight", "update"].filter(term => text.includes(term));
    if (explanation.trim().length < 135) { setFeedback("Explain the complete loop: prediction → loss → gradient/backprop → optimizer update → lower loss."); return; }
    if (hits.length < 8) { setFeedback("Use precise words: loss, target, gradient/slope, learning rate, chain rule/backprop, optimizer, weights/update."); return; }
    setFeedback("Strong. You separated what measures error, what computes derivatives, and what actually updates the parameters.");
    progress.completeTask("explain-backprop");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 02 · LESSON 03</span><h1>WRONG?<br/>HOW MUCH?<br/><em>WHICH WAY?</em></h1><p><strong>Loss</strong> says how bad the current prediction is. A <strong>gradient</strong> says how that loss changes if parameters move. <strong>Backpropagation</strong> computes those gradients efficiently through many layers.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroHill}><SlopeBot/><svg viewBox="0 0 100 70"><path d="M2 8 C18 60 30 62 48 43 S71 22 98 8" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="25" cy="55" r="4"/></svg><span>LOSS LANDSCAPE</span></div></section>

    <LessonSection id="loss" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="SLIDE · FLIP TARGET" title="Loss turns “wrong” into a number we can optimize.">Move the prediction and flip the true target. Compare binary cross-entropy and squared error. Both are low when prediction matches target, but they shape optimization differently.</Heading>
      <div className={styles.lossLab}><div className={styles.targetCard}><span>TRUE TARGET</span><div><button className={target === 0 ? styles.active : ""} onClick={() => setTarget(0)}>0 · BLOOP</button><button className={target === 1 ? styles.active : ""} onClick={() => setTarget(1)}>1 · ZING</button></div><label>PREDICTION P(ZING) <strong>{prediction.toFixed(2)}</strong><input type="range" min=".02" max=".98" step=".02" value={prediction} onChange={event => setPrediction(Number(event.target.value))}/></label><button onClick={recordLoss}>RECORD THIS CASE</button><small>Need target 0/1 with both low/high predictions.</small></div><div className={styles.lossMeters}><article><span>BINARY CROSS-ENTROPY</span><motion.strong key={bce} initial={{ scale: .8 }} animate={{ scale: 1 }}>{bce.toFixed(3)}</motion.strong><i><b style={{ width: `${Math.min(100, bce / 4 * 100)}%` }}/></i><p>Common binary-classification objective when sigmoid output parameterizes Bernoulli probability.</p></article><article><span>SQUARED ERROR</span><motion.strong key={mse} initial={{ scale: .8 }} animate={{ scale: 1 }}>{mse.toFixed(3)}</motion.strong><i><b style={{ width: `${Math.min(100, mse * 100)}%` }}/></i><p>Often natural for regression. This comparison is for intuition; objective choice depends on the probabilistic/task model.</p></article></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-loss"])}>Record four opposite prediction/target cases.</TaskStamp>
    </LessonSection>

    <LessonSection id="loss-landscape" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="SLIDE · WALK THE HILL" title="A parameter creates a location on the loss landscape.">Our whole toy model has one weight. Move it. Each position produces predictions on four examples and therefore one average loss.</Heading>
      <div className={styles.landscapeLab}><div className={styles.landscapePlot}><svg viewBox="0 0 100 70"><polyline points={landscapePoints.map((point, index) => `${index / (landscapePoints.length - 1) * 96 + 2},${64 - Math.min(58, point.loss / maxLandscapeLoss * 55)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="3"/></svg><motion.i animate={{ left: `${(landscapeW + 4) / 8 * 96 + 2}%`, top: `${64 - Math.min(58, landscapeLoss / maxLandscapeLoss * 55)}%` }}/></div><div className={styles.landscapeConsole}><label>WEIGHT w <strong>{landscapeW.toFixed(2)}</strong><input type="range" min="-4" max="4" step=".05" value={landscapeW} onChange={event => setLandscapeW(Number(event.target.value))}/></label><span>AVERAGE BCE LOSS</span><strong>{landscapeLoss.toFixed(4)}</strong><button onClick={recordLandscape}>RECORD POSITION</button><p>Visit negative/left, near-zero/middle and positive/right regions. Seen {landscapeZones.length}/3.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["walk-loss-landscape"])}>Walk all three weight regions of the landscape.</TaskStamp>
    </LessonSection>

    <LessonSection id="gradient" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="MEASURE LEFT · RIGHT" title="Gradient is local slope, not a map of the whole mountain.">We estimate dL/dw numerically by measuring a tiny step left and right. The sign tells which direction increases loss locally.</Heading>
      <div className={styles.gradientLab}><div className={styles.slopeBoard}><div><span>w−0.15</span><strong>{leftLoss.toFixed(3)}</strong></div><SlopeBot downhill={localGrad > 0}/><div><span>w+0.15</span><strong>{rightLoss.toFixed(3)}</strong></div><motion.b animate={{ rotate: Math.max(-28, Math.min(28, localGrad * 18)) }}/></div><div className={styles.gradientConsole}><label>WEIGHT w <strong>{gradientW.toFixed(2)}</strong><input type="range" min="-4" max="4" step=".05" value={gradientW} onChange={event => setGradientW(Number(event.target.value))}/></label><code>dL/dw ≈ {localGrad.toFixed(4)}</code><p>{Math.abs(localGrad) < .03 ? "Locally flat-ish: tiny parameter changes barely affect loss." : localGrad > 0 ? "Positive gradient: increasing w raises loss locally, so gradient descent subtracts and moves left." : "Negative gradient: increasing w lowers loss locally, so subtracting a negative gradient moves right."}</p><button onClick={recordGradient}>RECORD GRADIENT SIGN</button><small>Inspect at least two distinct gradient regimes.</small></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-gradient"])}>Inspect at least two local gradient regimes.</TaskStamp>
    </LessonSection>

    <LessonSection id="learning-rate" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="RUN 10 STEPS" title="Direction can be right while step size is wrong.">Use the same gradient rule from the same starting weight. Tiny η crawls. Useful η descends. Huge η can overshoot or become unstable.</Heading>
      <div className={styles.rateLab}><div className={styles.rateControls}><label>LEARNING RATE η <strong>{rate.toFixed(2)}</strong><input type="range" min=".01" max="7" step=".01" value={rate} onChange={event => setRate(Number(event.target.value))}/></label><div className={styles.rateZones}><span className={rate < .08 ? styles.active : ""}>TINY</span><span className={rate >= .08 && rate <= 4 ? styles.active : ""}>USEFUL RANGE</span><span className={rate > 4 ? styles.active : ""}>WILD</span></div><button onClick={runRateExperiment}>RUN 10 UPDATES</button><p>Test all three regimes. Exact useful range is task/optimizer dependent.</p></div><div className={styles.rateTape}>{rateHistory.map((point, index) => <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={index}><span>{index}</span><i style={{ height: `${Math.min(150, 18 + point.loss * 55)}px` }}/><small>L={point.loss.toFixed(2)}</small><b>w={Number.isFinite(point.w) ? point.w.toFixed(2) : "∞"}</b></motion.div>)}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["test-learning-rate"])}>Run tiny, useful and overly large learning-rate experiments.</TaskStamp>
    </LessonSection>

    <LessonSection id="gradient-descent" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="CLICK · DESCEND" title="Gradient descent repeats one simple local move.">Press STEP. Each update recomputes the gradient at the new location: w ← w − η·dL/dw. The path is built from local information.</Heading>
      <div className={styles.gdLab}><div className={styles.gdMountain}><svg viewBox="0 0 100 70"><polyline points={landscapePoints.map((point, index) => `${index / (landscapePoints.length - 1) * 96 + 2},${64 - Math.min(58, point.loss / maxLandscapeLoss * 55)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="3"/>{gdHistory.map((point, index) => <circle key={index} cx={(point.w + 4) / 8 * 96 + 2} cy={64 - Math.min(58, point.loss / maxLandscapeLoss * 55)} r="1.8"/>)}<circle cx={(gdW + 4) / 8 * 96 + 2} cy={64 - Math.min(58, scalarDatasetLoss(gdW) / maxLandscapeLoss * 55)} r="3.5"/></svg></div><div className={styles.gdConsole}><span>STEP {gdHistory.length}</span><strong>w {gdW.toFixed(4)}</strong><code>loss {scalarDatasetLoss(gdW).toFixed(4)}</code><code>gradient {gdGrad.toFixed(4)}</code><code>next = {gdW.toFixed(3)} − .8×({gdGrad.toFixed(3)})</code><button onClick={gdStep}>ONE GRADIENT STEP ↓</button><button onClick={() => { setGdW(-2.5); setGdHistory([]); }}>RESET</button></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["run-gradient-descent"])}>Take six+ steps and substantially reduce loss.</TaskStamp>
    </LessonSection>

    <LessonSection id="chain-rule" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="CLICK BACKWARD" title="Chain rule connects distant causes to the final loss.">Forward: x → z₁ → tanh → z₂ → sigmoid → loss. Backward: multiply local derivatives so we know how w₁ affected the final loss through every intermediate node.</Heading>
      <div className={styles.chainLab}><div className={styles.chainGraph}><ChainNode label="x" value={chain.x.toFixed(2)}/><b>× w₁</b><ChainNode label="z₁" value={chain.z1.toFixed(2)} hot={chainPhase === "first-weight"}/><b>tanh</b><ChainNode label="a₁" value={chain.a1.toFixed(2)} hot={chainPhase === "hidden"}/><b>× w₂</b><ChainNode label="z₂" value={chain.z2.toFixed(2)} hot={chainPhase === "output"}/><b>sigmoid</b><ChainNode label="p" value={chain.prediction.toFixed(2)} hot={chainPhase === "loss"}/><b>→</b><ChainNode label="LOSS" value={chain.loss.toFixed(2)} hot={chainPhase === "loss"}/></div><div className={styles.chainButtons}>{(["loss","output","hidden","first-weight"] as BackPhase[]).map((phase, index) => <button className={`${chainPhase === phase ? styles.active : ""} ${chainSeen.includes(phase) ? styles.done : ""}`} onClick={() => chooseChainPhase(phase)} key={phase}>{index + 1}. {phase === "loss" ? "START AT LOSS" : phase === "output" ? "BACK THROUGH OUTPUT" : phase === "hidden" ? "BACK THROUGH tanh" : "REACH w₁"}</button>)}</div><div className={styles.chainMath}>{chainPhase === "loss" && <><code>dL/dz₂ = p − y = {chain.dL_dz2.toFixed(4)}</code><p>For sigmoid + BCE, this derivative simplifies nicely.</p></>}{chainPhase === "output" && <><code>dL/dw₂ = dL/dz₂ · a₁ = {chain.dL_dw2.toFixed(4)}</code><code>dL/da₁ = dL/dz₂ · w₂ = {chain.dL_da1.toFixed(4)}</code></>}{chainPhase === "hidden" && <><code>da₁/dz₁ = 1 − tanh²(z₁) = {chain.da1_dz1.toFixed(4)}</code><code>dL/dz₁ = dL/da₁ · da₁/dz₁ = {chain.dL_dz1.toFixed(4)}</code></>}{chainPhase === "first-weight" && <><code>dz₁/dw₁ = x = {chain.x.toFixed(2)}</code><code>dL/dw₁ = dL/dz₁ · x = {chain.dL_dw1.toFixed(4)}</code></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["trace-chain-rule"])}>Trace all four backward chain-rule stages.</TaskStamp>
    </LessonSection>

    <LessonSection id="backprop" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="UPDATE · RECOMPUTE" title="Backprop computes gradients. The update rule uses them.">Change w₁/w₂ manually if you want, then run six update steps. Every click recomputes the forward values and the chain-rule gradients.</Heading>
      <div className={styles.backpropLab}><div className={styles.backControls}><label>w₁ <strong>{w1.toFixed(3)}</strong><input type="range" min="-2" max="2" step=".05" value={w1} onChange={event => { setW1(Number(event.target.value)); setBackSteps(0); }}/></label><label>w₂ <strong>{w2.toFixed(3)}</strong><input type="range" min="-2" max="2" step=".05" value={w2} onChange={event => { setW2(Number(event.target.value)); setBackSteps(0); }}/></label><button onClick={backpropStep}>BACKPROP + OPTIMIZER STEP</button><span>{backSteps} updates</span></div><div className={styles.backReadout}><ChainNode label="prediction" value={chain.prediction.toFixed(3)}/><ChainNode label="loss" value={chain.loss.toFixed(3)} hot/><code>dL/dw₁ {chain.dL_dw1.toFixed(4)}</code><code>dL/dw₂ {chain.dL_dw2.toFixed(4)}</code><p>Backprop found the gradients. Our simple SGD-like rule then changed w₁ and w₂.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["run-backprop"])}>Run six+ backward/update steps and reach low loss.</TaskStamp>
    </LessonSection>

    <LessonSection id="real-network-gradients" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="REAL 2→4→1 GRADIENTS" title="The same idea scales to many parameters.">This panel uses the same real XOR-like network engine from Lesson 01. Click six gradients, then apply one gradient update and verify the actual dataset loss decreases.</Heading>
      <div className={styles.realGradLab}><div className={styles.gradientMatrix}>{toyGradients.dw1.map((row, h) => row.map((value, i) => <button className={realGradSeen.includes(`w1-${h}-${i}`) ? styles.gradSeen : ""} onClick={() => inspectRealGradient(`w1-${h}-${i}`)} key={`${h}-${i}`}><span>∂L/∂w1[{h},{i}]</span><strong className={value >= 0 ? styles.gradPos : styles.gradNeg}>{value.toFixed(4)}</strong></button>))}{toyGradients.dw2.map((value, h) => <button className={realGradSeen.includes(`w2-${h}`) ? styles.gradSeen : ""} onClick={() => inspectRealGradient(`w2-${h}`)} key={h}><span>∂L/∂w2[{h}]</span><strong className={value >= 0 ? styles.gradPos : styles.gradNeg}>{value.toFixed(4)}</strong></button>)}</div><div className={styles.realGradConsole}><SlopeBot downhill/><span>DATASET LOSS</span><strong>{toyLoss.toFixed(4)}</strong><span>GRADIENT L2 NORM</span><strong>{toyGradNorm.toFixed(4)}</strong><label>STEP RATE <b>{realStepRate.toFixed(2)}</b><input type="range" min=".05" max="1.5" step=".05" value={realStepRate} onChange={event => setRealStepRate(Number(event.target.value))}/></label><button onClick={applyRealStep}>APPLY ONE REAL GRADIENT UPDATE</button>{realBeforeAfter && <p className={realBeforeAfter.after < realBeforeAfter.before ? styles.lossDown : styles.lossUp}>{realBeforeAfter.before.toFixed(4)} → {realBeforeAfter.after.toFixed(4)}</p>}<small>Gradients inspected {realGradSeen.length}/6 minimum.</small></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-real-gradients"])}>Inspect six gradients and apply a loss-reducing real update.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-backprop" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain training without saying “the network fixes itself.”">Separate prediction, loss, gradient/backprop, learning rate and optimizer update.</Heading>
      <div className={styles.explainLab}><div><span>⛰️</span><p>“So backprop is the thing that changes the weights?”</p></div><section><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="First the forward pass predicts... loss compares... the gradient says... backprop uses chain rule to... then the optimizer with learning rate..."/><footer><span>{explanation.length} chars</span><button onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <p className={progress.completedTasks["explain-backprop"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</p>}</section></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-backprop"])}>Explain loss, gradients, backprop and optimizer updates.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div>SECTIONS<strong>{sectionsRead}/9</strong></div><div>TASKS<strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.open : ""}>QUIZ<strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><h2>Can you walk downhill through a computation graph?</h2><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Loss measures. Backprop differentiates. Optimizer updates.</h2></div><Link href="/lessons/weights-bias-activations">← LESSON 02</Link><div><small>NEXT</small><b>SGD, Batches, Epochs & Learning Rate</b><span>build queue</span></div></section>
  </main>;
}
