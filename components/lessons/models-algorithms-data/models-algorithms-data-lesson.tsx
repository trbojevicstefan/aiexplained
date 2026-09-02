"use client";

import Link from "next/link";
import { motion, Reorder } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { modelAlgorithmDataSections } from "@/content/course";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./models-algorithms-data.module.css";

type Props = { progress: LessonProgressApi };
type Kind = "data" | "algorithm" | "model";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

const heroCopy: DepthCopy = {
  simple: <>A <strong>dataset</strong> is the examples. An <strong>algorithm</strong> is the procedure. A <strong>model</strong> is the fitted thing you end up using.</>,
  real: <>Training data provides observations; a fitting/training algorithm processes them to learn parameters or structure; the resulting model maps future inputs to outputs.</>,
  expert: <>Keep the ontology clean: data is evidence, an algorithm is a computational procedure, and a model is a parameterized or structured artifact/function instantiated or fitted by that procedure. Their boundaries matter for debugging, reproducibility and evaluation.</>,
};

const artifactFiles = [
  { id: "csv", name: "customers.csv", preview: "age, usage, churned\n31, 82, false\n57, 14, true", answer: "data" as Kind },
  { id: "py", name: "train_tree.py", preview: "fit(X, y)\nchoose_split()\nminimize_error()", answer: "algorithm" as Kind },
  { id: "json", name: "model-v3.json", preview: "{ threshold: 0.61,\n  nodes: 47, version: v3 }", answer: "model" as Kind },
  { id: "images", name: "cats/train/", preview: "cat_001.png\ncat_002.png\ncat_003.png", answer: "data" as Kind },
  { id: "optimizer", name: "fit_linear.ts", preview: "repeat: predict → loss\n→ update slope/intercept", answer: "algorithm" as Kind },
  { id: "weights", name: "weights.bin", preview: "0.038 -1.22 0.77 ...\n(saved learned parameters)", answer: "model" as Kind },
];

const diagnoses = [
  { id: "labels", text: "Hundreds of CAT images were accidentally labeled DOG.", answer: "data" as Kind },
  { id: "swap", text: "Team replaces a decision-tree fitting method with logistic regression.", answer: "algorithm" as Kind },
  { id: "version", text: "Production accidentally serves model-v1 instead of approved model-v4.", answer: "model" as Kind },
  { id: "coverage", text: "Training examples contain almost no mobile users.", answer: "data" as Kind },
  { id: "procedure", text: "The fitting procedure stops after one update instead of 1,000.", answer: "algorithm" as Kind },
  { id: "artifact", text: "The saved model checkpoint is corrupted after upload.", answer: "model" as Kind },
];

const pipelineCorrect = ["Dataset", "Training algorithm", "Learned model", "New input", "Prediction"];

const quizQuestions = [
  { q: "What is a dataset?", options: ["The final learned predictor", "A collection of observations/examples used for analysis or learning", "The training procedure", "Always a spreadsheet"], correct: 1, why: "A dataset is the evidence/observations. It can be tables, images, audio, text, events and many other forms." },
  { q: "What is an algorithm here?", options: ["A saved checkpoint", "A procedure or method for processing data / fitting a model", "The labels only", "The product UI"], correct: 1, why: "An algorithm is a procedure. A training algorithm specifies how the system processes evidence and fits parameters/structure." },
  { q: "What is a model?", options: ["Always the algorithm source code", "A fitted artifact/function whose behavior depends on learned parameters or structure", "The raw dataset", "Any CSV"], correct: 1, why: "The model is the fitted/learned result later used to map new inputs to outputs." },
  { q: "Can the same training algorithm produce different models?", options: ["No", "Yes — different data/settings/randomness can produce different fitted models", "Only with images", "Only after deployment"], correct: 1, why: "The procedure can stay fixed while the evidence it sees changes, leading to different learned parameters or structure." },
  { q: "Can one dataset be used with different algorithms?", options: ["No", "Yes — trees, linear models, nearest neighbors or neural methods can fit the same data differently", "Only once", "Only without labels"], correct: 1, why: "Data does not imply one fitting procedure. Different algorithms impose different assumptions and produce different models." },
  { q: "Which is most likely a model artifact?", options: ["train.py", "customers.csv", "weights.bin saved from a finished training run", "README.md"], correct: 2, why: "Saved learned weights/checkpoints are model artifacts; source code is procedure and rows/images are data." },
  { q: "Best relationship?", options: ["Data = algorithm = model", "A training algorithm uses data to fit a model; the model is then used on new inputs", "Model creates all historical data", "Algorithm is only a marketing name"], correct: 1, why: "Keep the roles separate: evidence → procedure → learned artifact → use on new input." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function Dot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.dot} animate={{ y: active ? [0, -9, 0] : [0, -5, 0], rotate: [-1, 1, -1] }} transition={{ duration: active ? 1.5 : 3, repeat: Infinity }}><div><i/><i/><span>•••</span></div><b>DOT · DATA</b></motion.div>;
}
function Loop({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.loop} animate={{ rotate: active ? [0, -3, 3, 0] : [0, 1, -1, 0] }} transition={{ duration: active ? 1.25 : 2.8, repeat: Infinity }}><div><i/><i/><span>↻</span></div><b>LOOP · ALGORITHM</b></motion.div>;
}
function Mod({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.mod} animate={{ y: active ? [0, -8, 0] : [0, -5, 0], scale: active ? [1, 1.04, 1] : [1, 1.02, 1] }} transition={{ duration: active ? 1.5 : 3.2, repeat: Infinity }}><div><i/><i/><span>M</span></div><b>MOD · MODEL</b></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const answered = Object.keys(answers).length;
  const passed = score >= 6;

  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ rotate: [-3, 3, -3], scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }}>🔒</motion.span><h3>Workshop exam locked.</h3><p>Build, compare, damage and diagnose the complete pipeline first.</p></div>;

  const submit = () => {
    if (answered !== quizQuestions.length) return;
    setSubmitted(true);
    progress.saveQuiz(score, passed);
  };

  return <div className={styles.quiz}>
    {quizQuestions.map((question, index) => <section key={question.q}>
      <h3><span>{index + 1}</span>{question.q}</h3>
      <div>{question.options.map((option, optionIndex) => <motion.button whileTap={{ scale: .97 }} disabled={submitted} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === question.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}>{option}</motion.button>)}</div>
      {submitted && <p>{question.why}</p>}
    </section>)}
    {!submitted ? <button className={`${styles.quizSubmit} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>CHECK WORKSHOP →</button> : <motion.div className={`${styles.quizResult} ${passed ? styles.pass : styles.fail}`} initial={{ scale: .9 }} animate={{ scale: 1 }}><strong>{score}/7</strong><div><h3>{passed ? "Roles separated." : "One more diagnostic pass."}</h3><p>{passed ? "You can now tell evidence, procedure and fitted artifact apart." : "Pass is 6/7. Inspect the mismatched roles and retry."}</p></div>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</motion.div>}
  </div>;
}

export function ModelsAlgorithmsDataLesson({ progress }: Props) {
  const [seen, setSeen] = useState<Kind[]>([]);
  const [pipeline, setPipeline] = useState(["Learned model", "Dataset", "Prediction", "Training algorithm", "New input"]);
  const [datasetRuns, setDatasetRuns] = useState<string[]>([]);
  const [algorithmRuns, setAlgorithmRuns] = useState<string[]>([]);
  const [fileChoices, setFileChoices] = useState<Record<string, Kind>>({});
  const [outlier, setOutlier] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Record<string, Kind>>({});
  const [analogyLimits, setAnalogyLimits] = useState<number[]>([]);
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const pipelineCorrect = pipeline.join("|") === pipelineCorrectValues.join("|");
  const filesCorrect = artifactFiles.every(file => fileChoices[file.id] === file.answer);
  const diagnosisCorrect = diagnoses.every(item => diagnosis[item.id] === item.answer);
  const prediction = outlier && !cleaned ? 318 : 240;

  useEffect(() => { if (seen.length === 3) progress.completeTask("inspect-three-things"); }, [seen.length, progress]);
  useEffect(() => { if (pipelineCorrect) progress.completeTask("assemble-learning-pipeline"); }, [pipelineCorrect, progress]);
  useEffect(() => { if (datasetRuns.includes("city") && datasetRuns.includes("suburb")) progress.completeTask("compare-datasets"); }, [datasetRuns, progress]);
  useEffect(() => { if (algorithmRuns.includes("linear") && algorithmRuns.includes("tree")) progress.completeTask("compare-algorithms"); }, [algorithmRuns, progress]);
  useEffect(() => { if (filesCorrect) progress.completeTask("classify-artifacts"); }, [filesCorrect, progress]);
  useEffect(() => { if (outlier && cleaned) progress.completeTask("damage-dataset"); }, [outlier, cleaned, progress]);
  useEffect(() => { if (diagnosisCorrect) progress.completeTask("diagnose-layer"); }, [diagnosisCorrect, progress]);
  useEffect(() => { if (analogyLimits.length === 3) progress.completeTask("break-analogy"); }, [analogyLimits.length, progress]);

  const requiredTasks = modelAlgorithmDataSections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(id => progress.completedTasks[id]).length;
  const sectionsRead = modelAlgorithmDataSections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const markSeen = (kind: Kind) => setSeen(current => current.includes(kind) ? current : [...current, kind]);
  const addRun = (type: "dataset" | "algorithm", id: string) => type === "dataset" ? setDatasetRuns(current => current.includes(id) ? current : [...current, id]) : setAlgorithmRuns(current => current.includes(id) ? current : [...current, id]);
  const revealLimit = (index: number) => setAnalogyLimits(current => current.includes(index) ? current : [...current, index]);
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["data", "dataset", "example", "algorithm", "procedure", "method", "model", "learn", "fit", "parameter"].filter(term => text.includes(term));
    if (explanation.trim().length < 90) { setFeedback("Use three clear parts: what data is, what the procedure does, and what the resulting model is."); return; }
    if (hits.length < 6) { setFeedback("Add mechanism words: dataset/examples, algorithm/procedure/fitting, learned model/parameters."); return; }
    setFeedback("Good. Evidence, procedure and learned artifact are cleanly separated.");
    progress.completeTask("explain-model-data");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}>
      <div><span className={styles.tag}>MODULE 01 · LESSON 07</span><h1>DATA<br/>+ ALGORITHM<br/>→ <em>MODEL</em></h1><p>{heroCopy[progress.depth]}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div>
      <div className={styles.heroBench}><Dot/><b>+</b><Loop/><b>→</b><Mod/></div>
    </section>

    <LessonSection id="three-things" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · INSPECT" title="Meet the three objects.">Data is evidence. Algorithm is procedure. Model is the fitted result. Click each until those roles feel physically different.</Heading>
      <div className={styles.threeObjects}>{([
        { kind: "data" as Kind, character: <Dot active={seen.includes("data")}/>, title: "DATASET", copy: "Examples or observations: rows, images, audio, text, events, labels, measurements." },
        { kind: "algorithm" as Kind, character: <Loop active={seen.includes("algorithm")}/>, title: "ALGORITHM", copy: "A procedure: how to process information, search, optimize, split, update or fit." },
        { kind: "model" as Kind, character: <Mod active={seen.includes("model")}/>, title: "MODEL", copy: "The learned/fitted artifact or function later used to transform new inputs into outputs." },
      ]).map(item => <motion.button whileHover={{ y: -5 }} key={item.kind} className={seen.includes(item.kind) ? styles.seen : ""} onClick={() => markSeen(item.kind)}>{item.character}<h3>{item.title}</h3><p>{item.copy}</p><small>{seen.includes(item.kind) ? "INSPECTED ✓" : "CLICK TO INSPECT"}</small></motion.button>)}</div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-three-things"])}>Inspect data, algorithm and model.</TaskStamp>
    </LessonSection>

    <LessonSection id="assemble-pipeline" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="DRAG · ASSEMBLE" title="Build learning first — then usage.">The model should not magically exist before training. Assemble both phases in one line.</Heading>
      <div className={styles.pipelineLab}><Reorder.Group axis="y" values={pipeline} onReorder={setPipeline}>{pipeline.map((item, index) => <Reorder.Item whileDrag={{ scale: 1.04, rotate: 1 }} className={pipelineCorrect ? styles.pipelineCorrect : ""} value={item} key={item}><span>{index + 1}</span><strong>{item}</strong><small>drag</small></Reorder.Item>)}</Reorder.Group><div>{pipelineCorrect ? <><strong>✓ TWO PHASES CONNECTED</strong><p>Dataset + training algorithm → learned model. Then new input + model → prediction.</p></> : <><strong>Start with evidence.</strong><p>Ask yourself: what must exist before a model can be fitted, and what only arrives after deployment?</p></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["assemble-learning-pipeline"])}>Order Dataset → Training algorithm → Learned model → New input → Prediction.</TaskStamp>
    </LessonSection>

    <LessonSection id="same-algorithm" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="RUN · COMPARE" title="Same algorithm. Different data. Different models.">The fitting procedure stays the same. The observations change, so the fitted coefficients change.</Heading>
      <div className={styles.twoDatasets}>
        <article><span>CITY HOUSING DATA</span><div className={styles.scatter}>{[44,58,63,71,87].map((value,index)=><i key={index} style={{ left: `${15 + index*16}%`, bottom: `${24 + value/2}%` }}/>)}</div><button onClick={() => addRun("dataset", "city")}>FIT SAME LINEAR ALGORITHM</button>{datasetRuns.includes("city") && <motion.p initial={{ scale: .9 }} animate={{ scale: 1 }}><b>MODEL CITY</b><br/>price ≈ 5.2 × m² + 8<br/><strong>80m² → €424k</strong></motion.p>}</article>
        <Loop active={datasetRuns.length > 0}/>
        <article><span>SUBURB HOUSING DATA</span><div className={styles.scatter}>{[22,31,38,46,56].map((value,index)=><i key={index} style={{ left: `${15 + index*16}%`, bottom: `${18 + value/2}%` }}/>)}</div><button onClick={() => addRun("dataset", "suburb")}>FIT SAME LINEAR ALGORITHM</button>{datasetRuns.includes("suburb") && <motion.p initial={{ scale: .9 }} animate={{ scale: 1 }}><b>MODEL SUBURB</b><br/>price ≈ 2.1 × m² + 22<br/><strong>80m² → €190k</strong></motion.p>}</article>
      </div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-datasets"])}>Fit the same algorithm on both conceptual datasets.</TaskStamp>
    </LessonSection>

    <LessonSection id="same-data" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="RUN · HOLD DATA FIXED" title="Same data. Different algorithms. Different models.">Now the evidence stays fixed while the fitting procedure changes.</Heading>
      <div className={styles.algorithmCompare}><div className={styles.sharedData}><Dot/><strong>SAME CUSTOMER DATA</strong><span>usage · tickets · churn label</span></div><article><b>LINEAR / LOGISTIC FIT</b><button onClick={() => addRun("algorithm", "linear")}>TRAIN</button>{algorithmRuns.includes("linear") && <><div className={styles.linearBoundary}/><p>smooth score: <strong>0.64 risk</strong></p></>}</article><article><b>DECISION TREE FIT</b><button onClick={() => addRun("algorithm", "tree")}>TRAIN</button>{algorithmRuns.includes("tree") && <><div className={styles.treeModel}><span>usage &lt; 40?</span><i>yes → 0.81</i><i>no → 0.29</i></div><p>piecewise score: <strong>0.81 risk</strong></p></>}</article></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-algorithms"])}>Train both procedures on the same conceptual data.</TaskStamp>
    </LessonSection>

    <LessonSection id="inspect-artifacts" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="OPEN · CLASSIFY" title="Open the files and name their role.">File type is not the definition, but contents reveal what the artifact is doing.</Heading>
      <div className={styles.files}>{artifactFiles.map(file => { const choice = fileChoices[file.id]; return <article key={file.id} className={choice ? (choice === file.answer ? styles.good : styles.bad) : ""}><h3>{file.name}</h3><pre>{file.preview}</pre><div>{(["data","algorithm","model"] as Kind[]).map(kind => <button className={choice === kind ? styles.active : ""} onClick={() => setFileChoices(current => ({ ...current, [file.id]: kind }))} key={kind}>{kind.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["classify-artifacts"])}>Classify all six artifacts.</TaskStamp>
    </LessonSection>

    <LessonSection id="data-quality" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="DAMAGE · CLEAN" title="Change the data and the fitted model can move.">Add one absurd outlier to a deliberately tiny toy dataset, observe the fit shift, then repair the row.</Heading>
      <div className={styles.qualityLab}><div className={styles.qualityScatter}>{[0,1,2,3,4].map(index => <i key={index}/>)}{outlier && !cleaned && <motion.b initial={{ scale: 0 }} animate={{ scale: 1 }}>BAD ROW</motion.b>}<motion.span animate={{ rotate: outlier && !cleaned ? -18 : -7 }}/></div><div><Dot active={outlier}/><span>80m² MODEL PREDICTION</span><motion.strong key={prediction} initial={{ scale: .8 }} animate={{ scale: 1 }}>€{prediction}k</motion.strong><button onClick={() => { setOutlier(true); setCleaned(false); }}>⚠ ADD OUTLIER</button><button disabled={!outlier} onClick={() => setCleaned(true)}>🧹 VERIFY / CLEAN ROW</button><p>{!outlier ? "Baseline toy dataset, baseline fit." : !cleaned ? "One bad point pulled this tiny fit hard. Real pipelines need validation, robust methods and monitoring." : "Row repaired. The toy fit returns to the cleaner data pattern."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["damage-dataset"])}>Damage the data, observe the model shift, then clean it.</TaskStamp>
    </LessonSection>

    <LessonSection id="diagnose-layer" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="DIAGNOSE · CLICK" title="Stop saying “the AI changed.”">Name the layer that changed: evidence, procedure, or fitted artifact.</Heading>
      <div className={styles.diagnose}>{diagnoses.map(item => { const choice = diagnosis[item.id]; return <article className={choice ? (choice === item.answer ? styles.good : styles.bad) : ""} key={item.id}><p>{item.text}</p><div>{(["data","algorithm","model"] as Kind[]).map(kind => <button className={choice === kind ? styles.active : ""} onClick={() => setDiagnosis(current => ({ ...current, [item.id]: kind }))} key={kind}>{kind.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["diagnose-layer"])}>Diagnose all six changes correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="analogy-limits" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="ANALOGY · THEN BREAK IT" title="Kitchen analogy: useful, then dangerous.">Ingredients ≈ data. Recipe/procedure ≈ algorithm. Cooked result ≈ model. Now reveal why that mapping is not literally how ML works.</Heading>
      <div className={styles.kitchen}><div><span>🥕🥛🍞</span><b>INGREDIENTS ≈ DATA</b></div><strong>+</strong><div><span>📖</span><b>RECIPE ≈ ALGORITHM</b></div><strong>→</strong><div><span>🍰</span><b>DISH ≈ MODEL</b></div></div>
      <div className={styles.analogyLimits}>{[
        "A trained model is reusable on many new inputs; a cake gets eaten.",
        "Training procedures adapt parameters based on evidence; a normal recipe usually stays fixed.",
        "Real training includes objectives, randomness, optimization, validation and versioning that the kitchen hides.",
      ].map((copy,index) => <button key={copy} className={analogyLimits.includes(index) ? styles.revealed : ""} onClick={() => revealLimit(index)}><span>{analogyLimits.includes(index) ? "LIMIT REVEALED" : "CLICK TO BREAK ANALOGY"}</span><p>{analogyLimits.includes(index) ? copy : "The analogy helps — but something important is missing."}</p></button>)}</div>
      <TaskStamp done={Boolean(progress.completedTasks["break-analogy"])}>Reveal all three analogy limits.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-model-data" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain all three without using them as synonyms.">Teach the pipeline in your own words and say how one can change while the others stay fixed.</Heading>
      <div className={styles.explainLab}><div><span>🧒</span><p>“So the algorithm is the model, and the model is the data?”</p></div><section><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="A dataset is... The training algorithm is... The resulting model is..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p className={progress.completedTasks["explain-model-data"] ? styles.feedbackGood : styles.feedbackHint} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{feedback}</motion.p>}</section></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-model-data"])}>Explain dataset, training algorithm and model as separate roles.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.gateOpen : ""}><span>QUIZ</span><strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 07 QUIZ</span><h2>Which object changed?</h2><p>Pass 6/7. Evidence, procedure and fitted artifact should now be impossible to confuse.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Data is evidence. Algorithm is procedure. Model is the fitted artifact.</h2></div><Link href="/lessons/training-vs-inference">← LESSON 06</Link><div><small>NEXT</small><b>Parameters vs Hyperparameters</b><span>build queue</span></div></section>
  </main>;
}

const pipelineCorrectValues = pipelineCorrect;
