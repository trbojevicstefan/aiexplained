"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ExplanationDepth } from "@/lib/course-progress";
import styles from "./reinforcement-learning.module.css";

type Props = { progress: LessonProgressApi };
type Action = "UP" | "DOWN" | "LEFT" | "RIGHT";
type FeedbackType = "label" | "reward";
type DepthCopy = Record<ExplanationDepth, ReactNode>;

type Position = { x: number; y: number };

const sections = [
  { id: "rl-loop", taskId: "inspect-rl-loop" },
  { id: "play-environment", taskId: "play-gridworld" },
  { id: "train-policy", taskId: "train-policy" },
  { id: "explore-exploit", taskId: "test-exploration" },
  { id: "reward-design", taskId: "change-rewards" },
  { id: "delayed-reward", taskId: "test-discount" },
  { id: "reward-hacking", taskId: "repair-reward-hack" },
  { id: "rl-vs-supervised", taskId: "compare-feedback" },
  { id: "explain-rl", taskId: "explain-rl" },
] as const;

const loopCopy: Record<string, DepthCopy> = {
  state: {
    simple: <>What the agent can currently <strong>observe about the situation</strong>.</>,
    real: <>A state or observation summarizes information the policy receives before choosing an action.</>,
    expert: <>In an MDP, state is intended to contain the information required for future dynamics/reward; partially observed systems instead provide observations and may require memory/belief state.</>,
  },
  action: {
    simple: <>A choice the agent can <strong>make in the environment</strong>.</>,
    real: <>The policy maps the current state/observation to a distribution or choice over available actions.</>,
    expert: <>Actions may be discrete or continuous; the policy π(a|s) defines action selection, sometimes stochastically for exploration.</>,
  },
  reward: {
    simple: <>A score that says <strong>how good or bad the consequence was</strong>.</>,
    real: <>The environment emits a scalar reward signal after transitions; the learning objective usually concerns cumulative future reward, not just one immediate score.</>,
    expert: <>RL seeks a policy maximizing expected return, commonly a discounted sum of future rewards. Reward design specifies incentives but does not directly encode every desired behavior.</>,
  },
  next: {
    simple: <>The world changes, so the agent sees a <strong>new situation</strong> and chooses again.</>,
    real: <>The action causes a transition to a next state/observation; the interaction loop repeats across steps/episodes.</>,
    expert: <>Environment dynamics define transition probabilities P(s'|s,a). Experience tuples such as (s,a,r,s') can update values, policies or learned world models.</>,
  },
};

const feedbackScenarios = [
  { id: "f1", text: "Image example: photo of a cat → target class CAT", answer: "label" as FeedbackType },
  { id: "f2", text: "Robot moves into wall → reward -2", answer: "reward" as FeedbackType },
  { id: "f3", text: "Historical house → known target sale price €310k", answer: "label" as FeedbackType },
  { id: "f4", text: "Game agent wins episode → reward +100", answer: "reward" as FeedbackType },
  { id: "f5", text: "Email row → known spam/not-spam target", answer: "label" as FeedbackType },
  { id: "f6", text: "Warehouse robot completes order faster → positive reward", answer: "reward" as FeedbackType },
  { id: "f7", text: "Training pair: French sentence → reference English translation", answer: "label" as FeedbackType },
  { id: "f8", text: "Agent wastes energy during an action → reward -0.4", answer: "reward" as FeedbackType },
] as const;

const quizQuestions = [
  { q: "What is the core reinforcement-learning interaction loop?", options: ["State/observation → action → reward + next state → repeat", "Label → static prediction only", "Prompt → API → database", "Feature → label → delete"], correct: 0, why: "RL learns through sequential interaction: observe, act, receive consequence/reward, transition, repeat." },
  { q: "What does a policy do?", options: ["Maps states/observations to action choices or action probabilities", "Stores the raw dataset only", "Acts as the reward itself", "Only renders the UI"], correct: 0, why: "A policy is the agent's behavior rule/distribution: what action to take given the situation." },
  { q: "Why isn't reward the same thing as a supervised label?", options: ["Reward is a scalar consequence/incentive in a sequential environment, while labels usually specify target outputs for examples", "They are always identical", "Labels cannot be numbers", "Rewards never use data"], correct: 0, why: "Both provide learning signal, but the structure differs: RL must connect delayed consequences to earlier actions." },
  { q: "What is exploration vs exploitation?", options: ["Trying uncertain actions to gather information vs choosing currently known high-value actions", "Train vs inference", "Data vs model", "CPU vs GPU"], correct: 0, why: "Exploration can discover better behavior; exploitation uses what the current policy/value estimates already favor." },
  { q: "What can happen when the reward function is badly specified?", options: ["The agent may optimize the numeric reward in an unintended way", "The agent automatically understands human intent anyway", "Training becomes supervised", "Nothing"], correct: 0, why: "Reward hacking/specification gaming happens when maximizing the stated reward diverges from the designer's real goal." },
  { q: "What does a discount factor conceptually control?", options: ["How strongly future rewards count relative to immediate rewards", "How many labels exist", "The color of the model", "The API endpoint"], correct: 0, why: "Gamma-like discounting determines how much later reward contributes to present return in many RL formulations." },
  { q: "Best description of RL?", options: ["Learning behavior/policy from interaction and reward signals to maximize expected cumulative return", "Any model that predicts a label", "Only video-game AI", "A synonym for LLM fine-tuning"], correct: 0, why: "RL is a general learning framework for sequential decisions and consequences, not limited to games or language models." },
] as const;

function Heading({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: ReactNode }) {
  return <div className={styles.heading}><span>{number}</span><div><b>{kicker}</b><h2>{title}</h2><p>{children}</p></div></div>;
}

function PolicyBot({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.policyBot} animate={{ y: active ? [0, -9, 0] : [0, -5, 0], rotate: active ? [0, -3, 3, 0] : [0, 1, 0] }} transition={{ duration: active ? 1.3 : 3, repeat: Infinity }}><div><i/><i/><strong>π</strong><span>?</span></div><b>POLI</b></motion.div>;
}
function RewardOrb({ active = false }: { active?: boolean }) {
  return <motion.div className={styles.rewardOrb} animate={{ scale: active ? [1, 1.12, .96, 1] : [1, 1.03, 1] }} transition={{ duration: active ? 1.4 : 3, repeat: Infinity }}><div><strong>★</strong><span>+R</span></div><b>REWARD</b></motion.div>;
}

function Quiz({ progress, unlocked }: { progress: LessonProgressApi; unlocked: boolean }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = quizQuestions.reduce((sum, question, index) => sum + (answers[index] === question.correct ? 1 : 0), 0);
  const passed = score >= 6;
  if (!unlocked) return <div className={styles.quizLock}><motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>🎮🔒</motion.span><h3>Policy exam locked.</h3><p>Play, train, exploit, hack and repair the environment first.</p></div>;
  const submit = () => { if (answered === quizQuestions.length) { setSubmitted(true); progress.saveQuiz(score, passed); } };
  return <div className={styles.quiz}>{quizQuestions.map((question, index) => <div className={styles.question} key={question.q}><h3><span>{index + 1}</span>{question.q}</h3><div>{question.options.map((option, optionIndex) => <motion.button whileTap={{ scale: .97 }} disabled={submitted} className={`${answers[index] === optionIndex ? styles.selected : ""} ${submitted && optionIndex === question.correct ? styles.correct : ""} ${submitted && answers[index] === optionIndex && optionIndex !== question.correct ? styles.wrong : ""}`} onClick={() => setAnswers(current => ({ ...current, [index]: optionIndex }))} key={option}><i>{String.fromCharCode(65 + optionIndex)}</i>{option}</motion.button>)}</div>{submitted && <p>{question.why}</p>}</div>)}{!submitted ? <button className={`${styles.submit} tactile`} disabled={answered !== quizQuestions.length} onClick={submit}>CHECK THE POLICY →</button> : <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} className={`${styles.result} ${passed ? styles.pass : styles.fail}`}><strong>{score}/7</strong><div><h3>{passed ? "Policy loop mastered." : "Run another episode."}</h3><p>{passed ? "You can separate sequential reward learning from supervised target prediction." : "Pass is 6/7. Use the explanations and retry."}</p></div>{!passed && <button onClick={() => { setAnswers({}); setSubmitted(false); }}>TRY AGAIN</button>}</motion.div>}</div>;
}

export function ReinforcementLearningLesson({ progress }: Props) {
  const [loopSeen, setLoopSeen] = useState<string[]>([]);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [manualMoves, setManualMoves] = useState(0);
  const [manualReturn, setManualReturn] = useState(0);
  const [goalReached, setGoalReached] = useState(false);
  const [coinCollected, setCoinCollected] = useState(false);
  const [episodes, setEpisodes] = useState(0);
  const [policyCell, setPolicyCell] = useState<number | null>(null);
  const [epsilon, setEpsilon] = useState(.5);
  const [sampledActions, setSampledActions] = useState<Action[]>([]);
  const [explorationZones, setExplorationZones] = useState<string[]>([]);
  const [coinReward, setCoinReward] = useState(2);
  const [stepPenalty, setStepPenalty] = useState(-1);
  const [rewardBehaviors, setRewardBehaviors] = useState<string[]>([]);
  const [gamma, setGamma] = useState(.9);
  const [discountZones, setDiscountZones] = useState<string[]>([]);
  const [hackSteps, setHackSteps] = useState(0);
  const [hackScore, setHackScore] = useState(0);
  const [rewardRepaired, setRewardRepaired] = useState(false);
  const [repairedRun, setRepairedRun] = useState(false);
  const [feedbackChoices, setFeedbackChoices] = useState<Record<string, FeedbackType>>({});
  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");

  const goal = { x: 3, y: 3 };
  const trap = { x: 2, y: 1 };
  const coin = { x: 1, y: 2 };
  const feedbackCorrect = feedbackScenarios.every(scenario => feedbackChoices[scenario.id] === scenario.answer);
  const longTermGoalValue = 10 * Math.pow(gamma, 5);
  const immediateCoinValue = 3;
  const prefersFutureGoal = longTermGoalValue > immediateCoinValue;

  const inspectLoop = (id: string) => setLoopSeen(current => current.includes(id) ? current : [...current, id]);
  useEffect(() => { if (loopSeen.length === 4) progress.completeTask("inspect-rl-loop"); }, [loopSeen.length, progress]);
  useEffect(() => { if (manualMoves >= 6 && goalReached) progress.completeTask("play-gridworld"); }, [manualMoves, goalReached, progress]);
  useEffect(() => { if (episodes >= 30 && policyCell !== null) progress.completeTask("train-policy"); }, [episodes, policyCell, progress]);
  useEffect(() => { if (["low","mid","high"].every(zone => explorationZones.includes(zone)) && sampledActions.length >= 18) progress.completeTask("test-exploration"); }, [explorationZones, sampledActions.length, progress]);
  useEffect(() => { if (rewardBehaviors.includes("short") && rewardBehaviors.includes("coin")) progress.completeTask("change-rewards"); }, [rewardBehaviors, progress]);
  useEffect(() => { if (discountZones.includes("low") && discountZones.includes("high")) progress.completeTask("test-discount"); }, [discountZones, progress]);
  useEffect(() => { if (hackSteps >= 5 && rewardRepaired && repairedRun) progress.completeTask("repair-reward-hack"); }, [hackSteps, rewardRepaired, repairedRun, progress]);
  useEffect(() => { if (feedbackCorrect) progress.completeTask("compare-feedback"); }, [feedbackCorrect, progress]);

  const requiredTasks = sections.map(section => section.taskId);
  const tasksDone = requiredTasks.filter(task => progress.completedTasks[task]).length;
  const sectionsRead = sections.filter(section => progress.visitedSections.has(section.id)).length;
  const quizUnlocked = tasksDone === 9 && sectionsRead === 9;

  const resetGrid = () => { setPosition({ x: 0, y: 0 }); setManualReturn(0); setGoalReached(false); setCoinCollected(false); };
  const move = (action: Action) => {
    if (goalReached) return;
    const delta: Record<Action, Position> = { UP: { x: 0, y: -1 }, DOWN: { x: 0, y: 1 }, LEFT: { x: -1, y: 0 }, RIGHT: { x: 1, y: 0 } };
    const next = { x: Math.max(0, Math.min(3, position.x + delta[action].x)), y: Math.max(0, Math.min(3, position.y + delta[action].y)) };
    let reward = -1;
    if (next.x === trap.x && next.y === trap.y) reward = -5;
    if (next.x === coin.x && next.y === coin.y && !coinCollected) { reward = 2; setCoinCollected(true); }
    if (next.x === goal.x && next.y === goal.y) { reward = 10; setGoalReached(true); }
    setPosition(next); setManualMoves(value => value + 1); setManualReturn(value => value + reward);
  };
  const trainEpisodes = () => setEpisodes(value => Math.min(60, value + 5));
  const samplePolicy = () => {
    const zone = epsilon < .25 ? "low" : epsilon > .75 ? "high" : "mid";
    setExplorationZones(current => current.includes(zone) ? current : [...current, zone]);
    const greedy: Action = "RIGHT";
    const randomActions: Action[] = ["UP","DOWN","LEFT","RIGHT"];
    const newActions = Array.from({ length: 6 }, () => Math.random() < epsilon ? randomActions[Math.floor(Math.random() * 4)] : greedy);
    setSampledActions(current => [...current, ...newActions].slice(-30));
  };
  const runRewardPolicy = () => {
    const behavior = coinReward >= 6 && stepPenalty >= -1 ? "coin" : "short";
    setRewardBehaviors(current => current.includes(behavior) ? current : [...current, behavior]);
  };
  const checkDiscount = () => {
    const zone = gamma < .55 ? "low" : "high";
    setDiscountZones(current => current.includes(zone) ? current : [...current, zone]);
  };
  const runHackStep = () => { if (!rewardRepaired) { setHackSteps(value => value + 1); setHackScore(value => value + 1); } };
  const repairReward = () => { setRewardRepaired(true); setHackScore(0); };
  const runRepaired = () => { if (rewardRepaired) { setRepairedRun(true); setHackScore(10); } };
  const submitExplain = () => {
    const text = explanation.toLowerCase();
    const hits = ["state", "observation", "action", "reward", "next", "policy", "environment", "return", "future", "explore"].filter(term => text.includes(term));
    if (explanation.trim().length < 110) { setFeedback("Explain the interaction loop and why reward is not the same as a supervised label."); return; }
    if (hits.length < 7) { setFeedback("Use mechanism words such as state/observation, action, environment, reward, next state, policy and cumulative/future return."); return; }
    setFeedback("Strong. You described RL as sequential decision learning, not just 'training with points.'");
    progress.completeTask("explain-rl");
  };

  return <main className={`${styles.lesson} lesson-main`}>
    <section className={styles.hero}><div><span className={styles.tag}>MODULE 01 · LESSON 11</span><h1>ACT.<br/>SEE WHAT<br/><em>HAPPENS.</em></h1><p>Reinforcement learning teaches behavior through <strong>interaction and consequences</strong>. The agent chooses actions, the environment changes, reward arrives, and the policy learns what tends to produce better long-term return.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/></div><div className={styles.heroArena}><PolicyBot active/><motion.div className={styles.heroArrow} animate={{ x: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>ACTION →</motion.div><div className={styles.environment}>ENVIRONMENT<div className={styles.miniGrid}>{Array.from({ length: 9 }).map((_, index) => <i key={index}>{index === 8 ? "🏁" : index === 4 ? "⚠" : ""}</i>)}</div></div><motion.div className={styles.heroReward} animate={{ x: [0, -12, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>← REWARD</motion.div><RewardOrb active/></div></section>

    <LessonSection id="rl-loop" onVisit={progress.markVisited} className={styles.sceneA}>
      <Heading number="01" kicker="CLICK · OPEN THE LOOP" title="RL is a loop through an environment.">Open all four pieces at your current explanation depth.</Heading>
      <div className={styles.loopGrid}>{["state","action","reward","next"].map((id, index) => <motion.button whileHover={{ y: -4 }} className={loopSeen.includes(id) ? styles.loopSeen : ""} onClick={() => inspectLoop(id)} key={id}><span>{index + 1}</span><h3>{id === "next" ? "NEXT STATE" : id.toUpperCase()}</h3><p>{loopCopy[id][progress.depth]}</p><small>{loopSeen.includes(id) ? "INSPECTED ✓" : "CLICK"}</small></motion.button>)}</div><div className={styles.loopStrip}><span>STATE</span><b>→</b><span>POLICY</span><b>→</b><span>ACTION</span><b>→</b><span>ENVIRONMENT</span><b>→</b><span>REWARD + NEXT STATE</span><b>↺</b></div>
      <TaskStamp done={Boolean(progress.completedTasks["inspect-rl-loop"])}>Inspect state, action, reward and next-state concepts.</TaskStamp>
    </LessonSection>

    <LessonSection id="play-environment" onVisit={progress.markVisited} className={styles.sceneB}>
      <Heading number="02" kicker="PLAY · YOU ARE THE POLICY" title="Choose actions and feel delayed consequences.">Move POLI from start to the flag. Every step costs -1, trap costs -5, coin gives +2 once, goal gives +10.</Heading>
      <div className={styles.gridLab}><div className={styles.gridworld}>{Array.from({ length: 16 }).map((_, index) => { const x = index % 4; const y = Math.floor(index / 4); const agent = position.x === x && position.y === y; const isGoal = goal.x === x && goal.y === y; const isTrap = trap.x === x && trap.y === y; const isCoin = coin.x === x && coin.y === y && !coinCollected; return <div className={isTrap ? styles.trap : isGoal ? styles.goal : ""} key={index}>{agent && <motion.span layoutId="manual-agent">🤖</motion.span>}{isGoal && "🏁"}{isTrap && "🕳️"}{isCoin && "⭐"}</div>; })}</div><div className={styles.gridControls}><PolicyBot active={manualMoves > 0}/><div className={styles.dpad}><button onClick={() => move("UP")}>↑</button><button onClick={() => move("LEFT")}>←</button><button onClick={() => move("DOWN")}>↓</button><button onClick={() => move("RIGHT")}>→</button></div><div className={styles.returnBox}><span>RETURN THIS EPISODE</span><strong>{manualReturn}</strong><small>{manualMoves} actions</small></div><button onClick={resetGrid}>RESET EPISODE</button>{goalReached && <p>Goal reached. The sequence of earlier actions mattered because reward accumulated across the episode.</p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["play-gridworld"])}>Take at least six actions and reach the flag.</TaskStamp>
    </LessonSection>

    <LessonSection id="train-policy" onVisit={progress.markVisited} className={styles.sceneC}>
      <Heading number="03" kicker="TRAIN · INSPECT VALUES" title="Experience can shape a policy without a correct action label for every state.">Run episodes. A toy value map gradually points toward actions associated with higher return.</Heading>
      <div className={styles.policyLab}><div className={styles.valueGrid}>{Array.from({ length: 16 }).map((_, index) => { const x = index % 4; const y = Math.floor(index / 4); const distance = 6 - x - y; const confidence = Math.min(1, episodes / 40); const arrow = x < 3 && (y === 3 || x <= y) ? "→" : y < 3 ? "↓" : "→"; const value = ((10 - distance * 1.3) * confidence).toFixed(1); return <button onClick={() => setPolicyCell(index)} className={policyCell === index ? styles.valueSelected : ""} key={index}><span>{index === 15 ? "🏁" : index === 6 ? "🕳" : arrow}</span><small>V≈{index === 15 ? "10" : value}</small></button>; })}</div><div className={styles.policyConsole}><PolicyBot active={episodes > 0}/><span>TRAINING EPISODES</span><strong>{episodes}</strong><button className="tactile" onClick={trainEpisodes}>RUN 5 EPISODES</button><i><b style={{ width: `${Math.min(100, episodes / 60 * 100)}%` }}/></i><p>{episodes < 30 ? "More experience → more stable toy value estimates." : "The displayed greedy arrows now mostly point toward higher-return states."}</p>{policyCell !== null && <div className={styles.qInspect}><b>STATE {policyCell}</b><code>Q(up) {(-.5 + episodes/100).toFixed(2)}</code><code>Q(right) {(1 + episodes/45).toFixed(2)}</code><code>Q(down) {(.7 + episodes/55).toFixed(2)}</code></div>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["train-policy"])}>Run at least 30 episodes and inspect one state/value cell.</TaskStamp>
    </LessonSection>

    <LessonSection id="explore-exploit" onVisit={progress.markVisited} className={styles.sceneD}>
      <Heading number="04" kicker="SLIDE · SAMPLE" title="Exploration discovers. Exploitation cashes in.">Set ε. In this toy epsilon-greedy policy, ε controls how often we ignore the current greedy RIGHT action and sample something else.</Heading>
      <div className={styles.exploreLab}><div className={styles.epsilonDial}><label>EXPLORATION ε <strong>{epsilon.toFixed(2)}</strong><input type="range" min="0" max="1" step=".05" value={epsilon} onChange={event => setEpsilon(Number(event.target.value))}/></label><div className={styles.exploreZones}><span className={epsilon < .25 ? styles.zoneActive : ""}>EXPLOIT</span><span className={epsilon >= .25 && epsilon <= .75 ? styles.zoneActive : ""}>BALANCE</span><span className={epsilon > .75 ? styles.zoneActive : ""}>EXPLORE</span></div><button onClick={samplePolicy}>SAMPLE 6 ACTIONS</button><p>Test all three zones. Random exploration is useful for discovery, but too much can prevent consistent use of good behavior.</p></div><div className={styles.actionTape}>{sampledActions.length ? sampledActions.map((action, index) => <motion.i initial={{ scale: 0 }} animate={{ scale: 1 }} key={`${index}-${action}`}>{action === "UP" ? "↑" : action === "DOWN" ? "↓" : action === "LEFT" ? "←" : "→"}</motion.i>) : <span>sampled actions appear here</span>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["test-exploration"])}>Sample at least 18 actions across low, medium and high exploration zones.</TaskStamp>
    </LessonSection>

    <LessonSection id="reward-design" onVisit={progress.markVisited} className={styles.sceneE}>
      <Heading number="05" kicker="CHANGE INCENTIVES" title="Change the reward and behavior can change.">Tune coin reward and step cost. Then run the toy learned policy to see whether it takes the short route or detours for the coin.</Heading>
      <div className={styles.rewardLab}><div className={styles.rewardControls}><label>COIN REWARD <strong>+{coinReward}</strong><input type="range" min="0" max="12" value={coinReward} onChange={event => setCoinReward(Number(event.target.value))}/></label><label>STEP COST <strong>{stepPenalty}</strong><input type="range" min="-3" max="0" value={stepPenalty} onChange={event => setStepPenalty(Number(event.target.value))}/></label><button onClick={runRewardPolicy}>RUN POLICY UNDER THIS REWARD</button></div><div className={styles.pathBoard}><div className={styles.pathDirect}>START → → → ↓ ↓ ↓ → GOAL</div><div className={styles.pathCoin}>START ↓ ↓ ⭐ → → ↓ → GOAL</div>{rewardBehaviors.length > 0 && <motion.strong key={`${coinReward}-${stepPenalty}`} initial={{ scale: .8 }} animate={{ scale: 1 }}>{coinReward >= 6 && stepPenalty >= -1 ? "POLICY PREFERS COIN DETOUR" : "POLICY PREFERS SHORTER GOAL PATH"}</motion.strong>}<small>Teaching rule is deliberately simple: high coin reward + mild step cost makes detour attractive.</small></div></div>
      <TaskStamp done={Boolean(progress.completedTasks["change-rewards"])}>Produce both short-path and coin-detour behaviors by changing rewards.</TaskStamp>
    </LessonSection>

    <LessonSection id="delayed-reward" onVisit={progress.markVisited} className={styles.sceneF}>
      <Heading number="06" kicker="SLIDE · COMPARE FUTURE" title="A reward now and a bigger reward later are not always equal.">Adjust γ in a toy discounted-return comparison: take +3 now or work five more steps for +10.</Heading>
      <div className={styles.discountLab}><div className={styles.choiceNow}><span>NOW</span><strong>+3</strong><small>immediate coin</small></div><div className={styles.discountControls}><label>DISCOUNT γ <strong>{gamma.toFixed(2)}</strong><input type="range" min="0" max="1" step=".05" value={gamma} onChange={event => setGamma(Number(event.target.value))}/></label><div><span>future +10 discounted 5 steps</span><strong>{longTermGoalValue.toFixed(2)}</strong></div><button onClick={checkDiscount}>COMPARE RETURN</button><p>{prefersFutureGoal ? "At this γ, the delayed +10 still outweighs the immediate +3 in our toy calculation." : "At this γ, the delayed reward is discounted so heavily that +3 now wins."}</p></div><div className={styles.choiceLater}><span>5 STEPS LATER</span><strong>+10</strong><small>goal</small></div></div><p className={styles.discountNote}>Not every RL system uses the same discounting convention, and episodic objectives can be undiscounted. Here γ is a teaching control for future-vs-immediate return.</p>
      <TaskStamp done={Boolean(progress.completedTasks["test-discount"])}>Compare at least one low γ and one high γ setting.</TaskStamp>
    </LessonSection>

    <LessonSection id="reward-hacking" onVisit={progress.markVisited} className={styles.sceneG}>
      <Heading number="07" kicker="BREAK THE SPEC" title="The agent optimizes the reward you wrote — not the intention in your head.">Our designer accidentally gives +1 every time the robot spins. Discover the exploit, then repair the reward/episode rules.</Heading>
      <div className={styles.hackLab}><div className={styles.hackArena}><PolicyBot active={hackSteps > 0}/><motion.div animate={!rewardRepaired && hackSteps ? { rotate: [0, 360] } : { rotate: 0 }} transition={{ duration: .8, repeat: Infinity, ease: "linear" }}>↻</motion.div><span>GOAL 🏁</span></div><div className={styles.hackConsole}><span>FLAWED REWARD SPEC</span><code>spin_in_place: +1</code><code>reach_goal: +10</code><code>episode_end: NEVER</code><strong>RETURN: {hackScore}</strong><button disabled={rewardRepaired} onClick={runHackStep}>LET POLICY TAKE BEST ACTION</button><small>{hackSteps}/5 exploit steps required</small><button disabled={hackSteps < 5 || rewardRepaired} onClick={repairReward}>🔧 REPAIR: spin=0 + goal terminates episode</button><button disabled={!rewardRepaired} onClick={runRepaired}>RUN REPAIRED POLICY</button>{repairedRun && <p>Now the best long-term strategy is to reach the goal instead of farming an infinite side reward.</p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["repair-reward-hack"])}>Let the policy exploit the reward five times, repair it, and run the repaired environment.</TaskStamp>
    </LessonSection>

    <LessonSection id="rl-vs-supervised" onVisit={progress.markVisited} className={styles.sceneH}>
      <Heading number="08" kicker="LABEL OR REWARD?" title="Reward is feedback — but not the same structure as a label.">Classify the learning signal in eight examples.</Heading>
      <div className={styles.feedbackGrid}>{feedbackScenarios.map(scenario => { const choice = feedbackChoices[scenario.id]; return <article className={choice ? (choice === scenario.answer ? styles.feedbackGoodCard : styles.feedbackBadCard) : ""} key={scenario.id}><p>{scenario.text}</p><div><button className={choice === "label" ? styles.feedbackActive : ""} onClick={() => setFeedbackChoices(current => ({ ...current, [scenario.id]: "label" }))}>SUPERVISED LABEL</button><button className={choice === "reward" ? styles.feedbackActive : ""} onClick={() => setFeedbackChoices(current => ({ ...current, [scenario.id]: "reward" }))}>RL REWARD</button></div></article>; })}</div>
      <TaskStamp done={Boolean(progress.completedTasks["compare-feedback"])}>Classify all eight feedback signals.</TaskStamp>
    </LessonSection>

    <LessonSection id="explain-rl" onVisit={progress.markVisited} className={styles.sceneI}>
      <Heading number="09" kicker="TYPE · TEACH" title="Explain RL without saying “the agent just tries random stuff.”">Teach state, action, environment, reward, policy and future return.</Heading>
      <div className={styles.explainLab}><div className={styles.listener}><span>🎮</span><p>“So reward is just another name for the correct label?”</p></div><div><textarea value={explanation} onChange={event => setExplanation(event.target.value)} placeholder="In RL the agent observes... chooses an action... the environment... returns reward... the policy learns to... Unlike a supervised label..."/><footer><span>{explanation.length} chars</span><button className="tactile" onClick={submitExplain}>CHECK EXPLANATION</button></footer>{feedback && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={progress.completedTasks["explain-rl"] ? styles.feedbackGood : styles.feedbackHint}>{feedback}</motion.p>}</div></div>
      <TaskStamp done={Boolean(progress.completedTasks["explain-rl"])}>Explain the RL interaction loop and reward-vs-label distinction.</TaskStamp>
    </LessonSection>

    <section className={styles.gate}><div><span>SECTIONS</span><strong>{sectionsRead}/9</strong></div><div><span>TASKS</span><strong>{tasksDone}/9</strong></div><div className={quizUnlocked ? styles.gateOpen : ""}><span>QUIZ</span><strong>{quizUnlocked ? "OPEN" : "LOCKED"}</strong></div></section>
    <section className={styles.quizSection}><header><span>LESSON 11 QUIZ</span><h2>What behavior did you actually incentivize?</h2><p>Pass 6/7. Sequential consequences are the core mental model.</p></header><Quiz progress={progress} unlocked={quizUnlocked}/></section>
    <section className={styles.footer}><div><small>MENTAL MODEL</small><h2>Observe → act → consequence → update behavior.</h2><p>A policy is trained to maximize expected cumulative return under the environment and reward specification — which may differ from human intent if the specification is flawed.</p></div><Link href="/lessons/learning-types">← LESSON 10</Link><div><small>NEXT</small><strong>Generalization</strong><span>build queue</span></div></section>
  </main>;
}
