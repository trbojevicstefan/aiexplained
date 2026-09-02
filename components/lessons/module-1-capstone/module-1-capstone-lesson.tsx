"use client";

import Link from "next/link";
import { motion, Reorder } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./module-1-capstone.module.css";

type Props = { progress: LessonProgressApi };
type Approach = "rules" | "supervised" | "unsupervised" | "self" | "rl" | "transfer";
type Adapt = "batch" | "online" | "transfer" | "representation";
type VocabRole = "data" | "procedure" | "learned" | "control" | "input" | "target" | "evaluation" | "state" | "feedback";

const sections = [
  { id: "briefing", taskId: "accept-mission" },
  { id: "approach-router", taskId: "route-approaches" },
  { id: "lifecycle-builder", taskId: "build-lifecycle" },
  { id: "experiment-debugger", taskId: "repair-experiment" },
  { id: "model-clinic", taskId: "repair-model" },
  { id: "adaptation-room", taskId: "plan-adaptation" },
  { id: "vocabulary-grid", taskId: "master-vocabulary" },
  { id: "teach-the-system", taskId: "teach-foundations" },
] as const;

const approachScenarios = [
  { id: "a1", text: "Finance policy: VAT = 20% for this category, with explicit legal exceptions. Every rule must be auditable.", answer: "rules" as Approach },
  { id: "a2", text: "Predict churn from historical customers where churned/not-churned outcomes are known.", answer: "supervised" as Approach },
  { id: "a3", text: "Discover natural customer segments when no segment labels exist.", answer: "unsupervised" as Approach },
  { id: "a4", text: "Pretrain on raw text by predicting hidden/next pieces derived automatically from the text itself.", answer: "self" as Approach },
  { id: "a5", text: "Warehouse robot chooses sequential moves and receives +reward for fast safe delivery and penalties for collisions.", answer: "rl" as Approach },
  { id: "a6", text: "Build a flower classifier from only 2,000 labeled images, starting from a strong pretrained vision model.", answer: "transfer" as Approach },
] as const;

const lifecycleCorrect = [
  "Raw observations",
  "Dataset + split policy",
  "Features / labels",
  "Training procedure + hyperparameters",
  "Learned model parameters",
  "Validation / model selection",
  "Best checkpoint",
  "Sealed final test",
  "Inference on new input",
  "Monitor / adapt",
];

const adaptationCases = [
  { id: "d1", text: "Rebuild a demand model nightly from a fixed daily snapshot.", answer: "batch" as Adapt },
  { id: "d2", text: "Click model updates incrementally from verified feedback because behavior changes during the day.", answer: "online" as Adapt },
  { id: "d3", text: "A new legal-text classifier has little labeled data but a broad pretrained language model is available.", answer: "transfer" as Adapt },
  { id: "d4", text: "Learn embeddings so related products become neighbors without hand-writing every semantic feature.", answer: "representation" as Adapt },
  { id: "d5", text: "Model quality falls after a market regime shift; fresh trustworthy labels arrive continuously.", answer: "online" as Adapt },
  { id: "d6", text: "Start internal code assistant from an existing pretrained code model and adapt it to company patterns.", answer: "transfer" as Adapt },
] as const;

const vocabCards = [
  { id: "v1", text: "training rows / examples", answer: "data" as VocabRole },
  { id: "v2", text: "gradient descent / tree fitting procedure", answer: "procedure" as VocabRole },
  { id: "v3", text: "weight w₁ = 0.73", answer: "learned" as VocabRole },
  { id: "v4", text: "learning rate = 0.01", answer: "control" as VocabRole },
  { id: "v5", text: "usage_days_7d", answer: "input" as VocabRole },
  { id: "v6", text: "churned_next_30d", answer: "target" as VocabRole },
  { id: "v7", text: "validation split", answer: "evaluation" as VocabRole },
  { id: "v8", text: "sealed test split", answer: "evaluation" as VocabRole },
  { id: "v9", text: "epoch-14 model.ckpt", answer: "state" as VocabRole },
  { id: "v10", text: "RL reward +10", answer: "feedback" as VocabRole },
  { id: "v11", text: "embedding tensor learned during training", answer: "learned" as VocabRole },
  { id: "v12", text: "batch size = 64", answer: "control" as VocabRole },
] as const;

const exam = [
  { q: "A model gets 100% training accuracy but 71% on truly new data. First diagnosis?", o: ["Possible overfitting / poor generalization", "Guaranteed perfect model", "Unsupervised learning", "Checkpoint corruption"], c: 0 },
  { q: "Which item changes because of ordinary gradient training?", o: ["Learned weights", "Chosen batch size itself", "Test split percentage", "API endpoint"], c: 0 },
  { q: "Which split should drive hyperparameter selection?", o: ["Validation", "Final test", "Only training score", "Production users"], c: 0 },
  { q: "A cancellation_reason field exists only after churn. Using it to predict churn is...", o: ["Target leakage", "Transfer learning", "Regularization", "Exploration"], c: 0 },
  { q: "Predict hidden/next tokens from raw text during pretraining is commonly framed as...", o: ["Self-supervised learning", "Unsupervised clustering only", "Rule engine", "Test-time evaluation"], c: 0 },
  { q: "What is inference?", o: ["Using a trained model to produce output for new input", "Changing weights with optimizer steps", "Choosing train/test rows", "Saving every checkpoint"], c: 0 },
  { q: "What is a model checkpoint?", o: ["Saved model/training state at a point in time", "A test data partition", "A label", "A hyperparameter"], c: 0 },
  { q: "When is transfer learning attractive?", o: ["When useful source representations align with a new target task/domain", "Only when no pretrained model exists", "Only for reinforcement learning", "Whenever test accuracy is low regardless of domain"], c: 0 },
  { q: "High statistical variance means...", o: ["The learned function is sensitive to which training sample it receives", "The model is socially biased", "No labels exist", "Temperature is high"], c: 0 },
  { q: "An RL policy learns from...", o: ["Sequential interaction, actions and reward/return", "Only fixed class labels", "Only vector databases", "No objective"], c: 0 },
  { q: "Why keep a final test set sealed?", o: ["So final evaluation does not influence model-selection decisions", "To reduce parameter count", "Because it cannot contain labels", "To make online learning possible"], c: 0 },
  { q: "Best foundation mental model?", o: ["AI system behavior emerges from data, representations, learning procedure, learned model, evaluation and runtime use — not one magical box", "AI is just a database", "Every AI is deep learning", "Every model is an agent"], c: 0 },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function Boss({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.boss} animate={{ y: active ? [0, -10, 0] : [0, -5, 0], rotate: active ? [0, -2, 2, 0] : [0, 1, 0] }} transition={{ duration: active ? 1.3 : 3, repeat: Infinity }}><div><i/><i/><strong>AI</strong><span>?</span></div><b>THE SYSTEM</b></motion.div>;
}

function MasteryExam({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = exam.reduce((sum, q, index) => sum + (answers[index] === q.c ? 1 : 0), 0);
  const passed = score >= 10;
  if (!unlocked) return <div className={styles.lock}>👑🔒<h3>Boss exam locked.</h3><p>Complete every capstone mission first.</p></div>;
  return <div className={styles.exam}>{exam.map((q, index) => <section key={q.q}><h3><span>{index + 1}</span>{q.q}</h3><div>{q.o.map((option, optionIndex) => <button disabled={submitted} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === q.c ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== q.c ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}>{option}</button>)}</div></section>)}{!submitted ? <button disabled={Object.keys(answers).length !== exam.length} onClick={() => { setSubmitted(true); progress.saveQuiz(score, passed); }}>DEFEAT MODULE 1 BOSS →</button> : <motion.div initial={{ scale: .85 }} animate={{ scale: 1 }} className={`${styles.examResult} ${passed ? styles.pass : styles.fail}`}><strong>{score}/12</strong><h3>{passed ? "MODULE 1 MASTERED" : "BOSS STILL STANDING"}</h3><p>{passed ? "You can reason across the full foundation stack instead of reciting isolated definitions." : "Pass is 10/12. Re-enter the missions and retry."}</p>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>RETRY BOSS</button>}</motion.div>}</div>;
}

export function ModuleOneCapstoneLesson({ progress }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [approachChoices, setApproachChoices] = useState<Record<string, Approach>>({});
  const [lifecycle, setLifecycle] = useState(["Raw observations", "Features / labels", "Dataset + split policy", "Training procedure + hyperparameters", "Learned model parameters", "Sealed final test", "Validation / model selection", "Best checkpoint", "Inference on new input", "Monitor / adapt"]);
  const [leak, setLeak] = useState(true);
  const [duplicates, setDuplicates] = useState(true);
  const [testPeeking, setTestPeeking] = useState(true);
  const [experimentChecked, setExperimentChecked] = useState(false);
  const [clinicState, setClinicState] = useState<"underfit" | "overfit" | "stable">("underfit");
  const [clinicSeen, setClinicSeen] = useState<string[]>([]);
  const [adaptChoices, setAdaptChoices] = useState<Record<string, Adapt>>({});
  const [vocabChoices, setVocabChoices] = useState<Record<string, VocabRole>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const approachCorrect = approachScenarios.every(item => approachChoices[item.id] === item.answer);
  const lifecycleCorrectNow = lifecycle.join("|") === lifecycleCorrect.join("|");
  const experimentClean = !leak && !duplicates && !testPeeking && experimentChecked;
  const adaptCorrect = adaptationCases.every(item => adaptChoices[item.id] === item.answer);
  const vocabCorrect = vocabCards.every(item => vocabChoices[item.id] === item.answer);

  useEffect(() => { if (accepted) progress.completeTask("accept-mission"); }, [accepted, progress]);
  useEffect(() => { if (approachCorrect) progress.completeTask("route-approaches"); }, [approachCorrect, progress]);
  useEffect(() => { if (lifecycleCorrectNow) progress.completeTask("build-lifecycle"); }, [lifecycleCorrectNow, progress]);
  useEffect(() => { if (experimentClean) progress.completeTask("repair-experiment"); }, [experimentClean, progress]);
  useEffect(() => { if (["underfit", "overfit", "stable"].every(state => clinicSeen.includes(state)) && clinicState === "stable") progress.completeTask("repair-model"); }, [clinicSeen, clinicState, progress]);
  useEffect(() => { if (adaptCorrect) progress.completeTask("plan-adaptation"); }, [adaptCorrect, progress]);
  useEffect(() => { if (vocabCorrect) progress.completeTask("master-vocabulary"); }, [vocabCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const examUnlocked = tasksDone === 8 && sectionsRead === 8;

  const setClinic = (state: "underfit" | "overfit" | "stable") => { setClinicState(state); setClinicSeen(current => current.includes(state) ? current : [...current, state]); };
  const clinicMetrics = clinicState === "underfit" ? { train: 62, newData: 60, complexity: 1, reg: 80 } : clinicState === "overfit" ? { train: 99, newData: 68, complexity: 10, reg: 0 } : { train: 91, newData: 88, complexity: 5, reg: 45 };
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["data", "feature", "label", "train", "algorithm", "hyperparameter", "parameter", "validation", "test", "checkpoint", "inference", "general", "reward", "transfer"].filter(term => text.includes(term));
    if (explanation.trim().length < 170) { setFeedback("Boss answer needs a full lifecycle: data → representation/features → training → model → evaluation → inference, plus one learning/adaptation example."); return; }
    if (hits.length < 10) { setFeedback("Use precise layer names: data, features/labels, training procedure, hyperparameters, learned parameters/model, validation/test, checkpoint, inference, generalization and adaptation/reward/transfer."); return; }
    setFeedback("Boss-level explanation. You decomposed AI into mechanisms instead of one black box.");
    progress.completeTask("teach-foundations");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · BOSS LEVEL</span><h1>BUILD IT.<br/>BREAK IT.<br/><em>EXPLAIN IT.</em></h1><p>No isolated vocabulary now. You inherit a broken AI project and must prove you understand the whole foundation stack.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroBoss}><Boss active/><div className={styles.orbit}>{["DATA","MODEL","TRAIN","TEST","REWARD","TRANSFER"].map((item,index)=><motion.i animate={{ rotate: 360 }} transition={{ duration: 8 + index, repeat: Infinity, ease: "linear" }} key={item}>{item}</motion.i>)}</div></div></section>

    <LessonSection id="briefing" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="MISSION BRIEFING" title="Your team shipped an AI system nobody can properly explain.">Training scores look amazing. Test methodology is suspicious. Engineers call every setting a “parameter.” Product wants online learning tomorrow. Your job: rebuild the mental model before rebuilding the product.</Heading>
      <div className={styles.briefing}><Boss active={accepted}/><div><h3>FOUNDATION INCIDENT #001</h3><ul><li>Choose the correct learning approach for each problem.</li><li>Rebuild the data → training → model → evaluation lifecycle.</li><li>Remove leakage and evaluation contamination.</li><li>Diagnose underfitting and overfitting.</li><li>Plan adaptation across time/tasks.</li><li>Name every layer precisely.</li></ul><button onClick={() => setAccepted(true)}>{accepted ? "MISSION ACCEPTED ✓" : "ACCEPT MISSION"}</button></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["accept-mission"])}>Accept the Module 1 boss mission.</TaskStamp>
    </LessonSection>

    <LessonSection id="approach-router" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="ROUTE · SIX PROBLEMS" title="Pick the learning setup from the problem — not from hype.">Rules, supervised, unsupervised, self-supervised, reinforcement learning and transfer learning each solve different kinds of problems.</Heading>
      <div className={styles.routeGrid}>{approachScenarios.map(item => { const choice = approachChoices[item.id]; return <article className={choice ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><p>{item.text}</p><div>{(["rules","supervised","unsupervised","self","rl","transfer"] as Approach[]).map(value => <button className={choice === value ? styles.active : ""} onClick={() => setApproachChoices(current => ({ ...current, [item.id]: value }))} key={value}>{value === "supervised" ? "SUP" : value === "unsupervised" ? "UNSUP" : value === "self" ? "SELF" : value.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["route-approaches"])}>Route all six problems correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="lifecycle-builder" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="DRAG · REBUILD" title="Put the AI lifecycle back in causal order.">This is intentionally simplified, but every card belongs to a different conceptual layer. Drag until the dependency chain makes sense.</Heading>
      <div className={styles.lifecycleLab}><Reorder.Group axis="y" values={lifecycle} onReorder={setLifecycle}>{lifecycle.map((item,index)=><Reorder.Item whileDrag={{ scale: 1.03, rotate: .5 }} className={lifecycleCorrectNow ? styles.lifecycleGood : ""} value={item} key={item}><span>{index+1}</span><strong>{item}</strong><small>drag</small></Reorder.Item>)}</Reorder.Group><div className={styles.lifecycleMachine}><Boss active={lifecycleCorrectNow}/>{lifecycleCorrectNow?<><h3>SYSTEM RECONSTRUCTED</h3><p>Data is organized and represented, a procedure fits learned parameters, validation selects, a checkpoint is saved, final test stays independent, then inference serves new inputs and monitoring may trigger adaptation.</p></>:<><h3>Dependencies are crossed.</h3><p>Hint: you cannot validate a learned model before training creates one, and the final test should come after model selection.</p></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["build-lifecycle"])}>Order the full foundation lifecycle.</TaskStamp>
    </LessonSection>

    <LessonSection id="experiment-debugger" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="DEBUG · REMOVE THREE CHEATS" title="The model is not 98% good. The experiment is 98% suspicious.">Repair target leakage, duplicate leakage and repeated test peeking. Then run the audit.</Heading>
      <div className={styles.debugLab}><div className={styles.incidents}><button className={leak ? styles.incidentOn : styles.incidentOff} onClick={() => setLeak(value => !value)}><span>TARGET LEAKAGE</span><code>cancellation_reason</code><b>{leak ? "IN INPUTS ☠" : "REMOVED ✓"}</b></button><button className={duplicates ? styles.incidentOn : styles.incidentOff} onClick={() => setDuplicates(value => !value)}><span>CROSS-SPLIT DUPLICATE</span><code>hash A81C in train + test</code><b>{duplicates ? "LEAKING ☠" : "GROUPED ✓"}</b></button><button className={testPeeking ? styles.incidentOn : styles.incidentOff} onClick={() => setTestPeeking(value => !value)}><span>TEST PEEKING</span><code>26 tuning decisions from test</code><b>{testPeeking ? "CONTAMINATED ☠" : "RE-SEALED ✓"}</b></button></div><div className={styles.auditConsole}><span>REPORTED SCORE</span><strong>{leak || duplicates || testPeeking ? "98.4%" : "86.9%"}</strong><button onClick={() => setExperimentChecked(true)}>RUN EXPERIMENT AUDIT</button>{experimentChecked && <p className={experimentClean ? styles.auditGood : styles.auditBad}>{experimentClean ? "Lower, cleaner, believable. Evaluation now measures unseen behavior more honestly." : `Still compromised: ${[leak&&"target leak",duplicates&&"duplicates",testPeeking&&"test peeking"].filter(Boolean).join(", ")}.`}</p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["repair-experiment"])}>Remove all three evaluation cheats and audit the clean experiment.</TaskStamp>
    </LessonSection>

    <LessonSection id="model-clinic" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="BREAK · COMPARE · STABILIZE" title="Visit underfit, overfit and generalizing regimes.">Use presets so you can compare the train/new-data pattern directly instead of assuming “more complex is better.”</Heading>
      <div className={styles.clinic}><div className={styles.clinicGraph}><svg viewBox="0 0 100 70"><path d={clinicState === "underfit" ? "M3 55 L98 24" : clinicState === "overfit" ? "M3 58 C10 2 17 69 25 12 S37 67 48 9 S60 65 72 13 S85 66 98 10" : "M3 58 C20 44 30 49 42 29 S66 14 81 29 S92 43 98 15"} fill="none" stroke="currentColor" strokeWidth="3"/>{[9,20,31,43,55,68,82,94].map((x,i)=><circle key={x} cx={x} cy={54-(i%4)*10+(i%2)*5} r="2.5"/>)}</svg><Boss active={clinicState === "stable"}/></div><div className={styles.clinicControls}><button className={clinicState === "underfit" ? styles.active : ""} onClick={() => setClinic("underfit")}>TOO SIMPLE</button><button className={clinicState === "overfit" ? styles.active : ""} onClick={() => setClinic("overfit")}>MEMORIZE NOISE</button><button className={clinicState === "stable" ? styles.active : ""} onClick={() => setClinic("stable")}>STABILIZE</button><dl><div><dt>complexity</dt><dd>{clinicMetrics.complexity}/10</dd></div><div><dt>regularization</dt><dd>{clinicMetrics.reg}</dd></div><div><dt>train score</dt><dd>{clinicMetrics.train}%</dd></div><div><dt>new-data score</dt><dd>{clinicMetrics.newData}%</dd></div></dl><p>{clinicState === "underfit" ? "High-ish error everywhere: insufficient flexibility / high systematic error." : clinicState === "overfit" ? "Near-perfect training, much worse new data: memorization/variance problem." : "Small train/new-data gap with strong scores: healthier toy generalization."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["repair-model"])}>Inspect underfit, overfit and stable regimes, ending stable.</TaskStamp>
    </LessonSection>

    <LessonSection id="adaptation-room" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="PLAN · SIX FUTURES" title="Decide how the system should learn after launch or on a new task.">Batch rebuild, online update, transfer learning and representation learning can coexist, but identify the primary mechanism each situation calls for.</Heading>
      <div className={styles.adaptGrid}>{adaptationCases.map(item => { const choice = adaptChoices[item.id]; return <article className={choice ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><p>{item.text}</p><div>{(["batch","online","transfer","representation"] as Adapt[]).map(value => <button className={choice === value ? styles.active : ""} onClick={() => setAdaptChoices(current => ({ ...current, [item.id]: value }))} key={value}>{value === "representation" ? "REP" : value.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["plan-adaptation"])}>Choose all six adaptation strategies.</TaskStamp>
    </LessonSection>

    <LessonSection id="vocabulary-grid" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="PRECISION ROUND" title="Stop calling everything “the model.”">Classify twelve concrete artifacts by conceptual role.</Heading>
      <div className={styles.vocabLegend}>{(["data","procedure","learned","control","input","target","evaluation","state","feedback"] as VocabRole[]).map(role => <span key={role}>{role.toUpperCase()}</span>)}</div><div className={styles.vocabGrid}>{vocabCards.map(item => { const choice = vocabChoices[item.id]; return <article className={choice ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><code>{item.text}</code><div>{(["data","procedure","learned","control","input","target","evaluation","state","feedback"] as VocabRole[]).map(role => <button className={choice === role ? styles.active : ""} onClick={() => setVocabChoices(current => ({ ...current, [item.id]: role }))} key={role}>{role.slice(0,4).toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["master-vocabulary"])}>Classify all twelve artifacts correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="teach-the-system" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="FINAL EXPLAIN-BACK" title="Explain a modern ML system without using “AI magic.”">Give a compact lifecycle from raw data to inference and evaluation, then mention one alternative learning signal or adaptation mechanism.</Heading>
      <div className={styles.explain}><div><Boss active={Boolean(progress.completedTasks["teach-foundations"])}/><p>“Explain what actually happens between raw examples and a trustworthy prediction.”</p></div><section><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="Start with data and features/labels. Then training procedure + hyperparameters... learned parameters/model... validation/test... checkpoint... inference... generalization... adaptation/RL/transfer..."/><footer><span>{explanation.length} chars</span><button onClick={submitExplain}>CHECK BOSS EXPLANATION</button></footer>{feedback && <p className={progress.completedTasks["teach-foundations"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</p>}</section></div>
      <TaskStamp done={Boolean(progress.completedTasks["teach-foundations"])}>Explain the complete foundation system in your own words.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div>MISSIONS<strong>{tasksDone}/8</strong></div><div>ROOMS VISITED<strong>{sectionsRead}/8</strong></div><div className={examUnlocked ? styles.open : ""}>BOSS EXAM<strong>{examUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.examSection}><span>MODULE 1 MASTERY EXAM</span><h2>12 questions. Pass 10.</h2><MasteryExam progress={progress} unlocked={examUnlocked}/></section>
    <section className={styles.footer}><div><small>MODULE 1 COMPLETE WHEN PASSED</small><h2>You can now reason about the foundation layer.</h2><p>Next module leaves the conceptual map and goes inside neural networks.</p></div><Link href="/lessons/learning-across-time-tasks">← LESSON 14</Link><div><small>NEXT MODULE</small><b>Neural Networks</b><span>coming next</span></div></section>
  </main>;
}
