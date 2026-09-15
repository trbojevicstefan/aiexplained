"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./academy-signature-lab.module.css";

const LAB_SLUGS = new Set([
  "osnove-komunikacije-sa-ai-agentom",
  "terminal-bez-straha",
  "git-workflow",
  "api-od-nule",
  "api-vs-webhook",
  "prvi-korisni-n8n-workflow",
  "kako-agent-dobija-alate",
  "google-calendar-booking",
  "kako-se-trazi-greska",
  "secrets-tokeni-bezbednost",
]);

export function hasAcademySignatureLab(slug: string) {
  return LAB_SLUGS.has(slug);
}

export function AcademySignatureLab({ slug, accent, onComplete }: { slug: string; accent: string; onComplete: (done: boolean) => void }) {
  if (slug === "osnove-komunikacije-sa-ai-agentom") return <AgentBriefLab accent={accent} onComplete={onComplete} />;
  if (slug === "terminal-bez-straha") return <TerminalLab accent={accent} onComplete={onComplete} />;
  if (slug === "git-workflow") return <GitWorkflowLab accent={accent} onComplete={onComplete} />;
  if (slug === "api-od-nule") return <ApiLab accent={accent} onComplete={onComplete} />;
  if (slug === "api-vs-webhook") return <WebhookLab accent={accent} onComplete={onComplete} />;
  if (slug === "prvi-korisni-n8n-workflow") return <N8nLab accent={accent} onComplete={onComplete} />;
  if (slug === "kako-agent-dobija-alate") return <McpLab accent={accent} onComplete={onComplete} />;
  if (slug === "google-calendar-booking") return <BookingLab accent={accent} onComplete={onComplete} />;
  if (slug === "kako-se-trazi-greska") return <DebugLayersLab accent={accent} onComplete={onComplete} />;
  if (slug === "secrets-tokeni-bezbednost") return <SecretsIncidentLab accent={accent} onComplete={onComplete} />;
  return null;
}

function LabShell({ accent, label, title, description, done, children }: { accent: string; label: string; title: string; description: string; done: boolean; children: React.ReactNode }) {
  return <section className={styles.shell} style={{ "--lab": accent } as React.CSSProperties}>
    <header className={styles.head}>
      <div><span>{label}</span><h3>{title}</h3><p>{description}</p></div>
      <AiMascot variant="tile" accent={accent} mood={done ? "excited" : "thinking"} size={90} label={done ? "DONE" : "LAB"} />
    </header>
    {children}
    <div className={styles.doneBar} data-done={done}>{done ? "✓ Signature lab završen" : "Završi uslov laboratorije da bi otključao quiz"}</div>
  </section>;
}

function AgentBriefLab({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const fields = ["Cilj", "Kontekst", "Šta smeš da menjaš", "Šta ne smeš da menjaš", "Očekivani rezultat", "Kako da proveriš da je gotovo"];
  const [values, setValues] = useState<string[]>(fields.map(() => ""));
  const [built, setBuilt] = useState(false);
  const ready = values.every((value) => value.trim().length >= 6);
  const done = built && ready;
  return <LabShell accent={accent} label="SIGNATURE LAB · AGENT BRIEF" title="Pretvori maglovitu poruku u operativni brief." description="Agent dobija isti cilj, ali tek strukturisan brief smanjuje pretpostavke i uvodi proveru." done={done}>
    <div className={styles.compareGrid}>
      <div className={styles.badPanel}><span>LOŠ PROMPT</span><p>“Sredi mi ovaj projekat i napravi da sve radi bolje.”</p><ul><li>nema scope-a</li><li>nema zabrana</li><li>nema acceptance criteria</li><li>nema dokaza</li></ul></div>
      <div className={styles.formPanel}>{fields.map((field, index) => <label key={field}><span>{field}</span><input value={values[index]} onChange={(event) => { const next=[...values]; next[index]=event.target.value; setValues(next); setBuilt(false); onComplete(false); }} placeholder={index===0?"Npr. dodaj pricing sekciju bez menjanja headera":index===5?"Npr. npm run build + proveri /pricing":"Upiši konkretno..."}/></label>)}</div>
    </div>
    <button className={styles.actionButton} disabled={!ready} onClick={() => { setBuilt(true); onComplete(true); }}>Pretvori u agent brief →</button>
    {built && <motion.div className={styles.outputPanel} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}><span>BRIEF SPREMAN</span>{fields.map((field,index)=><p key={field}><b>{field}:</b> {values[index]}</p>)}</motion.div>}
  </LabShell>;
}

function TerminalLab({ accent, onComplete }: { accent: string; onComplete: (done: boolean) => void }) {
  const commands = [
    ["pwd", "/Users/stefan/projects/academy"],
    ["ls", "README.md  package.json  app/  components/"],
    ["npm run dev", "> next dev\n✓ Ready on http://localhost:3000"],
    ["curl http://localhost:3000", "HTTP/1.1 200 OK\n<html>...AI Academy...</html>"],
  ] as const;
  const [history, setHistory] = useState<{cmd:string;out:string}[]>([]);
  const ran = new Set(history.map((item)=>item.cmd));
  const done = commands.every(([cmd])=>ran.has(cmd));
  function run(cmd:string,out:string){ const next=[...history,{cmd,out}]; setHistory(next); const nextSet=new Set(next.map((item)=>item.cmd)); onComplete(commands.every(([required])=>nextSet.has(required))); }
  return <LabShell accent={accent} label="SIGNATURE LAB · TERMINAL" title="Pokreni projekat bez straha od crnog ekrana." description="Ne kucaš nasumično. Svaka komanda odgovara na konkretno pitanje: gde sam, šta postoji, da li server radi, da li HTTP odgovara?" done={done}>
    <div className={styles.terminal}><div className={styles.terminalTop}><i/><i/><i/><span>academy — zsh</span></div><div className={styles.terminalBody}>{history.length===0&&<p className={styles.dim}>Klikni komande ispod redom i posmatraj šta svaka dokazuje.</p>}{history.map((item,index)=><div key={`${item.cmd}-${index}`}><p><b>$</b> {item.cmd}</p><pre>{item.out}</pre></div>)}</div></div>
    <div className={styles.commandRow}>{commands.map(([cmd,out])=><button key={cmd} data-done={ran.has(cmd)} onClick={()=>run(cmd,out)}>{ran.has(cmd)?"✓ ":""}{cmd}</button>)}</div>
  </LabShell>;
}

function GitWorkflowLab({ accent, onComplete }: { accent: string; onComplete: (done:boolean)=>void }) {
  const steps=["git status","git add .","git commit -m \"Add academy hero\"","git push","Open PR","Review diff","Merge"];
  const [index,setIndex]=useState(0);
  const done=index>=steps.length;
  return <LabShell accent={accent} label="SIGNATURE LAB · GIT" title="Prođi bezbedan put izmene od working tree-a do merge-a." description="Svaki korak postoji da bi promena bila pregledna, vratljiva i proverena." done={done}>
    <div className={styles.pipeline}>{steps.map((step,i)=><motion.button key={step} data-state={i<index?"done":i===index?"active":"waiting"} whileTap={{scale:.96}} onClick={()=>{ if(i===index){const next=index+1;setIndex(next);onComplete(next>=steps.length);} }}><span>{i<index?"✓":i+1}</span><b>{step}</b><small>{i===index?"CLICK TO RUN":i<index?"DONE":"WAITING"}</small></motion.button>)}</div>
    {index===1&&<p className={styles.callout}>Pre `git add .` proveri da nema `.env`, secret-a ili generated fajla.</p>}
    {index===5&&<p className={styles.callout}>Review nije formalnost: čitaj diff kao da pokušavaš da pronađeš regresiju.</p>}
  </LabShell>;
}

function ApiLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const methods=["GET","POST","PATCH","DELETE"] as const;
  const [method,setMethod]=useState<(typeof methods)[number]>("GET");
  const [doneMethods,setDoneMethods]=useState<string[]>([]);
  const [response,setResponse]=useState("Klikni SEND REQUEST");
  function send(){ const responses={GET:'200 OK\n[{"id":42,"name":"Ada"}]',POST:'201 CREATED\n{"id":43,"name":"Nova"}',PATCH:'200 OK\n{"id":43,"name":"Nova AI"}',DELETE:'204 NO CONTENT'} as const; setResponse(responses[method]); const next=doneMethods.includes(method)?doneMethods:[...doneMethods,method]; setDoneMethods(next); onComplete(methods.every((m)=>next.includes(m))); }
  const done=methods.every((m)=>doneMethods.includes(m));
  return <LabShell accent={accent} label="SIGNATURE LAB · API" title="Sastavi request i posmatraj šta REST metoda menja." description="Endpoint je isti, ali method menja nameru: čitaj, kreiraj, izmeni ili obriši." done={done}>
    <div className={styles.apiBuilder}><div className={styles.methodTabs}>{methods.map((m)=><button key={m} data-active={method===m} data-done={doneMethods.includes(m)} onClick={()=>setMethod(m)}>{doneMethods.includes(m)?"✓ ":""}{m}</button>)}</div><div className={styles.urlBar}><b>{method}</b><span>https://api.academy.test/users/43</span><button onClick={send}>SEND REQUEST</button></div><div className={styles.apiColumns}><div><span>REQUEST BODY</span><pre>{method==="GET"||method==="DELETE"?"— no body —":method==="POST"?'{\n  "name": "Nova"\n}':'{\n  "name": "Nova AI"\n}'}</pre></div><div><span>RESPONSE</span><pre>{response}</pre></div></div></div>
  </LabShell>;
}

function WebhookLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const [idempotent,setIdempotent]=useState(false); const [attempts,setAttempts]=useState(0); const [writes,setWrites]=useState(0); const [seen,setSeen]=useState(false);
  function reset(){setAttempts(0);setWrites(0);setSeen(false);onComplete(false)}
  function deliver(){const nextAttempts=attempts+1;const duplicate=seen;const nextWrites=idempotent&&duplicate?writes:writes+1;setAttempts(nextAttempts);setWrites(nextWrites);setSeen(true);onComplete(idempotent&&duplicate&&nextWrites<nextAttempts)}
  const done=idempotent&&attempts>=2&&writes<attempts;
  return <LabShell accent={accent} label="SIGNATURE LAB · WEBHOOK" title="Pusti isti event dva puta i spreči dupli write." description="Provider može da retry-uje isti događaj. Idempotency odlučuje da li drugi delivery pravi duplikat." done={done}>
    <div className={styles.webhookGrid}><div className={styles.eventCard}><AiMascot variant="mail" accent={accent} mood="happy" size={82} label="EVENT"/><b>lead.created</b><code>event_id: evt_7F2</code><button onClick={deliver}>Deliver webhook</button></div><div className={styles.counterCard}><span>DELIVERY ATTEMPTS</span><strong>{attempts}</strong><span>DATABASE WRITES</span><strong className={writes>1&&!idempotent?styles.dangerText:""}>{writes}</strong></div><div className={styles.switchCard}><span>IDEMPOTENCY</span><button data-on={idempotent} onClick={()=>{setIdempotent(!idempotent);reset();}}><i/>{idempotent?"ON":"OFF"}</button><p>{idempotent?"Poznati event_id se ne upisuje drugi put.":"Svaki delivery pravi novi write."}</p></div></div>
  </LabShell>;
}

function N8nLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const correct=["Webhook","Validacija","AI Agent","Google Sheets","Slack","Email"];
  const [nodes,setNodes]=useState(["AI Agent","Webhook","Slack","Validacija","Email","Google Sheets"]); const [drag,setDrag]=useState<number|null>(null); const [ran,setRan]=useState(false);
  const ordered=nodes.every((node,i)=>node===correct[i]); const done=ordered&&ran;
  function drop(to:number){if(drag===null)return;const next=[...nodes];const [item]=next.splice(drag,1);next.splice(to,0,item);setNodes(next);setDrag(null);setRan(false);onComplete(false)}
  return <LabShell accent={accent} label="SIGNATURE LAB · n8n" title="Složi lead workflow i pusti jedan item kroz ceo tok." description="Node nije samo kutija. Svaki ima input, output i uslov da sledeći korak sme da se izvrši." done={done}>
    <div className={styles.n8nFlow}>{nodes.map((node,i)=><div key={node} draggable onDragStart={()=>setDrag(i)} onDragOver={(e)=>e.preventDefault()} onDrop={()=>drop(i)} data-correct={node===correct[i]}><span>{i+1}</span><b>{node}</b>{i<nodes.length-1&&<i>→</i>}</div>)}</div>
    <button className={styles.actionButton} disabled={!ordered} onClick={()=>{setRan(true);onComplete(true)}}>{ran?"✓ Execution successful":"Run workflow"}</button>
    {!ordered&&<p className={styles.hint}>Hint: događaj mora prvo da stigne, zatim se validira, AI ga obrađuje, pa tek onda dolaze write/notification koraci.</p>}
  </LabShell>;
}

function McpLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const [connected,setConnected]=useState(false); const [readDone,setReadDone]=useState(false); const [approved,setApproved]=useState(false); const [writeDone,setWriteDone]=useState(false); const done=connected&&readDone&&approved&&writeDone;
  function update(next:{connected?:boolean;readDone?:boolean;approved?:boolean;writeDone?:boolean}){const state={connected,readDone,approved,writeDone,...next};onComplete(Boolean(state.connected&&state.readDone&&state.approved&&state.writeDone));}
  return <LabShell accent={accent} label="SIGNATURE LAB · MCP" title="Poveži server, otkrij tools i odvoji capability od permission-a." description="Server može da ponudi write alat, ali agent i dalje ne mora da ima dozvolu da ga izvrši bez approval-a." done={done}>
    <div className={styles.mcpLayout}><div className={styles.mcpServer}><AiMascot variant="briefcase" accent={accent} mood={connected?"happy":"neutral"} size={100} label="MCP"/><b>Project MCP Server</b><button onClick={()=>{setConnected(true);update({connected:true})}}>{connected?"✓ Connected":"Connect server"}</button></div><div className={styles.toolList}>{["list_projects · READ","get_project · READ","create_task · WRITE"].map((tool,i)=><div key={tool} data-visible={connected}><span>{i===2?"WRITE":"READ"}</span><b>{connected?tool:"capability hidden"}</b>{connected&&i===1&&<button onClick={()=>{setReadDone(true);update({readDone:true})}}>{readDone?"✓ Result received":"Execute"}</button>}{connected&&i===2&&<button disabled={!approved} onClick={()=>{setWriteDone(true);update({writeDone:true})}}>{writeDone?"✓ Task created":"Execute"}</button>}</div>)}</div><div className={styles.approvalBox}><span>WRITE PERMISSION</span><button data-on={approved} onClick={()=>{const value=!approved;setApproved(value);update({approved:value})}}>{approved?"✓ Human approval granted":"Require human approval"}</button><p>Tool discovery govori šta postoji. Approval govori šta sme da se uradi.</p></div></div>
  </LabShell>;
}

function BookingLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const [checked,setChecked]=useState(false); const [eventId,setEventId]=useState(""); const [cancelled,setCancelled]=useState(false); const [timezone,setTimezone]=useState("Europe/Belgrade"); const done=Boolean(eventId)&&cancelled;
  function create(){if(!checked)return;const id="evt_ai_"+Math.random().toString(36).slice(2,8);setEventId(id);setCancelled(false);onComplete(false)}
  return <LabShell accent={accent} label="SIGNATURE LAB · CALENDAR" title="Booking nije uspešan dok nemaš event ID." description="Proveri availability, timezone i trajanje, napravi event, pročitaj ID, pa testiraj cancellation." done={done}>
    <div className={styles.bookingGrid}><label><span>TIMEZONE</span><select value={timezone} onChange={(e)=>setTimezone(e.target.value)}><option>Europe/Belgrade</option><option>UTC</option><option>America/New_York</option></select></label><label><span>DURATION</span><select><option>30 min</option><option>45 min</option></select></label><div className={styles.bookingStatus}><span>AVAILABILITY</span><b>{checked?"10:00 — FREE":"NOT CHECKED"}</b><button onClick={()=>setChecked(true)}>Check availability</button></div><div className={styles.bookingStatus}><span>EVENT</span><b>{eventId||"NOT CREATED"}</b><button disabled={!checked} onClick={create}>Create event</button></div></div>
    {eventId&&<div className={styles.eventReceipt}><span>✓ CALENDAR READBACK</span><b>event_id: {eventId}</b><p>n8n Lab AI Agents Call · 30 min · {timezone}</p><button disabled={cancelled} onClick={()=>{setCancelled(true);onComplete(true)}}>{cancelled?"✓ Cancellation verified":"Test cancellation"}</button></div>}
  </LabShell>;
}

function DebugLayersLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const layers=["Browser","Frontend","Backend","API","Authentication","Database","Deployment / Origin","DNS / Proxy","External provider"];
  const [choice,setChoice]=useState<string|null>(null); const correct="Deployment / Origin"; const done=choice===correct;
  return <LabShell accent={accent} label="SIGNATURE LAB · DEBUG" title="Ne popravljaj pogrešan sloj." description="Incident: lokalno sve radi, ali javni URL vraća HTTP 530. Izaberi prvi sloj koji treba izolovati." done={done}>
    <div className={styles.layerStack}>{layers.map((layer,index)=><motion.button key={layer} whileTap={{scale:.97}} data-selected={choice===layer} data-correct={choice===layer&&layer===correct} data-wrong={choice===layer&&layer!==correct} onClick={()=>{setChoice(layer);onComplete(layer===correct)}}><span>{String(index+1).padStart(2,"0")}</span><b>{layer}</b></motion.button>)}</div>
    {choice&&<p className={choice===correct?styles.successText:styles.dangerText}>{choice===correct?"Tačno. Prvo proveri origin/tunnel health pre nego što menjaš frontend kod.":"Ovaj sloj može imati problem, ali 530 prvo traži proveru origin/proxy puta."}</p>}
  </LabShell>;
}

function SecretsIncidentLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const actions=["Revoke kompromitovani token","Generiši novi token sa manjim scope-om","Ukloni secret iz source-a i history plana","Premesti novi secret u env/secret store","Proveri audit log za zloupotrebu"];
  const [checked,setChecked]=useState<boolean[]>(actions.map(()=>false)); const done=checked.every(Boolean);
  return <LabShell accent={accent} label="SIGNATURE LAB · SECURITY" title="Token je procurio. Brisanje linije nije dovoljno." description="Tretiraj credential kao kompromitovan identitet: revoke, rotate, scope-down, očisti source i proveri audit trag." done={done}>
    <div className={styles.secretLeak}><div className={styles.codeLeak}><span>.env accidentally committed</span><code>GITHUB_TOKEN=ghp_live_example_********</code><b>LEAK DETECTED</b></div><div className={styles.responseChecklist}>{actions.map((action,index)=><button key={action} data-done={checked[index]} onClick={()=>{const next=checked.map((value,i)=>i===index?!value:value);setChecked(next);onComplete(next.every(Boolean));}}><span>{checked[index]?"✓":"○"}</span>{action}</button>)}</div></div>
  </LabShell>;
}
