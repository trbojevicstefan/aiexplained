"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { BrowserAction, BrowserAgentWorkbench } from "@/components/visualizations/browser-agent-workbench";
import styles from "./browser-computer-use-lab.module.css";

type Props={progress:LessonProgressApi};
const domCases=[
["Click the 'Book meeting' button by stable semantic selector","button#book"],["Select the time dropdown","select[name=time]"],["Read live confirmation status","div[aria-live=polite]"],["Find by fragile nth-child(17)","fragile"],
] as const;
const a11yCases=[
["button 'Book meeting'","button-name"],["textbox 'Date'","textbox-name"],["status 'No booking created yet.'","status-name"],["x=744,y=382","coordinate"],
] as const;
const stateCases=[
["Session cookie says user is authenticated","session"],["CSRF token stored for current form/session","session"],["Persisted browser profile keeps login across approved runs","profile"],["Password copied into model prompt","bad"],
] as const;
const formCases=[
["Fill name field using label/name","fill"],["Select available time from combobox","select"],["Submit only after auth/session is valid","submit"],["Bypass authentication wall using hidden endpoint","bad"],
] as const;
const visualCases=[
["Canvas-based chart has no useful DOM nodes","screenshot"],["Normal HTML button has stable accessible name","dom"],["Remote desktop app renders pixels only","screenshot"],["Form field with label and name attribute","dom"],
] as const;
const actionCases=[
["Type into focused text field","keyboard"],["Drag map marker to target location","mouse-drag"],["Press Escape to close modal","keyboard"],["Click visible native button","mouse-click"],
] as const;
const strategyCases=[
["Stable HTML button with id/role/name","dom"],["Canvas game control with no semantic element","coordinate"],["Button visually moved 80px after responsive layout change","dom"],["Legacy remote desktop stream rendered only as image","coordinate"],
] as const;
const verifyCases=[
["After booking click, wait for status text 'Meeting booked'","verify-state"],["After sending form, assume success because click returned","bad"],["After file upload, confirm filename/progress/success state","verify-state"],["After destructive action, inspect resulting resource or confirmation","verify-state"],
] as const;
const limitCases=[
["Site presents CAPTCHA intended to distinguish humans/bots","respect-limit"],["Website terms/rate controls block automation","respect-limit"],["Logged-in user explicitly authorizes routine form filling","allowed-workflow"],["Agent asks to steal another user's session cookie","reject"],
] as const;
const quiz=[
["The DOM is…",["A structured representation of page elements/nodes the browser exposes","A screenshot only","A model checkpoint","A vector index"],0],
["CSS selectors can be used to…",["Locate DOM elements by structured attributes/relationships","Train the LLM","Decrypt cookies","Generate images"],0],
["An accessibility tree can provide…",["Semantic roles, names and states useful for robust interaction","Only pixel coordinates","Only cookies","Only CSS colors"],0],
["Why preserve browser session state?",["Authentication/cookies/navigation state may be needed across steps","It changes model weights","It removes permissions","It guarantees success"],0],
["For a stable accessible button, DOM/semantic interaction is generally…",["More robust than hard-coded screen coordinates","Always worse than coordinates","Impossible","Only for mobile"],0],
["Visual grounding is especially useful when…",["The UI is pixel/canvas/remote-desktop based or semantics are insufficient","The element has a perfect stable id","No screenshot exists","Only text APIs are available"],0],
["After a click, a browser agent should…",["Verify the resulting page/application state","Assume success","Increase temperature","Clear cookies"],0],
["Coordinate clicking can break when…",["Layout, viewport, zoom or responsive positioning changes","The DOM is stable","The page has one button","The agent uses a keyboard"],0],
["CAPTCHA/anti-bot boundaries should be…",["Respected rather than treated as puzzles the agent must bypass","Automatically defeated","Stored as memory","Ignored by the runtime"],0],
["Browser automation and computer use are identical in all environments.",["True","False"],1],
] as const;

export function BrowserComputerUseLabLesson({progress}:Props){
 const [view,setView]=useState<"page"|"dom"|"a11y">("page"),[dom,setDom]=useState<Record<number,string>>({}),[a11y,setA11y]=useState<Record<number,string>>({}),[browserState,setBrowserState]=useState<Record<number,string>>({}),[forms,setForms]=useState<Record<number,string>>({}),[visual,setVisual]=useState<Record<number,string>>({}),[actionsAnswer,setActionsAnswer]=useState<Record<number,string>>({}),[strategy,setStrategy]=useState<Record<number,string>>({}),[verify,setVerify]=useState<Record<number,string>>({}),[limits,setLimits]=useState<Record<number,string>>({}),[clicked,setClicked]=useState(false),[verified,setVerified]=useState(false),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["browser-dom","browser-a11y","browser-state","browser-forms","browser-visual","browser-actions","browser-strategy","browser-verify","browser-limits","browser-explain"],sections=["dom","a11y","state","forms","visual","actions","strategy","verify","limits","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const browserActions=useMemo<BrowserAction[]>(()=>[
 {label:"inspect page structure",status:Object.keys(dom).length===4?"done":"active"},
 {label:"ground target",status:Object.keys(a11y).length===4?"done":Object.keys(dom).length===4?"active":"pending"},
 {label:"preserve session",status:Object.keys(browserState).length===4?"done":"pending"},
 {label:"fill booking form",status:Object.keys(forms).length===4?"done":"pending"},
 {label:"click Book meeting",status:clicked?"done":"pending"},
 {label:"verify confirmation",status:clicked&&!verified?"active":verified?"done":"pending"},
 ],[dom,a11y,browserState,forms,clicked,verified]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["dom","selector","accessib","session","cookie","form","screenshot","visual","coordinate","verify","captcha"].filter(w=>t.includes(w)).length;if(explain.length<150||hits<8){setFeedback("Go deeper: explain DOM/selectors and accessibility tree grounding, session/auth state, forms, screenshot/visual grounding, coordinate vs semantic actions, verification and CAPTCHA limits.");return;}setFeedback("Strong. You described browser agents as grounded interaction systems with state and verification, not as a model randomly clicking pixels.");progress.completeTask("browser-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 17 · BROWSER & COMPUTER USE</span><h1>A screenshot tells you where pixels are. A browser can often tell you what they mean.</h1><p>Learn when to use DOM structure, accessibility semantics, browser state and forms — and when you truly need visual grounding or coordinate-level computer use.</p><TaskStamp done={done===10}>{done}/10 browser missions complete</TaskStamp></div><div className={styles.workbench}><BrowserAgentWorkbench view={view} highlight={clicked&&!verified?"notice":"book"} actions={browserActions}/></div></section>

  <LessonSection id="dom" onVisit={progress.markVisited} className={styles.scene}><h2>1. DOM: ask the page for structure before guessing pixels.</h2><div className={styles.viewTabs}>{(["page","dom","a11y"] as const).map(item=><button key={item} className={view===item?styles.active:""} onClick={()=>setView(item)}>{item}</button>)}</div><BrowserAgentWorkbench view={view} highlight="book" actions={browserActions}/>{domCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["button#book","select[name=time]","div[aria-live=polite]","fragile"].map(choice=><button className={`${styles.button} ${dom[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(dom,setDom,domCases,i,choice,"browser-dom")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="a11y" onVisit={progress.markVisited} className={styles.scene}><h2>2. Accessibility tree: roles and accessible names can be excellent grounding.</h2><BrowserAgentWorkbench view="a11y" actions={browserActions}/>{a11yCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["button-name","textbox-name","status-name","coordinate"].map(choice=><button className={`${styles.button} ${a11y[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(a11y,setA11y,a11yCases,i,choice,"browser-a11y")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="state" onVisit={progress.markVisited} className={styles.scene}><h2>3. Browser state is part of the task environment.</h2>{stateCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["session","profile","bad"].map(choice=><button className={`${styles.button} ${browserState[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(browserState,setBrowserState,stateCases,i,choice,"browser-state")}>{choice}</button>)}</div>)}<BrowserAgentWorkbench view="page" actions={browserActions} loggedIn={true}/><p>Cookies/session tokens are credentials or credential-adjacent state. The runtime should protect them; they should not be casually pasted into model context or logs.</p></LessonSection>

  <LessonSection id="forms" onVisit={progress.markVisited} className={styles.scene}><h2>4. Fill forms through explicit fields and expected application flow.</h2>{formCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["fill","select","submit","bad"].map(choice=><button className={`${styles.button} ${forms[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(forms,setForms,formCases,i,choice,"browser-forms")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="visual" onVisit={progress.markVisited} className={styles.scene}><h2>5. Visual grounding is powerful — and expensive/fragile when semantics already exist.</h2>{visualCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["dom","screenshot"].map(choice=><button className={`${styles.button} ${visual[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(visual,setVisual,visualCases,i,choice,"browser-visual")}>{choice}</button>)}</div>)}<div className={styles.visualCompare}><div><b>DOM / A11Y</b><span>semantic, stable when page exposes meaning</span></div><div><b>SCREENSHOT</b><span>useful for canvas, visual layout and pixel-only UIs</span></div></div></LessonSection>

  <LessonSection id="actions" onVisit={progress.markVisited} className={styles.scene}><h2>6. Computer-use actions are just another external capability surface.</h2>{actionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["keyboard","mouse-drag","mouse-click"].map(choice=><button className={`${styles.button} ${actionsAnswer[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(actionsAnswer,setActionsAnswer,actionCases,i,choice,"browser-actions")}>{choice}</button>)}</div>)}<p>The harness still needs focus tracking, allowed actions, timeouts and verification. “Computer use” does not remove runtime responsibility.</p></LessonSection>

  <LessonSection id="strategy" onVisit={progress.markVisited} className={styles.scene}><h2>7. Prefer semantic interaction when available; coordinates are a fallback for pixel-only surfaces.</h2>{strategyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["dom","coordinate"].map(choice=><button className={`${styles.button} ${strategy[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(strategy,setStrategy,strategyCases,i,choice,"browser-strategy")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="verify" onVisit={progress.markVisited} className={styles.scene}><h2>8. Clicking is an attempt. State change is evidence.</h2><BrowserAgentWorkbench view="page" highlight={clicked&&!verified?"notice":"book"} actions={browserActions}/><div className={styles.controls}><button className={styles.primary} onClick={()=>{setClicked(true);setVerified(false)}}>Click “Book meeting”</button><button className={styles.primary} disabled={!clicked} onClick={()=>{setVerified(true);progress.completeTask("browser-verify")}}>Observe confirmation state</button></div>{verifyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["verify-state","bad"].map(choice=><button className={`${styles.button} ${verify[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(verify,setVerify,verifyCases,i,choice,"browser-verify")}>{choice}</button>)}</div>)}{verified&&<p className={styles.success}>✓ The agent verified a postcondition instead of trusting the click action itself.</p>}</LessonSection>

  <LessonSection id="limits" onVisit={progress.markVisited} className={styles.scene}><h2>9. Automation boundaries are part of product design.</h2>{limitCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["respect-limit","allowed-workflow","reject"].map(choice=><button className={`${styles.button} ${limits[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>solve(limits,setLimits,limitCases,i,choice,"browser-limits")}>{choice}</button>)}</div>)}<p>CAPTCHAs, site policies, anti-bot controls, rate limits and authentication barriers may require human action or an approved integration path. A production agent should surface the limitation rather than silently trying to circumvent it.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain how a browser agent sees and acts.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain DOM/selectors, accessibility tree, browser sessions/auth, forms, screenshots/visual grounding, keyboard/mouse/coordinates, verification and CAPTCHA/anti-bot boundaries."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.success}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Browser & Computer-Use quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selectedAnswer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.success}>{quizScore>=9?"★ BROWSER AGENT GROUNDING MASTERED":"Pass is 9/10. Revisit semantics, state and action verification."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/coding-agent-lab">← Coding Agent Lab</Link><Link href="/lessons/module-17-capstone">Module 17 Boss Lab →</Link></div>
 </main>
}
