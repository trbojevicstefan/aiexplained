"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./features-labels.module.css";

type Props = { progress: LessonProgressApi };
type Role = "feature" | "label";
type AuditRole = "feature" | "label" | "leak" | "metadata";
type Availability = "before" | "after";

const sections = [
  { id: "crime-scene", taskId: "extract-features" },
  { id: "feature-or-label", taskId: "sort-feature-label" },
  { id: "feature-selection", taskId: "select-features" },
  { id: "leakage", taskId: "repair-leakage" },
  { id: "encode-features", taskId: "encode-features" },
  { id: "time-availability", taskId: "check-availability" },
  { id: "engineered-learned", taskId: "compare-representations" },
  { id: "diagnose-dataset", taskId: "audit-dataset" },
  { id: "explain-features", taskId: "explain-features" },
] as const;

const profileClues = [
  { id: "usage", icon: "📉", raw: "Used product on 2 of last 7 days", feature: "usage_days_7d = 2" },
  { id: "tickets", icon: "🎫", raw: "Opened 4 support tickets this month", feature: "support_tickets_30d = 4" },
  { id: "tenure", icon: "🗓️", raw: "Joined 96 days ago", feature: "tenure_days = 96" },
  { id: "plan", icon: "💳", raw: "Currently on Starter plan", feature: "plan_type = starter" },
  { id: "login", icon: "🕓", raw: "Last login was 11 days ago", feature: "days_since_login = 11" },
] as const;

const sortCards = [
  { id: "s1", term: "usage_days_7d", answer: "feature" as Role, why: "A value available as input before the outcome window." },
  { id: "s2", term: "support_tickets_30d", answer: "feature" as Role, why: "Another input clue the model may use." },
  { id: "s3", term: "churned_next_30d", answer: "label" as Role, why: "This is the target answer the supervised model is trained to predict." },
  { id: "s4", term: "tenure_days", answer: "feature" as Role, why: "A measurable property of the example." },
  { id: "s5", term: "is_spam", answer: "label" as Role, why: "In a spam classification dataset this would be the class/target." },
  { id: "s6", term: "email_link_count", answer: "feature" as Role, why: "A measurable input used to help predict spam." },
  { id: "s7", term: "house_sale_price", answer: "label" as Role, why: "If the task is predicting sale price, sale_price is the target value." },
  { id: "s8", term: "house_square_meters", answer: "feature" as Role, why: "A property the price model can use as input." },
] as const;

const selectionClues = [
  { id: "usage-trend", name: "usage trend last 4 weeks", useful: true, strength: 90 },
  { id: "tickets", name: "support ticket count", useful: true, strength: 76 },
  { id: "tenure", name: "account tenure", useful: true, strength: 55 },
  { id: "last-login", name: "days since last login", useful: true, strength: 84 },
  { id: "button-radius", name: "radius of the Settings button", useful: false, strength: 3 },
  { id: "dashboard-pixel", name: "top-left dashboard pixel color", useful: false, strength: 2 },
  { id: "random-number", name: "random number generated after row load", useful: false, strength: 1 },
  { id: "browser-tab-x", name: "x-coordinate of browser tab icon", useful: false, strength: 2 },
] as const;

const availabilityCards = [
  { id: "a1", term: "usage during the last 7 days", answer: "before" as Availability, why: "Known at the moment we make the prediction." },
  { id: "a2", term: "current subscription plan", answer: "before" as Availability, why: "Current account state is available now." },
  { id: "a3", term: "support tickets already opened", answer: "before" as Availability, why: "Historical information exists before the future outcome." },
  { id: "a4", term: "cancellation reason entered after closing account", answer: "after" as Availability, why: "This exists only after the target event happened." },
  { id: "a5", term: "refund issued because customer churned", answer: "after" as Availability, why: "This is downstream of the outcome we are trying to predict." },
  { id: "a6", term: "churned_next_30d target flag", answer: "after" as Availability, why: "During training we know the label later, but it must not be an input feature at prediction time." },
] as const;

const auditColumns = [
  { id: "c1", name: "customer_id", answer: "metadata" as AuditRole, why: "Useful for row identity/joining, but in this toy audit we keep it out of predictive inputs to avoid memorization/identity shortcuts." },
  { id: "c2", name: "usage_days_7d", answer: "feature" as AuditRole, why: "Legitimate historical input." },
  { id: "c3", name: "support_tickets_30d", answer: "feature" as AuditRole, why: "Legitimate historical input." },
  { id: "c4", name: "plan_type", answer: "feature" as AuditRole, why: "Current account information can be encoded and used as input." },
  { id: "c5", name: "churned_next_30d", answer: "label" as AuditRole, why: "This is the supervised target." },
  { id: "c6", name: "cancellation_reason", answer: "leak" as AuditRole, why: "Recorded after cancellation; it reveals the answer." },
  { id: "c7", name: "account_closed_at", answer: "leak" as AuditRole, why: "A closure timestamp downstream of churn leaks the target." },
  { id: "c8", name: "snapshot_date", answer: "metadata" as AuditRole, why: "Useful for temporal bookkeeping/splitting; not a direct feature in this toy setup." },
] as const;

const quizQuestions = [
  { q: "In supervised learning, what is a feature?", options: ["An input variable/representation the model can use", "Always the final answer", "Only a UI feature", "The optimizer"], correct: 0, why: "Features are the input measurements or representations used to predict the target." },
  { q: "What is a label/target?", options: ["The value/class the supervised system is trained to predict", "Any column in the table", "A model weight", "Only text"], correct: 0, why: "The target is the desired output for each training example, such as spam/not-spam, churn or sale price." },
  { q: "What is target leakage?", options: ["A missing CSS file", "Input data contains information that would not legitimately be available at prediction time and reveals the target", "Having many useful features", "Using validation data"], correct: 1, why: "Leakage creates unrealistic performance because the model gets information derived from or downstream of the answer." },
  { q: "Why can 99.9% validation accuracy be suspicious?", options: ["High scores are impossible", "It may indicate leakage, duplicate examples, bad splitting or an unusually easy task — audit before celebrating", "It always proves AGI", "It means more labels are needed"], correct: 1, why: "Extremely strong results can be real, but they should trigger an audit for leakage, duplication and evaluation mistakes." },
  { q: "Which is a valid feature for predicting churn tomorrow?", options: ["Cancellation reason written after churn", "Usage history up to today", "The future churn flag itself", "Refund issued after cancellation"], correct: 1, why: "A usable production feature must be available when the prediction is made." },
  { q: "What is feature engineering?", options: ["Turning raw information into useful model inputs/representations using domain or statistical transformations", "Changing model weights by hand only", "Renaming the website", "Deleting every categorical value"], correct: 0, why: "Feature engineering derives useful inputs such as ratios, counts, elapsed time or encodings from raw data." },
  { q: "Do deep models eliminate the concept of features?", options: ["Completely", "No — they often learn internal representations from raw inputs, reducing some manual feature engineering but still operating on representations", "Only for tables", "Features and labels become identical"], correct: 1, why: "Representation learning changes where feature extraction happens; the system still transforms inputs into useful internal features/representations." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function Clue({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.clue} animate={{ y: active ? [0, -9, 0] : [0, -5, 0], rotate: active ? [0, -2, 2, 0] : [0, 1, 0] }} transition={{ duration: active ? 1.4 : 3, repeat: Infinity }}><div><i/><i/><strong>⌕</strong><span/></div><b>CLUE</b></motion.div>;
}
function Target({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.target} animate={{ scale: active ? [1, 1.06, 1] : [1, 1.02, 1], rotate: [0, -1, 1, 0] }} transition={{ duration: active ? 1.3 : 3.2, repeat: Infinity }}><div><i/><i/><strong>◎</strong></div><b>TARGET</b></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;

  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity }}>🕵️🔒</motion.span><h3>Case exam locked.</h3><p>Collect every clue, expose leakage and finish the dataset audit first.</p></div>;
  const submit = () => { if (answered === quizQuestions.length) { setSubmitted(true); progress.saveQuiz(score, passed); } };

  return <div className={styles.quiz}>{quizQuestions.map((question, index) => <div className={styles.question} key={question.q}><h3><span>{index + 1}</span>{question.q}</h3><div>{question.options.map((option, optionIndex) => <motion.button key={option} whileTap={{ scale: .97 }} disabled={submitted} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === question.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.wrong : ""}`}><i>{String.fromCharCode(65 + optionIndex)}</i>{option}</motion.button>)}</div>{submitted && <p>{question.why}</p>}</div>)}{!submitted ? <button className={`${styles.submit} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>CLOSE THE CASE →</button> : <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className={`${styles.result} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><div><h3>{passed ? "Case solved." : "Re-open the evidence board."}</h3><p>{passed ? "You can distinguish inputs, targets and illegal future information." : "Pass is 6/7. Use the explanations to fix the dataset mental model."}</p></div>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</motion.div>}</div>;
}

export function FeaturesLabelsLesson({ progress }: Props) {
  const [extracted, setExtracted] = useState<string[]>([]);
  const [revealedLabel, setRevealedLabel] = useState(false);
  const [sortChoices, setSortChoices] = useState<Record<string, Role>>({});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectionChecked, setSelectionChecked] = useState(false);
  const [leakAdded, setLeakAdded] = useState(false);
  const [leakRemoved, setLeakRemoved] = useState(false);
  const [encodingDone, setEncodingDone] = useState<string[]>([]);
  const [planType, setPlanType] = useState("pro");
  const [lastLoginDate, setLastLoginDate] = useState("2026-08-22");
  const [availability, setAvailability] = useState<Record<string, Availability>>({});
  const [representations, setRepresentations] = useState<string[]>([]);
  const [auditChoices, setAuditChoices] = useState<Record<string, AuditRole>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const sortCorrect = sortCards.every(card => sortChoices[card.id] === card.answer);
  const usefulIds = selectionClues.filter(item => item.useful).map(item => item.id);
  const selectionCorrect = selectionChecked && selectedFeatures.length === usefulIds.length && usefulIds.every(id => selectedFeatures.includes(id));
  const availabilityCorrect = availabilityCards.every(card => availability[card.id] === card.answer);
  const auditCorrect = auditColumns.every(column => auditChoices[column.id] === column.answer);
  const daysSinceLogin = Math.max(0, Math.round((new Date("2026-09-02").getTime() - new Date(lastLoginDate).getTime()) / 86400000));

  useEffect(() => { if (extracted.length === profileClues.length && revealedLabel) progress.completeTask("extract-features"); }, [extracted.length, revealedLabel, progress]);
  useEffect(() => { if (sortCorrect) progress.completeTask("sort-feature-label"); }, [sortCorrect, progress]);
  useEffect(() => { if (selectionCorrect) progress.completeTask("select-features"); }, [selectionCorrect, progress]);
  useEffect(() => { if (leakAdded && leakRemoved) progress.completeTask("repair-leakage"); }, [leakAdded, leakRemoved, progress]);
  useEffect(() => { if (["category", "date", "ratio"].every(id => encodingDone.includes(id))) progress.completeTask("encode-features"); }, [encodingDone, progress]);
  useEffect(() => { if (availabilityCorrect) progress.completeTask("check-availability"); }, [availabilityCorrect, progress]);
  useEffect(() => { if (representations.includes("engineered") && representations.includes("learned")) progress.completeTask("compare-representations"); }, [representations, progress]);
  useEffect(() => { if (auditCorrect) progress.completeTask("audit-dataset"); }, [auditCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const extract = (id: string) => setExtracted(current => current.includes(id) ? current : [...current, id]);
  const toggleSelected = (id: string) => { setSelectionChecked(false); setSelectedFeatures(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]); };
  const markEncoding = (id: string) => setEncodingDone(current => current.includes(id) ? current : [...current, id]);
  const markRepresentation = (id: string) => setRepresentations(current => current.includes(id) ? current : [...current, id]);
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["feature", "input", "label", "target", "predict", "leak", "future", "available", "representation"].filter(term => text.includes(term));
    if (explanation.trim().length < 100) { setFeedback("Explain three things: what a feature is, what a label/target is, and why future information can create leakage."); return; }
    if (hits.length < 6) { setFeedback("Add mechanism words such as input/feature, label/target, prediction time, future information and leakage."); return; }
    setFeedback("Strong. You described both the role of the columns and the time boundary that makes a feature legitimate.");
    progress.completeTask("explain-features");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · LESSON 09</span><h1>FEATURES<br/><em>→</em><br/>LABEL.</h1><p>A model is a detective. <strong>Features are the clues it gets to see.</strong> The label/target is the answer it is learning to predict. But if you accidentally hand it tomorrow's answer as a clue, the case is rigged.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroBoard}><Clue active/><div className={styles.redThread}><i/><i/><i/><i/><span>?</span></div><Target active/></div></section>

    <LessonSection id="crime-scene" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · EXTRACT" title="Turn a messy real customer into model clues.">Raw reality is full of stories. A dataset turns parts of that reality into measurable inputs. Click every observation to extract a feature.</Heading>
      <div className={styles.profileLab}><div className={styles.profile}><div className={styles.customer}><span>👩‍💻</span><strong>CUSTOMER #1842</strong><small>snapshot: today</small></div>{profileClues.map(clue => <motion.button whileTap={{ scale: .97 }} key={clue.id} className={extracted.includes(clue.id) ? styles.extracted : ""} onClick={() => extract(clue.id)}><i>{clue.icon}</i><span>{clue.raw}</span><b>{extracted.includes(clue.id) ? "FEATURE ✓" : "extract"}</b></motion.button>)}</div><div className={styles.featureSheet}><span>MODEL INPUT ROW</span>{profileClues.map(clue => <div key={clue.id} className={extracted.includes(clue.id) ? styles.rowOn : ""}><code>{extracted.includes(clue.id) ? clue.feature : "????????"}</code></div>)}<button disabled={extracted.length !== profileClues.length} onClick={() => setRevealedLabel(true)}>WAIT 30 DAYS → REVEAL TRAINING LABEL</button>{revealedLabel && <motion.div className={styles.labelStamp} initial={{ scale: 2, rotate: -14, opacity: 0 }} animate={{ scale: 1, rotate: -4, opacity: 1 }}><Target/><strong>churned_next_30d = TRUE</strong><p>The label is known later for this historical training example. At prediction time today, it is the answer we do not know yet.</p></motion.div>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["extract-features"])}>Extract all five features and reveal the historical target later in time.</TaskStamp>
    </LessonSection>

    <LessonSection id="feature-or-label" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="SORT · CLICK" title="Input clue or answer?">The same column name can be a feature in one task and a target in another. Classify each card according to the task implied by its name/context.</Heading>
      <div className={styles.roleLegend}><span>FEATURE / INPUT</span><span>LABEL / TARGET</span></div><div className={styles.sortGrid}>{sortCards.map(card => { const choice = sortChoices[card.id]; return <article className={choice ? (choice === card.answer ? styles.good : styles.bad) : ""} key={card.id}><code>{card.term}</code><p>{choice ? card.why : "Would the model see this, or try to predict it?"}</p><div><button className={choice === "feature" ? styles.active : ""} onClick={() => setSortChoices(current => ({ ...current, [card.id]: "feature" }))}>FEATURE</button><button className={choice === "label" ? styles.active : ""} onClick={() => setSortChoices(current => ({ ...current, [card.id]: "label" }))}>LABEL</button></div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["sort-feature-label"])}>Classify all eight examples correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="feature-selection" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="SELECT · TEST" title="Not every measurable thing is a useful clue.">Choose only the sensible toy churn clues. Then test your feature set. In real ML, usefulness is validated empirically — this scene gives us intentionally obvious distractors.</Heading>
      <div className={styles.selectionLab}><div className={styles.clueShelf}>{selectionClues.map(item => <motion.button whileHover={{ y: -3 }} whileTap={{ scale: .96 }} className={selectedFeatures.includes(item.id) ? styles.selectedClue : ""} onClick={() => toggleSelected(item.id)} key={item.id}><span>{item.name}</span><i><b style={{ width: `${item.strength}%` }}/></i><small>toy relevance signal</small></motion.button>)}</div><div className={styles.detector}><Clue active={selectedFeatures.length > 0}/><span>FEATURE SET</span><strong>{selectedFeatures.length}</strong><button onClick={() => setSelectionChecked(true)}>TEST SELECTION</button><AnimatePresence>{selectionChecked && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={selectionCorrect ? styles.feedbackGood : styles.feedbackHint}>{selectionCorrect ? "Clean toy set: four plausibly useful historical signals selected." : "Not quite. Keep the four behavioral/account clues; remove deliberately irrelevant UI/random-coordinate distractors."}</motion.p>}</AnimatePresence></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["select-features"])}>Select exactly the four useful toy features.</TaskStamp>
    </LessonSection>

    <LessonSection id="leakage" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="CHEAT · CATCH IT" title="Target leakage can make a bad experiment look brilliant.">Turn on a feature that only exists after cancellation. The model suddenly looks almost perfect — because we secretly handed it the answer.</Heading>
      <div className={styles.leakLab}><div className={styles.leakFeatures}><span>INPUTS</span>{["usage_days_7d", "support_tickets_30d", "tenure_days", "plan_type"].map(item => <code key={item}>✓ {item}</code>)}<motion.code className={leakAdded && !leakRemoved ? styles.leaking : ""} animate={leakAdded && !leakRemoved ? { x: [0, -3, 3, 0] } : undefined}>{leakAdded ? (leakRemoved ? "✕ cancellation_reason removed" : "☠ cancellation_reason = 'too expensive'") : "+ add suspicious feature"}</motion.code><button disabled={leakAdded} onClick={() => setLeakAdded(true)}>ADD POST-CHURN COLUMN</button><button disabled={!leakAdded || leakRemoved} onClick={() => setLeakRemoved(true)}>REMOVE LEAK</button></div><div className={styles.scoreBoard}><span>VALIDATION ACCURACY</span><motion.strong key={`${leakAdded}-${leakRemoved}`} initial={{ scale: .7 }} animate={{ scale: 1 }}>{leakAdded && !leakRemoved ? "99.8%" : "82.4%"}</motion.strong><i><motion.b animate={{ width: leakAdded && !leakRemoved ? "99.8%" : "82.4%" }}/></i><h3>{leakAdded && !leakRemoved ? "WOW! ...or wait." : leakRemoved ? "Lower — but honest." : "Healthy baseline."}</h3><p>{leakAdded && !leakRemoved ? "The cancellation reason exists only because churn already happened. This evaluation is cheating." : leakRemoved ? "Now the model must predict from information available before the outcome." : "Add the future column to see why suspiciously perfect metrics require an audit."}</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["repair-leakage"])}>Create leakage, observe the fake performance jump, then remove the leaked feature.</TaskStamp>
    </LessonSection>

    <LessonSection id="encode-features" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="TRANSFORM · CLICK" title="Raw information often needs a model-ready representation.">Feature engineering can turn categories, timestamps and raw counts into useful structured inputs. Do all three transformations.</Heading>
      <div className={styles.encodingGrid}><article className={encodingDone.includes("category") ? styles.encoded : ""}><span>CATEGORY</span><h3>plan_type = {planType}</h3><select value={planType} onChange={event => setPlanType(event.target.value)}><option>starter</option><option>pro</option><option>business</option></select><button onClick={() => markEncoding("category")}>ENCODE CATEGORY</button>{encodingDone.includes("category") && <code>[starter={planType === "starter" ? 1 : 0}, pro={planType === "pro" ? 1 : 0}, business={planType === "business" ? 1 : 0}]</code>}</article><article className={encodingDone.includes("date") ? styles.encoded : ""}><span>TIMESTAMP</span><h3>last_login = {lastLoginDate}</h3><input type="date" value={lastLoginDate} onChange={event => setLastLoginDate(event.target.value)}/><button onClick={() => markEncoding("date")}>DERIVE ELAPSED TIME</button>{encodingDone.includes("date") && <code>days_since_login = {daysSinceLogin}</code>}</article><article className={encodingDone.includes("ratio") ? styles.encoded : ""}><span>COUNTS → RATIO</span><h3>2 active days / 7 days</h3><div className={styles.week}>{Array.from({ length: 7 }).map((_, index) => <i className={index < 2 ? styles.dayOn : ""} key={index}/>)}</div><button onClick={() => markEncoding("ratio")}>CREATE NORMALIZED FEATURE</button>{encodingDone.includes("ratio") && <code>usage_rate_7d = 0.286</code>}</article></div>
      <TaskStamp done={Boolean(progress.completedTasks["encode-features"])}>Encode category, date and ratio features.</TaskStamp>
    </LessonSection>

    <LessonSection id="time-availability" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="TIME MACHINE · CLASSIFY" title="Could you know this when the prediction is made?">A valid historical column can still be an invalid production feature if it is created after the prediction timestamp.</Heading>
      <div className={styles.timeline}><div><span>PAST / NOW</span><strong>prediction at 09:00</strong></div><i>→</i><div><span>FUTURE OUTCOME WINDOW</span><strong>next 30 days</strong></div></div><div className={styles.availabilityGrid}>{availabilityCards.map(card => { const choice = availability[card.id]; return <article className={choice ? (choice === card.answer ? styles.good : styles.bad) : ""} key={card.id}><h3>{card.term}</h3><p>{choice ? card.why : "Was this fact available at 09:00?"}</p><div><button className={choice === "before" ? styles.active : ""} onClick={() => setAvailability(current => ({ ...current, [card.id]: "before" }))}>KNOWN BEFORE</button><button className={choice === "after" ? styles.active : ""} onClick={() => setAvailability(current => ({ ...current, [card.id]: "after" }))}>ONLY AFTER</button></div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["check-availability"])}>Classify all six facts by prediction-time availability.</TaskStamp>
    </LessonSection>

    <LessonSection id="engineered-learned" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="COMPARE · OPEN BOTH" title="Some features are designed. Others are learned as representations.">Traditional pipelines often hand-design useful measurements. Deep systems can learn internal representations from rawer inputs. Both are transformations of information.</Heading>
      <div className={styles.representationLab}><motion.button whileHover={{ y: -5 }} onClick={() => markRepresentation("engineered")} className={representations.includes("engineered") ? styles.representationSeen : ""}><Clue/><span>ENGINEERED FEATURES</span><h3>Spam email</h3><ul><li>capital_letter_ratio = .42</li><li>suspicious_link_count = 3</li><li>contains_prize_phrase = 1</li></ul><p>Humans define measurable clues using domain knowledge.</p></motion.button><motion.button whileHover={{ y: -5 }} onClick={() => markRepresentation("learned")} className={representations.includes("learned") ? styles.representationSeen : ""}><div className={styles.neuralCloud}>{Array.from({ length: 20 }).map((_, index) => <i style={{ opacity: .25 + (index % 7) / 10 }} key={index}/>)}</div><span>LEARNED REPRESENTATION</span><h3>Rawer text → internal vectors</h3><p>A neural system learns distributed internal features useful for its objective rather than requiring every clue to be explicitly named by a human.</p></motion.button></div><div className={styles.representationNote}><b>NOT A BINARY RELIGION</b><span>Modern systems often mix engineered metadata/features with learned representations.</span></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-representations"])}>Inspect engineered and learned representations.</TaskStamp>
    </LessonSection>

    <LessonSection id="diagnose-dataset" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="AUDIT · CLICK" title="Audit an actual dataset schema.">For our churn experiment, classify each column as legitimate feature, target label, leakage, or metadata/identifier.</Heading>
      <div className={styles.auditLegend}><span>FEATURE</span><span>LABEL</span><span>LEAK</span><span>METADATA</span></div><div className={styles.auditTable}>{auditColumns.map(column => { const choice = auditChoices[column.id]; return <article className={choice ? (choice === column.answer ? styles.good : styles.bad) : ""} key={column.id}><code>{column.name}</code><p>{choice ? column.why : "Assign a role."}</p><div>{(["feature", "label", "leak", "metadata"] as AuditRole[]).map(role => <button className={choice === role ? styles.active : ""} onClick={() => setAuditChoices(current => ({ ...current, [column.id]: role }))} key={role}>{role.toUpperCase()}</button>)}</div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["audit-dataset"])}>Audit all eight columns correctly.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-features" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain why the label is allowed in training but not as an input.">Teach a beginner features, labels and the prediction-time boundary.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🧩</span><p>“If the training table already has the answer, why not give that answer to the model as a feature?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="A feature is... The label/target is... During training we use the label to measure learning, but at prediction time... Leakage happens when..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={progress.completedTasks["explain-features"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-features"])}>Explain features, label/target and target leakage.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.gateOpen : ""}><span>QUIZ</span><strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 09 QUIZ</span><h2>Which clues are legal?</h2><p>Pass 6/7. A great feature is useful, available, and not secretly the answer.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Features are inputs. Label is the answer. Time decides what is legal.</h2><p>Training can use the historical target to calculate learning error — without leaking that target into the model's input features.</p></div><Link href="/lessons/parameters">← LESSON 08</Link><div><small>NEXT</small><strong>Learning Types</strong><span>build queue</span></div></section>
  </main>;
}
