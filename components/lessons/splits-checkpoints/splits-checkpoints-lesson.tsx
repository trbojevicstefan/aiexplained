"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./splits-checkpoints.module.css";

type Props = { progress: LessonProgressApi };
type SplitStrategy = "random" | "stratified" | "time";
type ArtifactRole = "split" | "checkpoint" | "neither";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

const sections = [
  { id: "three-rooms", taskId: "build-data-splits" },
  { id: "train-room", taskId: "fit-on-train" },
  { id: "validation-room", taskId: "tune-on-validation" },
  { id: "sealed-test", taskId: "respect-test-seal" },
  { id: "split-strategies", taskId: "choose-split-strategy" },
  { id: "duplicate-leakage", taskId: "repair-split-leakage" },
  { id: "checkpoint-station", taskId: "choose-best-checkpoint" },
  { id: "split-vs-checkpoint", taskId: "classify-split-checkpoint" },
  { id: "explain-evaluation", taskId: "explain-evaluation" },
] as const;

const roomCopy: Record<"train" | "validation" | "test", DepthCopy> = {
  train: {
    simple: <>The model is allowed to <strong>practice here</strong>. These examples can change its learned weights.</>,
    real: <>Training data is used by the fitting procedure/optimizer to update model parameters.</>,
    expert: <>The training split directly participates in parameter estimation through the optimization objective. Repeated epochs over it are expected.</>,
  },
  validation: {
    simple: <>This room helps you <strong>choose between versions/settings</strong> without touching the final exam.</>,
    real: <>Validation data estimates out-of-training performance while you tune hyperparameters, architectures, thresholds or checkpoint selection.</>,
    expert: <>Validation participates in model-selection decisions. Repeated selection against one validation set can itself overfit the validation criterion, motivating nested CV or fresh holdouts in rigorous settings.</>,
  },
  test: {
    simple: <>The <strong>sealed final exam</strong>. Open it only after choices are finished.</>,
    real: <>The test split should estimate final performance of the selected procedure/model without influencing tuning decisions.</>,
    expert: <>A test set is useful only to the extent it remains independent of iterative model selection. Repeated peeking converts it into de facto validation data and biases the reported estimate.</>,
  },
};

const tuningConfigs = [
  { id: "A", depth: 2, reg: .00, train: 82, validation: 78 },
  { id: "B", depth: 5, reg: .12, train: 91, validation: 88 },
  { id: "C", depth: 9, reg: .00, train: 99, validation: 73 },
  { id: "D", depth: 5, reg: .45, train: 84, validation: 81 },
] as const;

const strategyScenarios = [
  { id: "s1", text: "Balanced image dataset; examples are independent and identically sampled enough for a simple baseline split.", answer: "random" as SplitStrategy },
  { id: "s2", text: "Fraud dataset where positives are only 1%; each split should preserve roughly the class ratio.", answer: "stratified" as SplitStrategy },
  { id: "s3", text: "Forecast next month's demand using historical months. Future rows must never appear in training for a past prediction.", answer: "time" as SplitStrategy },
  { id: "s4", text: "Medical classification with rare disease labels; preserve label proportions across train/validation/test.", answer: "stratified" as SplitStrategy },
  { id: "s5", text: "Churn model trained on January–June and evaluated on later customers to mimic deployment chronology.", answer: "time" as SplitStrategy },
  { id: "s6", text: "Large shuffled synthetic dataset with no class imbalance or temporal structure relevant to evaluation.", answer: "random" as SplitStrategy },
] as const;

const artifactCards = [
  { id: "a1", text: "`train.csv`: 70% of examples reserved for fitting", answer: "split" as ArtifactRole },
  { id: "a2", text: "`model-epoch-18.safetensors`: saved learned weights", answer: "checkpoint" as ArtifactRole },
  { id: "a3", text: "`validation.parquet`: rows used for model selection", answer: "split" as ArtifactRole },
  { id: "a4", text: "`optimizer-state-step-4000.pt`: saved training state", answer: "checkpoint" as ArtifactRole },
  { id: "a5", text: "`test.csv`: untouched final-evaluation examples", answer: "split" as ArtifactRole },
  { id: "a6", text: "learning_rate = 0.01", answer: "neither" as ArtifactRole },
  { id: "a7", text: "`best-model-v4.ckpt`: selected saved model state", answer: "checkpoint" as ArtifactRole },
  { id: "a8", text: "customer_id feature column", answer: "neither" as ArtifactRole },
] as const;

const checkpointRows = [
  { epoch: 2, trainLoss: .82, valLoss: .90, weight: 18 },
  { epoch: 5, trainLoss: .54, valLoss: .61, weight: 36 },
  { epoch: 9, trainLoss: .31, valLoss: .39, weight: 58 },
  { epoch: 14, trainLoss: .19, valLoss: .33, weight: 73 },
  { epoch: 20, trainLoss: .11, valLoss: .48, weight: 89 },
] as const;

const quizQuestions = [
  { q: "Which split is normally allowed to update model weights?", options: ["Training", "Validation", "Test", "All three equally"], correct: 0, why: "The training split participates directly in fitting/optimization." },
  { q: "What is validation data for?", options: ["Final unbiased exam after all choices", "Model selection/tuning decisions without fitting directly on the test set", "Permanent storage only", "Updating production user records"], correct: 1, why: "Validation helps choose hyperparameters, architectures, thresholds or checkpoints." },
  { q: "Why should the test set remain sealed?", options: ["To keep the final evaluation independent of tuning choices", "Because test rows are illegal", "Because models cannot read CSV", "To make training faster only"], correct: 0, why: "If test results influence repeated choices, the test set stops being an independent final estimate." },
  { q: "What happens if you repeatedly tune based on test-set results?", options: ["The test set becomes de facto validation data and the reported score can become optimistically biased", "Nothing changes", "Training becomes unsupervised", "Parameter count drops"], correct: 0, why: "Model selection adapts to quirks of the test sample, contaminating final evaluation." },
  { q: "When is a time-based split especially useful?", options: ["When deployment predicts future from past and chronology must be respected", "Whenever labels are balanced", "Only for images", "Never"], correct: 0, why: "Temporal tasks need future examples kept out of earlier training to avoid unrealistic look-ahead." },
  { q: "What is a checkpoint?", options: ["A partition of data rows", "A saved model/training state at a particular point", "The target label", "A random feature"], correct: 1, why: "Checkpoints preserve learned parameters and sometimes optimizer/training state; they are not data splits." },
  { q: "Why can duplicate rows across train and test be dangerous?", options: ["They can let evaluation reward memorization/near-duplicate exposure rather than true new-data generalization", "Duplicates always improve fairness", "They reduce VRAM", "They create more classes"], correct: 0, why: "Cross-split duplicates or near duplicates can leak examples and inflate evaluation." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function Vault({ sealed = false, label }: { sealed?: boolean; label: string }) {
  return <motion.div className={`${styles.vault} ${sealed ? styles.sealed : ""}`} animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}><div><i/><i/><strong>{sealed ? "🔒" : "▦"}</strong></div><b>{label}</b></motion.div>;
}

function CheckpointBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.checkpointBot} animate={{ scale: active ? [1, 1.06, 1] : [1, 1.02, 1], rotate: active ? [0, -2, 2, 0] : [0, 1, 0] }} transition={{ duration: active ? 1.3 : 3, repeat: Infinity }}><div><i/><i/><strong>⏺</strong></div><b>SNAP</b></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;

  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity }}>🧪🔒</motion.span><h3>Final exam still sealed.</h3><p>Finish all split, leakage and checkpoint experiments first.</p></div>;
  const submit = () => { if (answered === quizQuestions.length) { setSubmitted(true); progress.saveQuiz(score, passed); } };
  return <div className={styles.quiz}>{quizQuestions.map((question, index) => <div className={styles.question} key={question.q}><h3><span>{index + 1}</span>{question.q}</h3><div>{question.options.map((option, optionIndex) => <motion.button whileTap={{ scale: .97 }} disabled={submitted} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === question.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}>{option}</motion.button>)}</div>{submitted && <p>{question.why}</p>}</div>)}{!submitted ? <button className={`${styles.submit} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>SUBMIT FINAL EXAM →</button> : <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className={`${styles.result} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><div><h3>{passed ? "Evaluation protocol mastered." : "Re-seal the experiment."}</h3><p>{passed ? "You can separate fitting, selection, final evaluation and saved model state." : "Pass is 6/7. Use the explanations and retry."}</p></div>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</motion.div>}</div>;
}

export function SplitsCheckpointsLesson({ progress }: Props) {
  const [trainPct, setTrainPct] = useState(70);
  const [valPct, setValPct] = useState(15);
  const testPct = 100 - trainPct - valPct;
  const [roomsSeen, setRoomsSeen] = useState<string[]>([]);
  const [splitLocked, setSplitLocked] = useState(false);
  const [epochs, setEpochs] = useState(0);
  const [weight, setWeight] = useState(12);
  const [configsRun, setConfigsRun] = useState<string[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [testPeeks, setTestPeeks] = useState(0);
  const [contaminationSeen, setContaminationSeen] = useState(false);
  const [experimentReset, setExperimentReset] = useState(false);
  const [cleanTestOpened, setCleanTestOpened] = useState(false);
  const [strategyChoices, setStrategyChoices] = useState<Record<string, SplitStrategy>>({});
  const [duplicateLeak, setDuplicateLeak] = useState(true);
  const [duplicateInspected, setDuplicateInspected] = useState(false);
  const [checkpointsSeen, setCheckpointsSeen] = useState<number[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null);
  const [artifactChoices, setArtifactChoices] = useState<Record<string, ArtifactRole>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const validSplit = trainPct >= 60 && trainPct <= 80 && valPct >= 10 && valPct <= 25 && testPct >= 10 && testPct <= 25;
  const strategyCorrect = strategyScenarios.every(item => strategyChoices[item.id] === item.answer);
  const artifactCorrect = artifactCards.every(item => artifactChoices[item.id] === item.answer);
  const bestCheckpointIndex = checkpointRows.reduce((best, row, index, rows) => row.valLoss < rows[best].valLoss ? index : best, 0);
  const selectedTuning = tuningConfigs.find(config => config.id === selectedConfig);
  const independence = Math.max(0, 100 - testPeeks * 28);

  const inspectRoom = (room: string) => setRoomsSeen(current => current.includes(room) ? current : [...current, room]);
  const runConfig = (id: string) => setConfigsRun(current => current.includes(id) ? current : [...current, id]);
  const inspectCheckpoint = (index: number) => setCheckpointsSeen(current => current.includes(index) ? current : [...current, index]);

  useEffect(() => { if (splitLocked && roomsSeen.length === 3) progress.completeTask("build-data-splits"); }, [splitLocked, roomsSeen.length, progress]);
  useEffect(() => { if (epochs >= 6) progress.completeTask("fit-on-train"); }, [epochs, progress]);
  useEffect(() => { if (configsRun.length === tuningConfigs.length && selectedConfig === "B") progress.completeTask("tune-on-validation"); }, [configsRun.length, selectedConfig, progress]);
  useEffect(() => { if (contaminationSeen && experimentReset && cleanTestOpened && testPeeks === 1) progress.completeTask("respect-test-seal"); }, [contaminationSeen, experimentReset, cleanTestOpened, testPeeks, progress]);
  useEffect(() => { if (strategyCorrect) progress.completeTask("choose-split-strategy"); }, [strategyCorrect, progress]);
  useEffect(() => { if (duplicateInspected && !duplicateLeak) progress.completeTask("repair-split-leakage"); }, [duplicateInspected, duplicateLeak, progress]);
  useEffect(() => { if (checkpointsSeen.length === checkpointRows.length && selectedCheckpoint === bestCheckpointIndex) progress.completeTask("choose-best-checkpoint"); }, [checkpointsSeen.length, selectedCheckpoint, bestCheckpointIndex, progress]);
  useEffect(() => { if (artifactCorrect) progress.completeTask("classify-split-checkpoint"); }, [artifactCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const trainEpoch = () => { setEpochs(value => Math.min(10, value + 1)); setWeight(value => Math.min(78, value + 8)); };
  const peekTest = () => { if (!selectedConfig) return; setTestPeeks(value => { const next = value + 1; if (next >= 3) setContaminationSeen(true); return next; }); if (experimentReset) setCleanTestOpened(true); };
  const resetProtocol = () => { setExperimentReset(true); setTestPeeks(0); setCleanTestOpened(false); setSelectedConfig("B"); };
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["train", "validation", "test", "parameter", "hyperparameter", "select", "sealed", "checkpoint", "weight", "leak"].filter(term => text.includes(term));
    if (explanation.trim().length < 115) { setFeedback("Explain all four roles: training split, validation split, test split, and checkpoint."); return; }
    if (hits.length < 7) { setFeedback("Add mechanism words: train/weights, validation/model selection, sealed test/final estimate, checkpoint/saved state, leakage/peeking."); return; }
    setFeedback("Strong. You separated data roles from saved model state and explained why the test set must stay independent.");
    progress.completeTask("explain-evaluation");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · LESSON 13</span><h1>TRAIN.<br/>CHOOSE.<br/><em>TEST ONCE.</em></h1><p>A trustworthy experiment separates <strong>learning</strong>, <strong>model selection</strong>, and <strong>final evaluation</strong>. A checkpoint is something else entirely: a saved model state.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroVaults}><Vault label="TRAIN"/><Vault label="VALIDATE"/><Vault label="TEST" sealed/><CheckpointBot active/></div></section>

    <LessonSection id="three-rooms" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="SLIDE · OPEN · LOCK" title="Split one dataset into three jobs.">Choose sensible toy percentages, inspect each room, then lock the split before fitting anything.</Heading>
      <div className={styles.splitLab}><div className={styles.splitControls}><label>TRAIN <strong>{trainPct}%</strong><input disabled={splitLocked} type="range" min="50" max="80" value={trainPct} onChange={event => setTrainPct(Math.min(Number(event.target.value), 90 - valPct))}/></label><label>VALIDATION <strong>{valPct}%</strong><input disabled={splitLocked} type="range" min="10" max="30" value={valPct} onChange={event => setValPct(Math.min(Number(event.target.value), 90 - trainPct))}/></label><div className={styles.splitBar}><i style={{ width: `${trainPct}%` }}>TRAIN</i><i style={{ width: `${valPct}%` }}>VAL</i><i style={{ width: `${testPct}%` }}>TEST</i></div><button disabled={!validSplit || splitLocked} onClick={() => setSplitLocked(true)}>{splitLocked ? "SPLIT LOCKED ✓" : "LOCK DATA SPLIT"}</button><p>{validSplit ? "Healthy toy split proportions. Exact ratios depend on dataset size and task." : "Keep enough data in every room: train 60–80%, validation/test 10–25% each for this exercise."}</p></div><div className={styles.roomCards}>{(["train","validation","test"] as const).map(room => <motion.button whileHover={{ y: -4 }} className={roomsSeen.includes(room) ? styles.roomSeen : ""} onClick={() => inspectRoom(room)} key={room}><Vault label={room.toUpperCase()} sealed={room === "test"}/><p>{roomCopy[room][progress.depth]}</p><small>{roomsSeen.includes(room) ? "INSPECTED ✓" : "CLICK TO INSPECT"}</small></motion.button>)}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["build-data-splits"])}>Inspect all three rooms and lock a valid split.</TaskStamp>
    </LessonSection>

    <LessonSection id="train-room" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="TRAIN · CHANGE WEIGHTS" title="Only the training room fits the model.">Run epochs. The toy weight and training loss change. Validation/test examples remain observers, not optimizer fuel.</Heading>
      <div className={styles.trainLab}><div className={styles.trainRows}>{Array.from({ length: 18 }).map((_, index) => <motion.i animate={epochs ? { scale: [1, 1.08, 1] } : undefined} transition={{ delay: index * .02 }} key={index}>{index % 3 === 0 ? "A" : "B"}</motion.i>)}</div><div className={styles.trainConsole}><CheckpointBot active={epochs > 0}/><span>EPOCH</span><strong>{epochs}</strong><div><span>WEIGHT</span><b>{weight}</b></div><div><span>TRAIN LOSS</span><b>{Math.max(.08, 1.1 * Math.exp(-epochs * .32)).toFixed(3)}</b></div><button disabled={!splitLocked} onClick={trainEpoch}>RUN TRAINING EPOCH</button><p>{epochs < 6 ? "Run at least six epochs. Every click updates model parameters using only training rows." : "Weights fitted. We still have not used test results to choose anything."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["fit-on-train"])}>Run at least six training epochs.</TaskStamp>
    </LessonSection>

    <LessonSection id="validation-room" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="RUN ALL · CHOOSE" title="Validation is where configurations compete.">Train/evaluate all four candidates conceptually, then choose based on validation — not the biggest training score.</Heading>
      <div className={styles.configGrid}>{tuningConfigs.map(config => <motion.button whileHover={{ y: -4 }} className={`${configsRun.includes(config.id) ? styles.configRun : ""} ${selectedConfig === config.id ? styles.configSelected : ""}`} onClick={() => runConfig(config.id)} key={config.id}><span>CONFIG {config.id}</span><dl><div><dt>depth</dt><dd>{config.depth}</dd></div><div><dt>regularization</dt><dd>{config.reg}</dd></div></dl>{configsRun.includes(config.id) ? <><div className={styles.scorePair}><i><b style={{ width: `${config.train}%` }}/><span>train {config.train}%</span></i><i><b style={{ width: `${config.validation}%` }}/><span>validation {config.validation}%</span></i></div><button onClick={event => { event.stopPropagation(); setSelectedConfig(config.id); }}>SELECT CONFIG</button></> : <strong>RUN TRAIN + VALIDATE</strong>}</motion.button>)}</div>{selectedConfig && <div className={`${styles.selectionNote} ${selectedConfig === "B" ? styles.selectionGood : styles.selectionBad}`}><b>SELECTED {selectedConfig}</b><span>{selectedConfig === "B" ? "Best validation score in this toy experiment. Notice C wins training but loses on validation." : "Look again at validation performance, not just training score."}</span></div>}
      <TaskStamp done={Boolean(progress.completedTasks["tune-on-validation"])}>Run all four configs and select B from validation performance.</TaskStamp>
    </LessonSection>

    <LessonSection id="sealed-test" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="CHEAT · CONTAMINATE · RESET" title="Open the test too often and it stops being a final exam.">First deliberately misuse it. Peek three times while imagining you tweak decisions based on the score. Then reset the experiment and perform one clean final evaluation.</Heading>
      <div className={styles.testLab}><div className={styles.testVault}><Vault label="FINAL TEST" sealed={testPeeks === 0}/><span>INDEPENDENCE</span><strong>{independence}%</strong><i><b style={{ width: `${independence}%` }}/></i><button disabled={!selectedConfig} onClick={peekTest}>{testPeeks === 0 ? "OPEN FINAL TEST" : "PEEK / TUNE AGAIN"}</button><small>{testPeeks} test evaluations in current experiment</small></div><div className={styles.testReport}>{testPeeks === 0 ? <><strong>SEALED</strong><p>Choose a configuration from validation first.</p></> : <><strong>{selectedTuning ? Math.max(60, selectedTuning.validation - 2 + Math.min(4, testPeeks)).toFixed(1) : "—"}%</strong><p>{testPeeks < 3 ? "A test result is visible. If you now change your system because of this number, you have used test information for selection." : "CONTAMINATED: repeated feedback from the test sample has influenced your choices. It is now functioning like another validation set."}</p></>}{contaminationSeen && !experimentReset && <button onClick={resetProtocol}>↺ START FRESH EXPERIMENT + RE-SEAL TEST</button>}{experimentReset && testPeeks === 0 && <p className={styles.cleanProtocol}>Fresh protocol: validation already selected B. Open test once, report it, stop.</p>}{experimentReset && cleanTestOpened && testPeeks === 1 && <strong className={styles.cleanStamp}>ONE CLEAN FINAL TEST ✓</strong>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["respect-test-seal"])}>Contaminate with 3+ peeks, reset the experiment, then open the final test exactly once.</TaskStamp>
    </LessonSection>

    <LessonSection id="split-strategies" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="ROUTE · DIAGNOSE" title="The right split respects the structure of the problem.">Random is not always safe. Use stratification for rare labels and time-aware splits when chronology matters.</Heading>
      <div className={styles.strategyGrid}>{strategyScenarios.map(item => { const choice = strategyChoices[item.id]; return <article className={choice ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><p>{item.text}</p><div>{(["random","stratified","time"] as SplitStrategy[]).map(strategy => <button className={choice === strategy ? styles.active : ""} onClick={() => setStrategyChoices(current => ({ ...current, [item.id]: strategy }))} key={strategy}>{strategy.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["choose-split-strategy"])}>Classify all six split scenarios correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="duplicate-leakage" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="FIND DUPLICATES · REMOVE" title="A clean percentage split can still leak examples.">The same customer/event/image can appear twice under different row IDs. Inspect the duplicate pair crossing train and test, then repair it.</Heading>
      <div className={styles.duplicateLab}><div className={styles.duplicateRooms}><section><span>TRAIN</span><code>row_18 · image_hash 7FA2 · CAT</code><code>row_27 · image_hash 3B91 · DOG</code><motion.code className={duplicateLeak ? styles.duplicate : ""}>row_44 · image_hash A81C · CAT</motion.code></section><section><span>TEST</span><code>row_103 · image_hash 9D04 · DOG</code><motion.code className={duplicateLeak ? styles.duplicate : ""}>row_121 · image_hash A81C · CAT</motion.code><code>row_133 · image_hash C552 · DOG</code></section></div><div className={styles.duplicateConsole}><span>APPARENT TEST SCORE</span><motion.strong key={duplicateLeak ? "leak" : "clean"} initial={{ scale: .8 }} animate={{ scale: 1 }}>{duplicateLeak ? "96%" : "87%"}</motion.strong><button onClick={() => setDuplicateInspected(true)}>COMPARE CONTENT HASHES</button>{duplicateInspected && <p>Found identical content hash <b>A81C</b> in train and test. Row IDs differ, content does not.</p>}<button disabled={!duplicateInspected || !duplicateLeak} onClick={() => setDuplicateLeak(false)}>REMOVE / GROUP DUPLICATES BEFORE SPLIT</button>{!duplicateLeak && <p>Score fell — but now it better reflects genuinely unseen examples.</p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["repair-split-leakage"])}>Find and remove the cross-split duplicate.</TaskStamp>
    </LessonSection>

    <LessonSection id="checkpoint-station" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="INSPECT · RESTORE BEST" title="Checkpoint the model state while training evolves.">Training loss keeps improving here, but validation loss bottoms out at epoch 14 then worsens. Inspect all snapshots and restore the best validation checkpoint.</Heading>
      <div className={styles.checkpointLab}><div className={styles.checkpointShelf}>{checkpointRows.map((row, index) => <motion.button whileHover={{ y: -4 }} onClick={() => inspectCheckpoint(index)} className={`${checkpointsSeen.includes(index) ? styles.checkpointSeen : ""} ${selectedCheckpoint === index ? styles.checkpointSelected : ""}`} key={row.epoch}><CheckpointBot active={selectedCheckpoint === index}/><span>EPOCH {row.epoch}</span>{checkpointsSeen.includes(index) && <><code>train loss {row.trainLoss}</code><code>val loss {row.valLoss}</code><code>weight {row.weight}</code><button onClick={event => { event.stopPropagation(); setSelectedCheckpoint(index); }}>RESTORE THIS</button></>}</motion.button>)}</div><div className={styles.bestCheckpoint}>{selectedCheckpoint === null ? <><strong>SELECT A CHECKPOINT</strong><p>Use validation loss, not lowest training loss.</p></> : <><span>RESTORED</span><strong>EPOCH {checkpointRows[selectedCheckpoint].epoch}</strong><p>train {checkpointRows[selectedCheckpoint].trainLoss} · validation {checkpointRows[selectedCheckpoint].valLoss}</p><b>{selectedCheckpoint === bestCheckpointIndex ? "BEST VALIDATION CHECKPOINT ✓" : "Not the best validation checkpoint."}</b></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["choose-best-checkpoint"])}>Inspect all five checkpoints and restore epoch 14, the best validation snapshot.</TaskStamp>
    </LessonSection>

    <LessonSection id="split-vs-checkpoint" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="CLASSIFY · STOP MIXING TERMS" title="A data split and a model checkpoint live on different axes.">One partitions examples. The other saves model/training state. Classify eight artifacts.</Heading>
      <div className={styles.artifactGrid}>{artifactCards.map(item => { const choice = artifactChoices[item.id]; return <article className={choice ? (choice === item.answer ? styles.goodDark : styles.badDark) : ""} key={item.id}><p>{item.text}</p><div>{(["split","checkpoint","neither"] as ArtifactRole[]).map(role => <button className={choice === role ? styles.active : ""} onClick={() => setArtifactChoices(current => ({ ...current, [item.id]: role }))} key={role}>{role.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["classify-split-checkpoint"])}>Classify all eight items correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-evaluation" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain why validation may be used many times but test should stay special.">Also explain where checkpoints fit. They are saved model states, not partitions of examples.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🧪</span><p>“Why not just keep choosing the model with the best test score?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="Training data is used to... Validation is used to... The test set should... Repeated peeking... A checkpoint is..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={progress.completedTasks["explain-evaluation"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-evaluation"])}>Explain train/validation/test roles, contamination and checkpoints.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.gateOpen : ""}><span>QUIZ</span><strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 13 QUIZ</span><h2>Protect the final exam.</h2><p>Pass 6/7. Evaluation only means something if your choices did not secretly train on it.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Train learns. Validation chooses. Test estimates. Checkpoints save.</h2><p>And once the test score starts steering your decisions, it is no longer a clean final test.</p></div><Link href="/lessons/generalization">← LESSON 12</Link><div><small>NEXT</small><strong>Learning Across Time & Tasks</strong><span>new lesson</span></div></section>
  </main>;
}
