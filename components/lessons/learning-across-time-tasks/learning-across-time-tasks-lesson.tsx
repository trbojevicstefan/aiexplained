"use client";

import Link from "next/link";
import { motion, Reorder } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./learning-across-time-tasks.module.css";

type Props = { progress: LessonProgressApi };
type Strategy = "batch" | "online" | "transfer" | "representation";
type TransferVerdict = "good" | "bad";

const sections = [
  { id: "batch-vs-online", taskId: "compare-batch-online" },
  { id: "stream-updates", taskId: "run-online-updates" },
  { id: "concept-drift", taskId: "adapt-to-drift" },
  { id: "transfer-learning", taskId: "build-transfer-pipeline" },
  { id: "freeze-unfreeze", taskId: "test-transfer-strategies" },
  { id: "representation-learning", taskId: "learn-representation" },
  { id: "negative-transfer", taskId: "diagnose-transfer" },
  { id: "scenario-router", taskId: "route-learning-strategy" },
  { id: "explain-across-time", taskId: "explain-across-time" },
] as const;

const transferPipelineCorrect = ["Pretrained source model", "Reusable representation", "New target task", "Adapt / fine-tune", "Target model"];

const transferCases = [
  { id: "t1", text: "Start image classifier from weights pretrained on millions of general images, then fine-tune on 5,000 flower photos.", answer: "good" as TransferVerdict, why: "Source visual representations are plausibly useful for another visual task." },
  { id: "t2", text: "Initialize a medical imaging model from a generic image encoder, then validate carefully on radiology data.", answer: "good" as TransferVerdict, why: "Transfer may help, though domain mismatch means careful validation is essential." },
  { id: "t3", text: "Reuse a speech recognition model as the starting representation for classifying tabular bank transactions with no shared modality/structure.", answer: "bad" as TransferVerdict, why: "The source representation is poorly aligned with the target input/task; transfer may provide little or harmful inductive bias." },
  { id: "t4", text: "Fine-tune a language model on legal contracts after broad language pretraining.", answer: "good" as TransferVerdict, why: "Language representations and broad linguistic knowledge are relevant to the legal text domain." },
  { id: "t5", text: "Copy a model trained on left-hand traffic-driving controls directly into a right-hand traffic policy without adaptation/testing.", answer: "bad" as TransferVerdict, why: "Source behavior can encode assumptions that conflict with the target environment." },
  { id: "t6", text: "Use a multilingual text encoder as features for a new language similarity task with a small labeled set.", answer: "good" as TransferVerdict, why: "The representation and modality align with the target task." },
] as const;

const scenarios = [
  { id: "s1", text: "Retrain a credit-risk model every Sunday from the full accumulated dataset.", answer: "batch" as Strategy },
  { id: "s2", text: "Update a click-through model incrementally as fresh events and delayed feedback arrive throughout the day.", answer: "online" as Strategy },
  { id: "s3", text: "Start a dog-breed classifier from a strong general-purpose vision encoder instead of random weights.", answer: "transfer" as Strategy },
  { id: "s4", text: "Train an encoder so similar products are nearby in vector space without hand-writing every product feature.", answer: "representation" as Strategy },
  { id: "s5", text: "Train a foundation language model to learn useful internal features from raw text, then reuse them for many tasks.", answer: "representation" as Strategy },
  { id: "s6", text: "A recommender adapts its parameters in small increments as user preferences drift.", answer: "online" as Strategy },
  { id: "s7", text: "A nightly ETL job rebuilds a model from a frozen snapshot of the day's dataset.", answer: "batch" as Strategy },
  { id: "s8", text: "Fine-tune a pretrained code model for a company's internal programming language.", answer: "transfer" as Strategy },
] as const;

const quizQuestions = [
  { q: "What is online learning?", options: ["Incrementally updating a model as new data/feedback arrives", "Training only once forever", "Using the internet", "Running inference in a browser"], correct: 0, why: "Online learning updates the model over time from a data stream rather than only fitting from one fixed batch." },
  { q: "What is concept drift?", options: ["The relationship/distribution relevant to prediction changes over time", "A CSS animation", "The model file moves folders", "The test set gets larger"], correct: 0, why: "If user behavior, markets or environments change, a previously good predictor can become stale." },
  { q: "What is transfer learning?", options: ["Reusing learned weights/representations from one source task/domain as a starting point for another", "Copying the dataset only", "Always freezing every layer", "Using two CPUs"], correct: 0, why: "Transfer learning leverages prior learned structure instead of starting the target task from scratch." },
  { q: "Why might you freeze early layers at first?", options: ["To preserve useful pretrained representations while adapting a smaller task-specific part", "Because frozen layers disappear", "To make labels unnecessary", "Because weights are API parameters"], correct: 0, why: "Feature-extraction-style transfer can keep pretrained representations fixed while training a new head." },
  { q: "What is representation learning?", options: ["Learning useful internal features/embeddings from data instead of specifying every feature by hand", "Only drawing charts", "Saving a checkpoint", "A synonym for evaluation"], correct: 0, why: "Representation learning discovers transformations/features that make downstream prediction or similarity easier." },
  { q: "Can transfer learning hurt?", options: ["Yes — source and target can be mismatched, causing negative transfer", "No, pretrained is always better", "Only if batch size is 1", "Only for text"], correct: 0, why: "Misaligned source knowledge or aggressive fine-tuning can hurt target performance; validate empirically." },
  { q: "Online learning solves drift automatically, right?", options: ["No — it can adapt, but bad/poisoned feedback, instability or changing objectives still need monitoring", "Yes, always", "Only with no labels", "Only if temperature=0"], correct: 0, why: "Adaptive updates can help with drift but introduce their own reliability and safety problems." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function StreamBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.streamBot} animate={{ y: active ? [0, -9, 0] : [0, -5, 0], rotate: active ? [0, -3, 3, 0] : [0, 1, 0] }} transition={{ duration: active ? 1.4 : 3, repeat: Infinity }}><div><i/><i/><strong>↻</strong><span>LIVE</span></div><b>STREAM</b></motion.div>;
}
function TransferBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.transferBot} animate={{ x: active ? [0, 7, 0] : [0, 3, 0], scale: [1, 1.03, 1] }} transition={{ duration: active ? 1.4 : 3.2, repeat: Infinity }}><div><i/><i/><strong>⇢</strong></div><b>TRANSFER</b></motion.div>;
}
function EmbedBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.embedBot} animate={{ scale: active ? [1, 1.06, .98, 1] : [1, 1.02, 1] }} transition={{ duration: active ? 1.5 : 3, repeat: Infinity }}><div><i/><i/><strong>⃗</strong></div><b>EMBED</b></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;
  if (!unlocked) return <div className={styles.quizLock}>🔄🔒<h3>Transfer lab exam locked.</h3><p>Adapt through time, move knowledge across tasks and open the representation space first.</p></div>;
  return <div className={styles.quiz}>{quizQuestions.map((question, index) => <section key={question.q}><h3><span>{index + 1}</span>{question.q}</h3><div>{question.options.map((option, optionIndex) => <button disabled={submitted} className={`${answers[index] === optionIndex ? styles.sel : ""} ${submitted && optionIndex === question.correct ? styles.ok : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.no : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}>{option}</button>)}</div>{submitted && <p>{question.why}</p>}</section>)}{!submitted ? <button disabled={Object.keys(answers).length !== quizQuestions.length} onClick={() => { setSubmitted(true); progress.saveQuiz(score, passed); }}>CHECK LEARNING STRATEGY →</button> : <div className={`${styles.quizResult} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><p>{passed ? "You can reason about learning across streams, tasks and representations." : "Pass is 6/7. Revisit where adaptation happens."}</p>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</div>}</div>;
}

export function LearningAcrossTimeTasksLesson({ progress }: Props) {
  const [batchRuns, setBatchRuns] = useState(0);
  const [onlineRuns, setOnlineRuns] = useState(0);
  const [streamWeight, setStreamWeight] = useState(.2);
  const [streamEvents, setStreamEvents] = useState(0);
  const [drift, setDrift] = useState(0);
  const [driftScore, setDriftScore] = useState(91);
  const [adapted, setAdapted] = useState(false);
  const [transferPipeline, setTransferPipeline] = useState(["New target task", "Pretrained source model", "Adapt / fine-tune", "Reusable representation", "Target model"]);
  const [freezeMode, setFreezeMode] = useState<"head" | "partial" | "full">("head");
  const [transferModesSeen, setTransferModesSeen] = useState<string[]>([]);
  const [embeddingSpread, setEmbeddingSpread] = useState(0);
  const [representationRuns, setRepresentationRuns] = useState(0);
  const [transferChoices, setTransferChoices] = useState<Record<string, TransferVerdict>>({});
  const [scenarioChoices, setScenarioChoices] = useState<Record<string, Strategy>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const pipelineCorrect = transferPipeline.join("|") === transferPipelineCorrect.join("|");
  const transferCorrect = transferCases.every(item => transferChoices[item.id] === item.answer);
  const scenariosCorrect = scenarios.every(item => scenarioChoices[item.id] === item.answer);

  useEffect(() => { if (batchRuns >= 2 && onlineRuns >= 4) progress.completeTask("compare-batch-online"); }, [batchRuns, onlineRuns, progress]);
  useEffect(() => { if (streamEvents >= 12) progress.completeTask("run-online-updates"); }, [streamEvents, progress]);
  useEffect(() => { if (drift >= 70 && adapted && driftScore >= 84) progress.completeTask("adapt-to-drift"); }, [drift, adapted, driftScore, progress]);
  useEffect(() => { if (pipelineCorrect) progress.completeTask("build-transfer-pipeline"); }, [pipelineCorrect, progress]);
  useEffect(() => { if (["head", "partial", "full"].every(mode => transferModesSeen.includes(mode))) progress.completeTask("test-transfer-strategies"); }, [transferModesSeen, progress]);
  useEffect(() => { if (representationRuns >= 5 && embeddingSpread >= 80) progress.completeTask("learn-representation"); }, [representationRuns, embeddingSpread, progress]);
  useEffect(() => { if (transferCorrect) progress.completeTask("diagnose-transfer"); }, [transferCorrect, progress]);
  useEffect(() => { if (scenariosCorrect) progress.completeTask("route-learning-strategy"); }, [scenariosCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const streamUpdate = () => { setStreamEvents(value => value + 1); setStreamWeight(value => Math.min(1.2, value + .055)); };
  const induceDrift = () => { setDrift(80); setDriftScore(58); setAdapted(false); };
  const adaptDrift = () => { if (drift >= 70) { setAdapted(true); setDriftScore(86); } };
  const runTransferMode = (mode: "head" | "partial" | "full") => { setFreezeMode(mode); setTransferModesSeen(current => current.includes(mode) ? current : [...current, mode]); };
  const trainRepresentation = () => { setRepresentationRuns(value => value + 1); setEmbeddingSpread(value => Math.min(100, value + 19)); };
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["online", "stream", "batch", "drift", "transfer", "pretrain", "representation", "feature", "embedding", "fine-tune", "freeze"].filter(term => text.includes(term));
    if (explanation.trim().length < 120) { setFeedback("Explain all three ideas: learning over time, transferring prior knowledge, and learning useful representations."); return; }
    if (hits.length < 7) { setFeedback("Add terms such as stream/online update, drift, pretrained/transfer/fine-tune, and learned representation/embedding."); return; }
    setFeedback("Strong. You separated when learning happens, where prior knowledge comes from, and what internal representation is learned.");
    progress.completeTask("explain-across-time");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · LESSON 14</span><h1>LEARN<br/>AGAIN.<br/><em>DON'T START OVER.</em></h1><p>Models can learn in batches, update as the world streams by, reuse knowledge from another task, and learn their own internal features. These are different ideas — but they often work together.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroMachines}><StreamBot active/><TransferBot active/><EmbedBot active/></div></section>

    <LessonSection id="batch-vs-online" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="RUN BOTH" title="Batch learning waits. Online learning updates through time.">Run both machines. Batch retraining rebuilds from a snapshot. Online learning applies smaller updates as new examples/feedback arrive.</Heading>
      <div className={styles.batchOnline}><article><span>BATCH MODE</span><div className={styles.batchPile}>{Array.from({ length: 18 }).map((_, index) => <i key={index}/>)}</div><strong>SNAPSHOT DATASET</strong><button onClick={() => setBatchRuns(value => value + 1)}>RETRAIN WHOLE SNAPSHOT</button><p>{batchRuns} full retrains. Simple operationally, but adaptation only happens when a retraining job runs.</p></article><article><StreamBot active={onlineRuns > 0}/><span>ONLINE MODE</span><div className={styles.eventTape}>{Array.from({ length: Math.min(10, onlineRuns) }).map((_, index) => <i key={index}>+</i>)}</div><button onClick={() => setOnlineRuns(value => value + 1)}>PROCESS NEXT EVENT + FEEDBACK</button><p>{onlineRuns} incremental updates. Fresh behavior can arrive faster, but stability, poisoning and monitoring become more important.</p></article></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-batch-online"])}>Run batch retraining twice and online updates at least four times.</TaskStamp>
    </LessonSection>

    <LessonSection id="stream-updates" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="CLICK · WATCH WEIGHT MOVE" title="An online update can change parameters after each small chunk of experience.">Feed a stream of events. The toy weight incrementally adapts instead of waiting for a giant retrain.</Heading>
      <div className={styles.streamLab}><div className={styles.streamTrack}>{Array.from({ length: 12 }).map((_, index) => <motion.i animate={{ opacity: index < streamEvents ? 1 : .18, x: index < streamEvents ? 0 : 8 }} key={index}>{index % 3 === 0 ? "click ✓" : index % 3 === 1 ? "view" : "skip ✕"}</motion.i>)}</div><div className={styles.streamConsole}><StreamBot active={streamEvents > 0}/><span>LEARNED WEIGHT</span><motion.strong key={streamWeight} initial={{ scale: .8 }} animate={{ scale: 1 }}>{streamWeight.toFixed(3)}</motion.strong><i><b style={{ width: `${Math.min(100, streamEvents / 12 * 100)}%` }}/></i><button onClick={streamUpdate}>NEXT EVENT → UPDATE</button><p>{streamEvents}/12 stream events. Production online systems may update per example, micro-batch, or other cadence — “online” does not require literally every row.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["run-online-updates"])}>Process twelve incremental events.</TaskStamp>
    </LessonSection>

    <LessonSection id="concept-drift" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="SHIFT WORLD · ADAPT" title="A model can become stale even if the code never breaks.">Change the world. Old user behavior no longer matches the model's learned relationship. Then use fresh feedback to adapt.</Heading>
      <div className={styles.driftLab}><div className={styles.driftPlot}><span>WORLD DRIFT {drift}%</span><motion.div animate={{ x: `${drift / 2}%`, rotate: drift / 14 }}><i/><i/><i/><i/><i/></motion.div><b>old decision boundary</b></div><div className={styles.driftConsole}><span>LIVE QUALITY</span><motion.strong key={driftScore} initial={{ scale: .75 }} animate={{ scale: 1 }}>{driftScore}%</motion.strong><button disabled={drift > 0} onClick={induceDrift}>⚡ SIMULATE BEHAVIOR DRIFT</button><button disabled={drift < 70 || adapted} onClick={adaptDrift}>↻ ADAPT WITH FRESH VERIFIED FEEDBACK</button><p>{drift === 0 ? "Original data distribution: strong score." : adapted ? "Adaptation recovered much of the lost quality — but online updates still need validation/guardrails." : "The relationship changed. A fixed old model is now stale."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["adapt-to-drift"])}>Trigger concept drift and recover with fresh feedback.</TaskStamp>
    </LessonSection>

    <LessonSection id="transfer-learning" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="DRAG · REUSE KNOWLEDGE" title="Transfer learning starts the new task with something already learned.">Order the transfer pipeline. A pretrained model can provide reusable representations/weights; the target task then adapts them.</Heading>
      <div className={styles.transferLab}><Reorder.Group axis="y" values={transferPipeline} onReorder={setTransferPipeline}>{transferPipeline.map((item, index) => <Reorder.Item whileDrag={{ scale: 1.04, rotate: 1 }} className={pipelineCorrect ? styles.pipelineGood : ""} value={item} key={item}><span>{index + 1}</span><strong>{item}</strong><small>drag</small></Reorder.Item>)}</Reorder.Group><div className={styles.transferMachine}><TransferBot active={pipelineCorrect}/>{pipelineCorrect ? <><strong>PRETRAINED → TARGET</strong><p>The target model does not begin from random ignorance. It inherits useful source representations, then adapts to target data/objective.</p></> : <><strong>Build the dependency chain.</strong><p>Ask: what must exist before target-task adaptation can begin?</p></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["build-transfer-pipeline"])}>Order the transfer-learning pipeline.</TaskStamp>
    </LessonSection>

    <LessonSection id="freeze-unfreeze" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="FREEZE · FINE-TUNE" title="Transfer is a spectrum: feature extraction to full fine-tuning.">Try three adaptation strategies. More trainable layers can improve target fit but cost more compute and can overwrite useful pretrained behavior.</Heading>
      <div className={styles.freezeLab}><div className={styles.layerTower}>{Array.from({ length: 7 }).map((_, index) => { const trainable = freezeMode === "full" || (freezeMode === "partial" && index >= 3) || index === 6; return <motion.div animate={{ backgroundColor: trainable ? "#ff9bc9" : "#cfd6de" }} key={index}><span>L{index + 1}</span><b>{trainable ? "TRAIN" : "FROZEN"}</b></motion.div>; })}</div><div className={styles.freezeControls}>{(["head","partial","full"] as const).map(mode => <button className={freezeMode === mode ? styles.active : ""} onClick={() => runTransferMode(mode)} key={mode}>{mode === "head" ? "TRAIN NEW HEAD ONLY" : mode === "partial" ? "UNFREEZE TOP LAYERS" : "FINE-TUNE ALL LAYERS"}</button>)}<div className={styles.transferMetrics}><span>TRAINABLE PARAMS</span><strong>{freezeMode === "head" ? "2%" : freezeMode === "partial" ? "38%" : "100%"}</strong><span>TOY TARGET SCORE</span><strong>{freezeMode === "head" ? "82" : freezeMode === "partial" ? "91" : "89"}%</strong><span>RELATIVE COMPUTE</span><strong>{freezeMode === "head" ? "1×" : freezeMode === "partial" ? "4×" : "11×"}</strong></div><p>These scores are illustrative. Full fine-tuning is not guaranteed to win; dataset size, domain shift, regularization and optimizer choices matter.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["test-transfer-strategies"])}>Test head-only, partial and full fine-tuning.</TaskStamp>
    </LessonSection>

    <LessonSection id="representation-learning" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="TRAIN · WATCH SPACE ORGANIZE" title="Representation learning lets the model discover useful coordinates.">At first the embeddings are a mess. Train the toy encoder and watch semantically related objects form neighborhoods.</Heading>
      <div className={styles.embeddingLab}><div className={styles.embeddingSpace}>{[
        ["🐶",15,25,"animal"],["🐱",27,36,"animal"],["🐺",21,53,"animal"],["🚗",65,22,"vehicle"],["🚙",78,35,"vehicle"],["🚲",70,52,"vehicle"],["🍎",48,76,"food"],["🍊",59,82,"food"],["🍐",38,84,"food"]
      ].map(([icon, xRaw, yRaw, group]) => { const x=Number(xRaw), y=Number(yRaw); const targets:Record<string,[number,number]>={animal:[22,35],vehicle:[74,35],food:[50,80]}; const [tx,ty]=targets[String(group)]; const t=embeddingSpread/100; return <motion.i animate={{ left:`${x+(tx-x)*t}%`, top:`${y+(ty-y)*t}%` }} key={String(icon)}>{icon}</motion.i>; })}<span>LEARNED 2D TEACHING PROJECTION</span></div><div className={styles.embeddingConsole}><EmbedBot active={representationRuns > 0}/><span>REPRESENTATION TRAINING</span><strong>{representationRuns}</strong><i><b style={{ width: `${embeddingSpread}%` }}/></i><button onClick={trainRepresentation}>TRAIN ENCODER STEP</button><p>{embeddingSpread < 80 ? "Raw positions gradually reorganize into useful similarity neighborhoods." : "Related examples are now closer in this toy projection. Real learned representations may have hundreds/thousands of dimensions."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["learn-representation"])}>Run at least five representation-learning steps.</TaskStamp>
    </LessonSection>

    <LessonSection id="negative-transfer" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="DIAGNOSE · DON'T WORSHIP PRETRAINING" title="Transfer learning can transfer the wrong assumptions too.">Classify six source→target transfers as promising or risky/negative. “Pretrained” is evidence to test, not a guarantee.</Heading>
      <div className={styles.transferCases}>{transferCases.map(item => { const choice=transferChoices[item.id]; return <article className={choice ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><p>{item.text}</p><small>{choice ? item.why : "Would source knowledge plausibly help this target?"}</small><div><button className={choice === "good" ? styles.active : ""} onClick={() => setTransferChoices(current => ({ ...current, [item.id]: "good" }))}>PROMISING TRANSFER</button><button className={choice === "bad" ? styles.active : ""} onClick={() => setTransferChoices(current => ({ ...current, [item.id]: "bad" }))}>RISKY / NEGATIVE</button></div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["diagnose-transfer"])}>Diagnose all six transfer scenarios.</TaskStamp>
    </LessonSection>

    <LessonSection id="scenario-router" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="ROUTE · CHOOSE THE LEARNING PATTERN" title="Batch, online, transfer, or representation learning?">These ideas can combine in one real system, but each scenario below emphasizes one primary concept.</Heading>
      <div className={styles.scenarioGrid}>{scenarios.map(item => { const choice=scenarioChoices[item.id]; return <article className={choice ? (choice===item.answer?styles.goodDark:styles.badDark):""} key={item.id}><p>{item.text}</p><div>{(["batch","online","transfer","representation"] as Strategy[]).map(strategy => <button className={choice===strategy?styles.active:""} onClick={() => setScenarioChoices(current => ({...current,[item.id]:strategy}))} key={strategy}>{strategy === "representation" ? "REP" : strategy.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["route-learning-strategy"])}>Route all eight scenarios correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-across-time" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain how one model can learn before, during and after a new task arrives.">Cover online updates, drift, transfer/fine-tuning and learned representations.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🔄</span><p>“Why not always just train a brand-new model from zero whenever anything changes?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="Batch learning... Online learning... Concept drift... Transfer learning reuses... Representation learning..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className={progress.completedTasks["explain-across-time"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-across-time"])}>Explain online, transfer and representation learning in your own words.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div>SECTIONS<strong>{sectionsRead}/9</strong></div><div>TASKS<strong>{tasksDone}/9</strong></div><div className={quizUnlocked?styles.open:""}>QUIZ<strong>{quizUnlocked?"OPEN":"LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><h2>When should learning happen — and what can be reused?</h2><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Adapt over time. Transfer across tasks. Learn representations.</h2></div><Link href="/lessons/splits-checkpoints">← LESSON 13</Link><div><small>NEXT</small><b>Module 1 Capstone</b><span>build queue</span></div></section>
  </main>;
}
