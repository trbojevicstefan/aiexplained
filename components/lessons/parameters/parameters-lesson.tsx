"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./parameters.module.css";

type Props = { progress: LessonProgressApi };
type Bucket = "learned" | "hyper" | "inference" | "api";
type Architecture = "tiny" | "medium" | "deep";

type TermCard = { id: string; term: string; bucket: Bucket; why: string };

const sections = [
  { id: "open-control-room", taskId: "inspect-controls" },
  { id: "sort-terms", taskId: "sort-parameter-types" },
  { id: "watch-weights", taskId: "train-weights" },
  { id: "learning-rate", taskId: "test-learning-rates" },
  { id: "batch-epochs", taskId: "tune-training-controls" },
  { id: "architecture", taskId: "change-architecture" },
  { id: "tuning-arena", taskId: "hyperparameter-search" },
  { id: "vocabulary-traps", taskId: "parameter-vocabulary" },
  { id: "explain-parameters", taskId: "explain-parameters" },
] as const;

const termCards: TermCard[] = [
  { id: "weight", term: "model weight w₁ = 0.73", bucket: "learned", why: "Its value is fitted/learned during training." },
  { id: "bias", term: "neuron bias b = -0.14", bucket: "learned", why: "Biases are trainable model parameters when the architecture defines them as learnable." },
  { id: "lr", term: "learning rate = 0.01", bucket: "hyper", why: "A training control chooses how aggressively the optimizer updates learned parameters." },
  { id: "batch", term: "batch size = 64", bucket: "hyper", why: "It controls how many examples contribute to an update; it is not learned by ordinary training." },
  { id: "depth", term: "tree max_depth = 8", bucket: "hyper", why: "A model/training configuration chosen before or around fitting." },
  { id: "temperature", term: "LLM temperature = 0.8", bucket: "inference", why: "Usually a generation/sampling setting applied at inference time, not a learned model weight." },
  { id: "top-p", term: "top_p = 0.9", bucket: "inference", why: "Another sampling control used while generating from a trained model." },
  { id: "max-tokens", term: "max_tokens = 600", bucket: "api", why: "An API request argument/limit. The word parameter is overloaded in programming, but this is not a learned model parameter." },
  { id: "user-id", term: "function parameter userId", bucket: "api", why: "A normal function/API argument has nothing to do with learned neural weights." },
  { id: "embedding-weight", term: "embedding weight[420,17]", bucket: "learned", why: "A specific learned number inside a model parameter tensor." },
];

const trapCards: TermCard[] = [
  { id: "trap-1", term: "Adam optimizer learning_rate", bucket: "hyper", why: "Chosen training behavior; not learned by the ordinary inner optimization loop." },
  { id: "trap-2", term: "Transformer attention matrix Wq", bucket: "learned", why: "Its tensor values are trainable model parameters." },
  { id: "trap-3", term: "temperature on a chat-completions request", bucket: "inference", why: "It changes sampling behavior for this run; it does not retrain the checkpoint." },
  { id: "trap-4", term: "HTTP query parameter ?page=2", bucket: "api", why: "Programming uses the word parameter broadly; this is simply a request argument." },
  { id: "trap-5", term: "number of hidden layers chosen by experiment", bucket: "hyper", why: "Architecture choice is a hyperparameter/design choice in this lesson's framing." },
  { id: "trap-6", term: "learned intercept in linear regression", bucket: "learned", why: "The fitting process estimates this value from data." },
  { id: "trap-7", term: "top_k sampling = 50", bucket: "inference", why: "A decoding/sampling setting for model use." },
  { id: "trap-8", term: "tool function argument location='Belgrade'", bucket: "api", why: "Structured tool/API argument; unrelated to learned weights." },
];

const quizQuestions = [
  { q: "What is a learned model parameter?", options: ["A number/structure whose value is fitted during training", "Any field sent to an API", "Only the learning rate", "Any dataset column"], correct: 0, why: "Weights, biases, coefficients and similar learned values are model parameters because training adjusts/fits them." },
  { q: "What is a hyperparameter?", options: ["Always a value the model learns", "A control/design choice that shapes training or model structure rather than being fitted by the ordinary training loop", "A user prompt", "Only temperature"], correct: 1, why: "Examples include learning rate, batch size, regularization strength, tree depth or architectural choices, depending on the system." },
  { q: "If learning rate is far too high, what can happen?", options: ["Updates can overshoot and training may oscillate/diverge", "The dataset disappears", "Inference becomes symbolic AI", "Weights freeze automatically"], correct: 0, why: "An overly large step size can jump across good regions of the loss surface rather than converge." },
  { q: "Which value normally changes because of gradient-based training?", options: ["A weight inside the model", "The chosen batch size itself", "The API endpoint URL", "The user's display name"], correct: 0, why: "The optimizer updates trainable parameters. Batch size is ordinarily selected outside that inner update loop." },
  { q: "Is LLM temperature usually a learned model parameter?", options: ["Yes, it is stored in every weight tensor", "No — it is typically an inference-time sampling setting", "Only above 1.0", "Only for images"], correct: 1, why: "Temperature rescales/smooths sampling probabilities at inference and normally does not modify trained weights." },
  { q: "Why can architecture hyperparameters change parameter count?", options: ["Adding layers/width can create more trainable weights that training must later learn", "Parameter count is unrelated to architecture", "Only file size matters", "Because the dataset becomes larger"], correct: 0, why: "Choosing more layers or width can create more parameter tensors, while training determines their values." },
  { q: "Best terminology rule?", options: ["Every software/API parameter is a model parameter", "Always ask which layer we mean: learned parameter, training hyperparameter, inference setting, or ordinary function/API argument", "Hyperparameter means 'very important parameter'", "Temperature always means training learning rate"], correct: 1, why: "The word parameter is overloaded. Precise AI discussions name the layer and role, not just the word." },
] as const;

const tuningConfigs = [
  { id: "A", lr: .0002, batch: 16, depth: 2, score: 72, cost: 16 },
  { id: "B", lr: .01, batch: 64, depth: 4, score: 91, cost: 42 },
  { id: "C", lr: .08, batch: 64, depth: 4, score: 63, cost: 42 },
  { id: "D", lr: .008, batch: 128, depth: 6, score: 89, cost: 78 },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function Weighty({ excited = false }: { excited?: boolean }) {
  return <motion.div className={styles.weighty} animate={{ y: excited ? [0, -10, 0] : [0, -5, 0], rotate: excited ? [0, -2, 2, 0] : [0, 1, 0] }} transition={{ duration: excited ? 1.4 : 3, repeat: Infinity }}><div><i/><i/><strong>w</strong><span>0.73</span></div><b>WEIGHTY</b></motion.div>;
}
function Dial({ excited = false }: { excited?: boolean }) {
  return <motion.div className={styles.dial} animate={{ scale: excited ? [1, 1.05, 1] : [1, 1.02, 1] }} transition={{ duration: excited ? 1.5 : 3.2, repeat: Infinity }}><div><i/><i/><strong>↗</strong><span/></div><b>DIAL</b></motion.div>;
}

function BucketLegend() {
  return <div className={styles.bucketLegend}><span>LEARNED PARAMETER</span><span>TRAINING HYPERPARAMETER</span><span>INFERENCE SETTING</span><span>API / FUNCTION ARGUMENT</span></div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;

  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ rotate: [-4, 4, -4], scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>🎛️🔒</motion.span><h3>Control-room exam locked.</h3><p>Test every dial and finish all nine exercises first.</p></div>;

  const submit = () => {
    if (answered !== quizQuestions.length) return;
    setSubmitted(true);
    progress.saveQuiz(score, passed);
  };

  return <div className={styles.quiz}>
    {quizQuestions.map((question, index) => <div className={styles.question} key={question.q}>
      <h3><span>{index + 1}</span>{question.q}</h3>
      <div>{question.options.map((option, optionIndex) => <motion.button key={option} whileTap={{ scale: .97 }} disabled={submitted} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === question.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.wrong : ""}`}><i>{String.fromCharCode(65 + optionIndex)}</i>{option}</motion.button>)}</div>
      {submitted && <p>{question.why}</p>}
    </div>)}
    {!submitted ? <button className={`${styles.submit} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>CHECK CONTROL ROOM →</button> : <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className={`${styles.result} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><div><h3>{passed ? "Controls separated." : "Retune the vocabulary."}</h3><p>{passed ? "You can distinguish learned values from controls around training and inference." : "Pass is 6/7. Read the explanations and retry."}</p></div>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</motion.div>}
  </div>;
}

export function ParametersLesson({ progress }: Props) {
  const [inspected, setInspected] = useState<string[]>([]);
  const [termChoices, setTermChoices] = useState<Record<string, Bucket>>({});
  const [trainStep, setTrainStep] = useState(0);
  const [learningRate, setLearningRate] = useState(.01);
  const [lrLoss, setLrLoss] = useState(1.2);
  const [lrStep, setLrStep] = useState(0);
  const [lrZones, setLrZones] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(4);
  const [trainingRuns, setTrainingRuns] = useState(0);
  const [architecture, setArchitecture] = useState<Architecture>("tiny");
  const [architecturesSeen, setArchitecturesSeen] = useState<Architecture[]>(["tiny"]);
  const [tuningSeen, setTuningSeen] = useState<string[]>([]);
  const [trapChoices, setTrapChoices] = useState<Record<string, Bucket>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const termCorrect = termCards.every(card => termChoices[card.id] === card.bucket);
  const trapsCorrect = trapCards.every(card => trapChoices[card.id] === card.bucket);
  const weightValues = useMemo(() => Array.from({ length: 12 }, (_, index) => {
    const base = ((index * 17) % 19 - 9) / 10;
    const target = ((index * 11) % 23 - 11) / 12;
    const t = Math.min(1, trainStep / 8);
    return base + (target - base) * t;
  }), [trainStep]);
  const paramCount = architecture === "tiny" ? 42 : architecture === "medium" ? 386 : 2842;
  const updateSteps = Math.max(1, Math.ceil((512 / batchSize) * epochs));
  const noise = Math.round(100 / Math.sqrt(batchSize));
  const toyCompute = Math.round(updateSteps * (architecture === "tiny" ? 1 : architecture === "medium" ? 3.2 : 8.5));

  const inspect = (id: string) => setInspected(current => current.includes(id) ? current : [...current, id]);
  const markArchitecture = (value: Architecture) => { setArchitecture(value); setArchitecturesSeen(current => current.includes(value) ? current : [...current, value]); };

  useEffect(() => { if (inspected.length >= 4) progress.completeTask("inspect-controls"); }, [inspected.length, progress]);
  useEffect(() => { if (termCorrect) progress.completeTask("sort-parameter-types"); }, [termCorrect, progress]);
  useEffect(() => { if (trainStep >= 8) progress.completeTask("train-weights"); }, [trainStep, progress]);
  useEffect(() => { if (["low", "good", "high"].every(zone => lrZones.includes(zone)) && lrStep >= 6 && lrLoss < .3) progress.completeTask("test-learning-rates"); }, [lrZones, lrStep, lrLoss, progress]);
  useEffect(() => { if (trainingRuns >= 3) progress.completeTask("tune-training-controls"); }, [trainingRuns, progress]);
  useEffect(() => { if (architecturesSeen.length === 3) progress.completeTask("change-architecture"); }, [architecturesSeen.length, progress]);
  useEffect(() => { if (tuningSeen.length === tuningConfigs.length) progress.completeTask("hyperparameter-search"); }, [tuningSeen.length, progress]);
  useEffect(() => { if (trapsCorrect) progress.completeTask("parameter-vocabulary"); }, [trapsCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const runLrStep = () => {
    const zone = learningRate < .002 ? "low" : learningRate <= .03 ? "good" : "high";
    setLrZones(current => current.includes(zone) ? current : [...current, zone]);
    setLrStep(step => step + 1);
    setLrLoss(current => {
      if (zone === "low") return Math.max(.5, current * .94);
      if (zone === "good") return Math.max(.09, current * .58);
      return Math.min(3.2, current * 1.32 + .12);
    });
  };
  const resetLr = () => { setLrLoss(1.2); setLrStep(0); };
  const runTrainingControl = () => setTrainingRuns(run => run + 1);
  const inspectTuning = (id: string) => setTuningSeen(current => current.includes(id) ? current : [...current, id]);
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["weight", "parameter", "learn", "train", "hyperparameter", "learning rate", "batch", "temperature", "inference", "api"].filter(term => text.includes(term));
    if (explanation.trim().length < 100) { setFeedback("Use at least four short ideas: learned parameter, training hyperparameter, inference setting, and ordinary API/function argument."); return; }
    if (hits.length < 7) { setFeedback("Add mechanism words such as learned weights, training, hyperparameter, learning rate/batch size, inference temperature, and API argument."); return; }
    setFeedback("Excellent. You are naming the layer and role instead of relying on the overloaded word parameter.");
    progress.completeTask("explain-parameters");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}>
      <div><span className={styles.tag}>MODULE 01 · LESSON 08</span><h1>PARAMETERS<br/><em>vs</em><br/>HYPERPARAMETERS.</h1><p>The model learns some numbers. Humans or outer systems choose other controls. And software APIs reuse the word <strong>parameter</strong> for unrelated arguments. Open the control room and separate them.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div>
      <div className={styles.heroConsole}><Weighty excited/><div className={styles.heroMeters}>{weightValues.slice(0, 6).map((value, index) => <i key={index}><b style={{ height: `${25 + Math.abs(value) * 55}%` }}/><span>{value.toFixed(2)}</span></i>)}</div><Dial excited/></div>
    </section>

    <LessonSection id="open-control-room" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · X-RAY" title="Four drawers — not one vague word.">Inspect all four. The first contains values the model <strong>learns</strong>. The others contain controls around training, inference or software calls.</Heading>
      <div className={styles.drawerGrid}>{[
        { id: "learned", title: "LEARNED MODEL PARAMETERS", icon: <Weighty active={false}/>, copy: "weights, biases, fitted coefficients, embedding tensors", accent: "learned" },
        { id: "hyper", title: "TRAINING HYPERPARAMETERS", icon: <Dial/>, copy: "learning rate, batch size, regularization, architecture choices", accent: "hyper" },
        { id: "inference", title: "INFERENCE SETTINGS", icon: <span className={styles.bigIcon}>🎚️</span>, copy: "temperature, top-p, top-k, beam settings, decoding limits", accent: "inference" },
        { id: "api", title: "API / FUNCTION ARGUMENTS", icon: <span className={styles.bigIcon}>{"{ }"}</span>, copy: "model='x', userId, page, location, max_tokens request field", accent: "api" },
      ].map(item => <motion.button whileHover={{ y: -5, rotate: .3 }} key={item.id} onClick={() => inspect(item.id)} className={`${styles.drawerCard} ${styles[item.accent]} ${inspected.includes(item.id) ? styles.inspected : ""}`}>{item.icon}<h3>{item.title}</h3><p>{item.copy}</p><small>{inspected.includes(item.id) ? "OPENED ✓" : "CLICK TO OPEN"}</small></motion.button>)}</div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-controls"])}>Open all four terminology drawers.</TaskStamp>
    </LessonSection>

    <LessonSection id="sort-terms" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="CLASSIFY · CLICK" title="Sort the overloaded word “parameter.”">Put every term into the most useful bucket. This is about role, not whether documentation happens to call something a parameter.</Heading>
      <BucketLegend/>
      <div className={styles.termGrid}>{termCards.map(card => { const choice = termChoices[card.id]; return <article key={card.id} className={`${styles.termCard} ${choice ? (choice === card.bucket ? styles.good : styles.bad) : ""}`}><code>{card.term}</code><p>{choice ? card.why : "Commit to a bucket before the explanation appears."}</p><div>{(["learned", "hyper", "inference", "api"] as Bucket[]).map(bucket => <button className={choice === bucket ? styles.active : ""} onClick={() => setTermChoices(current => ({ ...current, [card.id]: bucket }))} key={bucket}>{bucket === "learned" ? "LEARNED" : bucket === "hyper" ? "HYPER" : bucket === "inference" ? "INFER" : "API"}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["sort-parameter-types"])}>Classify all ten terms correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="watch-weights" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="TRAIN · WATCH" title="Learned parameters move. Hyperparameters stay chosen.">Run training steps. The weight wall changes toward a fitted state while the learning rate, batch size and epoch plan remain external controls.</Heading>
      <div className={styles.weightLab}><div className={styles.weightWall}>{weightValues.map((value, index) => <motion.div key={index} animate={{ backgroundColor: value >= 0 ? "#71e5bd" : "#ff9cc9", scale: trainStep ? [1, 1.03, 1] : 1 }} transition={{ delay: index * .025 }}><span>w{index + 1}</span><strong>{value.toFixed(3)}</strong><i><b style={{ width: `${Math.min(100, 25 + Math.abs(value) * 75)}%` }}/></i></motion.div>)}</div><div className={styles.trainingConsole}><Weighty excited={trainStep > 0}/><div className={styles.fixedControls}><span>LEARNING RATE <strong>0.010</strong></span><span>BATCH SIZE <strong>32</strong></span><span>EPOCH PLAN <strong>8</strong></span></div><button className="tactile" onClick={() => setTrainStep(step => Math.min(8, step + 1))}>RUN TRAINING UPDATE #{Math.min(8, trainStep + 1)}</button><div className={styles.stepMeter}>{Array.from({ length: 8 }).map((_, index) => <i className={index < trainStep ? styles.done : ""} key={index}/>)}</div><p>{trainStep < 8 ? `${trainStep}/8 updates. Watch the weight values, not the external controls.` : "Training complete. The model parameters changed; the chosen hyperparameters did not learn themselves."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["train-weights"])}>Run all eight weight updates.</TaskStamp>
    </LessonSection>

    <LessonSection id="learning-rate" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="SLIDE · BREAK · RECOVER" title="Learning rate can make optimization crawl — or explode.">Test a tiny, useful and excessive learning rate. The toy loss reacts differently.</Heading>
      <div className={styles.lrLab}><div className={styles.lossScope}><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M2 7 C24 48 43 57 64 58 C82 57 93 37 98 9" fill="none" stroke="currentColor" strokeWidth="2.5"/></svg><motion.i animate={{ left: `${Math.max(10, Math.min(90, 15 + (1.3 - Math.min(1.3, lrLoss)) * 53))}%`, bottom: `${Math.max(8, Math.min(78, 12 + lrLoss * 36))}%` }}>w</motion.i><span>LOW LOSS</span></div><div className={styles.lrControls}><label>LEARNING RATE <strong>{learningRate.toFixed(4)}</strong><input type="range" min="0.0001" max="0.1" step="0.0001" value={learningRate} onChange={event => setLearningRate(Number(event.target.value))}/></label><div className={styles.zoneReadout}><span className={learningRate < .002 ? styles.zoneActive : ""}>TOO LOW</span><span className={learningRate >= .002 && learningRate <= .03 ? styles.zoneActive : ""}>USEFUL ZONE</span><span className={learningRate > .03 ? styles.zoneActive : ""}>TOO HIGH</span></div><div className={styles.lossNumber}><span>TOY LOSS</span><motion.strong key={lrLoss} initial={{ scale: .8 }} animate={{ scale: 1 }}>{lrLoss.toFixed(3)}</motion.strong></div><button className="tactile" onClick={runLrStep}>TAKE OPTIMIZER STEP</button><button className={styles.secondaryButton} onClick={resetLr}>RESET RUN</button><p>Tested zones: {lrZones.length}/3 · current run steps: {lrStep}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["test-learning-rates"])}>Test low, useful and high learning-rate zones, then converge below 0.30 loss.</TaskStamp>
    </LessonSection>

    <LessonSection id="batch-epochs" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="TUNE · RUN" title="Batch size and epochs change the training process — not because the model learns their values.">Move both controls and run at least three configurations. See update count, toy noise and compute change.</Heading>
      <div className={styles.batchLab}><div className={styles.trainingControls}><label>BATCH SIZE <strong>{batchSize}</strong><input type="range" min="8" max="128" step="8" value={batchSize} onChange={event => setBatchSize(Number(event.target.value))}/></label><label>EPOCHS <strong>{epochs}</strong><input type="range" min="1" max="20" value={epochs} onChange={event => setEpochs(Number(event.target.value))}/></label><button className="tactile" onClick={runTrainingControl}>RUN CONFIGURATION</button><small>{trainingRuns}/3 required runs</small></div><div className={styles.trainingMetrics}><div><span>UPDATE STEPS</span><strong>{updateSteps}</strong></div><div><span>TOY GRADIENT NOISE</span><strong>{noise}</strong></div><div><span>RELATIVE COMPUTE</span><strong>{toyCompute}</strong></div><div><span>MODEL WEIGHTS</span><strong>learned during run</strong></div></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["tune-training-controls"])}>Run at least three batch-size/epoch configurations.</TaskStamp>
    </LessonSection>

    <LessonSection id="architecture" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="CHANGE ARCHITECTURE" title="A hyperparameter can decide how many parameters exist.">Choose tiny, medium and deep architectures. Architecture choice creates the parameter slots; training later learns the numbers inside those slots.</Heading>
      <div className={styles.architectureLab}><div className={styles.archButtons}>{(["tiny", "medium", "deep"] as Architecture[]).map(value => <button className={architecture === value ? styles.archActive : ""} onClick={() => markArchitecture(value)} key={value}>{value.toUpperCase()}</button>)}</div><motion.div key={architecture} className={styles.networkDiagram} initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}>{Array.from({ length: architecture === "tiny" ? 2 : architecture === "medium" ? 4 : 7 }).map((_, layerIndex) => <div key={layerIndex}>{Array.from({ length: architecture === "tiny" ? 3 : architecture === "medium" ? 5 : 7 }).map((__, nodeIndex) => <i key={nodeIndex}/>)}</div>)}</motion.div><div className={styles.parameterCounter}><span>TRAINABLE PARAMETER SLOTS</span><motion.strong key={paramCount} initial={{ scale: .7 }} animate={{ scale: 1 }}>{paramCount.toLocaleString()}</motion.strong><p>The count comes from architecture. The actual parameter <em>values</em> are learned during training.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["change-architecture"])}>Inspect tiny, medium and deep architectures.</TaskStamp>
    </LessonSection>

    <LessonSection id="tuning-arena" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="EXPERIMENT · VALIDATE" title="Hyperparameter tuning is an outer search around training.">Run every candidate. Each config trains/evaluates a model; the validation score tells you which setting combination worked best in this toy arena.</Heading>
      <div className={styles.tuningArena}>{tuningConfigs.map(config => <motion.button whileHover={{ y: -4 }} key={config.id} onClick={() => inspectTuning(config.id)} className={tuningSeen.includes(config.id) ? styles.tuningSeen : ""}><span>CONFIG {config.id}</span><dl><div><dt>learning rate</dt><dd>{config.lr}</dd></div><div><dt>batch</dt><dd>{config.batch}</dd></div><div><dt>depth</dt><dd>{config.depth}</dd></div></dl>{tuningSeen.includes(config.id) ? <><div className={styles.scoreBar}><i><b style={{ width: `${config.score}%` }}/></i><strong>{config.score}% val score</strong></div><small>cost {config.cost} units</small></> : <strong>RUN TRAIN + VALIDATE</strong>}</motion.button>)}</div>
      {tuningSeen.length === 4 && <motion.div className={styles.bestConfig} initial={{ scale: .9 }} animate={{ scale: 1 }}><span>BEST VALIDATION RESULT</span><strong>CONFIG B · 91%</strong><p>Config D spends much more compute but scores slightly lower here. Hyperparameter tuning is an empirical outer loop, not proof that “bigger” is always better.</p></motion.div>}
      <TaskStamp done={Boolean(progress.completedTasks["hyperparameter-search"])}>Run all four hyperparameter configurations.</TaskStamp>
    </LessonSection>

    <LessonSection id="vocabulary-traps" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="TERMINOLOGY · DIAGNOSE" title="The word parameter is overloaded. Name the layer.">This is the expert habit: never argue about “parameters” until everyone agrees which kind they mean.</Heading>
      <BucketLegend/>
      <div className={styles.trapList}>{trapCards.map(card => { const choice = trapChoices[card.id]; return <article className={choice ? (choice === card.bucket ? styles.good : styles.bad) : ""} key={card.id}><code>{card.term}</code><p>{choice ? card.why : "Which layer owns this value?"}</p><div>{(["learned", "hyper", "inference", "api"] as Bucket[]).map(bucket => <button className={choice === bucket ? styles.active : ""} onClick={() => setTrapChoices(current => ({ ...current, [card.id]: bucket }))} key={bucket}>{bucket === "learned" ? "MODEL" : bucket === "hyper" ? "TRAIN" : bucket === "inference" ? "INFER" : "API"}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["parameter-vocabulary"])}>Correctly classify all eight vocabulary traps.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-parameters" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain why “temperature is a parameter” is ambiguous.">Teach someone the four layers and explain which values training learns.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🎛️</span><p>“Learning rate, model weights, temperature and max_tokens are all parameters… same thing, right?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="A learned model parameter is... A training hyperparameter is... Temperature is usually... An API argument can be called a parameter in software but..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={progress.completedTasks["explain-parameters"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-parameters"])}>Explain learned parameters, hyperparameters, inference settings and API arguments.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.gateOpen : ""}><span>QUIZ</span><strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 08 QUIZ</span><h2>Which dial belongs where?</h2><p>Pass 6/7. Precision of vocabulary is part of understanding the system.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Parameters are learned. Hyperparameters shape how/what we train.</h2><p>And “parameter” in an API may simply mean argument — always name the layer.</p></div><Link href="/lessons/models-algorithms-data">← LESSON 07</Link><div><small>NEXT</small><strong>Features & Labels</strong><span>build queue</span></div></section>
  </main>;
}
