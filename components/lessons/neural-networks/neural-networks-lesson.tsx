"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import {
  XOR_DATASET,
  ToyNetwork,
  cloneToyNetwork,
  createToyNetwork,
  datasetLoss,
  forwardToyNetwork,
  sigmoid,
  trainToyNetwork,
} from "@/lib/toy-neural-network";
import styles from "./neural-networks.module.css";

type Props = { progress: LessonProgressApi };
type Phase = "input" | "hidden-sum" | "hidden-activation" | "output-sum" | "prediction";

const sections = [
  { id: "anatomy", taskId: "inspect-network-anatomy" },
  { id: "single-neuron", taskId: "control-neuron" },
  { id: "connections", taskId: "inspect-connections" },
  { id: "forward-pass", taskId: "run-forward-pass" },
  { id: "decision-space", taskId: "explore-decision-space" },
  { id: "real-training", taskId: "train-real-network" },
  { id: "hidden-neurons", taskId: "inspect-hidden-neurons" },
  { id: "break-restore", taskId: "break-restore-network" },
  { id: "explain-network", taskId: "explain-neural-network" },
] as const;

const anatomyCopy = {
  input: {
    simple: "Inputs are the numbers the network receives — measurements, pixels, token features, sensor values, etc.",
    real: "The input layer is not usually doing learning by itself; it presents numeric features/representations to the first learned transformation.",
    expert: "An input vector x ∈ R^d is consumed by affine/linear transformations in the next layer. The dimensionality is determined by the representation presented to the network.",
  },
  hidden: {
    simple: "Hidden neurons mix the inputs into new signals that can detect useful patterns.",
    real: "Each hidden unit computes a weighted sum plus bias, then applies a nonlinear activation. Multiple units can carve the input space into useful internal features.",
    expert: "For a dense layer, z = Wx + b and h = φ(z). Stacking nonlinear transformations allows the network to approximate functions a single linear map cannot represent.",
  },
  output: {
    simple: "The output turns the hidden signals into the answer we want from this network.",
    real: "For binary classification, one output logit can be passed through sigmoid to produce a value between 0 and 1.",
    expert: "The final layer maps the hidden representation to task logits. A link/activation such as sigmoid or softmax then parameterizes an output distribution.",
  },
} as const;

const quizQuestions = [
  { q: "What does a basic artificial neuron do?", options: ["Combines inputs with weights and bias, then applies an activation", "Stores the whole dataset", "Chooses the test split", "Downloads a model"], correct: 0, why: "A neuron/unit typically computes a weighted sum plus bias and then an activation." },
  { q: "What is a weight?", options: ["A learned number controlling how strongly one signal influences another", "A data row", "A test score", "A prompt"], correct: 0, why: "Training adjusts weights so useful input/hidden signals influence later units appropriately." },
  { q: "What does the bias term do?", options: ["Shifts a neuron's pre-activation threshold/offset", "Measures social bias only", "Adds more training rows", "Selects the optimizer"], correct: 0, why: "Bias is a learned offset in the affine transformation, not the fairness meaning of the word bias." },
  { q: "Why do hidden layers need nonlinear activations?", options: ["Without nonlinearity, stacked linear layers collapse to another linear transformation", "To make the UI colorful", "Only to save memory", "They do not"], correct: 0, why: "Nonlinear activations let stacked layers represent nonlinear relationships such as the XOR-like toy pattern." },
  { q: "What is a forward pass?", options: ["Computing activations from input through layers to output using current parameters", "Updating weights using gradients", "Splitting the dataset", "Saving a checkpoint only"], correct: 0, why: "Forward pass means run the current network from input to prediction; training adds loss/gradient/update steps afterward." },
  { q: "What happens during training in this lesson?", options: ["Loss is computed and gradients update the network's weights/biases", "The network reads the answer from a database", "Only the input values change", "The test set changes the labels"], correct: 0, why: "The toy engine performs real gradient-based updates on its parameters." },
  { q: "What can hidden neurons learn?", options: ["Intermediate representations/features useful for the final task", "Only final labels", "Nothing — they are decorative", "Only API keys"], correct: 0, why: "Hidden activations are learned internal representations; different units can respond to different regions/patterns." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function NeuronFace({ value, label, hot = false }: { value: number; label: string; hot?: boolean }) {
  return <motion.div className={`${styles.neuronFace} ${hot ? styles.hotNeuron : ""}`} animate={{ scale: 1 + Math.min(.1, Math.abs(value) * .06) }}><div><i/><i/><strong>{value.toFixed(2)}</strong></div><b>{label}</b></motion.div>;
}

function NetworkDiagram({ network, input, activeLayer = "all", onConnection }: { network: ToyNetwork; input: [number, number]; activeLayer?: string; onConnection?: (id: string) => void }) {
  const trace = forwardToyNetwork(network, input);
  const width = 760, height = 410;
  const inputPos = [{ x: 80, y: 130 }, { x: 80, y: 280 }];
  const hiddenPos = network.w1.map((_, index) => ({ x: 365, y: 65 + index * 92 }));
  const outputPos = { x: 680, y: 205 };
  return <div className={styles.networkDiagram}>
    <svg viewBox={`0 0 ${width} ${height}`}>
      {network.w1.flatMap((weights, h) => weights.map((weight, i) => <motion.line key={`i${i}-h${h}`} x1={inputPos[i].x} y1={inputPos[i].y} x2={hiddenPos[h].x} y2={hiddenPos[h].y} stroke={weight >= 0 ? "#315cff" : "#ff6558"} strokeWidth={1.5 + Math.min(7, Math.abs(weight) * 3)} opacity={activeLayer === "hidden" || activeLayer === "all" ? .85 : .22} onClick={() => onConnection?.(`i${i}-h${h}`)} />))}
      {network.w2.map((weight, h) => <motion.line key={`h${h}-o`} x1={hiddenPos[h].x} y1={hiddenPos[h].y} x2={outputPos.x} y2={outputPos.y} stroke={weight >= 0 ? "#315cff" : "#ff6558"} strokeWidth={1.5 + Math.min(7, Math.abs(weight) * 3)} opacity={activeLayer === "output" || activeLayer === "all" ? .85 : .22} onClick={() => onConnection?.(`h${h}-o`)} />)}
    </svg>
    {inputPos.map((pos, index) => <div className={`${styles.node} ${styles.inputNode}`} style={{ left: `${pos.x / width * 100}%`, top: `${pos.y / height * 100}%` }} key={index}><strong>{input[index].toFixed(2)}</strong><span>x{index + 1}</span></div>)}
    {hiddenPos.map((pos, index) => <div className={`${styles.node} ${styles.hiddenNode}`} style={{ left: `${pos.x / width * 100}%`, top: `${pos.y / height * 100}%` }} key={index}><strong>{trace.hiddenA[index].toFixed(2)}</strong><span>h{index + 1}</span></div>)}
    <div className={`${styles.node} ${styles.outputNode}`} style={{ left: `${outputPos.x / width * 100}%`, top: `${outputPos.y / height * 100}%` }}><strong>{trace.output.toFixed(2)}</strong><span>P(ZING)</span></div>
    <label className={styles.layerLabel} style={{ left: "5%" }}>INPUTS</label><label className={styles.layerLabel} style={{ left: "43%" }}>HIDDEN</label><label className={styles.layerLabel} style={{ right: "3%" }}>OUTPUT</label>
  </div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quizQuestions.reduce((sum, q, index) => sum + (answers[index] === q.correct ? 1 : 0), 0);
  const passed = score >= 6;
  if (!unlocked) return <div className={styles.quizLock}>🧠🔒<h3>Neural exam locked.</h3><p>Touch every layer and train the real toy network first.</p></div>;
  return <div className={styles.quiz}>{quizQuestions.map((q, index) => <section key={q.q}><h3><span>{index + 1}</span>{q.q}</h3><div>{q.options.map((option, optionIndex) => <button disabled={submitted} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === q.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== q.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}>{option}</button>)}</div>{submitted && <p>{q.why}</p>}</section>)}{!submitted ? <button disabled={Object.keys(answers).length !== quizQuestions.length} onClick={() => { setSubmitted(true); progress.saveQuiz(score, passed); }}>CHECK THE NETWORK →</button> : <div className={`${styles.quizResult} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><p>{passed ? "You can now see a neural network as math + learned connections, not a mysterious brain icon." : "Pass is 6/7. Re-run the network."}</p>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</div>}</div>;
}

export function NeuralNetworksLesson({ progress }: Props) {
  const [network, setNetwork] = useState(() => createToyNetwork(42, 4));
  const initialNetwork = useMemo(() => createToyNetwork(42, 4), []);
  const [anatomySeen, setAnatomySeen] = useState<string[]>([]);
  const [single, setSingle] = useState({ x1: .7, x2: .3, w1: .8, w2: -.5, b: .1 });
  const [neuronZones, setNeuronZones] = useState<string[]>([]);
  const [connectionsSeen, setConnectionsSeen] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("input");
  const [phasesSeen, setPhasesSeen] = useState<Phase[]>([]);
  const [probe, setProbe] = useState<[number, number]>([.32, .68]);
  const [dragging, setDragging] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);
  const [quadrantsSeen, setQuadrantsSeen] = useState<string[]>([]);
  const [epochs, setEpochs] = useState(0);
  const [learningRate, setLearningRate] = useState(.7);
  const [hiddenSeen, setHiddenSeen] = useState<number[]>([]);
  const [checkpoint, setCheckpoint] = useState<ToyNetwork | null>(null);
  const [broken, setBroken] = useState(false);
  const [restored, setRestored] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const trace = forwardToyNetwork(network, probe);
  const loss = datasetLoss(network, XOR_DATASET);
  const accuracy = XOR_DATASET.filter(point => (forwardToyNetwork(network, point.x).output >= .5 ? 1 : 0) === point.y).length / XOR_DATASET.length;
  const singleZ = single.x1 * single.w1 + single.x2 * single.w2 + single.b;
  const singleA = sigmoid(singleZ);

  const anatomyInspect = (id: string) => setAnatomySeen(current => current.includes(id) ? current : [...current, id]);
  const inspectConnection = (id: string) => setConnectionsSeen(current => current.includes(id) ? current : [...current, id]);
  const setForwardPhase = (next: Phase) => { setPhase(next); setPhasesSeen(current => current.includes(next) ? current : [...current, next]); };
  const markNeuronZone = () => { const zone = singleA < .3 ? "low" : singleA > .7 ? "high" : "mid"; setNeuronZones(current => current.includes(zone) ? current : [...current, zone]); };
  const updateProbeFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging && event.type === "pointermove") return;
    const rect = plotRef.current?.getBoundingClientRect(); if (!rect) return;
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
    setProbe([x, y]);
    const quadrant = `${x < .5 ? "L" : "R"}${y < .5 ? "B" : "T"}`;
    setQuadrantsSeen(current => current.includes(quadrant) ? current : [...current, quadrant]);
  };
  const train = (count = 50) => { setNetwork(current => trainToyNetwork(current, XOR_DATASET, count, learningRate)); setEpochs(value => value + count); };
  const saveCheckpoint = () => setCheckpoint(cloneToyNetwork(network));
  const breakNetwork = () => {
    setNetwork(current => ({ ...cloneToyNetwork(current), w1: current.w1.map(() => [0, 0]), b1: current.b1.map(() => 0), w2: current.w2.map(() => 0), b2: 0 }));
    setBroken(true); setRestored(false);
  };
  const restoreNetwork = () => { if (checkpoint) { setNetwork(cloneToyNetwork(checkpoint)); setRestored(true); } };

  useEffect(() => { if (anatomySeen.length === 3) progress.completeTask("inspect-network-anatomy"); }, [anatomySeen, progress]);
  useEffect(() => { if (["low","mid","high"].every(zone => neuronZones.includes(zone))) progress.completeTask("control-neuron"); }, [neuronZones, progress]);
  useEffect(() => { if (connectionsSeen.length >= 6) progress.completeTask("inspect-connections"); }, [connectionsSeen, progress]);
  useEffect(() => { if (["input","hidden-sum","hidden-activation","output-sum","prediction"].every(item => phasesSeen.includes(item as Phase))) progress.completeTask("run-forward-pass"); }, [phasesSeen, progress]);
  useEffect(() => { if (quadrantsSeen.length === 4) progress.completeTask("explore-decision-space"); }, [quadrantsSeen, progress]);
  useEffect(() => { if (epochs >= 250 && loss < .62 && accuracy >= .75) progress.completeTask("train-real-network"); }, [epochs, loss, accuracy, progress]);
  useEffect(() => { if (hiddenSeen.length === network.w1.length) progress.completeTask("inspect-hidden-neurons"); }, [hiddenSeen, network.w1.length, progress]);
  useEffect(() => { if (broken && restored && loss < .7) progress.completeTask("break-restore-network"); }, [broken, restored, loss, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["input", "weight", "bias", "hidden", "activation", "forward", "output", "loss", "train", "gradient", "parameter"].filter(term => text.includes(term));
    if (explanation.trim().length < 125) { setFeedback("Explain the path from numeric inputs to weighted hidden neurons to output, then what training changes."); return; }
    if (hits.length < 8) { setFeedback("Use mechanism words: inputs, weights, bias, hidden layer, activation, forward pass, output, loss and training/parameter update."); return; }
    setFeedback("Strong. You described a neural network as a trainable composition of numeric transformations rather than a literal biological brain.");
    progress.completeTask("explain-neural-network");
  };

  const grid = Array.from({ length: 144 }, (_, index) => {
    const gx = (index % 12) / 11, gy = 1 - Math.floor(index / 12) / 11;
    return { gx, gy, p: forwardToyNetwork(network, [gx, gy]).output };
  });

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 02 · LESSON 01</span><h1>OPEN<br/>THE<br/><em>NETWORK.</em></h1><p>A neural network is not a glowing brain. It is a stack of <strong>learned numeric transformations</strong>: inputs are multiplied by weights, shifted by biases, passed through nonlinear activations, and combined into an output.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroNet}><NetworkDiagram network={network} input={probe}/></div></section>

    <LessonSection id="anatomy" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · OPEN ALL 3" title="Inputs → hidden representation → output.">Click each layer. The names are simple; the important part is what information transformation happens at each step.</Heading>
      <div className={styles.anatomyGrid}>{(["input","hidden","output"] as const).map(id => <motion.button whileHover={{ y: -4 }} className={anatomySeen.includes(id) ? styles.seen : ""} onClick={() => anatomyInspect(id)} key={id}><span>{id === "input" ? "01" : id === "hidden" ? "02" : "03"}</span><h3>{id.toUpperCase()}</h3><p>{anatomyCopy[id][progress.depth]}</p><small>{anatomySeen.includes(id) ? "OPEN ✓" : "CLICK"}</small></motion.button>)}</div><NetworkDiagram network={network} input={probe} activeLayer={anatomySeen.at(-1) ?? "all"}/>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-network-anatomy"])}>Inspect input, hidden and output layers.</TaskStamp>
    </LessonSection>

    <LessonSection id="single-neuron" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="SLIDE · CHANGE INFLUENCE" title="One neuron is a tiny calculator with learnable knobs.">Change x₁, x₂, two weights and bias. Watch the pre-activation z and sigmoid output. In real training, the optimizer changes weights/bias; the input comes from data.</Heading>
      <div className={styles.neuronLab}><div className={styles.neuronFormula}><code>z = x₁·w₁ + x₂·w₂ + b</code><code>a = sigmoid(z)</code><div className={styles.neuronValues}><span>x₁ {single.x1.toFixed(2)}</span><b>×</b><span>w₁ {single.w1.toFixed(2)}</span><b>+</b><span>x₂ {single.x2.toFixed(2)}</span><b>×</b><span>w₂ {single.w2.toFixed(2)}</span><b>+</b><span>b {single.b.toFixed(2)}</span></div><strong>z = {singleZ.toFixed(3)} → a = {singleA.toFixed(3)}</strong><NeuronFace value={singleA} label="NEURON" hot={singleA > .7}/></div><div className={styles.sliders}>{(["x1","x2","w1","w2","b"] as const).map(key => <label key={key}>{key.toUpperCase()} <strong>{single[key].toFixed(2)}</strong><input type="range" min={key.startsWith("x") ? 0 : -2} max={key.startsWith("x") ? 1 : 2} step=".05" value={single[key]} onChange={event => setSingle(current => ({ ...current, [key]: Number(event.target.value) }))}/></label>)}<button onClick={markNeuronZone}>RECORD THIS ACTIVATION</button><p>Find low (&lt;.3), middle, and high (&gt;.7) activation regimes. Seen {neuronZones.length}/3.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["control-neuron"])}>Produce low, medium and high neuron activations.</TaskStamp>
    </LessonSection>

    <LessonSection id="connections" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="CLICK CONNECTIONS" title="Weights are the strength and sign of connections.">Blue edges are positive influence, red edges negative. Thickness represents magnitude in this visualizer. Click at least six edges and inspect their IDs.</Heading>
      <div className={styles.connectionLab}><NetworkDiagram network={network} input={probe} onConnection={inspectConnection}/><div className={styles.connectionConsole}><span>CONNECTIONS INSPECTED</span><strong>{connectionsSeen.length}</strong><div>{connectionsSeen.slice(-8).map(id => <code key={id}>{id}</code>)}</div><p>A large positive weight does not mean “good”; it means increasing the source activation pushes the destination pre-activation upward, all else equal.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-connections"])}>Click at least six learned connections.</TaskStamp>
    </LessonSection>

    <LessonSection id="forward-pass" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="STEP THROUGH REAL MATH" title="Forward pass: run current parameters from input to prediction.">Advance through five phases using the current probe point. Nothing is learned during this forward pass by itself.</Heading>
      <div className={styles.forwardLab}><div className={styles.phaseButtons}>{(["input","hidden-sum","hidden-activation","output-sum","prediction"] as Phase[]).map((item,index) => <button className={`${phase === item ? styles.activePhase : ""} ${phasesSeen.includes(item) ? styles.phaseSeen : ""}`} onClick={() => setForwardPhase(item)} key={item}><span>{index+1}</span>{item.replaceAll("-"," ")}</button>)}</div><div className={styles.forwardStage}>{phase === "input" && <><h3>INPUT VECTOR</h3><code>x = [{probe[0].toFixed(3)}, {probe[1].toFixed(3)}]</code></>}{phase === "hidden-sum" && <><h3>HIDDEN PRE-ACTIVATIONS</h3>{trace.hiddenZ.map((value,index) => <code key={index}>z{index+1} = {value.toFixed(4)}</code>)}</>}{phase === "hidden-activation" && <><h3>tanh(z)</h3><div className={styles.hiddenFaces}>{trace.hiddenA.map((value,index) => <NeuronFace key={index} value={value} label={`h${index+1}`}/>)}</div></>}{phase === "output-sum" && <><h3>OUTPUT LOGIT</h3><code>z_out = Σ(hⱼ · wⱼ) + b = {trace.outputZ.toFixed(4)}</code></>}{phase === "prediction" && <><h3>FINAL BINARY PROBABILITY</h3><strong>{(trace.output*100).toFixed(1)}% ZING</strong><p>{trace.output >= .5 ? "Prediction: ZING" : "Prediction: BLOOP"}</p></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["run-forward-pass"])}>Visit all five forward-pass phases.</TaskStamp>
    </LessonSection>

    <LessonSection id="decision-space" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="DRAG · FEEL THE FUNCTION" title="A trained network is a function over an input space.">Drag the green probe through all four quadrants. Every position becomes two input numbers, then a forward pass produces P(ZING).</Heading>
      <div className={styles.decisionLab}><div ref={plotRef} className={styles.decisionPlot} onPointerDown={event => { setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updateProbeFromPointer(event); }} onPointerMove={updateProbeFromPointer} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}>{grid.map((cell,index) => <i key={index} style={{ left: `${cell.gx*100}%`, top: `${(1-cell.gy)*100}%`, background: `rgba(${Math.round(70+160*cell.p)}, ${Math.round(210-90*cell.p)}, ${Math.round(255-120*cell.p)}, .78)` }}/>) }{XOR_DATASET.map((point,index) => <b className={point.y ? styles.zingPoint : styles.bloopPoint} style={{ left: `${point.x[0]*100}%`, top: `${(1-point.x[1])*100}%` }} key={index}>{point.y ? "Z" : "B"}</b>)}<button className={styles.probe} style={{ left: `${probe[0]*100}%`, top: `${(1-probe[1])*100}%` }}>?</button></div><div className={styles.decisionConsole}><span>PROBE INPUT</span><code>x₁ {probe[0].toFixed(3)}</code><code>x₂ {probe[1].toFixed(3)}</code><strong>{(trace.output*100).toFixed(1)}%</strong><b>{trace.output >= .5 ? "ZING" : "BLOOP"}</b><p>Quadrants visited {quadrantsSeen.length}/4. The background is computed by the real network on a 12×12 grid.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explore-decision-space"])}>Drag the probe through all four quadrants.</TaskStamp>
    </LessonSection>

    <LessonSection id="real-training" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="REAL CLIENT-SIDE TRAINING" title="Now let gradient descent change the actual weights.">This is not a prerecorded animation. The browser runs forward passes, binary cross-entropy loss, backpropagation and parameter updates on the eight-point BLOOP/ZING dataset.</Heading>
      <div className={styles.trainingLab}><div><NetworkDiagram network={network} input={probe}/><div className={styles.datasetStrip}>{XOR_DATASET.map((point,index) => <span className={point.y ? styles.zingPoint : styles.bloopPoint} key={index}>{point.y ? "Z" : "B"}</span>)}</div></div><div className={styles.trainingConsole}><span>EPOCHS</span><strong>{epochs}</strong><label>LEARNING RATE <b>{learningRate.toFixed(2)}</b><input type="range" min=".05" max="1.5" step=".05" value={learningRate} onChange={event => setLearningRate(Number(event.target.value))}/></label><div><span>LOSS</span><b>{loss.toFixed(4)}</b></div><div><span>TRAIN ACCURACY</span><b>{Math.round(accuracy*100)}%</b></div><button onClick={() => train(50)}>TRAIN 50 EPOCHS</button><button onClick={() => { setNetwork(cloneToyNetwork(initialNetwork)); setEpochs(0); setCheckpoint(null); setBroken(false); setRestored(false); }}>RESET WEIGHTS</button><button disabled={epochs < 250} onClick={saveCheckpoint}>{checkpoint ? "CHECKPOINT SAVED ✓" : "SAVE TRAINED CHECKPOINT"}</button><p>Target for this lesson: 250+ epochs, loss &lt; .62 and ≥75% training accuracy. Later lessons will go much deeper into gradients, SGD and backprop.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["train-real-network"])}>Train the real network to the lesson target.</TaskStamp>
    </LessonSection>

    <LessonSection id="hidden-neurons" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="CLICK · INSPECT ALL HIDDEN UNITS" title="Hidden neurons form an internal representation.">Each hidden unit responds differently across the input square. Click all four units and inspect a real activation heat map computed from that neuron.</Heading>
      <div className={styles.hiddenLab}><div className={styles.hiddenSelector}>{network.w1.map((_,index) => <button className={hiddenSeen.includes(index) ? styles.hiddenSeen : ""} onClick={() => setHiddenSeen(current => current.includes(index) ? current : [...current,index])} key={index}><NeuronFace value={trace.hiddenA[index]} label={`HIDDEN ${index+1}`}/><code>w=[{network.w1[index][0].toFixed(2)}, {network.w1[index][1].toFixed(2)}]</code><code>b={network.b1[index].toFixed(2)}</code></button>)}</div><div className={styles.heatMaps}>{network.w1.map((_,h) => <div className={hiddenSeen.includes(h) ? styles.heatVisible : ""} key={h}><span>h{h+1}</span>{Array.from({length:64}).map((__,i) => { const x=(i%8)/7,y=1-Math.floor(i/8)/7; const a=forwardToyNetwork(network,[x,y]).hiddenA[h]; const alpha=(a+1)/2; return <i key={i} style={{background:`rgba(${Math.round(255*alpha)}, ${Math.round(100+120*(1-alpha))}, 210, .9)`}}/>; })}</div>)}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-hidden-neurons"])}>Inspect all four hidden neurons and heat maps.</TaskStamp>
    </LessonSection>

    <LessonSection id="break-restore" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="BREAK · RESTORE" title="The architecture can stay identical while learned parameters disappear.">Save a trained checkpoint first. Then zero every learned weight/bias. The network collapses to 50% everywhere. Restore the checkpoint and recover the learned function.</Heading>
      <div className={styles.breakLab}><div><NetworkDiagram network={network} input={probe}/><p>Current loss <strong>{loss.toFixed(3)}</strong> · accuracy <strong>{Math.round(accuracy*100)}%</strong></p></div><div className={styles.breakConsole}><CheckpointBotLike ready={Boolean(checkpoint)}/><button disabled={!checkpoint || broken} onClick={breakNetwork}>💥 ZERO ALL LEARNED PARAMETERS</button><button disabled={!checkpoint || !broken} onClick={restoreNetwork}>↺ RESTORE CHECKPOINT</button><button disabled={!restored} onClick={() => setNetwork(current => trainToyNetwork(current, XOR_DATASET, 25, learningRate))}>TRAIN 25 MORE AFTER RESTORE</button><p>{broken && !restored ? "Architecture is still 2→4→1, but knowledge stored in learned parameters is gone." : restored ? "Checkpoint restored the learned numbers and therefore the learned behavior." : "Save a checkpoint in the training room, then break it."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["break-restore-network"])}>Zero the trained parameters and restore them from checkpoint.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-network" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain a neural network without saying “digital brain.”">Describe inputs, weights, biases, hidden activations, forward pass, output, loss and what training changes.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🧩</span><p>“What is actually inside those circles and lines?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="Inputs are numbers... each hidden neuron computes... weights/biases... activation... forward pass... output... training uses loss/gradients to..."/><footer><span>{explanation.length} chars</span><button onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <p className={progress.completedTasks["explain-neural-network"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-neural-network"])}>Explain the network as trainable numeric transformations.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div>SECTIONS<strong>{sectionsRead}/9</strong></div><div>TASKS<strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.open : ""}>QUIZ<strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><h2>Can you see through the circles now?</h2><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MODULE 2 BEGINS</small><h2>A neural network is learned math arranged in layers.</h2><p>Next we zoom into weights, bias and activation functions instead of treating them as one combined neuron.</p></div><Link href="/lessons/module-1-capstone">← MODULE 1 BOSS</Link><div><small>NEXT</small><b>Weights, Bias & Activations</b><span>build queue</span></div></section>
  </main>;
}

function CheckpointBotLike({ ready }: { ready: boolean }) {
  return <motion.div className={styles.checkpointIcon} animate={{ scale: ready ? [1,1.08,1] : 1 }} transition={{ duration: 1.5, repeat: Infinity }}><strong>⏺</strong><span>{ready ? "SAVED" : "NO CHECKPOINT"}</span></motion.div>;
}
