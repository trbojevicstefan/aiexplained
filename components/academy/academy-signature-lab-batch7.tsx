"use client";

import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./academy-signature-lab.module.css";

const BATCH7 = new Set([
  "lokalno-vs-produkcija",
  "ne-veruj-agentu-na-slepo",
  "projekat-licni-ai-workspace",
  "projekat-lead-automation",
  "projekat-mcp-agent",
  "projekat-voice-appointment-agent",
  "projekat-produkcioni-ai-proizvod",
]);

export function hasAcademySignatureLabBatch7(slug: string) { return BATCH7.has(slug); }

export function AcademySignatureLabBatch7({ slug, accent, onComplete }: { slug: string; accent: string; onComplete: (done: boolean) => void }) {
  if (slug === "lokalno-vs-produkcija") return <LocalProductionLab accent={accent} onComplete={onComplete} />;
  if (slug === "ne-veruj-agentu-na-slepo") return <EvidenceLab accent={accent} onComplete={onComplete} />;
  if (slug === "projekat-licni-ai-workspace") return <WorkspaceCapstone accent={accent} onComplete={onComplete} />;
  if (slug === "projekat-lead-automation") return <LeadAutomationCapstone accent={accent} onComplete={onComplete} />;
  if (slug === "projekat-mcp-agent") return <McpAgentCapstone accent={accent} onComplete={onComplete} />;
  if (slug === "projekat-voice-appointment-agent") return <VoiceCapstone accent={accent} onComplete={onComplete} />;
  if (slug === "projekat-produkcioni-ai-proizvod") return <ProductionProductCapstone accent={accent} onComplete={onComplete} />;
  return null;
}

function Shell({ accent, title, description, done, label = "FINAL LAB", children }: { accent: string; title: string; description: string; done: boolean; label?: string; children: React.ReactNode }) {
  return <section className={styles.shell} style={{ "--lab": accent } as React.CSSProperties}>
    <header className={styles.head}>
      <div><span>{label}</span><h3>{title}</h3><p>{description}</p></div>
      <AiMascot variant={done ? "star" : "bot"} accent={accent} mood={done ? "excited" : "thinking"} size={92} label={done ? "MASTERED" : "BUILD"} />
    </header>
    {children}
    <div className={styles.doneBar} data-done={done}>{done ? "✓ Dokaz je kompletan" : "Završi sve obavezne provere"}</div>
  </section>;
}

function Sequence({ steps, index, setIndex, onComplete }: { steps: string[]; index: number; setIndex: (n: number) => void; onComplete: (done: boolean) => void }) {
  return <div className={styles.pipeline} style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, 4)}, minmax(0, 1fr))` }}>
    {steps.map((step, i) => <button key={step} data-state={i < index ? "done" : i === index ? "active" : "waiting"} onClick={() => {
      if (i !== index) return;
      const next = index + 1;
      setIndex(next);
      onComplete(next === steps.length);
    }}><span>{i < index ? "✓" : i + 1}</span><b>{step}</b><small>{i === index ? "RUN" : ""}</small></button>)}
  </div>;
}

function LocalProductionLab({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const steps = ["Pokreni localhost", "Potvrdi port", "Proveri env", "Production build", "Deploy", "Public URL", "Health + logs"];
  const [index, setIndex] = useState(0);
  return <Shell accent={accent} title="Prebaci sistem iz lokalnog sveta u produkciju bez nagađanja." description="Lokalni proces, build artifact, production runtime i javni URL su različite stvari. Svaki sloj traži svoj dokaz." done={index === steps.length} label="SIGNATURE LAB · DEPLOYMENT">
    <Sequence steps={steps} index={index} setIndex={setIndex} onComplete={onComplete} />
    <p className={styles.callout}>Ako `localhost:3000` radi, to još ne dokazuje da production environment ima iste env varijable, isti runtime ili da javni health endpoint radi.</p>
  </Shell>;
}

function EvidenceLab({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const rows = [
    { label: "Deployment je gotov", answer: "Otvori public URL + health/readback" },
    { label: "Calendar event je kreiran", answer: "Event ID + Calendar readback" },
    { label: "Workflow je aktivan", answer: "GET workflow / activation status" },
    { label: "Kod radi", answer: "Build/test output" },
    { label: "API write je uspeo", answer: "Response ID + nezavisni GET" },
  ];
  const options = rows.map(row => row.answer);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const done = rows.every((row, i) => answers[i] === row.answer);
  return <Shell accent={accent} title="Pretvori 'gotovo je' u dokaz koji može nezavisno da se proveri." description="Agentova rečenica nije stanje spoljnog sistema. Spoji svaku tvrdnju sa minimalnim dokazom." done={done} label="SIGNATURE LAB · EVIDENCE">
    <div className={styles.toolList} style={{ padding: 20 }}>{rows.map((row, i) => <div key={row.label} data-visible="true"><span>TVRDNJA</span><b>{row.label}</b><select value={answers[i] ?? ""} onChange={event => {
      const next = { ...answers, [i]: event.target.value };
      setAnswers(next);
      onComplete(rows.every((item, j) => next[j] === item.answer));
    }} style={{ padding: 8, borderRadius: 8 }}><option value="">Izaberi dokaz</option>{options.map(option => <option key={option}>{option}</option>)}</select></div>)}</div>
  </Shell>;
}

function MissionChecklist({ items, selected, setSelected, onComplete }: { items: string[]; selected: string[]; setSelected: (items: string[]) => void; onComplete: (done: boolean) => void }) {
  return <div className={styles.responseChecklist} style={{ padding: 20 }}>{items.map(item => <button key={item} data-done={selected.includes(item)} onClick={() => {
    const next = selected.includes(item) ? selected.filter(value => value !== item) : [...selected, item];
    setSelected(next);
    onComplete(next.length === items.length);
  }}><span>{selected.includes(item) ? "✓" : "○"}</span>{item}</button>)}</div>;
}

function WorkspaceCapstone({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const missions = ["Repository kreiran", "README + setup", "Website radi lokalno", "Git istorija uredna", "Deployment povezan", "Public URL provereno", "Issue za sledeću iteraciju"];
  const [doneItems, setDoneItems] = useState<string[]>([]);
  return <Shell accent={accent} title="Capstone 1 · Lični AI workspace" description="Dokaži da možeš da vodiš mali digitalni projekat od praznog foldera do javnog URL-a i sledeće iteracije." done={doneItems.length === missions.length}>
    <MissionChecklist items={missions} selected={doneItems} setSelected={setDoneItems} onComplete={onComplete} />
  </Shell>;
}

function LeadAutomationCapstone({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const stages = ["Form", "Webhook", "Validation", "AI qualification", "Sheets write", "Slack", "Email"];
  const [index, setIndex] = useState(0);
  const [idempotent, setIdempotent] = useState(false);
  const [invalidTested, setInvalidTested] = useState(false);
  const [readback, setReadback] = useState(false);
  const done = index === stages.length && idempotent && invalidTested && readback;
  const sync = (nextIndex = index, nextIdem = idempotent, nextInvalid = invalidTested, nextReadback = readback) => onComplete(nextIndex === stages.length && nextIdem && nextInvalid && nextReadback);
  return <Shell accent={accent} title="Capstone 2 · Lead automation sistem" description="End-to-end nije samo happy path: moraš dokazati validan lead, odbijen nevalidan payload i zaštitu od duplog delivery-ja." done={done}>
    <Sequence steps={stages} index={index} setIndex={n => { setIndex(n); sync(n); }} onComplete={() => {}} />
    <div className={styles.responseChecklist} style={{ padding: 20 }}>
      <button data-done={idempotent} onClick={() => { const n = !idempotent; setIdempotent(n); sync(index, n); }}><span>{idempotent ? "✓" : "○"}</span>Idempotency key sprečava dupli lead</button>
      <button data-done={invalidTested} onClick={() => { const n = !invalidTested; setInvalidTested(n); sync(index, idempotent, n); }}><span>{invalidTested ? "✓" : "○"}</span>Nevalidan lead je testiran i odbijen</button>
      <button data-done={readback} onClick={() => { const n = !readback; setReadback(n); sync(index, idempotent, invalidTested, n); }}><span>{readback ? "✓" : "○"}</span>Sheets/Slack/email imaju readback dokaz</button>
    </div>
  </Shell>;
}

function McpAgentCapstone({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const rows = [
    { label: "GitHub issue read", answer: "READ" },
    { label: "Drive document read", answer: "READ" },
    { label: "Calendar create event", answer: "WRITE + APPROVAL" },
    { label: "Slack send message", answer: "WRITE + APPROVAL" },
  ];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [identity, setIdentity] = useState(false);
  const [readback, setReadback] = useState(false);
  const correct = rows.every((row, i) => answers[i] === row.answer);
  const done = correct && identity && readback;
  const sync = (nextAnswers = answers, nextIdentity = identity, nextReadback = readback) => onComplete(rows.every((row, i) => nextAnswers[i] === row.answer) && nextIdentity && nextReadback);
  return <Shell accent={accent} title="Capstone 3 · AI agent sa MCP alatima" description="Capability map nije permission map. Odvoji read od write akcija, potvrdi connected account i zahtevaj approval pre spoljnog efekta." done={done}>
    <div className={styles.toolList} style={{ padding: 20 }}>{rows.map((row, i) => <div key={row.label} data-visible="true"><span>CAPABILITY</span><b>{row.label}</b><select value={answers[i] ?? ""} onChange={event => { const next = { ...answers, [i]: event.target.value }; setAnswers(next); sync(next); }} style={{ padding: 8, borderRadius: 8 }}><option value="">Scope</option><option>READ</option><option>WRITE + APPROVAL</option></select></div>)}</div>
    <div className={styles.responseChecklist} style={{ padding: 20 }}>
      <button data-done={identity} onClick={() => { const n = !identity; setIdentity(n); sync(answers, n); }}><span>{identity ? "✓" : "○"}</span>Connected account / identity potvrđen</button>
      <button data-done={readback} onClick={() => { const n = !readback; setReadback(n); sync(answers, identity, n); }}><span>{readback ? "✓" : "○"}</span>Event/message ID provereni posle write-a</button>
    </div>
  </Shell>;
}

function VoiceCapstone({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const steps = ["STT transcript", "Intent", "Availability", "Calendar tool", "Event result", "TTS confirmation"];
  const [index, setIndex] = useState(0);
  const [conflict, setConflict] = useState(false);
  const [fallback, setFallback] = useState(false);
  const done = index === steps.length && conflict && fallback;
  const sync = (nextIndex = index, nextConflict = conflict, nextFallback = fallback) => onComplete(nextIndex === steps.length && nextConflict && nextFallback);
  return <Shell accent={accent} title="Capstone 4 · Voice AI appointment agent" description="Agent ne sme da izgovori 'zakazano' pre realnog Calendar rezultata. Testiraj i konflikt termin i fallback." done={done}>
    <Sequence steps={steps} index={index} setIndex={n => { setIndex(n); sync(n); }} onComplete={() => {}} />
    <div className={styles.responseChecklist} style={{ padding: 20 }}>
      <button data-done={conflict} onClick={() => { const n = !conflict; setConflict(n); sync(index, n); }}><span>{conflict ? "✓" : "○"}</span>Konflikt termin testiran</button>
      <button data-done={fallback} onClick={() => { const n = !fallback; setFallback(n); sync(index, conflict, n); }}><span>{fallback ? "✓" : "○"}</span>Fallback / handoff testiran</button>
    </div>
  </Shell>;
}

function ProductionProductCapstone({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const systems = ["Brand + website", "Product UI", "Backend/API", "Database", "Auth", "GitHub workflow", "Coding agents", "n8n", "MCP", "Deployment", "Analytics", "Monitoring", "Documentation", "Security review", "Public demo"];
  const [selected, setSelected] = useState<string[]>([]);
  const [criticalPath, setCriticalPath] = useState(false);
  const [incident, setIncident] = useState(false);
  const [approval, setApproval] = useState(false);
  const done = selected.length === systems.length && criticalPath && incident && approval;
  const sync = (nextSelected = selected, nextCritical = criticalPath, nextIncident = incident, nextApproval = approval) => onComplete(nextSelected.length === systems.length && nextCritical && nextIncident && nextApproval);
  return <Shell accent={accent} title="Capstone 5 · Produkcioni AI proizvod" description="Finalni nivo proverava arhitekturu, execution, deployment, monitoring, security i javni dokaz — ne samo lep demo." done={done}>
    <MissionChecklist items={systems} selected={selected} setSelected={items => { setSelected(items); sync(items); }} onComplete={() => {}} />
    <div className={styles.responseChecklist} style={{ padding: 20 }}>
      <button data-done={criticalPath} onClick={() => { const n = !criticalPath; setCriticalPath(n); sync(selected, n); }}><span>{criticalPath ? "✓" : "○"}</span>Critical path testiran end-to-end</button>
      <button data-done={incident} onClick={() => { const n = !incident; setIncident(n); sync(selected, criticalPath, n); }}><span>{incident ? "✓" : "○"}</span>Jedan production failure je simuliran i vidljiv u monitoring-u</button>
      <button data-done={approval} onClick={() => { const n = !approval; setApproval(n); sync(selected, criticalPath, incident, n); }}><span>{approval ? "✓" : "○"}</span>Rizična write akcija ima approval/audit</button>
    </div>
  </Shell>;
}
