"use client";

import Link from "next/link";
import { AnimatePresence, motion, Reorder, useReducedMotion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { aiMlDlSections } from "@/content/course";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./ai-ml-dl.module.css";

type Props = { progress: LessonProgressApi };
type Level = "ai" | "ml" | "dl";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

const levelCopy: Record<Level, DepthCopy> = {
  ai: {
    simple: <>The biggest umbrella: computers doing tasks that look like they need intelligence.</>,
    real: <>AI is the broad field. It includes hand-written reasoning/search systems <strong>and</strong> systems that learn from data.</>,
    expert: <>Artificial intelligence is the umbrella discipline spanning symbolic reasoning, search, planning, probabilistic methods, machine learning and modern neural approaches.</>,
  },
  ml: {
    simple: <>A smaller room inside AI: the computer learns useful behavior from examples or experience.</>,
    real: <>Machine learning is an approach to AI where model parameters are fitted from data instead of specifying every decision rule by hand.</>,
    expert: <>ML optimizes parameterized models against data/objectives, covering linear models, trees, kernels, ensembles, neural networks, reinforcement learning and more.</>,
  },
  dl: {
    simple: <>A smaller room inside ML: learning with neural networks made of many stacked transformation layers.</>,
    real: <>Deep learning is machine learning based on multi-layer neural networks that learn increasingly useful internal representations.</>,
    expert: <>Deep neural architectures compose many differentiable transformations and learn distributed representations end-to-end, commonly optimized through gradient-based methods.</>,
  },
};

const sortItems = [
  { id: "chess", icon: "♟️", title: "Search-based chess program", answer: "ai" as Level, why: "A search/planning system can be AI without learning its behavior from data." },
  { id: "expert", icon: "🩺", title: "Hand-built medical expert rules", answer: "ai" as Level, why: "Symbolic expert systems are classic AI even when humans author the knowledge rules." },
  { id: "linear", icon: "📈", title: "Linear regression model", answer: "ml" as Level, why: "It learns parameters from data, but it is not a deep neural network." },
  { id: "tree", icon: "🌳", title: "Decision tree classifier", answer: "ml" as Level, why: "It is machine learning, but not deep learning." },
  { id: "vision", icon: "👁️", title: "Deep image recognition network", answer: "dl" as Level, why: "A multi-layer neural network makes this deep learning — which is also ML and AI." },
  { id: "llm", icon: "💬", title: "Large language model", answer: "dl" as Level, why: "Modern LLMs use deep transformer neural networks." },
];

const mazeCells = [0,1,2,3,4,5,6,7,8];
const allowedMoves: Record<number, number[]> = {
  0: [1,3], 1: [0,2], 2: [1,5], 3: [0,6], 4: [5,7], 5: [2,4,8], 6: [3,7], 7: [6,4,8], 8: [5,7],
};
const blocked = new Set([4]);

const neighborExamples = [
  { x: 13, label: "apple", icon: "🍎" },
  { x: 31, label: "apple", icon: "🍏" },
  { x: 66, label: "orange", icon: "🍊" },
  { x: 86, label: "orange", icon: "🍊" },
] as const;

const layerNames = [
  { n: 1, title: "Pixels", icon: "▦", copy: "Raw brightness/color values." },
  { n: 2, title: "Edges", icon: "╱", copy: "Simple local changes and boundaries." },
  { n: 3, title: "Textures", icon: "▒", copy: "Repeated visual patterns." },
  { n: 4, title: "Parts", icon: "◔", copy: "Combinations that resemble eyes, wheels, corners…" },
  { n: 5, title: "Objects", icon: "🐕", copy: "Higher-level structures become easier to separate." },
  { n: 6, title: "Meaning", icon: "✦", copy: "Useful task-specific representation for the final prediction." },
] as const;

const approachData = {
  symbolic: { title: "Symbolic / rules AI", data: 18, compute: 16, explain: 92, adapt: 28, copy: "Humans encode logic and knowledge. Great when rules are clear and auditability matters." },
  classic: { title: "Classic ML", data: 55, compute: 38, explain: 62, adapt: 67, copy: "Learns patterns with models such as regression, trees, SVMs or boosting." },
  deep: { title: "Deep learning", data: 90, compute: 92, explain: 30, adapt: 94, copy: "Learns layered representations and shines on rich inputs like language, images, audio and video." },
} as const;

type Approach = keyof typeof approachData;

const myths = [
  { front: "All AI is machine learning.", back: "FALSE", note: "Search, planning and symbolic rule systems can be AI without learning parameters from data." },
  { front: "All machine learning is deep learning.", back: "FALSE", note: "Linear regression, trees, random forests, SVMs and many other methods are ML but not deep learning." },
  { front: "All deep learning is machine learning.", back: "TRUE", note: "Deep learning is a subset of machine learning." },
  { front: "Modern LLMs are deep learning systems.", back: "TRUE", note: "They are large deep neural networks, usually transformer-based." },
] as const;

const quizQuestions = [
  { q: "Which is the broadest category?", options: ["Deep Learning", "Machine Learning", "Artificial Intelligence", "Neural Networks"], correct: 2, why: "AI is the broad umbrella. ML is one family of approaches inside AI, and deep learning is inside ML." },
  { q: "Can something be AI without machine learning?", options: ["No", "Yes — for example search, planning or symbolic expert systems", "Only games", "Only robots"], correct: 1, why: "AI existed long before modern ML. Search and symbolic reasoning are important examples." },
  { q: "Which is machine learning but not deep learning?", options: ["A decision tree", "A large transformer LLM", "A deep CNN", "A hand-written IF/THEN expert system"], correct: 0, why: "Decision trees learn from data, so they are ML, but they are not deep neural networks." },
  { q: "Why is deep learning called deep?", options: ["It thinks deeply", "It always gives longer answers", "It uses multiple learned layers of representation", "It runs underground"], correct: 2, why: "Depth refers to stacked computational/representation layers, not human-style depth of thought." },
  { q: "A modern LLM is best placed where?", options: ["AI only, outside ML", "ML but outside DL", "Inside Deep Learning, therefore also inside ML and AI", "Outside AI"], correct: 2, why: "The nested categories accumulate: deep learning systems are also ML systems and AI systems." },
  { q: "Which statement is most precise?", options: ["AI, ML and DL are three competitor technologies", "They are nested concepts with different scopes", "ML replaced AI", "Deep learning and AI are synonyms"], correct: 1, why: "They describe different levels of scope, not three mutually exclusive product categories." },
  { q: "When might classic ML beat deep learning?", options: ["Never", "When tabular data is limited and a simpler, cheaper, more interpretable model works well", "Only without a CPU", "Only for images"], correct: 1, why: "Deep learning is powerful, but more complexity is not automatically better for every dataset or operational constraint." },
] as const;

function SectionHeading({ number, kicker, title, copy }: { number: string; kicker: string; title: string; copy: ReactNode }) {
  return <div className={styles.sectionHeading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{copy}</p></div></div>;
}

function LevelCreature({ level, active = false }: { level: Level; active?: boolean }) {
  const labels = { ai: "AURA", ml: "MILO", dl: "DEEP" };
  return (
    <motion.div className={`${styles.creature} ${styles[level]} ${active ? styles.creatureActive : ""}`} animate={{ y: active ? [0,-10,0] : [0,-5,0], rotate: active ? [0,-2,2,0] : [0,1,0] }} transition={{ duration: active ? 1.5 : 3.2, repeat: Infinity }}>
      <div className={styles.creatureBody}><i /><i /><strong>{level === "ai" ? "◎" : level === "ml" ? "~" : "≋"}</strong></div><b>{labels[level]}</b>
    </motion.div>
  );
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  const passed = score >= 6;
  const submit = () => { if (answered === quizQuestions.length) { setSubmitted(true); progress.saveQuiz(score, passed); } };

  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ scale:[1,1.08,1], rotate:[-3,3,-3] }} transition={{duration:2,repeat:Infinity}}>🔐</motion.span><h3>Hierarchy exam locked.</h3><p>Explore every zone and finish all nine interactions first.</p></div>;

  return <div className={styles.quiz}>
    {quizQuestions.map((q,i) => <div key={q.q} className={styles.q}>
      <h3><span>{i+1}</span>{q.q}</h3>
      <div>{q.options.map((option,j) => <motion.button whileTap={{scale:.97}} key={option} disabled={submitted} onClick={() => setAnswers(a=>({...a,[i]:j}))} className={`${answers[i]===j?styles.selected:""} ${submitted&&j===q.correct?styles.correct:""} ${submitted&&answers[i]===j&&j!==q.correct?styles.wrong:""}`}><i>{String.fromCharCode(65+j)}</i>{option}</motion.button>)}</div>
      {submitted && <p>{q.why}</p>}
    </div>)}
    {!submitted ? <button disabled={answered!==quizQuestions.length} className={`${styles.submit} tactile`} onClick={submit}>CHECK THE HIERARCHY →</button> : <motion.div className={`${styles.result} ${passed?styles.pass:styles.fail}`} initial={{scale:.9}} animate={{scale:1}}><strong>{score}/7</strong><div><h3>{passed?"Hierarchy mastered.":"One more pass."}</h3><p>{passed?"You can now place AI, ML and deep learning correctly without collapsing them into synonyms.":"Passing score is 6/7. Read each explanation and retry."}</p></div>{!passed&&<button onClick={()=>{setAnswers({});setSubmitted(false)}}>TRY AGAIN</button>}</motion.div>}
  </div>;
}

export function AiMlDlLesson({ progress }: Props) {
  const reducedMotion = useReducedMotion();
  const [zoneDepth, setZoneDepth] = useState(0);
  const [sortChoices, setSortChoices] = useState<Record<string,Level>>({});
  const [mazePos, setMazePos] = useState(0);
  const [mazeMoves, setMazeMoves] = useState(0);
  const [mysteryX, setMysteryX] = useState(50);
  const [neighborSamples, setNeighborSamples] = useState(0);
  const [seenLayers, setSeenLayers] = useState<number[]>([1]);
  const [layer, setLayer] = useState(1);
  const [approach, setApproach] = useState<Approach>("symbolic");
  const [seenApproaches, setSeenApproaches] = useState<Approach[]>(["symbolic"]);
  const [hierarchy, setHierarchy] = useState(["Deep Learning","AI","Machine Learning"]);
  const [flippedMyths, setFlippedMyths] = useState<number[]>([]);
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const sortedCorrect = sortItems.every(item => sortChoices[item.id] === item.answer);
  const hierarchyCorrect = hierarchy.join("|") === "AI|Machine Learning|Deep Learning";

  const nearest = useMemo(() => neighborExamples.reduce((best,item)=>Math.abs(item.x-mysteryX)<Math.abs(best.x-mysteryX)?item:best, neighborExamples[0]), [mysteryX]);

  useEffect(()=>{ if(zoneDepth>=3) progress.completeTask("enter-zones"); },[zoneDepth,progress]);
  useEffect(()=>{ if(sortedCorrect) progress.completeTask("sort-spectrum"); },[sortedCorrect,progress]);
  useEffect(()=>{ if(mazePos===8 && mazeMoves>0) progress.completeTask("solve-symbolic"); },[mazePos,mazeMoves,progress]);
  useEffect(()=>{ if(neighborSamples>=3) progress.completeTask("nearest-neighbor"); },[neighborSamples,progress]);
  useEffect(()=>{ if(seenLayers.length===6) progress.completeTask("layer-elevator"); },[seenLayers.length,progress]);
  useEffect(()=>{ if(seenApproaches.length===3) progress.completeTask("compare-approaches"); },[seenApproaches.length,progress]);
  useEffect(()=>{ if(hierarchyCorrect) progress.completeTask("hierarchy-build"); },[hierarchyCorrect,progress]);
  useEffect(()=>{ if(flippedMyths.length===myths.length) progress.completeTask("myth-flips"); },[flippedMyths.length,progress]);

  const required = aiMlDlSections.map(s=>s.taskId);
  const tasksDone = required.filter(id=>progress.completedTasks[id]).length;
  const sectionsRead = aiMlDlSections.filter(s=>progress.visitedSections.has(s.id)).length;
  const quizUnlocked = tasksDone===required.length && sectionsRead===aiMlDlSections.length;

  const enterZone = (target:number) => { if(target<=zoneDepth+1) setZoneDepth(Math.max(zoneDepth,target)); };
  const chooseApproach = (a:Approach) => { setApproach(a); setSeenApproaches(s=>s.includes(a)?s:[...s,a]); };
  const visitLayer = (n:number) => { setLayer(n); setSeenLayers(s=>s.includes(n)?s:[...s,n]); };
  const moveMaze = (next:number) => { if(!blocked.has(next) && allowedMoves[mazePos]?.includes(next)){ setMazePos(next); setMazeMoves(m=>m+1); } };
  const submitExplain = () => {
    const t=explanation.toLowerCase(); const hits=["ai","machine learning","deep learning","subset","inside","umbrella","learn","neural","rule","search"].filter(k=>t.includes(k));
    if(explanation.trim().length<80){setFeedback("Use at least three short sentences: define AI, then ML, then deep learning and how they nest.");return;}
    if(hits.length<5){setFeedback("Include the hierarchy and mechanism: AI umbrella, ML learns from data, deep learning uses multi-layer neural networks.");return;}
    setFeedback("Strong mental model. You explained scope and mechanism instead of treating three labels as synonyms."); progress.completeTask("explain-hierarchy");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <div className={styles.ambient} aria-hidden="true"><motion.i animate={reducedMotion?undefined:{rotate:360}} transition={{duration:18,repeat:Infinity,ease:"linear"}}/><motion.i animate={reducedMotion?undefined:{y:[0,25,0],rotate:[0,15,0]}} transition={{duration:6,repeat:Infinity}}/><motion.i animate={reducedMotion?undefined:{scale:[1,1.12,1]}} transition={{duration:4,repeat:Infinity}}/></div>

    <section className={styles.hero}>
      <div><span className={styles.tag}>MODULE 01 · LESSON 03</span><h1>AI <em>contains</em><br/>ML <em>contains</em><br/>Deep Learning.</h1><p>Three words people constantly mix up. By the end, you should be able to physically place almost any example at the right level.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div>
      <div className={styles.heroWorld}><div className={styles.heroAi}><LevelCreature level="ai"/><div className={styles.heroMl}><LevelCreature level="ml"/><div className={styles.heroDl}><LevelCreature level="dl"/></div></div></div></div>
    </section>

    <LessonSection id="nested-world" onVisit={progress.markVisited} className={styles.sceneA}>
      <SectionHeading number="01" kicker="CLICK · ENTER" title="Walk inside the hierarchy." copy={<>The categories are <strong>nested</strong>. Enter them from broadest to narrowest.</>}/>
      <div className={styles.nestedLab}>
        <button className={`${styles.zone} ${styles.zoneAi} ${zoneDepth>=1?styles.open:""}`} onClick={()=>enterZone(1)}><span>AI</span><small>the whole field</small><div className={`${styles.zone} ${styles.zoneMl} ${zoneDepth>=2?styles.open:""}`} onClick={(e)=>{e.stopPropagation();enterZone(2)}}><span>MACHINE LEARNING</span><small>learning from data</small><div className={`${styles.zone} ${styles.zoneDl} ${zoneDepth>=3?styles.open:""}`} onClick={(e)=>{e.stopPropagation();enterZone(3)}}><span>DEEP LEARNING</span><small>multi-layer neural learning</small></div></div></button>
        <div className={styles.zonePanel}>{zoneDepth===0?<><strong>Start outside.</strong><p>Click the AI world first.</p></>:<><div className={styles.creatureRow}><LevelCreature level={zoneDepth===1?"ai":zoneDepth===2?"ml":"dl"} active/></div><strong>{zoneDepth===1?"AI umbrella":zoneDepth===2?"Inside AI: Machine Learning":"Inside ML: Deep Learning"}</strong><p>{levelCopy[zoneDepth===1?"ai":zoneDepth===2?"ml":"dl"][progress.depth]}</p>{zoneDepth<3&&<button onClick={()=>enterZone(zoneDepth+1)}>GO ONE LEVEL DEEPER →</button>}</>}</div>
      </div>
      <TaskStamp done={Boolean(progress.completedTasks["enter-zones"])}>Enter AI → Machine Learning → Deep Learning in that order.</TaskStamp>
    </LessonSection>

    <LessonSection id="sort-examples" onVisit={progress.markVisited} className={styles.sceneB}>
      <SectionHeading number="02" kicker="CLASSIFY · CLICK" title="Not everything AI-shaped belongs in the deepest box." copy={<>Place each example at its <strong>most specific</strong> level.</>}/>
      <div className={styles.sortLegend}><span>AI, NOT ML</span><span>ML, NOT DL</span><span>DEEP LEARNING</span></div>
      <div className={styles.sortGrid}>{sortItems.map(item=>{const c=sortChoices[item.id];return <motion.article key={item.id} className={`${styles.sortCard} ${c?(c===item.answer?styles.sortGood:styles.sortBad):""}`} whileHover={{y:-4}}><i>{item.icon}</i><h3>{item.title}</h3><p>{c?item.why:"Commit to a level to reveal why."}</p><div>{(["ai","ml","dl"] as Level[]).map(l=><button key={l} className={c===l?styles.chosen:""} onClick={()=>setSortChoices(s=>({...s,[item.id]:l}))}>{l==="ai"?"AI":l==="ml"?"ML":"DL"}</button>)}</div></motion.article>})}</div>
      <TaskStamp done={Boolean(progress.completedTasks["sort-spectrum"])}>Place all six examples at the most specific correct level.</TaskStamp>
    </LessonSection>

    <LessonSection id="symbolic-ai" onVisit={progress.markVisited} className={styles.sceneC}>
      <SectionHeading number="03" kicker="MOVE · SEARCH" title="AI existed before models learned everything." copy={<>Guide a tiny search agent through a maze. The agent uses a <strong>state space + allowed moves</strong>, not learned neural weights.</>}/>
      <div className={styles.mazeLab}><div className={styles.maze}>{mazeCells.map(cell=><button key={cell} disabled={blocked.has(cell)} onClick={()=>moveMaze(cell)} className={`${blocked.has(cell)?styles.wall:""} ${mazePos===cell?styles.robot:""} ${cell===8?styles.goal:""}`}>{blocked.has(cell)?"██":mazePos===cell?"🤖":cell===8?"★":"·"}</button>)}</div><div className={styles.mazeInfo}><LevelCreature level="ai" active/><h3>SYMBOLIC / SEARCH AI</h3><p>The “intelligence” can come from representing possible states and searching legal actions. Nothing here needed a training dataset.</p><strong>{mazePos===8?"GOAL FOUND ✓":`state ${mazePos} · ${mazeMoves} legal moves`}</strong><button onClick={()=>{setMazePos(0);setMazeMoves(0)}}>RESET MAZE</button></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["solve-symbolic"])}>Reach the star using only legal state transitions.</TaskStamp>
    </LessonSection>

    <LessonSection id="classic-ml" onVisit={progress.markVisited} className={styles.sceneD}>
      <SectionHeading number="04" kicker="SLIDE · PREDICT" title="Machine learning does not need to be deep." copy={<>A nearest-neighbor classifier can learn from examples with <strong>zero deep neural layers</strong>.</>}/>
      <div className={styles.neighborLab}><div className={styles.numberLine}>{neighborExamples.map(e=><div key={e.x} className={styles.example} style={{left:`${e.x}%`}}><span>{e.icon}</span><small>{e.label}</small></div>)}<motion.div className={styles.mystery} animate={{left:`${mysteryX}%`}}><span>?</span></motion.div></div><div className={styles.neighborControls}><label>MYSTERY POSITION <input type="range" min="5" max="95" value={mysteryX} onChange={e=>setMysteryX(Number(e.target.value))}/></label><button className="tactile" onClick={()=>setNeighborSamples(n=>n+1)}>ASK NEAREST NEIGHBOR</button><div className={styles.prediction}><small>nearest example says</small><strong>{nearest.icon} {nearest.label.toUpperCase()}</strong><span>{neighborSamples} predictions tried</span></div><p>This is machine learning because examples influence prediction behavior. It is not deep learning because there is no deep neural representation stack.</p></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["nearest-neighbor"])}>Move the mystery point and request at least three nearest-neighbor predictions.</TaskStamp>
    </LessonSection>

    <LessonSection id="deep-learning" onVisit={progress.markVisited} className={styles.sceneE}>
      <SectionHeading number="05" kicker="SLIDE · INSPECT" title="Deep means stacked learned representations." copy={<>Ride the layer elevator. The intuition: later layers can operate on features built by earlier layers.</>}/>
      <div className={styles.elevatorLab}><div className={styles.elevatorShaft}>{layerNames.map(item=><motion.button key={item.n} className={`${styles.floor} ${layer===item.n?styles.floorActive:""} ${seenLayers.includes(item.n)?styles.floorSeen:""}`} onClick={()=>visitLayer(item.n)} whileHover={{x:5}}><span>{item.n}</span><strong>{item.title}</strong></motion.button>)}<motion.div className={styles.elevatorCar} animate={{bottom:`${8+(layer-1)*14.8}%`}} transition={{type:"spring",stiffness:180,damping:22}}>↕</motion.div></div><div className={styles.layerDisplay}><LevelCreature level="dl" active/><div className={styles.layerIcon}>{layerNames[layer-1].icon}</div><span>LAYER {layer}</span><h3>{layerNames[layer-1].title}</h3><p>{layerNames[layer-1].copy}</p><label>RIDE THE STACK<input type="range" min="1" max="6" step="1" value={layer} onChange={e=>visitLayer(Number(e.target.value))}/></label><div className={styles.seenMeter}>{layerNames.map(l=><i key={l.n} className={seenLayers.includes(l.n)?styles.seen:""}/>)}</div></div></div>
      <div className={styles.deepWarning}><strong>“Deep” does not mean conscious, wise or reasoning deeply.</strong><p>It describes architecture depth: many transformations/layers between input and output.</p></div>
      <TaskStamp done={Boolean(progress.completedTasks["layer-elevator"])}>Inspect all six representation floors.</TaskStamp>
    </LessonSection>

    <LessonSection id="tradeoffs" onVisit={progress.markVisited} className={styles.sceneF}>
      <SectionHeading number="06" kicker="COMPARE · SWITCH" title="More modern is not automatically more appropriate." copy={<>Inspect three approaches. Every extra capability comes with different data, compute, explainability and adaptation tradeoffs.</>}/>
      <div className={styles.tradeLab}><div className={styles.approachTabs}>{(Object.keys(approachData) as Approach[]).map(a=><button key={a} className={approach===a?styles.activeApproach:""} onClick={()=>chooseApproach(a)}>{a==="symbolic"?"SYMBOLIC AI":a==="classic"?"CLASSIC ML":"DEEP LEARNING"}</button>)}</div><motion.div key={approach} className={styles.tradePanel} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><div><span>EMAIL ROUTING SYSTEM</span><h3>{approachData[approach].title}</h3><p>{approachData[approach].copy}</p></div><div className={styles.meters}>{[["DATA NEED",approachData[approach].data],["COMPUTE",approachData[approach].compute],["EXPLAINABILITY",approachData[approach].explain],["ADAPTABILITY",approachData[approach].adapt]].map(([name,value])=><div key={String(name)}><span>{name}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</div></motion.div></div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-approaches"])}>Inspect symbolic AI, classic ML and deep learning.</TaskStamp>
    </LessonSection>

    <LessonSection id="build-hierarchy" onVisit={progress.markVisited} className={styles.sceneG}>
      <SectionHeading number="07" kicker="DRAG · ORDER" title="Build the nesting from memory." copy={<>Arrange broadest → narrowest. If you can do this instantly, the vocabulary stops being slippery.</>}/>
      <div className={styles.reorderWrap}><Reorder.Group axis="y" values={hierarchy} onReorder={setHierarchy}>{hierarchy.map((item,index)=><Reorder.Item key={item} value={item} className={`${styles.reorderItem} ${hierarchyCorrect?styles.reorderCorrect:""}`} whileDrag={{scale:1.04,rotate:1}}><span>{index+1}</span><strong>{item}</strong><small>drag</small></Reorder.Item>)}</Reorder.Group><div className={styles.hierarchyHint}>{hierarchyCorrect?<><strong>✓ AI → Machine Learning → Deep Learning</strong><p>Each inner category inherits the outer labels.</p></>:<><strong>Broadest first.</strong><p>Ask: can this category include systems that are not in the next category?</p></>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["hierarchy-build"])}>Drag the hierarchy into AI → ML → Deep Learning.</TaskStamp>
    </LessonSection>

    <LessonSection id="myths" onVisit={progress.markVisited} className={styles.sceneH}>
      <SectionHeading number="08" kicker="FLIP · DESTROY" title="Four myths that wreck AI conversations." copy={<>Flip every card. The goal is to stop using AI, ML and deep learning as interchangeable marketing words.</>}/>
      <div className={styles.mythGrid}>{myths.map((myth,index)=>{const flipped=flippedMyths.includes(index);return <button key={myth.front} onClick={()=>setFlippedMyths(s=>s.includes(index)?s:[...s,index])} className={`${styles.myth} ${flipped?styles.mythFlipped:""}`}><motion.div animate={{rotateY:flipped?180:0}} transition={{duration:.45}}><div className={styles.mythFront}><span>MYTH {index+1}</span><strong>{myth.front}</strong><small>click to flip</small></div><div className={styles.mythBack}><span>{myth.back}</span><p>{myth.note}</p></div></motion.div></button>})}</div>
      <TaskStamp done={Boolean(progress.completedTasks["myth-flips"])}>Flip all four myth cards.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-hierarchy" onVisit={progress.markVisited} className={styles.sceneI}>
      <SectionHeading number="09" kicker="TYPE · TEACH" title="Explain all three without circular definitions." copy={<>Your answer should make clear that AI is broad, ML learns behavior from data, and deep learning is ML using deep neural networks.</>}/>
      <div className={styles.explainLab}><div className={styles.listener}><span>🧑‍🚀</span><p>“So… AI, machine learning and deep learning are basically the same thing, right?”</p></div><div><textarea value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="AI is the broad... Machine learning is inside it because... Deep learning is a subset of ML that..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK MY MENTAL MODEL</button></footer>{feedback&&<motion.p className={progress.completedTasks["explain-hierarchy"]?styles.feedbackGood:styles.feedbackHint} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-hierarchy"])}>Teach the hierarchy in your own words.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked?styles.gateOpen:""}><span>QUIZ</span><strong>{quizUnlocked?"OPEN":"LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 03 QUIZ</span><h2>Where does it belong?</h2><p>Pass 6 of 7. The hierarchy should now feel obvious, not memorized.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>

    <section className={styles.footer}><div><span>MENTAL MODEL</span><h2>AI ⊃ ML ⊃ Deep Learning</h2><p>Deep learning is machine learning. Machine learning is AI. But AI does not have to be ML, and ML does not have to be deep.</p></div><Link href="/lessons/ai-vs-software">← LESSON 02</Link><div><small>NEXT</small><strong>Generative vs Predictive</strong><span>build queue</span></div></section>
  </main>;
}
