"use client";

import Link from "next/link";
import { AnimatePresence, motion, Reorder, useReducedMotion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { aiVsSoftwareSections } from "@/content/course";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./ai-vs-software.module.css";

type Props = { progress: LessonProgressApi };
type Engine = "rules" | "ml" | "hybrid";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

const traceRules = [
  { id: "heavy", label: "IF weight > 5 kg", result: "add HEAVY sticker", expected: true, color: "#ffdf3f" },
  { id: "fragile", label: "IF fragile = yes", result: "add FRAGILE sticker", expected: true, color: "#ff7a66" },
  { id: "customs", label: "IF destination = overseas", result: "add CUSTOMS form", expected: false, color: "#70c7ff" },
] as const;

const edgeCases = [
  { icon: "🐈", title: "A black cat at night", copy: "Your rule said: look for a bright cat-shaped outline. Now lighting changed." },
  { icon: "🐕", title: "A tiny dog with pointy ears", copy: "Your rule said: pointy ears means cat. The dog just broke it." },
  { icon: "🧸", title: "A cat-shaped toy", copy: "Your rule said: whiskers + ears = cat. The toy matches the checklist." },
  { icon: "🐈‍⬛", title: "A cat hiding its face", copy: "Your rule required whiskers. The real cat does not show them." },
] as const;

const boundaryPoints = [
  { id: "a", x: 16, label: "safe" },
  { id: "b", x: 27, label: "safe" },
  { id: "c", x: 42, label: "safe" },
  { id: "d", x: 57, label: "risky" },
  { id: "e", x: 72, label: "risky" },
  { id: "f", x: 86, label: "risky" },
] as const;

const engineScenarios = [
  { id: "tax", icon: "🧾", title: "Calculate a fixed 20% tax", hint: "The rule is known, exact and easy to test.", answer: "rules" as Engine },
  { id: "photo", icon: "🖼️", title: "Recognize a dog in a photo", hint: "Pixels vary too much for a neat human-written checklist.", answer: "ml" as Engine },
  { id: "fraud", icon: "💳", title: "Block suspicious card payments", hint: "Use hard safety limits plus a learned risk score.", answer: "hybrid" as Engine },
  { id: "password", icon: "🔐", title: "Require passwords to be 12+ characters", hint: "The policy is explicit. Do not ask a model to guess it.", answer: "rules" as Engine },
  { id: "spam", icon: "📨", title: "Spot new kinds of spam", hint: "Language and attacker behavior change constantly.", answer: "ml" as Engine },
  { id: "refund", icon: "📦", title: "Approve a high-value refund", hint: "Policy rules + risk model + human approval is safer.", answer: "hybrid" as Engine },
];

const boringCases = [
  { id: "vat", title: "Add a known VAT rate", icon: "🧮", answer: "rules" },
  { id: "caption", title: "Describe an unfamiliar photo", icon: "🌄", answer: "ai" },
  { id: "limit", title: "Reject transfers over a hard legal limit", icon: "🚧", answer: "rules" },
  { id: "intent", title: "Understand what a messy customer message means", icon: "💬", answer: "ai" },
  { id: "timer", title: "Turn a light off after exactly 30 seconds", icon: "⏱️", answer: "rules" },
] as const;

const quizQuestions = [
  {
    q: "What makes a traditional rule-based program predictable?",
    options: ["It never has bugs", "Its behavior follows explicit instructions for the current input", "It uses more data", "It always uses AI"],
    correct: 1,
    why: "Rule-based software can still have bugs, but the intended decision path comes from explicit logic written by people.",
  },
  {
    q: "Why can machine learning help with photo recognition?",
    options: ["Photos have no rules at all", "A model can learn useful visual patterns from many examples instead of requiring humans to enumerate every pixel case", "ML stores every possible photo", "ML makes the camera better"],
    correct: 1,
    why: "The important difference is where the decision behavior comes from: learned parameters can capture patterns that are painful to hand-code.",
  },
  {
    q: "Which task should usually stay boring, deterministic software?",
    options: ["Generate a product description", "Detect sentiment in free text", "Apply an exact 7% discount when a coupon is valid", "Recognize objects in photos"],
    correct: 2,
    why: "If the rule is explicit, stable and easy to test, ordinary code is often cheaper, safer and easier to audit.",
  },
  {
    q: "Does 'AI vs software' mean AI applications contain no normal software?",
    options: ["Yes", "No — AI products are software systems that may include models alongside ordinary code, databases, UI and rules", "Only on mobile", "Only if they use agents"],
    correct: 1,
    why: "AI is not outside software. A model is typically one component inside a larger software system.",
  },
  {
    q: "What is a strong reason to build a hybrid rules + ML system?",
    options: ["It always costs less", "Hard constraints can stay deterministic while fuzzy judgments use learned models", "It removes the need for testing", "It guarantees 100% accuracy"],
    correct: 1,
    why: "Hybrid systems let each mechanism do what it is good at: exact rules for non-negotiable constraints and models for fuzzy pattern recognition.",
  },
  {
    q: "Why is debugging a learned model different from tracing a rule engine?",
    options: ["Models have no code", "A model decision emerges from many learned parameters rather than one short human-readable IF/THEN path", "Rules cannot be logged", "Models always hide their output"],
    correct: 1,
    why: "You can inspect inputs, outputs, features and traces around a model, but its learned decision boundary is not usually a simple list of authored rules.",
  },
  {
    q: "Best mental model?",
    options: ["Normal software = dumb, AI = smart", "Rules and learned models are different mechanisms; good products choose the simplest reliable mechanism for each part", "Everything should eventually use AI", "AI is a replacement for programming"],
    correct: 1,
    why: "The expert choice is not 'AI everywhere'. It is choosing the mechanism that best matches uncertainty, risk, cost, explainability and change rate.",
  },
] as const;

const depthIntro: DepthCopy = {
  simple: <>Normal software follows a recipe you wrote. Machine learning can <strong>learn part of the recipe from examples</strong>.</>,
  real: <>Traditional software encodes behavior mostly through authored logic. ML systems encode part of their behavior in <strong>parameters learned from data</strong>.</>,
  expert: <>The distinction is not “code versus no code.” Both are software. The useful distinction is <strong>explicit symbolic control flow versus behavior partially represented by fitted parameters</strong>, often combined in one production system.</>,
};

function getDepth(copy: DepthCopy, depth: ExplanationDepth) {
  return copy[depth];
}

function Ruley({ excited = false }: { excited?: boolean }) {
  return (
    <motion.div className={styles.ruley} animate={{ y: [0, -6, 0], rotate: excited ? [0, -2, 2, 0] : [0, 1, 0] }} transition={{ duration: excited ? 1.2 : 3.2, repeat: Infinity }}>
      <div className={styles.ruleyPaper}>
        <span>IF</span><i />
        <span>THEN</span><i />
        <span>ELSE</span><i />
      </div>
      <b>RULEY</b>
    </motion.div>
  );
}

function Pix({ thinking = false }: { thinking?: boolean }) {
  return (
    <motion.div className={styles.pix} animate={{ y: [0, -9, 0], scale: thinking ? [1, 1.03, .99, 1] : [1, 1.02, 1] }} transition={{ duration: 2.8, repeat: Infinity }}>
      <div className={styles.pixCloud}>
        {Array.from({ length: 9 }).map((_, i) => <i key={i} />)}
        <span className={styles.pixEyeLeft} />
        <span className={styles.pixEyeRight} />
        <strong>~</strong>
      </div>
      <b>PIX</b>
    </motion.div>
  );
}

function SectionHeading({ number, kicker, title, copy }: { number: string; kicker: string; title: string; copy: ReactNode }) {
  return (
    <div className={styles.sectionHeading}>
      <div className={styles.sectionNumber}>{number}</div>
      <div>
        <span className="eyebrow">{kicker}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </div>
  );
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;

  const submit = () => {
    if (!unlocked || answered !== quizQuestions.length) return;
    setSubmitted(true);
    progress.saveQuiz(score, passed);
  };

  if (!unlocked) {
    return (
      <div className={styles.quizLocked}>
        <motion.div animate={{ rotate: [-2, 2, -2], y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>🔒</motion.div>
        <h3>Quiz sealed.</h3>
        <p>Visit every scene and complete every experiment first. The lock is part of the lesson.</p>
      </div>
    );
  }

  return (
    <div className={styles.quizBox}>
      <div className={styles.quizTopline}>
        <span>FINAL CHECK</span>
        <b>{answered}/{quizQuestions.length} answered</b>
      </div>
      {quizQuestions.map((question, index) => (
        <div className={styles.quizQuestion} key={question.q}>
          <h3><span>{index + 1}</span>{question.q}</h3>
          <div className={styles.quizOptions}>
            {question.options.map((option, optionIndex) => {
              const selected = answers[index] === optionIndex;
              const correct = submitted && optionIndex === question.correct;
              const wrong = submitted && selected && optionIndex !== question.correct;
              return (
                <motion.button
                  key={option}
                  whileTap={{ scale: .97 }}
                  className={`${selected ? styles.selected : ""} ${correct ? styles.correct : ""} ${wrong ? styles.wrong : ""}`}
                  onClick={() => !submitted && setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                >
                  <i>{String.fromCharCode(65 + optionIndex)}</i>{option}
                </motion.button>
              );
            })}
          </div>
          {submitted && <motion.p className={styles.quizWhy} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{question.why}</motion.p>}
        </div>
      ))}

      {!submitted ? (
        <button className={`${styles.bigButton} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>CHECK MY MODEL →</button>
      ) : (
        <motion.div className={`${styles.quizResult} ${passed ? styles.pass : styles.retry}`} initial={{ scale: .92, rotate: -1 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}>
          <strong>{score}/{quizQuestions.length}</strong>
          <div>
            <h3>{passed ? "You can tell rules from learning." : "Almost. Repair the weak spots."}</h3>
            <p>{passed ? "Lesson mastered. You now know when AI is useful — and when ordinary software is the smarter choice." : "Read the explanations above, then try again. Passing score is 6/7."}</p>
          </div>
          {!passed && <button className="tactile" onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}
        </motion.div>
      )}
    </div>
  );
}

export function AiVsSoftwareLesson({ progress }: Props) {
  const reducedMotion = useReducedMotion();
  const [traceChoices, setTraceChoices] = useState<Record<string, boolean>>({});
  const [traceChecked, setTraceChecked] = useState(false);
  const [repeatRuns, setRepeatRuns] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [threshold, setThreshold] = useState(34);
  const [thresholdTouched, setThresholdTouched] = useState(false);
  const [autoLearned, setAutoLearned] = useState(false);
  const [engineChoices, setEngineChoices] = useState<Record<string, Engine>>({});
  const [hybridOrder, setHybridOrder] = useState(["ML risk score", "Action", "Hard rules", "Human approval"]);
  const [hybridRan, setHybridRan] = useState(false);
  const [debugSeen, setDebugSeen] = useState<string[]>([]);
  const [debugAnswer, setDebugAnswer] = useState("");
  const [boringChoices, setBoringChoices] = useState<Record<string, string>>({});
  const [explanation, setExplanation] = useState("");
  const [explainFeedback, setExplainFeedback] = useState("");

  const traceCorrect = traceRules.every((rule) => Boolean(traceChoices[rule.id]) === rule.expected);

  const thresholdAccuracy = useMemo(() => {
    const correct = boundaryPoints.filter((point) => {
      const predicted = point.x >= threshold ? "risky" : "safe";
      return predicted === point.label;
    }).length;
    return Math.round((correct / boundaryPoints.length) * 100);
  }, [threshold]);

  const enginesCorrect = engineScenarios.every((item) => engineChoices[item.id] === item.answer);
  const hybridCorrect = hybridOrder.join("|") === "Hard rules|ML risk score|Human approval|Action";
  const boringCorrect = boringCases.every((item) => boringChoices[item.id] === item.answer);

  useEffect(() => {
    if (traceChecked && traceCorrect) progress.completeTask("trace-rules");
  }, [traceChecked, traceCorrect, progress]);
  useEffect(() => {
    if (repeatRuns >= 3) progress.completeTask("repeat-program");
  }, [repeatRuns, progress]);
  useEffect(() => {
    if (edgeCount >= edgeCases.length) progress.completeTask("grow-rules");
  }, [edgeCount, progress]);
  useEffect(() => {
    if (thresholdTouched && autoLearned) progress.completeTask("learn-boundary");
  }, [thresholdTouched, autoLearned, progress]);
  useEffect(() => {
    if (enginesCorrect) progress.completeTask("choose-engine");
  }, [enginesCorrect, progress]);
  useEffect(() => {
    if (hybridCorrect && hybridRan) progress.completeTask("hybrid-builder");
  }, [hybridCorrect, hybridRan, progress]);
  useEffect(() => {
    if (debugSeen.includes("rules") && debugSeen.includes("model") && debugAnswer === "rules") progress.completeTask("debug-contrast");
  }, [debugSeen, debugAnswer, progress]);
  useEffect(() => {
    if (boringCorrect) progress.completeTask("boring-wins");
  }, [boringCorrect, progress]);

  const requiredTasks = aiVsSoftwareSections.map((section) => section.taskId);
  const tasksDone = requiredTasks.filter((id) => progress.completedTasks[id]).length;
  const sectionsRead = aiVsSoftwareSections.filter((section) => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === requiredTasks.length && sectionsRead === aiVsSoftwareSections.length;

  const addDebugSeen = (id: string) => setDebugSeen((current) => current.includes(id) ? current : [...current, id]);

  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["rule", "instruction", "example", "data", "learn", "pattern", "parameter", "predict", "exact", "fuzzy"].filter((term) => text.includes(term));
    if (explanation.trim().length < 70) {
      setExplainFeedback("Make it concrete. Use at least two sentences and explain where the behavior comes from in each kind of system.");
      return;
    }
    if (hits.length < 3) {
      setExplainFeedback("Add mechanism words: rules/instructions for normal software; examples/data/learned patterns or parameters for ML.");
      return;
    }
    setExplainFeedback("Good. You separated explicit instructions from learned behavior — without pretending AI is outside normal software.");
    progress.completeTask("explain-software");
  };

  return (
    <main className={`${styles.lesson} lesson-main`}>
      <div className={styles.ambient} aria-hidden="true">
        <motion.i className={styles.ambientStar} animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} />
        <motion.i className={styles.ambientPill} animate={reducedMotion ? undefined : { y: [0, 25, 0], rotate: [-8, 7, -8] }} transition={{ duration: 7, repeat: Infinity }} />
        <motion.i className={styles.ambientBlob} animate={reducedMotion ? undefined : { scale: [1, 1.08, .97, 1], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.lessonTag}><span>MODULE 01</span><b>LESSON 02</b></div>
          <motion.h1 initial={{ opacity: 0, y: 24, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .55 }}>
            AI <em>vs</em><br />normal software
          </motion.h1>
          <p className={styles.heroLead}>{getDepth(depthIntro, progress.depth)}</p>
          <DepthSwitch value={progress.depth} onChange={progress.setDepth} />
          <div className={styles.heroRule}>
            <span>THE QUESTION IS NOT</span><strong>“AI or code?”</strong>
            <span>THE QUESTION IS</span><strong>“Where does the behavior come from?”</strong>
          </div>
        </div>
        <div className={styles.heroStage}>
          <div className={styles.versus}>VS</div>
          <Ruley />
          <Pix />
          <motion.div className={styles.heroArrowA} animate={reducedMotion ? undefined : { x: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}>EXPLICIT RULES →</motion.div>
          <motion.div className={styles.heroArrowB} animate={reducedMotion ? undefined : { x: [0, -12, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>← LEARNED PATTERNS</motion.div>
        </div>
      </section>

      <LessonSection id="be-the-computer" onVisit={progress.markVisited} className={styles.sceneBlue}>
        <SectionHeading number="01" kicker="COLD OPEN · CLICK" title="Be the computer." copy={<>Before we talk about AI, feel what ordinary software does: <strong>follow explicit instructions exactly.</strong></>} />
        <div className={styles.traceLab}>
          <div className={styles.packageCard}>
            <span className={styles.packageIcon}>📦</span>
            <h3>PACKAGE #4821</h3>
            <dl><div><dt>weight</dt><dd>7 kg</dd></div><div><dt>fragile</dt><dd>yes</dd></div><div><dt>destination</dt><dd>Belgrade</dd></div></dl>
          </div>
          <div className={styles.ruleStack}>
            {traceRules.map((rule, index) => (
              <motion.button
                key={rule.id}
                className={`${styles.traceRule} ${traceChoices[rule.id] ? styles.traceOn : ""}`}
                style={{ background: rule.color }}
                whileHover={{ y: -3, rotate: index % 2 ? .5 : -.5 }}
                whileTap={{ scale: .97 }}
                onClick={() => { setTraceChecked(false); setTraceChoices((current) => ({ ...current, [rule.id]: !current[rule.id] })); }}
              >
                <span>{traceChoices[rule.id] ? "✓" : "○"}</span>
                <div><strong>{rule.label}</strong><small>{rule.result}</small></div>
              </motion.button>
            ))}
            <button className={`${styles.runButton} tactile`} onClick={() => setTraceChecked(true)}>RUN THESE RULES</button>
          </div>
          <AnimatePresence mode="wait">
            {traceChecked && (
              <motion.div className={`${styles.traceResult} ${traceCorrect ? styles.good : styles.bad}`} initial={{ opacity: 0, scale: .9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}>
                <strong>{traceCorrect ? "Exactly." : "Trace it again."}</strong>
                <p>{traceCorrect ? "7 kg triggers HEAVY. fragile=yes triggers FRAGILE. Belgrade is not overseas, so no CUSTOMS form." : "A computer does not use common sense here. It only executes the conditions you gave it."}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["trace-rules"])}>Select the exact rules that fire for this package.</TaskStamp>
      </LessonSection>

      <LessonSection id="same-input" onVisit={progress.markVisited} className={styles.sceneYellow}>
        <SectionHeading number="02" kicker="EXPERIMENT · CLICK" title="Same input. Same path. Same result." copy={<>A deterministic function is boring in a useful way. If state and inputs are identical, its authored logic gives you the same result.</>} />
        <div className={styles.repeatGrid}>
          <div className={styles.codeMachine}>
            <div className={styles.codeHeader}><i /><i /><i /><span>shipping.js</span></div>
            <code>price = 100<br />coupon = <b>"SAVE20"</b><br /><br />IF coupon.valid<br />→ price = price × 0.80</code>
            <button className="tactile" onClick={() => setRepeatRuns((n) => Math.min(5, n + 1))}>▶ RUN PROGRAM</button>
          </div>
          <div className={styles.runReceipts}>
            {Array.from({ length: Math.max(repeatRuns, 1) }).map((_, index) => (
              index < repeatRuns ? <motion.div key={index} initial={{ x: -30, opacity: 0, rotate: -3 }} animate={{ x: 0, opacity: 1, rotate: index % 2 ? 1 : -1 }} className={styles.receipt}><span>RUN {index + 1}</span><strong>€80.00</strong><small>exactly the same</small></motion.div> : <div key={index} className={styles.receiptGhost}>run it</div>
            ))}
          </div>
        </div>
        <div className={styles.conceptRibbon}><b>DETERMINISTIC ≠ SIMPLE</b><span>A huge software system can be deterministic. The point is that its decision logic is explicitly specified rather than statistically learned.</span></div>
        <TaskStamp done={Boolean(progress.completedTasks["repeat-program"])}>Run the exact same program at least three times.</TaskStamp>
      </LessonSection>

      <LessonSection id="rule-explosion" onVisit={progress.markVisited} className={styles.sceneCoral}>
        <SectionHeading number="03" kicker="BREAK IT · CLICK" title="Now make the rules survive the real world." copy={<>Some problems have clean rules. Others have <strong>too many fuzzy edge cases</strong> for a useful hand-written checklist.</>} />
        <div className={styles.edgeLab}>
          <div className={styles.catRuleBook}>
            <div className={styles.bookTop}><Ruley excited={edgeCount >= 3} /><div><span>CAT DETECTOR v1</span><strong>{4 + edgeCount * 7} RULES</strong></div></div>
            <div className={styles.ruleLines}>
              <p>IF ears = pointy → +cat</p><p>IF whiskers = visible → +cat</p><p>IF outline = cat-shaped → +cat</p><p>IF size &lt; 60cm → +cat</p>
              {Array.from({ length: edgeCount }).map((_, i) => <motion.p key={i} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.exception}>EXCEPT edge_case_{String(i + 1).padStart(2, "0")} → add more logic…</motion.p>)}
            </div>
            <button className="tactile" disabled={edgeCount >= edgeCases.length} onClick={() => setEdgeCount((n) => Math.min(edgeCases.length, n + 1))}>{edgeCount >= edgeCases.length ? "RULEBOOK IS A MESS" : "THROW AN EDGE CASE AT IT →"}</button>
          </div>
          <div className={styles.edgeCards}>
            {edgeCases.map((edge, index) => (
              <motion.article key={edge.title} className={index < edgeCount ? styles.edgeVisible : ""} initial={false} animate={index < edgeCount ? { opacity: 1, x: 0, rotate: index % 2 ? 1.5 : -1.5 } : { opacity: .18, x: 35, rotate: 0 }}>
                <span>{edge.icon}</span><div><strong>{edge.title}</strong><p>{edge.copy}</p></div>
              </motion.article>
            ))}
          </div>
        </div>
        <div className={styles.misconception}><span>!</span><p><strong>This does NOT mean “rules are bad.”</strong> It means the cost of writing reliable rules can explode when inputs are high-dimensional, noisy or ambiguous.</p></div>
        <TaskStamp done={Boolean(progress.completedTasks["grow-rules"])}>Expose all four edge cases and watch the hand-written rulebook grow.</TaskStamp>
      </LessonSection>

      <LessonSection id="learn-boundary" onVisit={progress.markVisited} className={styles.scenePurple}>
        <SectionHeading number="04" kicker="SLIDE + LEARN" title="Instead of writing the boundary, fit it from examples." copy={<>A tiny toy model can learn a threshold from labeled examples. Real models can learn vastly richer boundaries, but the core idea starts here.</>} />
        <div className={styles.boundaryLab}>
          <div className={styles.boundaryPlot}>
            <div className={styles.axis}><span>LOW RISK</span><span>HIGH RISK</span></div>
            <motion.div className={styles.boundaryLine} animate={{ left: `${threshold}%` }} transition={{ type: "spring", stiffness: 230, damping: 24 }}><b>{threshold}</b></motion.div>
            {boundaryPoints.map((point, index) => {
              const predicted = point.x >= threshold ? "risky" : "safe";
              const right = predicted === point.label;
              return <motion.button key={point.id} className={`${styles.dataPoint} ${point.label === "risky" ? styles.riskyPoint : styles.safePoint} ${right ? "" : styles.misclassified}`} style={{ left: `${point.x}%`, top: `${32 + (index % 3) * 22}%` }} whileHover={{ scale: 1.18 }} title={`${point.label} example`}>{point.label === "risky" ? "!" : "✓"}</motion.button>;
            })}
          </div>
          <div className={styles.boundaryControls}>
            <div className={styles.accuracyDial}><span>training accuracy</span><strong>{thresholdAccuracy}%</strong><i style={{ transform: `rotate(${Math.min(180, thresholdAccuracy * 1.8 - 90)}deg)` }} /></div>
            <label>YOU choose a threshold<input type="range" min="10" max="90" value={threshold} onChange={(e) => { setThresholdTouched(true); setAutoLearned(false); setThreshold(Number(e.target.value)); }} /></label>
            <button className={`${styles.learnButton} tactile`} onClick={() => { setThreshold(50); setAutoLearned(true); }}>✦ LET THE TOY MODEL FIT IT</button>
            <AnimatePresence>{autoLearned && <motion.p className={styles.learnNote} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>The toy learner searched for a threshold that separates the labeled examples well. In real ML, optimization adjusts many parameters — not just one slider.</motion.p>}</AnimatePresence>
          </div>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["learn-boundary"])}>Move the boundary yourself, then let the model fit it from examples.</TaskStamp>
      </LessonSection>

      <LessonSection id="choose-engine" onVisit={progress.markVisited} className={styles.sceneMint}>
        <SectionHeading number="05" kicker="DECISION GAME · CLICK" title="Choose the right engine." copy={<>Experts do not ask “How can I add AI?” first. They ask <strong>which mechanism makes this task reliable, cheap and understandable.</strong></>} />
        <div className={styles.engineLegend}><span><i className={styles.ruleDot} />RULES</span><span><i className={styles.mlDot} />ML</span><span><i className={styles.hybridDot} />HYBRID</span></div>
        <div className={styles.scenarioGrid}>
          {engineScenarios.map((scenario) => {
            const choice = engineChoices[scenario.id];
            const correct = choice === scenario.answer;
            return (
              <motion.article key={scenario.id} className={`${styles.scenarioCard} ${choice ? (correct ? styles.choiceCorrect : styles.choiceWrong) : ""}`} layout whileHover={{ y: -5, rotate: .4 }}>
                <span className={styles.scenarioIcon}>{scenario.icon}</span>
                <h3>{scenario.title}</h3>
                <p>{choice ? scenario.hint : "Pick the mechanism before revealing the reasoning."}</p>
                <div className={styles.engineButtons}>
                  {(["rules", "ml", "hybrid"] as Engine[]).map((engine) => <button key={engine} onClick={() => setEngineChoices((current) => ({ ...current, [scenario.id]: engine }))} className={choice === engine ? styles.engineActive : ""}>{engine.toUpperCase()}</button>)}
                </div>
              </motion.article>
            );
          })}
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["choose-engine"])}>Correctly classify all six tasks as Rules, ML or Hybrid.</TaskStamp>
      </LessonSection>

      <LessonSection id="hybrid-system" onVisit={progress.markVisited} className={styles.sceneDark}>
        <SectionHeading number="06" kicker="DRAG + RUN" title="Real AI products are usually hybrids." copy={<>Put deterministic safety constraints around a learned judgment. Then add a human where the consequence deserves one.</>} />
        <div className={styles.hybridLab}>
          <div className={styles.paymentCard}><span>💳</span><div><small>NEW PAYMENT</small><strong>€4,850</strong><p>new device · unusual country · known customer</p></div></div>
          <Reorder.Group axis="x" values={hybridOrder} onReorder={(next) => { setHybridOrder(next); setHybridRan(false); }} className={styles.hybridPipeline}>
            {hybridOrder.map((item) => (
              <Reorder.Item key={item} value={item} className={`${styles.hybridBlock} ${item.startsWith("Hard") ? styles.blockRules : item.startsWith("ML") ? styles.blockMl : item.startsWith("Human") ? styles.blockHuman : styles.blockAction}`} whileDrag={{ scale: 1.08, rotate: 2, zIndex: 5 }}>
                <span>{item.startsWith("Hard") ? "{}" : item.startsWith("ML") ? "✦" : item.startsWith("Human") ? "👤" : "→"}</span><strong>{item}</strong><small>drag me</small>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className={styles.hybridRunRow}>
            <p>{hybridCorrect ? "Pipeline makes sense: non-negotiable rules first, fuzzy risk score next, human approval for the costly edge case, then action." : "Arrange the blocks so exact constraints come before learned judgment, and irreversible action comes last."}</p>
            <button disabled={!hybridCorrect} className="tactile" onClick={() => setHybridRan(true)}>RUN PAYMENT THROUGH PIPELINE</button>
          </div>
          <AnimatePresence>{hybridRan && <motion.div className={styles.flowResult} initial={{ scaleX: .2, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}><span>RULES ✓</span><span>RISK 0.78</span><span>HUMAN REVIEW</span><strong>HOLD</strong></motion.div>}</AnimatePresence>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["hybrid-builder"])}>Drag the hybrid pipeline into a safe order and run the payment.</TaskStamp>
      </LessonSection>

      <LessonSection id="debug-it" onVisit={progress.markVisited} className={styles.sceneSky}>
        <SectionHeading number="07" kicker="INSPECT · COMPARE" title="Debugging feels different." copy={<>With rules, you can often point to the exact branch. With a learned model, behavior emerges from many fitted parameters, so you investigate differently.</>} />
        <div className={styles.debugGrid}>
          <motion.button className={styles.debugRules} onClick={() => addDebugSeen("rules")} whileHover={{ y: -4 }}>
            <div className={styles.debugTitle}><Ruley /><div><span>RULE TRACE</span><strong>Why was coupon rejected?</strong></div></div>
            <ol><li className={styles.tracePass}>coupon exists ✓</li><li className={styles.traceFail}>expiry &lt; today ✕</li><li>STOP → reject coupon</li></ol>
            <small>{debugSeen.includes("rules") ? "You can identify the authored branch that caused the output." : "CLICK TO INSPECT"}</small>
          </motion.button>
          <motion.button className={styles.debugModel} onClick={() => addDebugSeen("model")} whileHover={{ y: -4 }}>
            <div className={styles.debugTitle}><Pix thinking /><div><span>MODEL TRACE</span><strong>Why risk score 0.78?</strong></div></div>
            <div className={styles.signalBars}>{[82, 63, 49, 71, 38].map((v, i) => <i key={i} style={{ width: `${v}%` }} />)}</div>
            <p>Many learned signals contributed to the score. We can inspect features, examples, attribution and system traces — but there is no single hand-written IF line that equals “0.78”.</p>
            <small>{debugSeen.includes("model") ? "Different observability tools, different mental model." : "CLICK TO INSPECT"}</small>
          </motion.button>
        </div>
        <div className={styles.debugQuestion}><strong>Which one is easier to trace to one exact authored branch?</strong><button className={debugAnswer === "rules" ? styles.picked : ""} onClick={() => setDebugAnswer("rules")}>RULE ENGINE</button><button className={debugAnswer === "model" ? styles.picked : ""} onClick={() => setDebugAnswer("model")}>LEARNED MODEL</button>{debugAnswer === "model" && <span>Not quite — model behavior is inspectable, but not usually reducible to one human-authored branch.</span>}</div>
        <TaskStamp done={Boolean(progress.completedTasks["debug-contrast"])}>Inspect both systems and answer the traceability question.</TaskStamp>
      </LessonSection>

      <LessonSection id="boring-wins" onVisit={progress.markVisited} className={styles.scenePink}>
        <SectionHeading number="08" kicker="ANTI-HYPE CHALLENGE" title="Sometimes the smartest choice is no AI at all." copy={<>AI adds uncertainty, cost and operational complexity. If a tiny exact function solves the problem, <strong>use the tiny exact function.</strong></>} />
        <div className={styles.boringArena}>
          <div className={styles.boringHeader}><span>🧰</span><div><strong>THE BORING TOOLBOX</strong><p>Choose RULES or AI. Do not reward novelty.</p></div></div>
          {boringCases.map((item, index) => {
            const chosen = boringChoices[item.id];
            const correct = chosen === item.answer;
            return (
              <motion.div key={item.id} className={`${styles.boringRow} ${chosen ? (correct ? styles.boringGood : styles.boringBad) : ""}`} initial={{ opacity: 0, x: index % 2 ? 18 : -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span>{item.icon}</span><strong>{item.title}</strong><div><button onClick={() => setBoringChoices((c) => ({ ...c, [item.id]: "rules" }))}>RULES</button><button onClick={() => setBoringChoices((c) => ({ ...c, [item.id]: "ai" }))}>AI</button></div><b>{chosen ? (correct ? "✓" : "↺") : "?"}</b>
              </motion.div>
            );
          })}
        </div>
        <div className={styles.ruleOfThumb}><span>RULE OF THUMB</span><p><strong>Known + exact + stable?</strong> Start with rules. <strong>Fuzzy + pattern-heavy + changing?</strong> Consider ML. <strong>High stakes?</strong> Combine mechanisms with safeguards.</p></div>
        <TaskStamp done={Boolean(progress.completedTasks["boring-wins"])}>Choose the simplest suitable mechanism for all five tasks.</TaskStamp>
      </LessonSection>

      <LessonSection id="explain-software" onVisit={progress.markVisited} className={styles.sceneCream}>
        <SectionHeading number="09" kicker="FEYNMAN CHECK · TYPE" title="Explain it without saying “AI is smarter.”" copy={<>Teach the difference to someone who has never coded. Your explanation should say <strong>where the behavior comes from.</strong></>} />
        <div className={styles.explainGrid}>
          <div className={styles.cousinCard}><span>🧒</span><p>“Why not just write normal code for everything? And if AI is code too… what is actually different?”</p></div>
          <div className={styles.typeCard}>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Normal software usually... A machine-learning model instead... Both are still..." />
            <div className={styles.typeFooter}><span>{explanation.trim().length} chars</span><button className="tactile" onClick={submitExplain}>CHECK MY EXPLANATION</button></div>
            <AnimatePresence mode="wait">{explainFeedback && <motion.p key={explainFeedback} className={progress.completedTasks["explain-software"] ? styles.explainGood : styles.explainHint} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{explainFeedback}</motion.p>}</AnimatePresence>
          </div>
        </div>
        <TaskStamp done={Boolean(progress.completedTasks["explain-software"])}>Write a mechanism-level explanation in your own words.</TaskStamp>
      </LessonSection>

      <section className={styles.lockSummary}>
        <div><span>SECTIONS</span><strong>{sectionsRead}/{aiVsSoftwareSections.length}</strong></div>
        <div><span>ACTIVITIES</span><strong>{tasksDone}/{requiredTasks.length}</strong></div>
        <div className={quizUnlocked ? styles.unlocked : ""}><span>QUIZ</span><strong>{quizUnlocked ? "UNLOCKED" : "LOCKED"}</strong></div>
      </section>

      <section className={styles.quizSection}>
        <div className={styles.quizHeading}><span className="eyebrow">LESSON 02 QUIZ</span><h2>Can you choose the right kind of machine?</h2><p>Passing score: 6/7. Your best score and completion persist locally.</p></div>
        <Quiz progress={progress} unlocked={quizUnlocked} />
      </section>

      <section className={styles.lessonFooter}>
        <div><span>YOU NOW KNOW</span><h2>AI is not the opposite of software.</h2><p>It is a way of building some behaviors inside software by learning patterns from data instead of specifying every decision rule by hand.</p></div>
        <Link href="/lessons/what-is-ai" className="tactile">← REVISIT LESSON 01</Link>
        <div className={styles.nextLocked}><span>NEXT</span><strong>AI / ML / Deep Learning</strong><small>Build queue</small></div>
      </section>
    </main>
  );
}
