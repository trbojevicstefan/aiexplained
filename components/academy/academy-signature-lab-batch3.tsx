"use client";

import { useState } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./academy-signature-lab.module.css";

const BATCH3 = new Set([
  "hermes-basic",
  "openclaw-basic",
  "codex-basic",
  "claude-code-basic",
  "github-timski-rad",
  "github-cli",
  "api-kljucevi-i-auth",
  "webhook-debugging",
  "n8n-api-upravljanje",
  "custom-mcp-server",
]);

export function hasAcademySignatureLabBatch3(slug: string) {
  return BATCH3.has(slug);
}

export function AcademySignatureLabBatch3({ slug, accent, onComplete }: { slug: string; accent: string; onComplete: (done: boolean) => void }) {
  if (slug === "hermes-basic") return <HermesBasicLab accent={accent} onComplete={onComplete} />;
  if (slug === "openclaw-basic") return <OpenClawBasicLab accent={accent} onComplete={onComplete} />;
  if (slug === "codex-basic") return <CodexRepoLab accent={accent} onComplete={onComplete} />;
  if (slug === "claude-code-basic") return <ClaudeCodeLab accent={accent} onComplete={onComplete} />;
  if (slug === "github-timski-rad") return <GitHubTeamLab accent={accent} onComplete={onComplete} />;
  if (slug === "github-cli") return <GitHubCliLab accent={accent} onComplete={onComplete} />;
  if (slug === "api-kljucevi-i-auth") return <CredentialSorter accent={accent} onComplete={onComplete} />;
  if (slug === "webhook-debugging") return <WebhookDebugLab accent={accent} onComplete={onComplete} />;
  if (slug === "n8n-api-upravljanje") return <N8nApiLab accent={accent} onComplete={onComplete} />;
  if (slug === "custom-mcp-server") return <CustomMcpLab accent={accent} onComplete={onComplete} />;
  return null;
}

function Shell({ accent, title, description, done, children }: { accent:string; title:string; description:string; done:boolean; children:React.ReactNode }) {
  return <section className={styles.shell} style={{"--lab":accent} as React.CSSProperties}>
    <header className={styles.head}><div><span>SIGNATURE LAB · AGENT-FIRST</span><h3>{title}</h3><p>{description}</p></div><AiMascot variant="bot" accent={accent} mood={done?"excited":"thinking"} size={92} label={done?"DONE":"LAB"}/></header>
    {children}
    <div className={styles.doneBar} data-done={done}>{done?"✓ Workbench završen":"Završi sve obavezne korake"}</div>
  </section>;
}

function StepWorkbench({items,doneItems,onRun}:{items:{label:string;detail:string}[];doneItems:number[];onRun:(index:number)=>void}){
  return <div className={styles.pipeline} style={{gridTemplateColumns:`repeat(${Math.min(items.length,6)},1fr)`}}>{items.map((item,index)=><button key={item.label} data-state={doneItems.includes(index)?"done":index===Math.min(doneItems.length,items.length-1)?"active":"waiting"} onClick={()=>onRun(index)}><span>{doneItems.includes(index)?"✓":index+1}</span><b>{item.label}</b><small>{item.detail}</small></button>)}</div>;
}

function HermesBasicLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const items=[{label:"READ PROJECT",detail:"inspect files"},{label:"TERMINAL",detail:"run command"},{label:"WEB",detail:"check source"},{label:"WRITE README",detail:"create artifact"},{label:"VERIFY",detail:"readback + test"}];
 const [doneItems,setDoneItems]=useState<number[]>([]); const done=doneItems.length===items.length;
 function run(i:number){if(i>0&&!doneItems.includes(i-1))return;const next=doneItems.includes(i)?doneItems:[...doneItems,i];setDoneItems(next);onComplete(next.length===items.length)}
 return <Shell accent={accent} title="Vodi Hermesa kroz realan projekat, ne kroz pretpostavke." description="Prvo čitaš stvarne fajlove, zatim koristiš terminal/web po potrebi, tek onda pišeš i na kraju proveravaš rezultat." done={done}><StepWorkbench items={items} doneItems={doneItems} onRun={run}/>{doneItems.length>=1&&<div className={styles.outputPanel}><span>PROJECT CONTEXT</span><p><b>README.md</b> · package.json · app/ · components/</p><p>{doneItems.length>=2?"$ npm run test → 12 passed":"Terminal još nije pokrenut."}</p><p>{doneItems.length>=5?"✓ README readback + test dokaz postoje":"Verification još nije završen."}</p></div>}</Shell>
}

function OpenClawBasicLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const [mode,setMode]=useState<"conversation"|"execution">("conversation"); const [permission,setPermission]=useState<"read"|"write">("read"); const [called,setCalled]=useState(false); const [verified,setVerified]=useState(false); const done=mode==="execution"&&permission==="write"&&called&&verified;
 return <Shell accent={accent} title="Razdvoji razgovor od izvršenja kroz agent gateway." description="Poruka može samo da objasni šta treba uraditi. Execution koristi alat i mora da ima status, permission i readback." done={done}><div className={styles.webhookGrid}><div className={styles.switchCard}><span>MODE</span><button data-on={mode==="execution"} onClick={()=>{setMode(mode==="conversation"?"execution":"conversation");setCalled(false);setVerified(false);onComplete(false)}}><i/>{mode==="execution"?"EXECUTION":"CONVERSATION"}</button><p>{mode==="conversation"?"Agent samo razgovara. Nema spoljne akcije.":"Agent sme da predloži tool call."}</p></div><div className={styles.switchCard}><span>TOOL PERMISSION</span><button data-on={permission==="write"} onClick={()=>{setPermission(permission==="read"?"write":"read");setCalled(false);setVerified(false);onComplete(false)}}><i/>{permission.toUpperCase()}</button><p>Write je odvojena capability granica.</p></div><div className={styles.eventCard}><AiMascot variant="tile" accent={accent} mood={called?"happy":"thinking"} size={78} label="GATE"/><b>create_task</b><button disabled={mode!=="execution"||permission!=="write"} onClick={()=>setCalled(true)}>{called?"✓ executed":"Execute tool"}</button><button disabled={!called} onClick={()=>{setVerified(true);onComplete(true)}}>{verified?"✓ status verified":"Verify status"}</button></div></div></Shell>
}

function CodexRepoLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const steps=[{label:"READ REPO",detail:"map files"},{label:"PLAN",detail:"scope change"},{label:"PATCH",detail:"edit files"},{label:"DIFF",detail:"review"},{label:"TEST",detail:"run suite"},{label:"FIX",detail:"repair failure"}]; const [doneItems,setDoneItems]=useState<number[]>([]); const [failed,setFailed]=useState(false); const done=doneItems.length===steps.length;
 function run(i:number){if(i>0&&!doneItems.includes(i-1))return;if(i===4&&!failed){setFailed(true);return}const next=doneItems.includes(i)?doneItems:[...doneItems,i];setDoneItems(next);onComplete(next.length===steps.length)}
 return <Shell accent={accent} title="Coding agent workflow: repo → plan → patch → diff → test → repair." description="Test je namerno podešen da prvi put padne. Lekcija se završava tek kada agent pročita failure i popravi ga." done={done}><StepWorkbench items={steps} doneItems={doneItems} onRun={run}/>{failed&&!doneItems.includes(4)&&<p className={styles.callout}>✕ `pricing.test.ts`: expected 3 cards, received 2. Klikni TEST ponovo nakon što razumeš failure.</p>}{doneItems.includes(4)&&<p className={styles.callout}>✓ test suite: 18 passed. Sada uradi finalni repair/verification korak.</p>}</Shell>
}

function ClaudeCodeLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const files=["app/page.tsx","components/hero.tsx","components/hero.module.css","tests/hero.test.tsx"]; const [selected,setSelected]=useState<string[]>([]); const [reviewed,setReviewed]=useState(false); const [tested,setTested]=useState(false); const done=selected.length===files.length&&reviewed&&tested;
 function sync(next?:Partial<{selected:string[];reviewed:boolean;tested:boolean}>){const state={selected,reviewed,tested,...next};onComplete(state.selected.length===files.length&&state.reviewed&&state.tested)}
 return <Shell accent={accent} title="Planiraj multi-file izmenu pre nego što terminal agent počne da piše." description="Claude Code je koristan kada task prolazi kroz više fajlova i terminal koraka, ali plan i review i dalje moraju biti eksplicitni." done={done}><div className={styles.toolList} style={{padding:20}}>{files.map(file=><div key={file} data-visible="true"><span>FILE</span><b>{file}</b><button onClick={()=>{const next=selected.includes(file)?selected.filter(f=>f!==file):[...selected,file];setSelected(next);sync({selected:next})}}>{selected.includes(file)?"✓ in plan":"Add to plan"}</button></div>)}</div><div className={styles.commandRow}><button data-done={reviewed} disabled={selected.length!==files.length} onClick={()=>{setReviewed(true);sync({reviewed:true})}}>Review diff</button><button data-done={tested} disabled={!reviewed} onClick={()=>{setTested(true);sync({tested:true})}}>Run build + tests</button></div></Shell>
}

function GitHubTeamLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const steps=["Create issue","Assign owner","Create branch","Open PR","Request review","Approve review","Merge PR","Close issue"]; const [index,setIndex]=useState(0); const done=index>=steps.length;
 return <Shell accent={accent} title="Pretvori GitHub u timski workflow, ne samo storage." description="Issue daje kontekst, branch izoluje rad, PR prikazuje diff, review proverava, merge zatvara promenu." done={done}><div className={styles.pipeline} style={{gridTemplateColumns:"repeat(4,1fr)"}}>{steps.map((step,i)=><button key={step} data-state={i<index?"done":i===index?"active":"waiting"} onClick={()=>{if(i===index){const next=index+1;setIndex(next);onComplete(next>=steps.length)}}}><span>{i<index?"✓":i+1}</span><b>{step}</b><small>{i===index?"NEXT":""}</small></button>)}</div></Shell>
}

function GitHubCliLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const cmds=["gh auth status","gh repo view","gh repo list","gh issue create","gh pr create","gh run list"]; const [history,setHistory]=useState<string[]>([]); const done=history.length===cmds.length;
 function run(cmd:string){const expected=cmds[history.length];if(cmd!==expected)return;const next=[...history,cmd];setHistory(next);onComplete(next.length===cmds.length)}
 return <Shell accent={accent} title="Vozi GitHub workflow iz terminala, ali prvo potvrdi identitet." description="Redosled počinje sa `gh auth status`, jer write akcija bez proverene identity/permission granice nije bezbedan workflow." done={done}><div className={styles.terminal}><div className={styles.terminalTop}><i/><i/><i/><span>gh — authenticated session</span></div><div className={styles.terminalBody}>{history.map((cmd,i)=><div key={cmd}><p><b>$</b> {cmd}</p><pre>{i===0?"✓ Logged in as trbojevicstefan":i===3?"✓ Created issue #42":i===4?"✓ Pull request #18 opened":"✓ command completed"}</pre></div>)}</div></div><div className={styles.commandRow}>{cmds.map(cmd=><button key={cmd} data-done={history.includes(cmd)} onClick={()=>run(cmd)}>{history.includes(cmd)?"✓ ":""}{cmd}</button>)}</div></Shell>
}

function CredentialSorter({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const items=[{name:"API key",bucket:"server"},{name:"Bearer token",bucket:"request"},{name:"Refresh token",bucket:"server"},{name:"Session cookie",bucket:"browser"},{name:"Service account",bucket:"server"},{name:"Webhook secret",bucket:"server"}]; const buckets=["browser","request","server"]; const [answers,setAnswers]=useState<Record<string,string>>({}); const done=items.every(i=>answers[i.name]===i.bucket);
 return <Shell accent={accent} title="Razvrstaj credential-e prema mestu i nameni." description="Nije svaki token isti. Neki predstavljaju browser session, neki HTTP authorization, a neki dugotrajan server identitet." done={done}><div className={styles.toolList} style={{padding:20}}>{items.map(item=><div key={item.name} data-visible="true"><span>CREDENTIAL</span><b>{item.name}</b><select value={answers[item.name]??""} onChange={e=>{const next={...answers,[item.name]:e.target.value};setAnswers(next);onComplete(items.every(i=>next[i.name]===i.bucket))}} style={{padding:8,borderRadius:8}}><option value="">Choose</option>{buckets.map(b=><option key={b} value={b}>{b}</option>)}</select></div>)}</div></Shell>
}

function WebhookDebugLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const checks=["Production URL","Workflow active","Webhook registered","POST method","Content-Type: application/json","Origin reachable"]; const [doneChecks,setDoneChecks]=useState<string[]>([]); const done=doneChecks.length===checks.length;
 return <Shell accent={accent} title="Workflow postoji, ali webhook i dalje ne radi. Prati checklistu." description="Editor state nije dokaz da je produkcioni webhook registration stvarno aktivan." done={done}><div className={styles.responseChecklist} style={{padding:20}}>{checks.map(check=><button key={check} data-done={doneChecks.includes(check)} onClick={()=>{const next=doneChecks.includes(check)?doneChecks:[...doneChecks,check];setDoneChecks(next);onComplete(next.length===checks.length)}}><span>{doneChecks.includes(check)?"✓":"○"}</span>{check}</button>)}</div>{doneChecks.length>=3&&<p className={styles.callout}>Execution log je izvor istine: proveri da li request stvarno ulazi u workflow.</p>}</Shell>
}

function N8nApiLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const [read,setRead]=useState(false); const [backup,setBackup]=useState(false); const [updated,setUpdated]=useState(false); const [readback,setReadback]=useState(false); const done=read&&backup&&updated&&readback;
 return <Shell accent={accent} title="Napravi bezbedan n8n API update sa backup-om i readback-om." description="Ne radi PUT nad workflow-om koji prethodno nisi pročitao i sačuvao. Posle write-a ponovo čitaš finalno stanje." done={done}><div className={styles.pipeline} style={{gridTemplateColumns:"repeat(4,1fr)"}}>{[
  ["GET workflow",read,()=>setRead(true)],
  ["Backup JSON",backup,()=>{if(read)setBackup(true)}],
  ["PUT update",updated,()=>{if(backup)setUpdated(true)}],
  ["GET readback",readback,()=>{if(updated){setReadback(true);onComplete(true)}}],
 ].map(([label,state,fn],i)=><button key={String(label)} data-state={state?"done":i===[read,backup,updated,readback].filter(Boolean).length?"active":"waiting"} onClick={fn as ()=>void}><span>{state?"✓":i+1}</span><b>{String(label)}</b><small>{state?"DONE":""}</small></button>)}</div></Shell>
}

function CustomMcpLab({accent,onComplete}:{accent:string;onComplete:(done:boolean)=>void}){
 const tools=[{name:"list_projects",mode:"READ"},{name:"get_project",mode:"READ"},{name:"create_task",mode:"WRITE"},{name:"update_project_status",mode:"WRITE"}]; const [configured,setConfigured]=useState<string[]>([]); const [validation,setValidation]=useState(false); const [errors,setErrors]=useState(false); const done=configured.length===tools.length&&validation&&errors;
 function sync(nextConfig=configured,nextValidation=validation,nextErrors=errors){onComplete(nextConfig.length===tools.length&&nextValidation&&nextErrors)}
 return <Shell accent={accent} title="Dizajniraj mali custom MCP server sa jasnim read/write granicama." description="Dobar MCP tool ima usku namenu, input schema, validation, error behavior i permission model." done={done}><div className={styles.toolList} style={{padding:20}}>{tools.map(tool=><div key={tool.name} data-visible="true"><span>{tool.mode}</span><b>{tool.name}</b><button onClick={()=>{const next=configured.includes(tool.name)?configured:[...configured,tool.name];setConfigured(next);sync(next)}}>{configured.includes(tool.name)?"✓ schema ready":"Define schema"}</button></div>)}</div><div className={styles.commandRow}><button data-done={validation} disabled={configured.length!==tools.length} onClick={()=>{setValidation(true);sync(configured,true,errors)}}>Input validation</button><button data-done={errors} disabled={!validation} onClick={()=>{setErrors(true);sync(configured,validation,true)}}>Error handling + logs</button></div></Shell>
}
