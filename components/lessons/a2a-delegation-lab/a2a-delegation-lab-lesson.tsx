"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./a2a-delegation-lab.module.css";

type Props = { progress: LessonProgressApi };
type TaskState = "draft" | "submitted" | "working" | "input-required" | "completed";

type AgentCard = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  auth: string;
  accent: string;
  endpoint: string;
};

const agents: AgentCard[] = [
  { id: "research", name: "Scout", role: "Research specialist", skills: ["web_research", "source_summary", "citation_pack"], auth: "signed service identity", accent: "#70c9ff", endpoint: "https://agents.example/research" },
  { id: "sales", name: "Nova", role: "Sales specialist", skills: ["account_research", "lead_brief", "crm_note"], auth: "workspace OAuth delegation", accent: "#ff9fc8", endpoint: "https://agents.example/sales" },
  { id: "code", name: "Patch", role: "Coding specialist", skills: ["repo_search", "patch", "test_report"], auth: "ephemeral repo scope", accent: "#9fe870", endpoint: "https://agents.example/code" },
];

const protocolCases = [
  ["Expose a local filesystem capability to one desktop agent", "mcp"],
  ["Delegate a research task to a remote research-agent service", "a2a"],
  ["Call Stripe's REST endpoint from application code", "api"],
  ["Let a model request create_invoice with typed arguments", "tool"],
] as const;

const identityCases = [
  ["Agent Card says 'finance expert', but endpoint certificate belongs to an unknown host.", "reject"],
  ["Known partner agent presents expected service identity and task-scoped authorization.", "allow"],
  ["Agent requests permanent admin token for a one-off summary task.", "reduce-scope"],
] as const;

const marketplaceCases = [
  ["Directory advertises capabilities", "discovery"],
  ["Signed identity proves which service answered", "identity"],
  ["Task contract defines requested output and constraints", "contract"],
  ["Runtime decides whether this caller may delegate", "authorization"],
] as const;

const quiz = [
  ["Agent-to-agent delegation is mainly about…", ["One agent/service delegating a task to another agent/service with explicit capability/task semantics", "Adding more hidden layers", "Tokenizing text", "Replacing authentication"], 0],
  ["An Agent Card/capability description is useful because…", ["A caller can discover what an agent claims to do and how to contact it", "It stores model weights", "It is a training batch", "It guarantees trust automatically"], 0],
  ["Capability discovery proves that a remote agent is trustworthy.", ["True", "False"], 1],
  ["A delegated task should ideally carry…", ["Goal/input/constraints plus task identity and expected outputs", "Only a casual chat sentence", "A model checkpoint", "A tokenizer vocabulary"], 0],
  ["Why track task status?", ["Remote work may be long-running, paused, fail, request input or complete asynchronously", "Because all agents finish in one token", "To change model weights", "To avoid authentication"], 0],
  ["An artifact is best thought of as…", ["A structured output/result produced by the delegated task", "The remote agent's password", "An attention head", "A retry timer"], 0],
  ["MCP and A2A solve exactly the same integration problem.", ["True", "False"], 1],
  ["A marketplace/directory still needs identity, authorization and trust policy around discovered agents.", ["True", "False"], 0],
] as const;

export function A2aDelegationLabLesson({ progress }: Props) {
  const [whyAnswers, setWhyAnswers] = useState<Record<number, string>>({});
  const [selectedAgent, setSelectedAgent] = useState("research");
  const [seenCards, setSeenCards] = useState<string[]>([]);
  const [identityAnswers, setIdentityAnswers] = useState<Record<number, string>>({});
  const [taskState, setTaskState] = useState<TaskState>("draft");
  const [goal, setGoal] = useState("Research three credible sources about model routing and return a cited briefing.");
  const [taskId, setTaskId] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [answerToAgent, setAnswerToAgent] = useState("");
  const [statusSeen, setStatusSeen] = useState<TaskState[]>([]);
  const [artifactAccepted, setArtifactAccepted] = useState(false);
  const [marketAnswers, setMarketAnswers] = useState<Record<number, string>>({});
  const [explain, setExplain] = useState("");
  const [feedback, setFeedback] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const selected = agents.find((agent) => agent.id === selectedAgent) ?? agents[0];
  const tasks = ["a2a-why", "a2a-card", "a2a-identity", "a2a-task", "a2a-messages", "a2a-status", "a2a-artifact", "a2a-marketplace", "a2a-explain"];
  const sections = ["why", "card", "identity", "task", "messages", "status", "artifact", "marketplace", "explain"];
  const done = tasks.filter((task) => progress.completedTasks[task]).length;
  const read = sections.filter((section) => progress.visitedSections.has(section)).length;
  const unlocked = done === tasks.length && read === sections.length;

  const quizScore = quiz.reduce((sum, item, index) => sum + (quizAnswers[index] === item[2] ? 1 : 0), 0);
  const quizDone = Object.keys(quizAnswers).length === quiz.length;

  const markSeenCard = (id: string) => {
    const next = [...new Set([...seenCards, id])];
    setSeenCards(next);
    if (next.length === agents.length) progress.completeTask("a2a-card");
  };

  const createTask = () => {
    if (goal.trim().length < 35) return;
    const id = `task_${Math.random().toString(36).slice(2, 8)}`;
    setTaskId(id);
    setTaskState("submitted");
    setStatusSeen(["submitted"]);
    setMessages([`MANAGER → ${selected.name}: ${goal}`]);
    progress.completeTask("a2a-task");
  };

  const advance = () => {
    const next: Record<TaskState, TaskState> = {
      draft: "submitted",
      submitted: "working",
      working: "input-required",
      "input-required": "completed",
      completed: "completed",
    };
    const value = next[taskState];
    setTaskState(value);
    setStatusSeen((current) => {
      const merged = [...new Set([...current, value])];
      if (["submitted", "working", "input-required", "completed"].every((state) => merged.includes(state as TaskState))) progress.completeTask("a2a-status");
      return merged;
    });
    if (value === "working") setMessages((current) => [...current, `${selected.name}: Task accepted. Research started.`]);
    if (value === "input-required") setMessages((current) => [...current, `${selected.name}: I need one clarification: prioritize technical sources or business summaries?`]);
    if (value === "completed") setMessages((current) => [...current, `${selected.name}: Completed. Artifact citation_pack.json is ready.`]);
  };

  const sendClarification = () => {
    if (taskState !== "input-required" || answerToAgent.trim().length < 8) return;
    setMessages((current) => [...current, `MANAGER → ${selected.name}: ${answerToAgent}`]);
    setAnswerToAgent("");
    progress.completeTask("a2a-messages");
    advance();
  };

  const submitExplain = () => {
    const text = explain.toLowerCase();
    const hits = ["agent", "card", "capabil", "identity", "task", "status", "artifact", "delegat", "auth"].filter((word) => text.includes(word)).length;
    if (explain.trim().length < 110 || hits < 5) {
      setFeedback("Go deeper: describe discovery/Agent Card, identity + authorization, a task contract, status/messages and the returned artifact.");
      return;
    }
    setFeedback("Strong. You separated task delegation from casual chat and kept identity/authorization outside the capability claim itself.");
    progress.completeTask("a2a-explain");
  };

  const artifact = useMemo(() => ({
    task_id: taskId || "task_demo",
    type: "citation_pack",
    title: "Model-routing research briefing",
    sources: 3,
    status: taskState === "completed" ? "ready" : "pending",
  }), [taskId, taskState]);

  return <main className={styles.root}>
    <section className={styles.hero}>
      <div>
        <span className={styles.eyebrow}>MODULE 13 · A2A DELEGATION LAB</span>
        <h1>One agent should not have to become every specialist.</h1>
        <p>Learn a clean delegation mental model: <b>discover → verify → create task → exchange task-scoped messages → track status → receive artifact</b>. Capability discovery is not trust, and a chat message is not automatically a robust task contract.</p>
        <DepthSwitch value={progress.depth} onChange={progress.setDepth}/>
        <TaskStamp done={done === tasks.length}>{done}/{tasks.length} delegation missions complete</TaskStamp>
      </div>
      <div className={styles.heroNetwork}>
        <AiMascot variant="bot" accent="#6f87ff" mood={taskState === "completed" ? "excited" : "happy"} size={112} label="MANAGER"/>
        <motion.div className={styles.delegateArrow} animate={{ x: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>task →</motion.div>
        <AiMascot variant="briefcase" accent={selected.accent} mood={taskState === "working" || taskState === "input-required" ? "thinking" : taskState === "completed" ? "excited" : "happy"} size={112} label={selected.name.toUpperCase()}/>
      </div>
    </section>

    <LessonSection id="why" onVisit={progress.markVisited} className={styles.scene}>
      <h2>1. First: which boundary are you actually crossing?</h2>
      <p>Do not call every integration “agent-to-agent.” Classify the interface by what is interacting.</p>
      <div className={styles.grid2}>{protocolCases.map((item, index) => <div className={styles.panel} key={item[0]}><p>{item[0]}</p><div className={styles.buttonRow}>{["api", "tool", "mcp", "a2a"].map((choice) => <button key={choice} className={`${styles.button} ${whyAnswers[index] === choice ? (choice === item[1] ? styles.correct : styles.wrong) : ""}`} onClick={() => { const next = { ...whyAnswers, [index]: choice }; setWhyAnswers(next); if (protocolCases.every((entry, i) => next[i] === entry[1])) progress.completeTask("a2a-why"); }}>{choice.toUpperCase()}</button>)}</div></div>)}</div>
    </LessonSection>

    <LessonSection id="card" onVisit={progress.markVisited} className={styles.scene}>
      <h2>2. Discover capability cards — then inspect, do not blindly trust.</h2>
      <div className={styles.agentTabs}>{agents.map((agent) => <button key={agent.id} className={`${styles.agentTab} ${selectedAgent === agent.id ? styles.selected : ""}`} onClick={() => { setSelectedAgent(agent.id); markSeenCard(agent.id); }}><AiMascot variant={agent.id === "sales" ? "star" : agent.id === "code" ? "tile" : "briefcase"} accent={agent.accent} size={64}/><span><b>{agent.name}</b><small>{agent.role}</small></span></button>)}</div>
      <motion.div className={styles.card} key={selected.id} initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <div><span>AGENT CARD</span><h3>{selected.name}</h3><p>{selected.role}</p></div>
        <dl><div><dt>endpoint</dt><dd>{selected.endpoint}</dd></div><div><dt>auth</dt><dd>{selected.auth}</dd></div><div><dt>skills</dt><dd>{selected.skills.join(" · ")}</dd></div></dl>
      </motion.div>
      <p className={styles.note}>Inspect all three cards: {seenCards.length}/3. A card is a <b>claim/description</b>; trust still depends on identity, transport, authorization and your own policy.</p>
    </LessonSection>

    <LessonSection id="identity" onVisit={progress.markVisited} className={styles.scene}>
      <h2>3. Identity and authorization are not optional protocol garnish.</h2>
      {identityCases.map((item, index) => <div className={styles.panel} key={item[0]}><p>{item[0]}</p><div className={styles.buttonRow}>{["allow", "reject", "reduce-scope"].map((choice) => <button className={`${styles.button} ${identityAnswers[index] === choice ? (choice === item[1] ? styles.correct : styles.wrong) : ""}`} key={choice} onClick={() => { const next = { ...identityAnswers, [index]: choice }; setIdentityAnswers(next); if (identityCases.every((entry, i) => next[i] === entry[1])) progress.completeTask("a2a-identity"); }}>{choice}</button>)}</div></div>)}
    </LessonSection>

    <LessonSection id="task" onVisit={progress.markVisited} className={styles.scene}>
      <h2>4. Create a task contract, not “hey bro can you research this?”</h2>
      <div className={styles.taskBuilder}>
        <label>Delegate to <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>{agents.map((agent) => <option value={agent.id} key={agent.id}>{agent.name} · {agent.role}</option>)}</select></label>
        <label>Goal / expected result<textarea value={goal} onChange={(e) => setGoal(e.target.value)}/></label>
        <div className={styles.contractGrid}><div><b>input</b><span>topic: model routing</span></div><div><b>constraint</b><span>3 credible sources</span></div><div><b>output</b><span>citation_pack</span></div><div><b>scope</b><span>research only</span></div></div>
        <button className={styles.primary} onClick={createTask}>Create delegated task</button>
        {taskId && <code>{taskId} · {taskState}</code>}
      </div>
    </LessonSection>

    <LessonSection id="messages" onVisit={progress.markVisited} className={styles.scene}>
      <h2>5. Messages belong to a task lifecycle.</h2>
      {!taskId ? <p className={styles.warning}>Create the delegated task first.</p> : <>
        <div className={styles.chat}>{messages.map((message, index) => <motion.div key={`${message}-${index}`} initial={{ opacity: 0, x: index % 2 ? 14 : -14 }} animate={{ opacity: 1, x: 0 }}>{message}</motion.div>)}</div>
        <div className={styles.buttonRow}><button className={styles.primary} disabled={taskState === "completed"} onClick={advance}>Advance remote work</button></div>
        {taskState === "input-required" && <div className={styles.reply}><input value={answerToAgent} onChange={(e) => setAnswerToAgent(e.target.value)} placeholder="Prioritize original technical sources."/><button className={styles.primary} onClick={sendClarification}>Send task message</button></div>}
      </>}
    </LessonSection>

    <LessonSection id="status" onVisit={progress.markVisited} className={styles.scene}>
      <h2>6. Remote work needs explicit status, not hopeful polling.</h2>
      <div className={styles.statusTrack}>{(["submitted", "working", "input-required", "completed"] as TaskState[]).map((state, index) => <div key={state} className={`${styles.statusNode} ${statusSeen.includes(state) ? styles.seen : ""} ${taskState === state ? styles.current : ""}`}><span>{index + 1}</span><b>{state}</b></div>)}</div>
      <p>Long-running agent work can pause, fail, require input, resume and complete later. Task identity + status make this explicit.</p>
    </LessonSection>

    <LessonSection id="artifact" onVisit={progress.markVisited} className={styles.scene}>
      <h2>7. The final product is an artifact/result — not necessarily a chat bubble.</h2>
      <div className={`${styles.artifact} ${artifact.status === "ready" ? styles.ready : ""}`}><span>ARTIFACT</span><pre>{JSON.stringify(artifact, null, 2)}</pre></div>
      <button className={styles.primary} disabled={taskState !== "completed"} onClick={() => { setArtifactAccepted(true); progress.completeTask("a2a-artifact"); }}>Accept artifact into manager workflow</button>
      {artifactAccepted && <p className={styles.success}>✓ Artifact accepted. The manager can now synthesize it with other task results.</p>}
    </LessonSection>

    <LessonSection id="marketplace" onVisit={progress.markVisited} className={styles.scene}>
      <h2>8. Discovery service / marketplace is only one layer.</h2>
      <div className={styles.grid2}>{marketplaceCases.map((item, index) => <div className={styles.panel} key={item[0]}><p>{item[0]}</p><div className={styles.buttonRow}>{["discovery", "identity", "contract", "authorization"].map((choice) => <button className={`${styles.button} ${marketAnswers[index] === choice ? (choice === item[1] ? styles.correct : styles.wrong) : ""}`} key={choice} onClick={() => { const next = { ...marketAnswers, [index]: choice }; setMarketAnswers(next); if (marketplaceCases.every((entry, i) => next[i] === entry[1])) progress.completeTask("a2a-marketplace"); }}>{choice}</button>)}</div></div>)}</div>
      <p className={styles.note}>A marketplace can help you <b>find</b> agents; it does not remove the need to authenticate them, authorize delegation, define task contracts or evaluate results.</p>
    </LessonSection>

    <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}>
      <h2>9. Explain A2A as a systems engineer.</h2>
      <textarea value={explain} onChange={(e) => setExplain(e.target.value)} placeholder="Explain capability discovery, Agent Cards, identity/auth, task creation, task-scoped messages/status and returned artifacts. Contrast with MCP/tool/API."/>
      <button className={styles.primary} onClick={submitExplain}>Check explanation</button>
      {feedback && <p className={styles.success}>{feedback}</p>}
    </LessonSection>

    <section className={styles.quiz}>
      <h2>A2A mastery check</h2>
      {!unlocked ? <div className={styles.locked}>🔒 Complete all 9 rooms. {done}/9 tasks · {read}/9 sections.</div> : <>{quiz.map((item, index) => <div className={styles.question} key={item[0]}><strong>{index + 1}. {item[0]}</strong>{item[1].map((option, optionIndex) => <button key={option} className={quizAnswers[index] === optionIndex ? styles.selectedAnswer : ""} onClick={() => setQuizAnswers((current) => ({ ...current, [index]: optionIndex }))}>{option}</button>)}{quizAnswers[index] !== undefined && <small>{quizAnswers[index] === item[2] ? "✓ Correct" : `Correct: ${item[1][item[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={() => progress.saveQuiz(quizScore, quizScore >= 7)}>Submit · {quizScore}/8</button>{quizDone && <p className={styles.success}>{quizScore >= 7 ? "★ AGENT DELEGATION MASTERED" : "Pass is 7/8. Revisit trust, task state and MCP-vs-A2A."}</p>}</>}
    </section>

    <div className={styles.footer}><Link href="/lessons/mcp-capability-lab">← MCP Capability Lab</Link><Link href="/lessons/module-13-capstone">Protocol Boss Lab →</Link></div>
  </main>;
}
