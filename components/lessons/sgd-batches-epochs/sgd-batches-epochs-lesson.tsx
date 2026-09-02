"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { XOR_DATASET, createToyNetwork, datasetLoss, sigmoid } from "@/lib/toy-neural-network";
import { applyToyGradients, computeToyGradients } from "@/lib/toy-neural-network-gradients";
import styles from "./sgd-batches-epochs.module.css";

type Props = { progress: LessonProgressApi };
type BatchZone = "stochastic" | "mini" | "full";
type PairZone = "small-noisy" | "balanced" | "large-step";

const sections = [
  { id: "epoch", taskId: "run-full-epoch" },
  { id: "batch-size", taskId: "test-batch-sizes" },
  { id: "sgd", taskId: "compare-gradient-noise" },
  { id: "shuffle", taskId: "test-shuffle" },
  { id: "updates", taskId: "count-updates" },
  { id: "mini-batch-trainer", taskId: "train-mini-batches" },
  { id: "learning-rate", taskId: "pair-rate-batch" },
  { id: "training-budget", taskId: "solve-training-budget" },
  { id: "explain-training-loop", taskId: "explain-training-loop" },
] as const;

const budgetCases = [
  { id: "u1", n: 1000, batch: 100, epochs: 3, answer: 30 },
  { id: "u2", n: 1000, batch: 250, epochs: 2, answer: 8 },
  { id: "u3", n: 120, batch: 1, epochs: 1, answer: 120 },
  { id: "u4", n: 120, batch: 120, epochs: 5, answer: 5 },
  { id: "u5", n: 96, batch: 32, epochs: 4, answer: 12 },
  { id: "u6", n: 100, batch: 32, epochs: 2, answer: 8 },
] as const;

const quizQuestions = [
  { q: "What is one epoch?", options: ["One complete pass through the training set under the current data-loader definition", "One optimizer update", "One batch", "One model checkpoint"], correct: 0, why: "An epoch is a pass over the training examples; it can contain many optimizer updates." },
  { q: "What does batch size control?", options: ["How many training examples contribute to one gradient estimate/update", "How many layers the network has", "How many test sets exist", "The learned weights directly"], correct: 0, why: "Batch size groups examples for a gradient estimate before an optimizer update." },
  { q: "With N=1000 and batch=100, roughly how many updates per epoch?", options: ["10", "100", "1000", "1"], correct: 0, why: "1000 / 100 = 10 batches, hence about 10 updates per epoch." },
  { q: "Classical SGD most literally uses...", options: ["One example per gradient update", "The whole dataset every update", "No gradients", "Only validation rows"], correct: 0, why: "Strict stochastic gradient descent uses single-example gradients; modern usage often says SGD for mini-batch variants too." },
  { q: "Why shuffle training examples?", options: ["To reduce systematic ordering effects/correlations in stochastic mini-batch updates", "To change labels", "To increase parameter count", "To make the test set larger"], correct: 0, why: "Shuffling changes which examples share batches and the order of stochastic updates." },
  { q: "Does larger batch always mean better training?", options: ["No — it changes gradient noise, memory/throughput and optimization behavior; there are tradeoffs", "Yes", "Only for regression", "Only at inference"], correct: 0, why: "Batch size is a systems + optimization tradeoff, not a monotonic quality knob." },
  { q: "Learning rate and batch size interact because...", options: ["The scale/noise of gradient estimates and step size jointly shape the optimization path", "Batch size changes labels", "Learning rate is a feature", "They are unrelated by definition"], correct: 0, why: "A step size that behaves well under one gradient-noise regime may behave differently under another." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function LoaderBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.loaderBot} animate={{ x: active ? [0, 7, 0] : [0, 3, 0], y: [0, -4, 0] }} transition={{ duration: active ? 1.3 : 3, repeat: Infinity }}><div><i/><i/><strong>▦</strong><span>→</span></div><b>LOADER</b></motion.div>;
}

function OptBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.optBot} animate={{ rotate: active ? [0, -5, 5, 0] : [0, 1, 0] }} transition={{ duration: active ? 1.1 : 3, repeat: Infinity }}><div><i/><i/><strong>Δw</strong></div><b>OPTIMIZER</b></motion.div>;
}

function shuffleIndexes(length: number, seed: number) {
  const values = Array.from({ length }, (_, index) => index);
  let state = seed || 1;
  const random = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function runScalarEpoch(order: number[], batchSize: number, lr: number, startWeight = -.9) {
  const examples = [
    { x: -.95, y: 0 }, { x: -.8, y: 0 }, { x: -.65, y: 0 }, { x: -.45, y: 0 },
    { x: -.2, y: 0 }, { x: -.05, y: 0 }, { x: .08, y: 1 }, { x: .25, y: 1 },
    { x: .46, y: 1 }, { x: .68, y: 1 }, { x: .82, y: 1 }, { x: .98, y: 1 },
  ];
  let w = startWeight;
  const path = [w];
  for (let start = 0; start < order.length; start += batchSize) {
    const ids = order.slice(start, start + batchSize);
    const gradient = ids.reduce((sum, id) => {
      const row = examples[id];
      return sum + (sigmoid(w * row.x) - row.y) * row.x;
    }, 0) / ids.length;
    w -= lr * gradient;
    path.push(w);
  }
  return { w, path };
}

function trainRealMiniBatch(batchSize: number, lr = .55, epochs = 80) {
  let network = createToyNetwork(42, 4);
  const curve: number[] = [datasetLoss(network, XOR_DATASET)];
  for (let epoch = 0; epoch < epochs; epoch++) {
    const order = shuffleIndexes(XOR_DATASET.length, 900 + epoch);
    for (let start = 0; start < order.length; start += batchSize) {
      const batch = order.slice(start, start + batchSize).map(index => XOR_DATASET[index]);
      const gradients = computeToyGradients(network, batch);
      network = applyToyGradients(network, gradients, lr);
    }
    if (epoch % 4 === 3) curve.push(datasetLoss(network, XOR_DATASET));
  }
  return { loss: datasetLoss(network, XOR_DATASET), curve };
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quizQuestions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  const passed = score >= 6;
  if (!unlocked) return <div className={styles.quizLock}>📦🔒<h3>Data-loader exam locked.</h3><p>Run every batch regime first.</p></div>;
  return <div className={styles.quiz}>{quizQuestions.map((q, i) => <section key={q.q}><h3><span>{i + 1}</span>{q.q}</h3><div>{q.options.map((option, j) => <button disabled={submitted} className={`${answers[i] === j ? styles.selected : ""} ${submitted && j === q.correct ? styles.correct : ""} ${submitted && answers[i] === j && j !== q.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [i]: j }))} key={option}>{option}</button>)}</div>{submitted && <p>{q.why}</p>}</section>)}{!submitted ? <button disabled={Object.keys(answers).length !== quizQuestions.length} onClick={() => { setSubmitted(true); progress.saveQuiz(score, passed); }}>CHECK TRAINING LOOP →</button> : <div className={`${styles.result} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><p>{passed ? "You can count passes, batches and parameter updates separately." : "Pass is 6/7. Re-run the conveyor."}</p>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</div>}</div>;
}

export function SgdBatchesEpochsLesson({ progress }: Props) {
  const dataset = useMemo(() => Array.from({ length: 12 }, (_, index) => ({ id: index, label: index < 6 ? 0 : 1 })), []);
  const [epochCursor, setEpochCursor] = useState(0);
  const [epochCount, setEpochCount] = useState(0);
  const [batchSize, setBatchSize] = useState(3);
  const [batchZones, setBatchZones] = useState<BatchZone[]>([]);
  const [gradientBatch, setGradientBatch] = useState(1);
  const [gradientSamples, setGradientSamples] = useState<number[][]>([]);
  const [shuffleRuns, setShuffleRuns] = useState<{ seed: number; finalW: number; path: number[] }[]>([]);
  const [nExamples, setNExamples] = useState(1000);
  const [calcBatch, setCalcBatch] = useState(100);
  const [calcEpochs, setCalcEpochs] = useState(3);
  const [updateChecks, setUpdateChecks] = useState<string[]>([]);
  const [miniRuns, setMiniRuns] = useState<Record<number, { loss: number; curve: number[] }>>({});
  const [pairBatch, setPairBatch] = useState(1);
  const [pairRate, setPairRate] = useState(.3);
  const [pairZones, setPairZones] = useState<PairZone[]>([]);
  const [pairPath, setPairPath] = useState<number[]>([]);
  const [budgetAnswers, setBudgetAnswers] = useState<Record<string, number>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const updatesPerEpoch = Math.ceil(nExamples / calcBatch);
  const totalUpdates = updatesPerEpoch * calcEpochs;
  const budgetCorrect = budgetCases.every(item => budgetAnswers[item.id] === item.answer);

  const nextEpochChunk = () => {
    const next = Math.min(dataset.length, epochCursor + batchSize);
    if (next >= dataset.length) { setEpochCount(value => value + 1); setEpochCursor(0); }
    else setEpochCursor(next);
  };
  const recordBatchZone = () => {
    const zone: BatchZone = batchSize === 1 ? "stochastic" : batchSize === dataset.length ? "full" : "mini";
    setBatchZones(current => current.includes(zone) ? current : [...current, zone]);
  };
  const sampleGradients = () => {
    const order = shuffleIndexes(dataset.length, gradientSamples.length + 12);
    const w = -.5;
    const xValues = [-.95,-.8,-.65,-.45,-.2,-.05,.08,.25,.46,.68,.82,.98];
    const yValues = [0,0,0,0,0,0,1,1,1,1,1,1];
    const ids = order.slice(0, gradientBatch);
    const per = ids.map(id => (sigmoid(w * xValues[id]) - yValues[id]) * xValues[id]);
    setGradientSamples(current => [...current, per].slice(-8));
  };
  const runShuffle = (seed: number) => {
    const order = shuffleIndexes(dataset.length, seed);
    const result = runScalarEpoch(order, 3, .9);
    setShuffleRuns(current => [...current.filter(item => item.seed !== seed), { seed, finalW: result.w, path: result.path }]);
  };
  const recordUpdateCount = () => {
    const key = `${nExamples}-${calcBatch}-${calcEpochs}`;
    setUpdateChecks(current => current.includes(key) ? current : [...current, key]);
  };
  const runMini = (size: number) => setMiniRuns(current => ({ ...current, [size]: trainRealMiniBatch(size) }));
  const runPair = () => {
    const zone: PairZone = pairBatch === 1 && pairRate <= .15 ? "small-noisy" : pairRate >= 2.5 ? "large-step" : "balanced";
    setPairZones(current => current.includes(zone) ? current : [...current, zone]);
    const order = shuffleIndexes(12, 77);
    const result = runScalarEpoch(order, pairBatch, pairRate, -1.2);
    setPairPath(result.path);
  };

  useEffect(() => { if (epochCount >= 1) progress.completeTask("run-full-epoch"); }, [epochCount, progress]);
  useEffect(() => { if (["stochastic","mini","full"].every(zone => batchZones.includes(zone as BatchZone))) progress.completeTask("test-batch-sizes"); }, [batchZones, progress]);
  useEffect(() => { const hasSingle = gradientSamples.some(sample => sample.length === 1); const hasFull = gradientSamples.some(sample => sample.length === 12); if (hasSingle && hasFull && gradientSamples.length >= 4) progress.completeTask("compare-gradient-noise"); }, [gradientSamples, progress]);
  useEffect(() => { if (shuffleRuns.length >= 3) progress.completeTask("test-shuffle"); }, [shuffleRuns, progress]);
  useEffect(() => { if (updateChecks.length >= 3) progress.completeTask("count-updates"); }, [updateChecks, progress]);
  useEffect(() => { if ([1,4,8].every(size => miniRuns[size])) progress.completeTask("train-mini-batches"); }, [miniRuns, progress]);
  useEffect(() => { if (["small-noisy","balanced","large-step"].every(zone => pairZones.includes(zone as PairZone))) progress.completeTask("pair-rate-batch"); }, [pairZones, progress]);
  useEffect(() => { if (budgetCorrect) progress.completeTask("solve-training-budget"); }, [budgetCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["epoch","pass","batch","example","gradient","update","sgd","shuffle","learning rate","optimizer"].filter(term => text.includes(term));
    if (explanation.trim().length < 120) { setFeedback("Explain dataset → batches → gradient → update, and how many updates make one epoch."); return; }
    if (hits.length < 7) { setFeedback("Use precise words: epoch/pass, batch/examples, gradient/update, SGD/shuffle, learning rate/optimizer."); return; }
    setFeedback("Strong. You separated data passes from optimizer steps and explained why batch size changes gradient noise and update count.");
    progress.completeTask("explain-training-loop");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 02 · LESSON 04</span><h1>LOAD.<br/>GRADIENT.<br/><em>UPDATE.</em></h1><p>The dataset does not jump into the optimizer all at once by magic. A <strong>data loader forms batches</strong>. Each batch produces a gradient estimate. The optimizer applies an update. An <strong>epoch</strong> is a complete pass over training data.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroConveyor}><LoaderBot active/><div className={styles.heroBoxes}>{dataset.map(row => <i key={row.id}>{row.label ? "Z" : "B"}</i>)}</div><OptBot active/></div></section>

    <LessonSection id="epoch" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · COMPLETE A PASS" title="One epoch means the loader has visited the training set once.">Process batches until all 12 examples have passed the optimizer gate. Every batch is one update; the epoch ends only when the full dataset pass completes.</Heading>
      <div className={styles.epochLab}><div className={styles.conveyor}>{dataset.map((row, index) => <motion.i animate={{ opacity: index < epochCursor ? .2 : 1, y: index < epochCursor ? 10 : 0 }} className={row.label ? styles.zing : styles.bloop} key={row.id}>{row.label ? "Z" : "B"}<span>#{row.id + 1}</span></motion.i>)}</div><div className={styles.epochConsole}><LoaderBot active={epochCursor > 0}/><label>BATCH SIZE <strong>{batchSize}</strong><input type="range" min="1" max="12" step="1" value={batchSize} onChange={event => setBatchSize(Number(event.target.value))}/></label><strong>EPOCHS DONE {epochCount}</strong><span>CURRENT PASS {epochCursor}/12 examples processed</span><button onClick={nextEpochChunk}>PROCESS NEXT BATCH → UPDATE</button></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["run-full-epoch"])}>Complete at least one full pass through all 12 examples.</TaskStamp>
    </LessonSection>

    <LessonSection id="batch-size" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="SLIDE · RECORD 3 REGIMES" title="Batch size decides how many examples vote on one gradient.">Batch=1 is classical stochastic gradient descent. Batch=12 is full-batch for this toy dataset. Values in between are mini-batches.</Heading>
      <div className={styles.batchLab}><div className={styles.batchBoxes}>{dataset.map((row, index) => <motion.i animate={{ scale: index < batchSize ? 1 : .65, opacity: index < batchSize ? 1 : .25 }} key={row.id}>{index < batchSize ? "IN BATCH" : "WAIT"}</motion.i>)}</div><div className={styles.batchConsole}><label>BATCH SIZE <strong>{batchSize}</strong><input type="range" min="1" max="12" step="1" value={batchSize} onChange={event => setBatchSize(Number(event.target.value))}/></label><div><span>EXAMPLES / UPDATE</span><strong>{batchSize}</strong></div><div><span>UPDATES / EPOCH</span><strong>{Math.ceil(12 / batchSize)}</strong></div><button onClick={recordBatchZone}>RECORD THIS REGIME</button><p>Find batch=1, one mini-batch value, and batch=12. Seen {batchZones.length}/3.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["test-batch-sizes"])}>Record stochastic, mini-batch and full-batch regimes.</TaskStamp>
    </LessonSection>

    <LessonSection id="sgd" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="SAMPLE · COMPARE NOISE" title="Small-batch gradients bounce around the underlying average.">Sample gradient estimates at the same weight. A one-example estimate depends heavily on which example you picked. A full-batch estimate averages all 12.</Heading>
      <div className={styles.noiseLab}><div className={styles.gradientSamples}>{gradientSamples.map((sample, index) => { const mean = sample.reduce((a,b) => a+b,0) / sample.length; return <motion.div initial={{ scale: .8 }} animate={{ scale: 1 }} key={index}><span>batch {sample.length}</span><i style={{ transform: `rotate(${Math.max(-55, Math.min(55, mean * 120))}deg)` }}/><strong>g≈{mean.toFixed(3)}</strong></motion.div>; })}</div><div className={styles.noiseConsole}><label>GRADIENT BATCH <strong>{gradientBatch}</strong><input type="range" min="1" max="12" step="1" value={gradientBatch} onChange={event => setGradientBatch(Number(event.target.value))}/></label><button onClick={sampleGradients}>SAMPLE A GRADIENT ESTIMATE</button><p>Get several samples including batch=1 and batch=12. “Noisy” does not mean useless — stochasticity can be a useful part of optimization.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-gradient-noise"])}>Compare repeated single-example and full-batch gradients.</TaskStamp>
    </LessonSection>

    <LessonSection id="shuffle" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="RUN THREE ORDERS" title="Same examples, different order, different stochastic path.">With mini-batches, early updates change the weights seen by later batches. Shuffle order therefore changes the exact trajectory even within the same epoch.</Heading>
      <div className={styles.shuffleLab}><div className={styles.shuffleButtons}>{[1,7,42].map(seed => <button onClick={() => runShuffle(seed)} key={seed}>RUN ORDER SEED {seed}</button>)}</div><div className={styles.paths}>{shuffleRuns.map(run => <article key={run.seed}><span>SEED {run.seed}</span><strong>final w {run.finalW.toFixed(3)}</strong><div>{run.path.map((w,index) => <i style={{ left: `${Math.max(0,Math.min(100,(w+2)/4*100))}%` }} key={index}/>)}</div></article>)}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["test-shuffle"])}>Run three different shuffled orders.</TaskStamp>
    </LessonSection>

    <LessonSection id="updates" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="SLIDE · COUNT" title="Epochs and updates are not interchangeable units.">For simple non-distributed training: updates per epoch ≈ ceil(N / batch size). Multiply by epochs to estimate total optimizer steps.</Heading>
      <div className={styles.updateLab}><div className={styles.updateFormula}><code>updates/epoch = ceil(N ÷ batch)</code><code>total updates = updates/epoch × epochs</code><strong>{updatesPerEpoch} × {calcEpochs} = {totalUpdates}</strong></div><div className={styles.updateControls}><label>TRAIN EXAMPLES N <strong>{nExamples}</strong><input type="range" min="100" max="2000" step="100" value={nExamples} onChange={event => setNExamples(Number(event.target.value))}/></label><label>BATCH <strong>{calcBatch}</strong><input type="range" min="25" max="500" step="25" value={calcBatch} onChange={event => setCalcBatch(Number(event.target.value))}/></label><label>EPOCHS <strong>{calcEpochs}</strong><input type="range" min="1" max="10" value={calcEpochs} onChange={event => setCalcEpochs(Number(event.target.value))}/></label><button onClick={recordUpdateCount}>RECORD TRAINING PLAN</button><p>Plans recorded {updateChecks.length}/3.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["count-updates"])}>Record at least three different training plans.</TaskStamp>
    </LessonSection>

    <LessonSection id="mini-batch-trainer" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="REAL 2→4→1 TRAINING" title="Batch size changes the real optimizer path in our toy network.">Train the same seeded XOR-like network with batch sizes 1, 4 and 8. Every run uses real gradients and updates; only how examples are grouped changes.</Heading>
      <div className={styles.miniGrid}>{[1,2,4,8].map(size => <article className={miniRuns[size] ? styles.miniDone : ""} key={size}><span>BATCH {size}</span><button onClick={() => runMini(size)}>TRAIN 80 EPOCHS</button>{miniRuns[size] && <><strong>loss {miniRuns[size].loss.toFixed(3)}</strong><div className={styles.sparkline}>{miniRuns[size].curve.map((loss,index) => <i style={{ height: `${Math.max(5,Math.min(100,loss*85))}%` }} key={index}/>)}</div><small>{Math.ceil(8/size)} updates/epoch</small></>}</article>)}</div>
      <TaskStamp done={Boolean(progress.completedTasks["train-mini-batches"])}>Run real training with batch 1, 4 and 8.</TaskStamp>
    </LessonSection>

    <LessonSection id="learning-rate" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="PAIR TWO KNOBS" title="Batch noise and step size meet in the same update.">Try a tiny step with batch=1, a balanced setup, and a deliberately huge step. There is no universal perfect pair — optimizers and scale matter.</Heading>
      <div className={styles.pairLab}><div className={styles.pairControls}><label>BATCH <strong>{pairBatch}</strong><input type="range" min="1" max="12" value={pairBatch} onChange={event => setPairBatch(Number(event.target.value))}/></label><label>LEARNING RATE <strong>{pairRate.toFixed(2)}</strong><input type="range" min=".03" max="4" step=".03" value={pairRate} onChange={event => setPairRate(Number(event.target.value))}/></label><button onClick={runPair}>RUN ONE EPOCH</button><p>Find: batch=1 + η≤.15; a middle/balanced pair; and η≥2.5. Seen {pairZones.length}/3.</p></div><div className={styles.pairPath}>{pairPath.map((w,index) => <motion.i initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ left: `${Math.max(2,Math.min(98,(w+3)/6*100))}%`, top: `${12+(index%5)*17}%` }} key={index}>{index}</motion.i>)}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["pair-rate-batch"])}>Test noisy-small-step, balanced and huge-step regimes.</TaskStamp>
    </LessonSection>

    <LessonSection id="training-budget" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="CALCULATE · SIX CASES" title="Turn dataset size, batch size and epochs into optimizer work.">Choose the total update count. We use ceil for the final partial batch in this simplified loader.</Heading>
      <div className={styles.budgetGrid}>{budgetCases.map(item => { const choice = budgetAnswers[item.id]; const options = Array.from(new Set([item.answer, Math.max(1,item.answer*2), Math.max(1,Math.floor(item.answer/2)), item.n*item.epochs])).sort((a,b)=>a-b); return <article className={choice !== undefined ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><code>N={item.n} · batch={item.batch} · epochs={item.epochs}</code><div>{options.map(option => <button className={choice === option ? styles.active : ""} onClick={() => setBudgetAnswers(current => ({ ...current, [item.id]: option }))} key={option}>{option} updates</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["solve-training-budget"])}>Solve all six optimizer-update counts.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-training-loop" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain one epoch without confusing it with one update.">Describe loader → batch → gradient → optimizer update → next batch → completed pass.</Heading>
      <div className={styles.explainLab}><div><LoaderBot active/><p>“If I train for 10 epochs, did the model update its weights only 10 times?”</p></div><section><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="An epoch is... The loader creates batches... each batch estimates... optimizer update... with N examples and batch size... SGD/shuffling... learning rate..."/><footer><span>{explanation.length} chars</span><button onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <p className={progress.completedTasks["explain-training-loop"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</p>}</section></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-training-loop"])}>Explain batches, epochs, SGD and update counts.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div>SECTIONS<strong>{sectionsRead}/9</strong></div><div>TASKS<strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.open : ""}>QUIZ<strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><h2>How many times did the optimizer actually move?</h2><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Epoch = pass. Batch = gradient sample. Update = parameter move.</h2></div><Link href="/lessons/loss-gradients-backprop">← LESSON 03</Link><div><small>NEXT</small><b>Vanishing, Exploding & Normalization</b><span>build queue</span></div></section>
  </main>;
}
