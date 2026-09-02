"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./learning-types.module.css";

type Props = { progress: LessonProgressApi };
type LearningType = "supervised" | "unsupervised" | "self" | "semi";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

const sections = [
  { id: "four-rooms", taskId: "inspect-learning-rooms" },
  { id: "supervised", taskId: "train-supervised" },
  { id: "unsupervised", taskId: "cluster-unlabeled" },
  { id: "self-supervised", taskId: "solve-self-supervised" },
  { id: "semi-supervised", taskId: "mix-semi-supervised" },
  { id: "same-data", taskId: "compare-objectives" },
  { id: "scenario-router", taskId: "route-learning-scenarios" },
  { id: "data-budget", taskId: "design-data-strategy" },
  { id: "explain-learning-types", taskId: "explain-learning-types" },
] as const;

const roomCopy: Record<LearningType, DepthCopy> = {
  supervised: {
    simple: <>A teacher gives examples <strong>with the right answers attached</strong>.</>,
    real: <>Each training example includes an input and target/label; the objective rewards predicting those provided targets accurately.</>,
    expert: <>The learner optimizes an empirical risk/objective over labeled pairs (x, y), estimating a mapping or conditional distribution from input to target.</>,
  },
  unsupervised: {
    simple: <>No answer sheet. The system tries to <strong>find structure or groups</strong> in the data.</>,
    real: <>The dataset lacks task labels; algorithms model structure such as clusters, density, latent factors, similarity or anomalies.</>,
    expert: <>“Unsupervised” is a broad umbrella for objectives that do not rely on externally provided task targets, including clustering, density estimation, dimensionality reduction and latent-variable modeling.</>,
  },
  self: {
    simple: <>The data <strong>hides part of itself and becomes its own quiz</strong>.</>,
    real: <>Targets are created automatically from the raw data — for example predicting a masked token, next token, missing patch or relationship between views.</>,
    expert: <>Self-supervised learning constructs supervisory signals from transformations/structure of unlabeled data. It is commonly used for representation/foundation-model pretraining and can be viewed as supervised optimization with automatically derived targets.</>,
  },
  semi: {
    simple: <>Use <strong>a few examples with answers</strong> plus lots of examples without them.</>,
    real: <>Semi-supervised methods combine a labeled subset with a larger unlabeled set using techniques such as pseudo-labeling, consistency regularization or graph-based propagation.</>,
    expert: <>The objective mixes labeled loss with information extracted from the unlabeled distribution; assumptions such as cluster/manifold consistency often determine when the unlabeled data helps.</>,
  },
};

const supervisedExamples = [
  { id: "s1", icon: "🍎", label: "APPLE" }, { id: "s2", icon: "🍊", label: "ORANGE" },
  { id: "s3", icon: "🍏", label: "APPLE" }, { id: "s4", icon: "🍊", label: "ORANGE" },
  { id: "s5", icon: "🍎", label: "APPLE" }, { id: "s6", icon: "🍊", label: "ORANGE" },
] as const;

const selfQuestions = [
  { id: "m1", left: "The sky is", answer: "blue", options: ["blue", "fork", "chair"] },
  { id: "m2", left: "A dog has four", answer: "legs", options: ["clouds", "legs", "keys"] },
  { id: "m3", left: "Paris is in", answer: "France", options: ["France", "banana", "Tuesday"] },
  { id: "m4", left: "2 + 2 =", answer: "4", options: ["7", "4", "rain"] },
] as const;

const scenarios = [
  { id: "r1", text: "Predict house price from historical homes with known sale prices.", answer: "supervised" as LearningType },
  { id: "r2", text: "Group customers into behavioral segments when no segment labels exist.", answer: "unsupervised" as LearningType },
  { id: "r3", text: "Pretrain a language model by predicting hidden/next pieces of raw text.", answer: "self" as LearningType },
  { id: "r4", text: "Classify medical images with 300 expert labels plus 30,000 unlabeled images.", answer: "semi" as LearningType },
  { id: "r5", text: "Detect unusual transactions by modeling normal patterns without fraud labels.", answer: "unsupervised" as LearningType },
  { id: "r6", text: "Train spam classifier from emails explicitly labeled spam/not spam.", answer: "supervised" as LearningType },
  { id: "r7", text: "Learn image representations by matching two transformed views of the same unlabeled image.", answer: "self" as LearningType },
  { id: "r8", text: "Use 100 labeled wildlife photos to seed labels for thousands of unlabeled photos, then retrain.", answer: "semi" as LearningType },
] as const;

const budgetStrategies = [
  { id: "manual", title: "LABEL EVERYTHING", labels: 10000, unlabeled: 0, cost: 10000, score: 94, note: "Strong but impossible under the toy budget." },
  { id: "small", title: "ONLY 100 LABELS", labels: 100, unlabeled: 0, cost: 100, score: 68, note: "Cheap, but throws away 9,900 available unlabeled examples." },
  { id: "semi", title: "100 LABELS + SEMI-SUPERVISED", labels: 100, unlabeled: 9900, cost: 100, score: 84, note: "Uses unlabeled structure to improve beyond the tiny labeled subset in this toy world." },
  { id: "self", title: "SELF-SUPERVISED PRETRAIN + 100 LABEL FINE-TUNE", labels: 100, unlabeled: 9900, cost: 100, score: 89, note: "Learns a representation from all raw images, then uses scarce labels for the downstream task." },
] as const;

const quizQuestions = [
  { q: "What makes ordinary supervised learning supervised?", options: ["The examples include task targets/labels used as feedback", "The model is watched by a human every second", "The dataset has no answers", "It only uses rules"], correct: 0, why: "Supervised training uses externally provided target values/classes for the examples." },
  { q: "What is an unsupervised clustering task trying to do?", options: ["Predict given class labels", "Discover structure/groups from unlabeled data", "Always generate text", "Update an API parameter"], correct: 1, why: "Clustering seeks structure based on similarity without task labels telling it the correct group." },
  { q: "Why is next-token prediction often described as self-supervised?", options: ["Humans manually label every token", "The target token is derived automatically from the original text itself", "It has no objective", "It never uses gradients"], correct: 1, why: "Raw sequences create their own input/target pairs: context is input and the held-out/next token becomes the target." },
  { q: "What is semi-supervised learning?", options: ["Half the model is symbolic", "Using labeled and unlabeled data together for a task", "Only using validation data", "Using exactly 50% labels"], correct: 1, why: "Semi-supervised methods combine a relatively small labeled set with additional unlabeled examples; it does not mean exactly half labeled." },
  { q: "Which task is most naturally unsupervised?", options: ["Predict email spam from known spam labels", "Find customer clusters with no segment labels", "Predict known sale price", "Classify photos using labeled examples"], correct: 1, why: "If no segment labels exist and the goal is to discover groups, clustering is an unsupervised framing." },
  { q: "Is self-supervised learning literally 'no supervision'?", options: ["Yes, there is no target/objective anywhere", "No — it creates target signals automatically from the data rather than relying on manual task labels", "Only for language", "Only for tiny models"], correct: 1, why: "Self-supervised methods still optimize predictive/contrastive/reconstruction objectives; the supervisory signal comes from data structure." },
  { q: "Best mental model for these categories?", options: ["Four different species of neural network", "Different ways of constructing the learning signal/objective and using labeled vs unlabeled data", "A strict ranking from worst to best", "Four cloud providers"], correct: 1, why: "The categories primarily describe the learning setup and source of supervision, not one mandatory model architecture." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function RoomCharacter({ type, active = false }: { type: LearningType; active?: boolean }) {
  const icon = type === "supervised" ? "✓" : type === "unsupervised" ? "◌" : type === "self" ? "▣" : "⇄";
  const name = type === "supervised" ? "TEACH" : type === "unsupervised" ? "SCOUT" : type === "self" ? "MASK" : "BRIDGE";
  return <motion.div className={`${styles.roomCharacter} ${styles[type]}`} animate={{ y: active ? [0, -9, 0] : [0, -5, 0], rotate: active ? [0, -2, 2, 0] : [0, 1, -1, 0] }} transition={{ duration: active ? 1.4 : 3, repeat: Infinity }}><div><i/><i/><strong>{icon}</strong></div><b>{name}</b></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;
  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>🚪🔒</motion.span><h3>Learning-lab exam locked.</h3><p>Complete experiments in all four rooms first.</p></div>;
  const submit = () => { if (answered === quizQuestions.length) { setSubmitted(true); progress.saveQuiz(score, passed); } };
  return <div className={styles.quiz}>{quizQuestions.map((question, index) => <div className={styles.question} key={question.q}><h3><span>{index + 1}</span>{question.q}</h3><div>{question.options.map((option, optionIndex) => <motion.button whileTap={{ scale: .97 }} disabled={submitted} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === question.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}><i>{String.fromCharCode(65 + optionIndex)}</i>{option}</motion.button>)}</div>{submitted && <p>{question.why}</p>}</div>)}{!submitted ? <button className={`${styles.submit} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>CHECK ALL FOUR ROOMS →</button> : <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className={`${styles.result} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><div><h3>{passed ? "Learning signals understood." : "Route the examples again."}</h3><p>{passed ? "You can identify where the supervisory signal comes from." : "Pass is 6/7. Read the explanations and retry."}</p></div>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</motion.div>}</div>;
}

export function LearningTypesLesson({ progress }: Props) {
  const [roomsSeen, setRoomsSeen] = useState<LearningType[]>([]);
  const [supervisedFed, setSupervisedFed] = useState<string[]>([]);
  const [supervisedTrained, setSupervisedTrained] = useState(false);
  const [clusterK, setClusterK] = useState(2);
  const [clusterRuns, setClusterRuns] = useState<number[]>([]);
  const [selfAnswers, setSelfAnswers] = useState<Record<string, string>>({});
  const [semiLabeled, setSemiLabeled] = useState<string[]>([]);
  const [pseudoPropagated, setPseudoPropagated] = useState(false);
  const [objectivesSeen, setObjectivesSeen] = useState<LearningType[]>([]);
  const [scenarioChoices, setScenarioChoices] = useState<Record<string, LearningType>>({});
  const [strategiesSeen, setStrategiesSeen] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const selfCorrect = selfQuestions.every(question => selfAnswers[question.id] === question.answer);
  const scenarioCorrect = scenarios.every(scenario => scenarioChoices[scenario.id] === scenario.answer);
  const inspectRoom = (type: LearningType) => setRoomsSeen(current => current.includes(type) ? current : [...current, type]);
  const markObjective = (type: LearningType) => setObjectivesSeen(current => current.includes(type) ? current : [...current, type]);
  const markStrategy = (id: string) => setStrategiesSeen(current => current.includes(id) ? current : [...current, id]);

  useEffect(() => { if (roomsSeen.length === 4) progress.completeTask("inspect-learning-rooms"); }, [roomsSeen.length, progress]);
  useEffect(() => { if (supervisedFed.length === supervisedExamples.length && supervisedTrained) progress.completeTask("train-supervised"); }, [supervisedFed.length, supervisedTrained, progress]);
  useEffect(() => { if (clusterRuns.includes(2) && clusterRuns.includes(3)) progress.completeTask("cluster-unlabeled"); }, [clusterRuns, progress]);
  useEffect(() => { if (selfCorrect) progress.completeTask("solve-self-supervised"); }, [selfCorrect, progress]);
  useEffect(() => { if (semiLabeled.length >= 3 && pseudoPropagated) progress.completeTask("mix-semi-supervised"); }, [semiLabeled.length, pseudoPropagated, progress]);
  useEffect(() => { if (objectivesSeen.length === 4) progress.completeTask("compare-objectives"); }, [objectivesSeen.length, progress]);
  useEffect(() => { if (scenarioCorrect) progress.completeTask("route-learning-scenarios"); }, [scenarioCorrect, progress]);
  useEffect(() => { if (strategiesSeen.length === budgetStrategies.length) progress.completeTask("design-data-strategy"); }, [strategiesSeen.length, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const feedSupervised = (id: string) => setSupervisedFed(current => current.includes(id) ? current : [...current, id]);
  const runCluster = (k: number) => { setClusterK(k); setClusterRuns(current => current.includes(k) ? current : [...current, k]); };
  const labelSemi = (id: string) => setSemiLabeled(current => current.includes(id) ? current : [...current, id]);
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["label", "target", "supervised", "unsupervised", "cluster", "self-supervised", "data itself", "unlabeled", "semi-supervised", "few"].filter(term => text.includes(term));
    if (explanation.trim().length < 120) { setFeedback("Use at least one sentence per setup: supervised, unsupervised, self-supervised and semi-supervised."); return; }
    if (hits.length < 7) { setFeedback("Mention where labels/targets come from: external labels, no task labels, targets derived from data itself, or a mix of labeled + unlabeled data."); return; }
    setFeedback("Strong. You explained the source of the learning signal rather than treating the four names as model architectures.");
    progress.completeTask("explain-learning-types");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · LESSON 10</span><h1>HOW DOES<br/>THE MODEL<br/><em>GET FEEDBACK?</em></h1><p>The learning type is mostly about <strong>where the training signal comes from</strong>: human/task labels, structure with no labels, targets created from the raw data itself, or a mixture.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroRooms}>{(["supervised","unsupervised","self","semi"] as LearningType[]).map(type => <div key={type}><RoomCharacter type={type} active/><span>{type === "self" ? "SELF-SUPERVISED" : type === "semi" ? "SEMI-SUPERVISED" : type.toUpperCase()}</span></div>)}</div></section>

    <LessonSection id="four-rooms" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · OPEN ALL" title="Four rooms. Four sources of learning signal.">Open each room using your current Simple / Real / Expert depth.</Heading>
      <div className={styles.roomGrid}>{(["supervised","unsupervised","self","semi"] as LearningType[]).map(type => <motion.button whileHover={{ y: -5 }} key={type} onClick={() => inspectRoom(type)} className={`${styles.roomCard} ${styles[type]} ${roomsSeen.includes(type) ? styles.roomSeen : ""}`}><RoomCharacter type={type} active={roomsSeen.includes(type)}/><h3>{type === "self" ? "SELF-SUPERVISED" : type === "semi" ? "SEMI-SUPERVISED" : type.toUpperCase()}</h3><p>{roomCopy[type][progress.depth]}</p><small>{roomsSeen.includes(type) ? "ROOM OPEN ✓" : "CLICK TO ENTER"}</small></motion.button>)}</div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-learning-rooms"])}>Open all four learning rooms.</TaskStamp>
    </LessonSection>

    <LessonSection id="supervised" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="FEED · LABEL · TRAIN" title="Supervised: every example arrives with an answer.">Feed all six fruit examples. The label tells the learner what output it should have produced.</Heading>
      <div className={styles.supervisedLab}><div className={styles.labeledExamples}>{supervisedExamples.map(example => <motion.button whileTap={{ scale: .95 }} className={supervisedFed.includes(example.id) ? styles.fed : ""} onClick={() => feedSupervised(example.id)} key={example.id}><span>{example.icon}</span><strong>{example.label}</strong><small>{supervisedFed.includes(example.id) ? "FED ✓" : "feed"}</small></motion.button>)}</div><div className={styles.teacherMachine}><RoomCharacter type="supervised" active={supervisedFed.length > 0}/><div><span>INPUT</span><b>→</b><span>PREDICTION</span><b>↔</b><span>KNOWN LABEL</span><b>→</b><span>ERROR / UPDATE</span></div><button disabled={supervisedFed.length !== supervisedExamples.length} onClick={() => setSupervisedTrained(true)}>{supervisedTrained ? "TRAINED ✓" : "TRAIN ON LABELED PAIRS"}</button>{supervisedTrained && <p>New fruit 🍏 → <strong>APPLE · 94%</strong></p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["train-supervised"])}>Feed all six labeled examples and train.</TaskStamp>
    </LessonSection>

    <LessonSection id="unsupervised" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="SLIDE · CLUSTER" title="Unsupervised: remove the answer sheet and ask for structure.">The points have no class labels. Change K and watch a toy clustering algorithm partition the same geometry differently.</Heading>
      <div className={styles.clusterLab}><div className={styles.clusterPlot}>{Array.from({ length: 18 }).map((_, index) => { const group = index % 3; const x = group === 0 ? 18 + (index * 7) % 18 : group === 1 ? 52 + (index * 5) % 18 : 74 + (index * 3) % 16; const y = group === 0 ? 25 + (index * 11) % 18 : group === 1 ? 65 + (index * 7) % 20 : 28 + (index * 9) % 20; const colorClass = clusterK === 2 ? (x < 55 ? styles.clusterOne : styles.clusterTwo) : group === 0 ? styles.clusterOne : group === 1 ? styles.clusterTwo : styles.clusterThree; return <motion.i layout className={colorClass} style={{ left: `${x}%`, bottom: `${y}%` }} key={index}/>; })}<span>NO CLASS LABELS</span></div><div className={styles.clusterControls}><RoomCharacter type="unsupervised" active={clusterRuns.length > 0}/><label>NUMBER OF CLUSTERS K <strong>{clusterK}</strong><input type="range" min="2" max="3" value={clusterK} onChange={event => setClusterK(Number(event.target.value))}/></label><button onClick={() => runCluster(clusterK)}>RUN CLUSTERING K={clusterK}</button><p>Tested K values: {clusterRuns.join(", ") || "none"}. The algorithm groups by structure/similarity, not by provided APPLE/ORANGE labels.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["cluster-unlabeled"])}>Run clustering with K=2 and K=3.</TaskStamp>
    </LessonSection>

    <LessonSection id="self-supervised" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="HIDE · PREDICT" title="Self-supervised: the raw data manufactures its own targets.">No human had to label “blue,” “legs,” “France” or “4.” We hide a known piece of the original data and make it the target.</Heading>
      <div className={styles.maskLab}>{selfQuestions.map(question => { const answer = selfAnswers[question.id]; return <article className={answer ? (answer === question.answer ? styles.correctCard : styles.wrongCard) : ""} key={question.id}><span>{question.left} <b>[ MASK ]</b></span><div>{question.options.map(option => <button className={answer === option ? styles.activeOption : ""} onClick={() => setSelfAnswers(current => ({ ...current, [question.id]: option }))} key={option}>{option}</button>)}</div>{answer && <p>{answer === question.answer ? `✓ Original hidden target: ${question.answer}` : "Not the hidden piece from the original data."}</p>}</article>; })}</div><div className={styles.selfFlow}><RoomCharacter type="self" active={Object.keys(selfAnswers).length > 0}/><span>RAW DATA</span><b>→</b><span>MASK / TRANSFORM</span><b>→</b><span>INPUT + AUTO-DERIVED TARGET</span><b>→</b><span>TRAIN</span></div>
      <TaskStamp done={Boolean(progress.completedTasks["solve-self-supervised"])}>Recover all four auto-derived targets.</TaskStamp>
    </LessonSection>

    <LessonSection id="semi-supervised" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="LABEL A FEW · PROPAGATE" title="Semi-supervised: labels are expensive, raw examples are cheap.">Seed a few labeled points, then use them with the unlabeled structure. This is a toy pseudo-labeling/propagation picture, not a universal semi-supervised algorithm.</Heading>
      <div className={styles.semiLab}><div className={styles.semiCloud}>{Array.from({ length: 16 }).map((_, index) => { const left = index < 8 ? 15 + (index * 6) % 25 : 58 + (index * 5) % 27; const top = 15 + (index * 13) % 65; const id = `p${index}`; const labeled = semiLabeled.includes(id); const pseudo = pseudoPropagated && !labeled; return <button key={id} style={{ left: `${left}%`, top: `${top}%` }} className={`${labeled ? (index < 8 ? styles.labelBlue : styles.labelPink) : ""} ${pseudo ? (index < 8 ? styles.pseudoBlue : styles.pseudoPink) : ""}`} onClick={() => !pseudoPropagated && labelSemi(id)}>{labeled ? (index < 8 ? "A" : "B") : pseudo ? (index < 8 ? "a?" : "b?") : "?"}</button>; })}</div><div className={styles.semiControls}><RoomCharacter type="semi" active={semiLabeled.length > 0}/><span>MANUAL LABELS</span><strong>{semiLabeled.length}</strong><p>Click at least three seed points before propagation.</p><button disabled={semiLabeled.length < 3 || pseudoPropagated} onClick={() => setPseudoPropagated(true)}>{pseudoPropagated ? "UNLABELED DATA USED ✓" : "PROPAGATE / PSEUDO-LABEL"}</button>{pseudoPropagated && <small>Now a later training pass can use labeled loss plus information/pseudo-labels from the larger unlabeled set.</small>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["mix-semi-supervised"])}>Label at least three seeds and propagate to the unlabeled set.</TaskStamp>
    </LessonSection>

    <LessonSection id="same-data" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="SAME RAW DATA · CHANGE OBJECTIVE" title="Learning type is not the file format or network architecture.">Click every objective. The raw images/text could be identical while the learning signal changes.</Heading>
      <div className={styles.objectiveBoard}><div className={styles.rawPile}><span>RAW DATA</span><strong>10,000 images</strong><i>🦊 🐺 🦌 🐻 🦊 🐺</i></div><div className={styles.objectives}>{(["supervised","unsupervised","self","semi"] as LearningType[]).map(type => <button className={objectivesSeen.includes(type) ? styles.objectiveSeen : ""} onClick={() => markObjective(type)} key={type}><RoomCharacter type={type}/><strong>{type === "self" ? "SELF-SUPERVISED" : type === "semi" ? "SEMI-SUPERVISED" : type.toUpperCase()}</strong><p>{type === "supervised" ? "Use explicit species labels as targets." : type === "unsupervised" ? "Discover groups/structure without species labels." : type === "self" ? "Create a pretext/representation objective from the images themselves." : "Use a small labeled subset together with the remaining unlabeled images."}</p></button>)}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-objectives"])}>Inspect all four objectives on the same raw data.</TaskStamp>
    </LessonSection>

    <LessonSection id="scenario-router" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="ROUTE · DIAGNOSE" title="Choose the setup from the supervision available.">Classify eight real-world task framings. Focus on where the target signal comes from.</Heading>
      <div className={styles.scenarioGrid}>{scenarios.map(scenario => { const choice = scenarioChoices[scenario.id]; return <article className={choice ? (choice === scenario.answer ? styles.scenarioGood : styles.scenarioBad) : ""} key={scenario.id}><p>{scenario.text}</p><div>{(["supervised","unsupervised","self","semi"] as LearningType[]).map(type => <button className={choice === type ? styles.activeOption : ""} onClick={() => setScenarioChoices(current => ({ ...current, [scenario.id]: type }))} key={type}>{type === "supervised" ? "SUP" : type === "unsupervised" ? "UNSUP" : type === "self" ? "SELF" : "SEMI"}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["route-learning-scenarios"])}>Route all eight scenarios correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="data-budget" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="RUN · COMPARE" title="Design around the labeling budget.">You have 10,000 wildlife images but can afford only 100 expert labels. Run all strategies — then compare instead of pretending one method always wins.</Heading>
      <div className={styles.budgetBanner}><span>RAW IMAGES</span><strong>10,000</strong><span>LABEL BUDGET</span><strong>100</strong></div><div className={styles.strategyGrid}>{budgetStrategies.map(strategy => <motion.button whileHover={{ y: -4 }} className={strategiesSeen.includes(strategy.id) ? styles.strategySeen : ""} onClick={() => markStrategy(strategy.id)} key={strategy.id}><span>{strategy.title}</span><dl><div><dt>manual labels</dt><dd>{strategy.labels}</dd></div><div><dt>unlabeled used</dt><dd>{strategy.unlabeled}</dd></div><div><dt>toy label cost</dt><dd>{strategy.cost}</dd></div></dl>{strategiesSeen.includes(strategy.id) ? <><div className={styles.strategyScore}><i><b style={{ width: `${strategy.score}%` }}/></i><strong>{strategy.score}% toy score</strong></div><p>{strategy.note}</p></> : <strong>RUN STRATEGY</strong>}</motion.button>)}</div>{strategiesSeen.length === budgetStrategies.length && <motion.div className={styles.budgetConclusion} initial={{ scale: .92 }} animate={{ scale: 1 }}><b>NO UNIVERSAL WINNER</b><span>Data quality, distribution match, model family, objective, label cost and compute decide which strategy is best. This toy makes unlabeled-data methods useful by construction.</span></motion.div>}
      <TaskStamp done={Boolean(progress.completedTasks["design-data-strategy"])}>Run and compare all four labeling-budget strategies.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-learning-types" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain the source of supervision.">Teach the four setups without calling one “smarter” than another.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🧠</span><p>“So unsupervised means the model just learns by itself, with no goal?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="Supervised uses... Unsupervised tries to... Self-supervised creates targets from... Semi-supervised combines..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={progress.completedTasks["explain-learning-types"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-learning-types"])}>Explain all four learning setups by their supervision signal.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.gateOpen : ""}><span>QUIZ</span><strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 10 QUIZ</span><h2>Where does the learning signal come from?</h2><p>Pass 6/7. Labels are only one way to construct a useful training objective.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Different supervision, not different magic.</h2><p>Supervised: external labels. Unsupervised: discover unlabeled structure. Self-supervised: derive targets from the data. Semi-supervised: mix scarce labels with unlabeled examples.</p></div><Link href="/lessons/features-labels">← LESSON 09</Link><div><small>NEXT</small><strong>Reinforcement Learning</strong><span>build queue</span></div></section>
  </main>;
}
