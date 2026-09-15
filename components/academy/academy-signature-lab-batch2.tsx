"use client";

import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./academy-signature-lab.module.css";

const BATCH2 = new Set([
  "browser-i-server",
  "json-za-non-tech",
  "oauth-bez-magije",
  "n8n-ai-agent-node",
  "n8n-multi-agent",
  "composio-mcp-gateway",
  "kako-rade-voice-agenti",
  "firebase-firestore-storage",
  "cloudflare-tunnel-debugging",
  "citanje-logova",
]);

export function hasAcademySignatureLabBatch2(slug: string) {
  return BATCH2.has(slug);
}

export function AcademySignatureLabBatch2({ slug, accent, onComplete }: { slug: string; accent: string; onComplete: (done: boolean) => void }) {
  if (slug === "browser-i-server") return <HttpInspector accent={accent} onComplete={onComplete} />;
  if (slug === "json-za-non-tech") return <JsonFixer accent={accent} onComplete={onComplete} />;
  if (slug === "oauth-bez-magije") return <OAuthLab accent={accent} onComplete={onComplete} />;
  if (slug === "n8n-ai-agent-node") return <AgentNodeAssembler accent={accent} onComplete={onComplete} />;
  if (slug === "n8n-multi-agent") return <MultiAgentRouter accent={accent} onComplete={onComplete} />;
  if (slug === "composio-mcp-gateway") return <ComposioMapper accent={accent} onComplete={onComplete} />;
  if (slug === "kako-rade-voice-agenti") return <VoicePipelineLab accent={accent} onComplete={onComplete} />;
  if (slug === "firebase-firestore-storage") return <FirebaseLab accent={accent} onComplete={onComplete} />;
  if (slug === "cloudflare-tunnel-debugging") return <CloudflareLab accent={accent} onComplete={onComplete} />;
  if (slug === "citanje-logova") return <LogCorrelationLab accent={accent} onComplete={onComplete} />;
  return null;
}

function Shell({ accent, title, description, done, children }: { accent: string; title: string; description: string; done: boolean; children: React.ReactNode }) {
  return <section className={styles.shell} style={{ "--lab": accent } as React.CSSProperties}>
    <header className={styles.head}><div><span>SIGNATURE LAB · BATCH 2</span><h3>{title}</h3><p>{description}</p></div><AiMascot variant="tile" accent={accent} mood={done ? "excited" : "thinking"} size={90} label={done ? "DONE" : "LAB"} /></header>
    {children}<div className={styles.doneBar} data-done={done}>{done ? "✓ Simulator završen" : "Završi uslov simulatora"}</div>
  </section>;
}

function HttpInspector({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const cases = [
    ["200", "OK", "Request je uspešan."], ["201", "CREATED", "Novi resurs je kreiran."], ["400", "BAD REQUEST", "Payload ili zahtev nije validan."],
    ["401", "UNAUTHENTICATED", "Nema validnog identiteta/tokena."], ["403", "FORBIDDEN", "Identitet postoji, ali nema dozvolu."], ["404", "NOT FOUND", "Route ili resurs ne postoji."],
    ["429", "RATE LIMITED", "Previše zahteva."], ["500", "SERVER ERROR", "Aplikacioni server je pukao."], ["502", "BAD GATEWAY", "Problem između proxy-ja/upstream servera."], ["530", "CLOUDFLARE", "Problem proxy/origin/tunnel puta."],
  ];
  const [seen,setSeen]=useState<string[]>([]); const [active,setActive]=useState(0); const done=seen.length===cases.length;
  function inspect(index:number){const code=cases[index][0];setActive(index);const next=seen.includes(code)?seen:[...seen,code];setSeen(next);onComplete(next.length===cases.length)}
  return <Shell accent={accent} title="HTTP status nije dekoracija — on ti kaže gde da gledaš." description="Klikni sve response scenarije i poveži status sa vrstom problema pre nego što bilo šta menjaš." done={done}>
    <div className={styles.apiBuilder}><div className={styles.methodTabs}>{cases.map(([code],i)=><button key={code} data-active={active===i} data-done={seen.includes(code)} onClick={()=>inspect(i)}>{seen.includes(code)?"✓ ":""}{code}</button>)}</div><div className={styles.urlBar}><b>GET</b><span>https://academy.test/api/projects/42</span><button>RESPONSE</button></div><div className={styles.apiColumns}><div><span>REQUEST</span><pre>{`GET /api/projects/42\nAuthorization: Bearer ••••\nAccept: application/json`}</pre></div><div><span>STATUS</span><pre>{`${cases[active][0]} ${cases[active][1]}\n\n${cases[active][2]}`}</pre></div></div></div>
  </Shell>;
}

function JsonFixer({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const broken = '{\n  "lead": {\n    "name": "Ana",\n    "score": 91,\n    "qualified": true,\n  }\n}';
  const fixed = '{\n  "lead": {\n    "name": "Ana",\n    "score": 91,\n    "qualified": true\n  }\n}';
  const [value,setValue]=useState(broken); const [path,setPath]=useState(""); const valid=(()=>{try{JSON.parse(value);return true}catch{return false}})(); const pathOk=path.trim()==="lead.score"; const done=valid&&pathOk;
  return <Shell accent={accent} title="Popravi JSON i pronađi vrednost kroz nested path." description="Jedan trailing zarez može da pokvari parser; jedan pogrešan path može da pošalje praznu vrednost u sledeći node." done={done}>
    <div className={styles.apiColumns} style={{padding:20}}><div><span>JSON EDITOR</span><textarea value={value} onChange={(e)=>{setValue(e.target.value);onComplete(false)}} style={{width:"100%",minHeight:210,background:"transparent",color:"#dce0e5",border:0,font:"13px/1.5 ui-monospace,monospace"}}/><button className={styles.actionButton} style={{margin:0}} onClick={()=>setValue(fixed)}>Fix trailing comma</button></div><div><span>PATH MAPPER</span><pre>{valid?"✓ JSON VALID\n\nTraži score polje unutar lead objekta.":"✕ INVALID JSON\n\nParser staje pre mapping-a."}</pre><input value={path} onChange={(e)=>{setPath(e.target.value);onComplete(valid&&e.target.value.trim()==="lead.score")}} placeholder="npr. lead.score" style={{width:"100%",boxSizing:"border-box",padding:12,borderRadius:10,border:"1px solid #555",background:"#20242a",color:"white"}}/><p>{pathOk&&valid?"✓ rezultat: 91":"Upiši tačan nested path"}</p></div></div>
  </Shell>;
}

function OAuthLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const [redirect,setRedirect]=useState("https://app.test/auth/callback"); const [scopes,setScopes]=useState<string[]>([]); const [consented,setConsented]=useState(false); const [token,setToken]=useState(false);
  const options=["calendar.readonly","calendar.events","drive.full_access"]; const safe=scopes.includes("calendar.readonly")&&scopes.includes("calendar.events")&&!scopes.includes("drive.full_access"); const done=redirect.endsWith("/auth/callback")&&safe&&consented&&token;
  function sync(next?:Partial<{scopes:string[];consented:boolean;token:boolean}>){const state={scopes,consented,token,...next};onComplete(redirect.endsWith("/auth/callback")&&state.scopes.includes("calendar.readonly")&&state.scopes.includes("calendar.events")&&!state.scopes.includes("drive.full_access")&&state.consented&&state.token)}
  return <Shell accent={accent} title="Sastavi OAuth consent bez preširokih dozvola." description="Cilj je Calendar availability + event creation. Ne traži Drive full access ako ti ne treba." done={done}>
    <div className={styles.mcpLayout}><div className={styles.approvalBox}><span>REDIRECT URL</span><input value={redirect} onChange={(e)=>{setRedirect(e.target.value);onComplete(false)}} style={{width:"100%",boxSizing:"border-box",marginTop:10,padding:10,borderRadius:9,border:"1px solid #ccc"}}/><p>Mora tačno da odgovara konfigurisanom callback-u.</p></div><div className={styles.toolList}>{options.map((scope)=><div key={scope} data-visible="true"><span>SCOPE</span><b>{scope}</b><button onClick={()=>{const next=scopes.includes(scope)?scopes.filter((s)=>s!==scope):[...scopes,scope];setScopes(next);sync({scopes:next})}}>{scopes.includes(scope)?"✓ selected":"select"}</button></div>)}</div><div className={styles.approvalBox}><span>CONSENT & TOKEN</span><button data-on={consented} onClick={()=>{const next=!consented;setConsented(next);sync({consented:next})}}>{consented?"✓ User approved":"Show consent screen"}</button><button disabled={!consented||!safe} style={{marginTop:8}} data-on={token} onClick={()=>{setToken(true);sync({token:true})}}>{token?"✓ Access token issued":"Exchange code for token"}</button><p>{safe?"Scope set je minimalan za cilj.":"Izaberi Calendar read + events, bez Drive full access."}</p></div></div>
  </Shell>;
}

function AgentNodeAssembler({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const parts=["Model","System prompt","User input","Memory","Tools","Structured output","Guardrails","Fallback","Human approval"];
  const [added,setAdded]=useState<string[]>([]); const done=added.length===parts.length;
  return <Shell accent={accent} title="Sastavi n8n AI Agent node iz njegovih stvarnih delova." description="Agent node nije jedna čarobna kutija. Dodaj model, kontekst, memory, tools, output kontrolu, guardrails, fallback i approval." done={done}>
    <div className={styles.n8nFlow} style={{flexWrap:"wrap"}}>{parts.map((part,i)=><button key={part} onClick={()=>{const next=added.includes(part)?added:[...added,part];setAdded(next);onComplete(next.length===parts.length)}} style={{minWidth:150,flex:"1 1 160px",border:"2px solid #17191d",borderRadius:14,padding:14,background:added.includes(part)?"#d9f7e6":"#f4f4f2",cursor:"pointer"}}><span>{added.includes(part)?"✓":i+1}</span><b style={{display:"block",marginTop:18}}>{part}</b></button>)}</div>
  </Shell>;
}

function MultiAgentRouter({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const jobs=["Istraži tržište","Napiši članak","Proveri SEO","Generiši sliku","Objavi sadržaj"];
  const agents=["Research Agent","Writing Agent","SEO Agent","Image Agent","Publishing Agent"];
  const [routes,setRoutes]=useState<Record<number,string>>({}); const done=jobs.every((_,i)=>routes[i]===agents[i]);
  return <Shell accent={accent} title="Rutiraj task specijalisti i sačuvaj handoff kontekst." description="Supervisor ne treba da radi sve. Njegov posao je da pošalje pravi task pravom agentu i proveri handoff." done={done}>
    <div className={styles.toolList} style={{padding:20}}>{jobs.map((job,i)=><div key={job} data-visible="true"><span>TASK {i+1}</span><b>{job}</b><select value={routes[i]??""} onChange={(e)=>{const next={...routes,[i]:e.target.value};setRoutes(next);onComplete(jobs.every((_,j)=>next[j]===agents[j]))}} style={{padding:8,borderRadius:8}}><option value="">Choose agent</option>{agents.map((agent)=><option key={agent}>{agent}</option>)}</select></div>)}</div>
  </Shell>;
}

function ComposioMapper({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const [connected,setConnected]=useState(false); const [account,setAccount]=useState(""); const [toolkit,setToolkit]=useState(""); const [executed,setExecuted]=useState(false); const done=connected&&account==="stefan-google"&&toolkit==="Google Calendar"&&executed;
  return <Shell accent={accent} title="Razdvoji API key, connected account i toolkit." description="Composio gateway radi tek kada znaš ko je korisnik, koji account je povezan i koji toolkit/tool se izvršava." done={done}>
    <div className={styles.pipeline} style={{gridTemplateColumns:"repeat(4,1fr)"}}><button data-state={connected?"done":"active"} onClick={()=>setConnected(true)}><span>{connected?"✓":"1"}</span><b>OAuth Connect Link</b><small>USER APPROVAL</small></button><button data-state={account?"done":connected?"active":"waiting"} onClick={()=>{if(connected)setAccount("stefan-google")}}><span>{account?"✓":"2"}</span><b>connected account</b><small>{account||"WAITING"}</small></button><button data-state={toolkit?"done":account?"active":"waiting"} onClick={()=>{if(account)setToolkit("Google Calendar")}}><span>{toolkit?"✓":"3"}</span><b>toolkit</b><small>{toolkit||"WAITING"}</small></button><button data-state={executed?"done":toolkit?"active":"waiting"} onClick={()=>{if(toolkit){setExecuted(true);onComplete(true)}}}><span>{executed?"✓":"4"}</span><b>execute read tool</b><small>{executed?"RESULT RECEIVED":"WAITING"}</small></button></div>
  </Shell>;
}

function VoicePipelineLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const stages=["Speech-to-text","LLM","Tool call","Tool result","Text-to-speech","Audio reply"]; const [step,setStep]=useState(0); const done=step>=stages.length;
  return <Shell accent={accent} title="Prati jednu rečenicu kroz real-time voice pipeline." description="Voice agent nije samo LLM sa glasom. Audio mora da postane tekst, model odlučuje, tool možda radi, pa tek onda odgovor ponovo postaje audio." done={done}>
    <div className={styles.pipeline} style={{gridTemplateColumns:"repeat(6,1fr)"}}>{stages.map((stage,i)=><button key={stage} data-state={i<step?"done":i===step?"active":"waiting"} onClick={()=>{if(i===step){const next=step+1;setStep(next);onComplete(next>=stages.length)}}}><span>{i<step?"✓":i+1}</span><b>{stage}</b><small>{i===2?"BOOKING?":""}</small></button>)}</div>
    {step===3&&<p className={styles.callout}>Model ne sme da izgovori “zakazano je” dok tool result ne potvrdi event.</p>}
  </Shell>;
}

function FirebaseLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const [doc,setDoc]=useState(false); const [asset,setAsset]=useState(false); const [rules,setRules]=useState(false); const done=doc&&asset&&rules;
  return <Shell accent={accent} title="Spoji Firestore podatak, Storage asset i security rules." description="Database i Storage nisu isto; client ne treba da dobije service-account secret, a write mora da poštuje rules." done={done}>
    <div className={styles.webhookGrid}><div className={styles.eventCard}><AiMascot variant="briefcase" accent={accent} mood={doc?"happy":"thinking"} size={78} label="DB"/><b>Firestore</b><code>projects/demo</code><button onClick={()=>{setDoc(true);onComplete(asset&&rules)}}>{doc?"✓ document created":"Create document"}</button></div><div className={styles.eventCard}><AiMascot variant="tile" accent={accent} mood={asset?"happy":"thinking"} size={78} label="FILE"/><b>Storage</b><code>/assets/hero.png</code><button onClick={()=>{setAsset(true);onComplete(doc&&rules)}}>{asset?"✓ URL saved":"Upload asset"}</button></div><div className={styles.switchCard}><span>SECURITY RULES</span><button data-on={rules} onClick={()=>{const next=!rules;setRules(next);onComplete(doc&&asset&&next)}}><i/>{rules?"AUTH WRITE ONLY":"PUBLIC WRITE"}</button><p>{rules?"Write zahteva authenticated user.":"Namerno nesigurno stanje."}</p></div></div>
  </Shell>;
}

function CloudflareLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const incidents=[{code:"1010",correct:"WAF / client reputation"},{code:"1033",correct:"Tunnel disconnected"},{code:"530",correct:"Origin / tunnel path"}]; const options=["WAF / client reputation","Tunnel disconnected","Origin / tunnel path","Frontend CSS"];
  const [answers,setAnswers]=useState<Record<number,string>>({}); const done=incidents.every((item,i)=>answers[i]===item.correct);
  return <Shell accent={accent} title="Razdvoji WAF, tunnel i origin problem pre nego što diraš app kod." description="Cloudflare error kodovi žive iznad aplikacije. Dijagnostika kreće od mrežnog sloja koji error implicira." done={done}>
    <div className={styles.toolList} style={{padding:20}}>{incidents.map((item,i)=><div key={item.code} data-visible="true"><span>HTTP {item.code}</span><b>Koji sloj prvo proveravaš?</b><select value={answers[i]??""} onChange={(e)=>{const next={...answers,[i]:e.target.value};setAnswers(next);onComplete(incidents.every((inc,j)=>next[j]===inc.correct))}} style={{padding:8,borderRadius:8}}><option value="">Choose layer</option>{options.map((option)=><option key={option}>{option}</option>)}</select></div>)}</div>
  </Shell>;
}

function LogCorrelationLab({ accent, onComplete }: { accent:string; onComplete:(done:boolean)=>void }) {
  const rows=[
    ["10:14:02.091","Browser","POST /api/book → 500"],
    ["10:14:02.086","Server","calendar.create failed"],
    ["10:14:02.071","Provider","401 invalid_token"],
    ["10:14:02.050","Agent","calling calendar.create"],
  ];
  const [selected,setSelected]=useState<number|null>(null); const done=selected===2;
  return <Shell accent={accent} title="Pronađi prvi uzrok, ne poslednju posledicu." description="Isti incident ostavlja trag u više sistema. Timestamp i causal chain pomažu da ne popravljaš browser kada je pravi uzrok provider auth." done={done}>
    <div className={styles.terminal} style={{margin:20}}><div className={styles.terminalTop}><i/><i/><i/><span>incident timeline</span></div><div className={styles.terminalBody}>{rows.map((row,i)=><button key={row[0]} onClick={()=>{setSelected(i);onComplete(i===2)}} style={{width:"100%",display:"grid",gridTemplateColumns:"110px 90px 1fr",gap:10,padding:10,border:"0",borderBottom:"1px solid #29302d",background:selected===i?(i===2?"#173b2b":"#452129"):"transparent",color:"#d9f5df",textAlign:"left",cursor:"pointer"}}><span>{row[0]}</span><b>{row[1]}</b><span>{row[2]}</span></button>)}</div></div>
    {selected!==null&&<p className={selected===2?styles.successText:styles.dangerText} style={{padding:"0 20px 20px"}}>{selected===2?"Tačno: provider 401 je prvi failure u lancu.":"Ovo je posledica. Prati timestamp unazad do prvog failure-a."}</p>}
  </Shell>;
}
