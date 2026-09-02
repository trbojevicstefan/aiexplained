"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { generativePredictiveSections } from "@/content/course";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./generative-vs-predictive.module.css";

type Props = { progress: LessonProgressApi };
type Job = "predictive" | "generative" | "hybrid";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

const introCopy: DepthCopy = {
  simple: <>A predictive system answers <strong>“which one / how much / what happens next?”</strong> A generative system answers <strong>“make me something new.”</strong></>,
  real: <>Predictive products usually return a class, probability, ranking or numeric estimate. Generative products produce variable-length artifacts such as text, images, audio or code.</>,
  expert: <>The distinction is primarily task- and interface-level, not an absolute model taxonomy. Autoregressive generative models themselves perform conditional next-token prediction repeatedly to construct an output sequence.</>,
};

const outputTasks = [
  { id: "churn", icon: "📉", title: "Churn probability: 78%", answer: "predictive" as Job, why: "The product returns a score about an outcome." },
  { id: "image", icon: "🎨", title: "Create a new poster", answer: "generative" as Job, why: "The requested output is a new artifact." },
  { id: "intent", icon: "🏷️", title: "Intent = billing", answer: "predictive" as Job, why: "The output is a constrained label." },
  { id: "email", icon: "✉️", title: "Draft a reply", answer: "generative" as Job, why: "The system composes new language." },
  { id: "fraud", icon: "🛡️", title: "Risk score + investigator note", answer: "hybrid" as Job, why: "A predictive score feeds a generated explanation/work artifact." },
  { id: "forecast", icon: "📊", title: "Tomorrow demand = 1,240", answer: "predictive" as Job, why: "The product estimates a future numeric value." },
];

const tokenSteps = [
  { prefix: "The new AI assistant", candidates: [["can", 48], ["will", 27], ["helps", 15], ["is", 10]] },
  { prefix: "The new AI assistant can", candidates: [["summarize", 41], ["help", 32], ["read", 17], ["quickly", 10]] },
  { prefix: "The new AI assistant can summarize", candidates: [["documents", 45], ["meetings", 31], ["text", 16], ["anything", 8]] },
  { prefix: "The new AI assistant can summarize documents", candidates: [["and", 52], [".", 19], ["for", 17], ["while", 12]] },
  { prefix: "The new AI assistant can summarize documents and", candidates: [["draft", 46], ["answer", 25], ["extract", 18], ["organize", 11]] },
] as const;

const productScenarios = [
  { id: "sales", icon: "💰", title: "Forecast next month's sales", answer: "predictive" as Job, note: "Estimate a numeric future outcome." },
  { id: "logo", icon: "🖼️", title: "Create campaign artwork", answer: "generative" as Job, note: "Produce a new visual artifact." },
  { id: "support", icon: "🎧", title: "Draft a support response", answer: "generative" as Job, note: "Compose variable-length language." },
  { id: "fraud2", icon: "💳", title: "Score fraud risk, then write analyst context", answer: "hybrid" as Job, note: "Prediction drives a generated work product." },
  { id: "demand", icon: "📦", title: "Estimate tomorrow's inventory demand", answer: "predictive" as Job, note: "Return a forecast/value." },
  { id: "triage", icon: "🏥", title: "Estimate case urgency, then draft a handoff note", answer: "hybrid" as Job, note: "Conceptually combines a risk/priority estimate with generation; real clinical systems require rigorous validation and human oversight." },
];

const failureCards = [
  { id: "false-positive", title: "False positive", desc: "Predictive system flags a safe case as risky.", bucket: "predictive" as Job },
  { id: "calibration", title: "Poor calibration", desc: "A displayed 90% score does not behave like 90% in reality.", bucket: "predictive" as Job },
  { id: "drift", title: "Data drift", desc: "The world changes and old predictive relationships weaken.", bucket: "predictive" as Job },
  { id: "hallucination", title: "Hallucination", desc: "Generated content confidently introduces unsupported information.", bucket: "generative" as Job },
  { id: "instruction", title: "Instruction failure", desc: "Generated artifact ignores format, tone or constraints.", bucket: "generative" as Job },
  { id: "cascade", title: "Error cascade", desc: "A bad prediction feeds a generator, which turns it into a polished but wrong downstream artifact.", bucket: "hybrid" as Job },
] as const;

const quizQuestions = [
  { q: "What does a predictive AI product usually return?", options: ["Only images", "A label, score, ranking, probability or numeric estimate", "A new database", "Always a paragraph"], correct: 1, why: "Predictive product outputs are usually constrained estimates about a class, value, ordering or future outcome." },
  { q: "What makes a product generative?", options: ["It uses a GPU", "It produces a new artifact such as text, image, audio or code", "It has more parameters", "It never predicts probabilities"], correct: 1, why: "Generation is about constructing new output content rather than only returning a fixed label/value." },
  { q: "Does an autoregressive LLM stop being predictive because it generates text?", options: ["Yes", "No — it repeatedly predicts a distribution over the next token and uses those predictions to build text", "Only at low temperature", "Only during training"], correct: 1, why: "This is the central nuance: product-level generation can be implemented through repeated next-token prediction." },
  { q: "A churn score of 0.82 is…", options: ["Generative output", "Predictive output", "Neither because it is a number", "Always deep learning"], correct: 1, why: "It estimates an outcome/probability rather than creating a new artifact." },
  { q: "A system first scores fraud risk, then drafts an investigator summary. Best description?", options: ["Predictive only", "Generative only", "Hybrid predictive + generative workflow", "Not AI"], correct: 2, why: "One component estimates risk; another generates language around the case." },
  { q: "Can the same foundation model be used in a predictive-style and generative-style product flow?", options: ["No", "Yes — for example constrained classification output versus free-form generation", "Only if retrained from scratch", "Only on images"], correct: 1, why: "Model capability and product task are distinct. A general model can be constrained into labels/JSON or allowed to generate longer artifacts." },
  { q: "Which failure is especially associated with generative outputs?", options: ["False positive rate only", "Hallucinated unsupported content", "No possible failures", "Arithmetic overflow only"], correct: 1, why: "Generative systems can create fluent but unsupported content, while predictive systems are often evaluated with errors such as false positives, calibration and drift." },
] as const;

function getDepth(copy: DepthCopy, depth: ExplanationDepth) { return copy[depth]; }

function SectionHeading({ number, kicker, title, copy }: { number:string; kicker:string; title:string; copy:ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{copy}</p></div></div>;
}

function Predi({ active=false }: { active?:boolean }) {
  return <motion.div className={styles.predi} animate={{y:active?[0,-10,0]:[0,-5,0],rotate:[0,-1,1,0]}} transition={{duration:active?1.5:3,repeat:Infinity}}><div><i/><i/><strong>78</strong><span>%</span></div><b>PREDI</b></motion.div>;
}
function Geni({ active=false }: { active?:boolean }) {
  return <motion.div className={styles.geni} animate={{y:active?[0,-9,0]:[0,-5,0],scale:active?[1,1.04,1]:[1,1.02,1]}} transition={{duration:active?1.6:3.2,repeat:Infinity}}><div><i/><i/><strong>✦</strong><motion.span animate={{height:active?[40,72,40]:52}} transition={{duration:1.8,repeat:Infinity}}/></div><b>GENI</b></motion.div>;
}

function Quiz({progress,unlocked}:{progress:LessonProgressApi;unlocked:boolean}){
  const [answers,setAnswers]=useState<Record<number,number>>({}); const [submitted,setSubmitted]=useState(false);
  const answered=Object.keys(answers).length; const score=quizQuestions.reduce((n,q,i)=>n+(answers[i]===q.correct?1:0),0); const passed=score>=6;
  if(!unlocked)return <div className={styles.quizLock}><motion.span animate={{rotate:[-4,4,-4],scale:[1,1.08,1]}} transition={{duration:2,repeat:Infinity}}>🔒</motion.span><h3>Final quiz locked.</h3><p>Run every machine and finish all nine tasks first.</p></div>;
  const submit=()=>{if(answered===quizQuestions.length){setSubmitted(true);progress.saveQuiz(score,passed)}};
  return <div className={styles.quiz}>{quizQuestions.map((q,i)=><div className={styles.question} key={q.q}><h3><span>{i+1}</span>{q.q}</h3><div>{q.options.map((o,j)=><motion.button whileTap={{scale:.97}} disabled={submitted} key={o} onClick={()=>setAnswers(a=>({...a,[i]:j}))} className={`${answers[i]===j?styles.selected:""} ${submitted&&j===q.correct?styles.correct:""} ${submitted&&answers[i]===j&&j!==q.correct?styles.wrong:""}`}><i>{String.fromCharCode(65+j)}</i>{o}</motion.button>)}</div>{submitted&&<p>{q.why}</p>}</div>)}{!submitted?<button className={`${styles.submit} tactile`} disabled={answered!==quizQuestions.length} onClick={submit}>CHECK MY MODEL →</button>:<motion.div className={`${styles.result} ${passed?styles.pass:styles.fail}`} initial={{scale:.9}} animate={{scale:1}}><strong>{score}/7</strong><div><h3>{passed?"Two jobs. One clear mental model.":"Repair the confusion."}</h3><p>{passed?"You can separate product-level prediction from generation — while remembering that generation can be built from repeated predictions.":"Pass is 6/7. Read the explanations and try again."}</p></div>{!passed&&<button onClick={()=>{setAnswers({});setSubmitted(false)}}>TRY AGAIN</button>}</motion.div>}</div>;
}

export function GenerativeVsPredictiveLesson({progress}:Props){
  const reducedMotion=useReducedMotion();
  const [machineRuns,setMachineRuns]=useState<string[]>([]);
  const [shapeChoices,setShapeChoices]=useState<Record<string,Job>>({});
  const [tokenIndex,setTokenIndex]=useState(0); const [tokens,setTokens]=useState<string[]>([]); const [chosenCandidate,setChosenCandidate]=useState(0);
  const [usage,setUsage]=useState(72); const [tickets,setTickets]=useState(3); const [late,setLate]=useState(1); const [scoreTouched,setScoreTouched]=useState<string[]>([]);
  const [tone,setTone]=useState("friendly"); const [length,setLength]=useState(2); const [temperature,setTemperature]=useState(.5); const [genRuns,setGenRuns]=useState(0); const [draft,setDraft]=useState("");
  const [modelModes,setModelModes]=useState<string[]>([]);
  const [patternChoices,setPatternChoices]=useState<Record<string,Job>>({});
  const [failureChoices,setFailureChoices]=useState<Record<string,Job>>({});
  const [explanation,setExplanation]=useState(""); const [feedback,setFeedback]=useState("");

  const shapesCorrect=outputTasks.every(x=>shapeChoices[x.id]===x.answer);
  const patternsCorrect=productScenarios.every(x=>patternChoices[x.id]===x.answer);
  const failuresCorrect=failureCards.every(x=>failureChoices[x.id]===x.bucket);
  const churnScore=useMemo(()=>Math.max(3,Math.min(96,Math.round((100-usage)*.48+tickets*7.5+late*14))),[usage,tickets,late]);

  useEffect(()=>{if(machineRuns.includes("predictive")&&machineRuns.includes("generative"))progress.completeTask("run-two-machines")},[machineRuns,progress]);
  useEffect(()=>{if(shapesCorrect)progress.completeTask("sort-output-shapes")},[shapesCorrect,progress]);
  useEffect(()=>{if(tokens.length>=5)progress.completeTask("token-factory")},[tokens.length,progress]);
  useEffect(()=>{if(["usage","tickets","late"].every(x=>scoreTouched.includes(x)))progress.completeTask("predictive-score")},[scoreTouched,progress]);
  useEffect(()=>{if(genRuns>=3)progress.completeTask("generation-controls")},[genRuns,progress]);
  useEffect(()=>{if(modelModes.includes("classify")&&modelModes.includes("generate"))progress.completeTask("same-model-modes")},[modelModes,progress]);
  useEffect(()=>{if(patternsCorrect)progress.completeTask("choose-product-pattern")},[patternsCorrect,progress]);
  useEffect(()=>{if(failuresCorrect)progress.completeTask("compare-failures")},[failuresCorrect,progress]);

  const required=generativePredictiveSections.map(s=>s.taskId); const tasksDone=required.filter(id=>progress.completedTasks[id]).length; const sectionsRead=generativePredictiveSections.filter(s=>progress.visitedSections.has(s.id)).length; const quizUnlocked=tasksDone===9&&sectionsRead===9;
  const markMode=(m:string)=>setModelModes(s=>s.includes(m)?s:[...s,m]);
  const markSlider=(m:string)=>setScoreTouched(s=>s.includes(m)?s:[...s,m]);
  const runMachine=(m:string)=>setMachineRuns(s=>s.includes(m)?s:[...s,m]);

  const chooseNextToken=()=>{if(tokenIndex>=tokenSteps.length)return; const step=tokenSteps[tokenIndex]; const word=step.candidates[chosenCandidate]?.[0]??step.candidates[0][0]; setTokens(t=>[...t,String(word)]); setTokenIndex(i=>i+1); setChosenCandidate(0)};
  const generateDraft=()=>{const open=tone==="formal"?"Thank you for contacting us.":tone==="bold"?"Good news — we can fix this fast.":"Thanks for reaching out — I can help with that."; const middle=length===1?" I'll check the billing issue now.":length===2?" I can see why the duplicate charge is frustrating. I'll check the billing history and the latest payment status now.":" I can see why the duplicate charge is frustrating. I'll review the billing history, payment status, and any duplicate authorization so we can give you a clear next step."; const spice=temperature>.75?[" Here's the fastest path forward."," Let's untangle it together."," I'll make this easy to follow."][genRuns%3]:""; setDraft(open+middle+spice); setGenRuns(n=>n+1)};
  const submitExplain=()=>{const t=explanation.toLowerCase();const hits=["predict","label","score","probability","generate","content","token","artifact","next"].filter(k=>t.includes(k));if(explanation.trim().length<85){setFeedback("Use at least three sentences: what predictive products output, what generative products output, and why an LLM generator still predicts internally.");return}if(hits.length<5){setFeedback("Add the mechanism: scores/labels for prediction; new content/artifacts for generation; repeated next-token prediction inside an autoregressive LLM.");return}setFeedback("Exactly. You separated the product job from the model's internal prediction mechanism.");progress.completeTask("explain-gen-pred")};

  return <main className={`${styles.lesson} lesson-main`}>
    <div className={styles.ambient} aria-hidden="true"><motion.i animate={reducedMotion?undefined:{rotate:360}} transition={{duration:16,repeat:Infinity,ease:"linear"}}/><motion.i animate={reducedMotion?undefined:{y:[0,22,0],rotate:[-8,8,-8]}} transition={{duration:6,repeat:Infinity}}/><motion.i animate={reducedMotion?undefined:{scale:[1,1.1,1]}} transition={{duration:4,repeat:Infinity}}/></div>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · LESSON 04</span><h1>Predict<br/><em>or</em><br/>Generate?</h1><p>{getDepth(introCopy,progress.depth)}</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><div className={styles.heroNote}><b>ONE CRITICAL NUANCE</b><span>A text generator can generate by repeatedly predicting what comes next.</span></div></div><div className={styles.heroStage}><Predi/><div className={styles.vs}>↔</div><Geni/><motion.span className={styles.scoreSlip} animate={reducedMotion?undefined:{y:[0,-8,0]}} transition={{duration:2.4,repeat:Infinity}}>RISK<br/><b>0.78</b></motion.span><motion.span className={styles.textSlip} animate={reducedMotion?undefined:{x:[0,8,0]}} transition={{duration:2.8,repeat:Infinity}}>“Thanks for<br/>reaching out…”</motion.span></div></section>

    <LessonSection id="two-machines" onVisit={progress.markVisited} className={styles.sceneOne}><SectionHeading number="01" kicker="SAME INPUT · TWO JOBS" title="Feed the same message into two machines." copy={<>The input can be identical. What changes is <strong>the job we ask the system to do.</strong></>}/><div className={styles.twoMachines}><div className={styles.inputCard}><span>INCOMING CUSTOMER MESSAGE</span><p>“I was charged twice and if this is not fixed today I'm cancelling.”</p></div><div className={styles.machineGrid}><button className={machineRuns.includes("predictive")?styles.ran:""} onClick={()=>runMachine("predictive")}><Predi active={machineRuns.includes("predictive")}/><strong>PREDICTIVE JOB</strong><span>Estimate churn / urgency</span><AnimatePresence>{machineRuns.includes("predictive")&&<motion.div initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}><b>CHURN RISK 82%</b><small>intent: billing · urgency: high</small></motion.div>}</AnimatePresence></button><button className={machineRuns.includes("generative")?styles.ran:""} onClick={()=>runMachine("generative")}><Geni active={machineRuns.includes("generative")}/><strong>GENERATIVE JOB</strong><span>Draft a useful reply</span><AnimatePresence>{machineRuns.includes("generative")&&<motion.div initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}><b>“I'm sorry about the duplicate charge…”</b><small>new variable-length text</small></motion.div>}</AnimatePresence></button></div></div><TaskStamp done={Boolean(progress.completedTasks["run-two-machines"])}>Run both machines on the same message.</TaskStamp></LessonSection>

    <LessonSection id="output-shapes" onVisit={progress.markVisited} className={styles.sceneTwo}><SectionHeading number="02" kicker="CLASSIFY · CLICK" title="Look at the shape of the output." copy={<>A fast first clue: is the product returning a constrained <strong>estimate</strong>, constructing a new <strong>artifact</strong>, or doing both?</>}/><div className={styles.jobLegend}><span>PREDICTIVE</span><span>GENERATIVE</span><span>HYBRID</span></div><div className={styles.outputGrid}>{outputTasks.map(item=>{const c=shapeChoices[item.id];return <motion.article key={item.id} className={`${styles.outputCard} ${c?(c===item.answer?styles.good:styles.bad):""}`} whileHover={{y:-4}}><i>{item.icon}</i><h3>{item.title}</h3><p>{c?item.why:"Commit before the explanation appears."}</p><div>{(["predictive","generative","hybrid"] as Job[]).map(j=><button key={j} className={c===j?styles.active:""} onClick={()=>setShapeChoices(s=>({...s,[item.id]:j}))}>{j==="predictive"?"PRED":j==="generative"?"GEN":"BOTH"}</button>)}</div></motion.article>})}</div><TaskStamp done={Boolean(progress.completedTasks["sort-output-shapes"])}>Classify all six outputs correctly.</TaskStamp></LessonSection>

    <LessonSection id="token-factory" onVisit={progress.markVisited} className={styles.sceneThree}><SectionHeading number="03" kicker="CLICK · BUILD" title="Generation can be repeated prediction." copy={<>Watch an autoregressive text generator grow a sentence <strong>one predicted token at a time.</strong></>}/><div className={styles.tokenFactory}><div className={styles.conveyor}><span className={styles.seed}>The new AI assistant</span>{tokens.map((t,i)=><motion.span key={`${t}-${i}`} initial={{scale:.6,y:-20,rotate:-8}} animate={{scale:1,y:0,rotate:i%2?1:-1}}>{t}</motion.span>)}<i/></div><div className={styles.tokenConsole}>{tokenIndex<tokenSteps.length?<><div className={styles.contextLine}><small>CURRENT CONTEXT</small><strong>{tokenSteps[tokenIndex].prefix}</strong></div><div className={styles.candidates}>{tokenSteps[tokenIndex].candidates.map(([word,pct],i)=><button key={word} className={chosenCandidate===i?styles.candidateActive:""} onClick={()=>setChosenCandidate(i)}><span>{word}</span><i><b style={{width:`${pct}%`}}/></i><strong>{pct}%</strong></button>)}</div><button className={`${styles.nextToken} tactile`} onClick={chooseNextToken}>USE THIS NEXT-TOKEN PREDICTION →</button></>:<div className={styles.sentenceDone}><Geni active/><strong>Sentence constructed.</strong><p>The product feels generative because it created a new sequence. Mechanically, each step used a prediction distribution conditioned on what came before.</p></div>}</div></div><TaskStamp done={Boolean(progress.completedTasks["token-factory"])}>Choose five next-token predictions and build the output.</TaskStamp></LessonSection>

    <LessonSection id="prediction-lab" onVisit={progress.markVisited} className={styles.sceneFour}><SectionHeading number="04" kicker="SLIDE · SCORE" title="A predictive product compresses evidence into an estimate." copy={<>Move all three customer features and watch the churn score change. This is a toy scoring function, not a production model.</>}/><div className={styles.scoreLab}><div className={styles.featurePanel}><label>PRODUCT USAGE <strong>{usage}%</strong><input type="range" min="0" max="100" value={usage} onChange={e=>{setUsage(Number(e.target.value));markSlider("usage")}}/></label><label>SUPPORT TICKETS <strong>{tickets}</strong><input type="range" min="0" max="10" value={tickets} onChange={e=>{setTickets(Number(e.target.value));markSlider("tickets")}}/></label><label>LATE PAYMENTS <strong>{late}</strong><input type="range" min="0" max="5" value={late} onChange={e=>{setLate(Number(e.target.value));markSlider("late")}}/></label></div><div className={styles.scoreGauge}><Predi active/><span>CHURN RISK</span><motion.strong key={churnScore} initial={{scale:.75}} animate={{scale:1}}>{churnScore}%</motion.strong><i><motion.b animate={{width:`${churnScore}%`}}/></i><p>One compact estimate. A real predictive system would need data quality checks, validation, calibration and monitoring.</p></div></div><TaskStamp done={Boolean(progress.completedTasks["predictive-score"])}>Move usage, tickets and late-payment sliders.</TaskStamp></LessonSection>

    <LessonSection id="generation-lab" onVisit={progress.markVisited} className={styles.sceneFive}><SectionHeading number="05" kicker="CONTROL · GENERATE" title="A generator has a much larger output space." copy={<>Change tone, length and randomness. Then produce at least three drafts to feel how many valid outputs can exist for one input.</>}/><div className={styles.genLab}><div className={styles.genControls}><div><span>TONE</span>{["friendly","formal","bold"].map(v=><button key={v} className={tone===v?styles.active:""} onClick={()=>setTone(v)}>{v.toUpperCase()}</button>)}</div><label>LENGTH <strong>{length===1?"SHORT":length===2?"MEDIUM":"LONG"}</strong><input type="range" min="1" max="3" step="1" value={length} onChange={e=>setLength(Number(e.target.value))}/></label><label>TEMPERATURE <strong>{temperature.toFixed(2)}</strong><input type="range" min="0" max="1" step=".05" value={temperature} onChange={e=>setTemperature(Number(e.target.value))}/></label><button className={`${styles.generateButton} tactile`} onClick={generateDraft}>✦ GENERATE DRAFT</button></div><div className={styles.paperOut}><Geni active={Boolean(draft)}/><span>OUTPUT #{genRuns||"—"}</span><AnimatePresence mode="wait"><motion.p key={draft||"empty"} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>{draft||"Your generated customer response will print here."}</motion.p></AnimatePresence><small>{genRuns}/3 required generations</small></div></div><TaskStamp done={Boolean(progress.completedTasks["generation-controls"])}>Generate at least three outputs while experimenting with controls.</TaskStamp></LessonSection>

    <LessonSection id="same-model" onVisit={progress.markVisited} className={styles.sceneSix}><SectionHeading number="06" kicker="SAME MODEL · DIFFERENT CONTRACT" title="Model capability and product job are different layers." copy={<>A general language model can be wrapped in a constrained classification interface or a free-form generation interface.</>}/><div className={styles.sameModel}><div className={styles.modelCore}><span>FOUNDATION MODEL</span><strong>LANGUAGE MODEL</strong><div>same learned weights</div></div><button onClick={()=>markMode("classify")} className={modelModes.includes("classify")?styles.modeDone:""}><span>MODE A</span><strong>CONSTRAIN OUTPUT</strong><code>{`{"sentiment":"negative","urgency":"high"}`}</code><small>predictive-style product contract</small></button><button onClick={()=>markMode("generate")} className={modelModes.includes("generate")?styles.modeDone:""}><span>MODE B</span><strong>ALLOW FREE-FORM OUTPUT</strong><p>“I understand the duplicate charge is urgent. I'll help you check it now…”</p><small>generative-style product contract</small></button></div><div className={styles.layerNote}><b>Important:</b><span>This does not mean every predictive model is generative or every generator is the same architecture. It means product behavior depends on both model capability and the wrapper/contract around it.</span></div><TaskStamp done={Boolean(progress.completedTasks["same-model-modes"])}>Run the same conceptual language model in both output modes.</TaskStamp></LessonSection>

    <LessonSection id="choose-pattern" onVisit={progress.markVisited} className={styles.sceneSeven}><SectionHeading number="07" kicker="PRODUCT ARCHITECT · CLICK" title="Choose Predictive, Generative or Hybrid." copy={<>Think about what the product must output — and whether a prediction should feed a generator.</>}/><div className={styles.patternGrid}>{productScenarios.map(item=>{const c=patternChoices[item.id];return <motion.article key={item.id} className={`${styles.patternCard} ${c?(c===item.answer?styles.good:styles.bad):""}`} whileHover={{rotate:.4,y:-4}}><i>{item.icon}</i><h3>{item.title}</h3><p>{c?item.note:"Choose a system pattern."}</p><div>{(["predictive","generative","hybrid"] as Job[]).map(j=><button key={j} className={c===j?styles.active:""} onClick={()=>setPatternChoices(s=>({...s,[item.id]:j}))}>{j==="predictive"?"PREDICT":j==="generative"?"GENERATE":"HYBRID"}</button>)}</div></motion.article>})}</div><TaskStamp done={Boolean(progress.completedTasks["choose-product-pattern"])}>Design all six product patterns correctly.</TaskStamp></LessonSection>

    <LessonSection id="failure-modes" onVisit={progress.markVisited} className={styles.sceneEight}><SectionHeading number="08" kicker="SORT · DIAGNOSE" title="The failure vocabulary changes too." copy={<>Prediction errors and generation errors overlap in production systems, but knowing their characteristic failure modes helps you choose evals and guardrails.</>}/><div className={styles.failureBoard}><div className={styles.failureLegend}><span>PREDICTIVE</span><span>GENERATIVE</span><span>HYBRID / PIPELINE</span></div>{failureCards.map(card=>{const c=failureChoices[card.id];return <div className={`${styles.failureRow} ${c?(c===card.bucket?styles.good:styles.bad):""}`} key={card.id}><div><strong>{card.title}</strong><p>{card.desc}</p></div><div>{(["predictive","generative","hybrid"] as Job[]).map(j=><button key={j} className={c===j?styles.active:""} onClick={()=>setFailureChoices(s=>({...s,[card.id]:j}))}>{j==="predictive"?"PRED":j==="generative"?"GEN":"PIPE"}</button>)}</div></div>})}</div><TaskStamp done={Boolean(progress.completedTasks["compare-failures"])}>Assign all six failure modes to the most useful bucket.</TaskStamp></LessonSection>

    <LessonSection id="explain-gen-pred" onVisit={progress.markVisited} className={styles.sceneNine}><SectionHeading number="09" kicker="TYPE · TEACH" title="Explain the paradox: “generation is prediction.”" copy={<>Explain the difference at the product level, then explain how a text generator can still predict one token at a time internally.</>}/><div className={styles.explainLab}><div className={styles.listener}><span>🤔</span><p>“If ChatGPT predicts the next token… why do we call it generative AI?”</p></div><div><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="A predictive product usually returns... A generative product instead... An autoregressive LLM generates by..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback&&<motion.p className={progress.completedTasks["explain-gen-pred"]?styles.feedbackGood:styles.feedbackHint} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>{feedback}</motion.p>}</div></div><TaskStamp done={Boolean(progress.completedTasks["explain-gen-pred"])}>Explain predictive vs generative and the next-token mechanism.</TaskStamp></LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked?styles.openGate:""}><span>QUIZ</span><strong>{quizUnlocked?"OPEN":"LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 04 QUIZ</span><h2>Prediction or generation?</h2><p>Pass 6/7. You should be able to separate the product job from the model mechanism.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><span>MENTAL MODEL</span><h2>Predictive = estimate. Generative = construct.</h2><p>And an autoregressive generator can construct by repeating a prediction step over and over.</p></div><Link href="/lessons/ai-ml-dl">← LESSON 03</Link><div><small>NEXT</small><strong>Symbolic vs Neural AI</strong><span>build queue</span></div></section>
  </main>;
}
