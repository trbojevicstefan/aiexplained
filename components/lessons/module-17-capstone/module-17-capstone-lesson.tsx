"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { CodeAgentWorkbench, WorkbenchAction, WorkbenchFile } from "@/components/visualizations/code-agent-workbench";
import { BrowserAction, BrowserAgentWorkbench } from "@/components/visualizations/browser-agent-workbench";
import styles from "./module-17-capstone.module.css";

type Props={progress:LessonProgressApi};
const files:WorkbenchFile[]=[
{path:"src/booking.ts",kind:"code",content:`export function confirmationText(success:boolean){\n  return success ? "Booking complete" : "No booking created yet.";\n}`},
{path:"src/BookingForm.tsx",kind:"code",content:`const result = await createBooking(values);\nsetNotice(confirmationText(result.ok));`},
{path:"tests/booking.test.ts",kind:"test",content:`expect(confirmationText(true)).toBe("Meeting booked");`},
{path:"package.json",kind:"config",content:`{"scripts":{"test":"vitest run","dev":"next dev"}}`},
];
const repoCases=[
["Search exact failing text 'Meeting booked'","test-search"],["Search confirmationText references","references"],["Load all build output and node_modules","bad"],["Inspect booking source + related test","relevant-files"],
] as const;
const patchCases=[
["Change success text to 'Meeting booked' only","minimal"],["Delete failing test","bad"],["Rewrite whole booking subsystem","bad"],["Keep failure text unchanged","bad"],
] as const;
const sandboxCases=[
["Workspace read/write","allow"],["npm test and dev server","allow"],["Read host SSH keys","deny"],["Arbitrary outbound network to unknown hosts","deny"],
] as const;
const groundCases=[
["button 'Book meeting' in accessibility tree","semantic"],["button#book in DOM","semantic"],["hard-coded x=711,y=402 while semantic target exists","fragile"],["Canvas-only control with no semantic structure","visual"],
] as const;
const verifyCases=[
["After click, status becomes 'Meeting booked'","postcondition"],["Click promise resolves","not-enough"],["No console error + status changed","postcondition"],["Mouse event fired","not-enough"],
] as const;
const gitCases=[
["Diff contains only confirmation text fix","good"],["Relevant tests pass","good"],["Browser verification result recorded in PR summary","good"],["Unrelated .env file accidentally staged","bad"],
] as const;
const quiz=[
["A strong coding-agent run usually starts by…",["Discovering relevant repo context and failure evidence","Editing the first file it sees","Running destructive shell commands","Committing immediately"],0],
["AST/reference/dependency information helps because…",["It reveals code structure and impact relationships beyond plain text matches","It guarantees tests pass","It replaces Git","It stores user memory"],0],
["After a code patch, tests provide…",["External feedback/evidence that can update the agent's hypothesis","Model training automatically","A browser session","A new tokenizer"],0],
["Passing unit tests proves the UI works end-to-end.",["True","False"],1],
["A browser agent should prefer semantic DOM/accessibility targeting when available because…",["It is generally more robust to layout changes than fixed coordinates","Coordinates are always prohibited","It changes model weights","It bypasses authentication"],0],
["Visual/coordinate grounding is useful when…",["The UI is canvas/pixel/remote-desktop based or semantic structure is insufficient","Every DOM element has a stable role/name","Only APIs exist","Tests fail"],0],
["Action verification means…",["Observe the intended resulting state/postcondition after acting","Trust that the click command returned","Trust model confidence","Skip status checks"],0],
["A coding/browser agent sandbox should protect…",["Filesystem, credentials, process/network and action boundaries","Only font sizes","Only tokenization","Nothing if model is smart"],0],
["Why inspect git diff/status before completion?",["To catch unintended files/changes and make the result reviewable","To train the model","To persist cookies","To render screenshots"],0],
["A complete agent task can require both code-level and user-visible verification.",["True","False"],0],
["CAPTCHA/anti-bot controls should generally be…",["Respected, with human/approved integration path when needed","Bypassed automatically","Stored in memory","Ignored after tests pass"],0],
["The model alone is not the whole coding/browser agent because…",["Harness/runtime supplies repo access, tools, shell/browser state, permissions, feedback and verification loops","The model has no language capability","Tools live in weights","Git is a model layer"],0],
] as const;

export function Module17CapstoneLesson({progress}:Props){
 const [repo,setRepo]=useState<Record<number,string>>({}),[patch,setPatch]=useState<Record<number,string>>({}),[testState,setTestState]=useState<"idle"|"fail"|"pass">("idle"),[failureRead,setFailureRead]=useState(false),[sandbox,setSandbox]=useState<Record<number,string>>({}),[ground,setGround]=useState<Record<number,string>>({}),[clicked,setClicked]=useState(false),[verified,setVerified]=useState(false),[verify,setVerify]=useState<Record<number,string>>({}),[git,setGit]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m17-repo","m17-patch","m17-test","m17-sandbox","m17-ground","m17-verify","m17-git","m17-explain"],sections=["repo","patch","test","sandbox","ground","verify","git","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const codeActions=useMemo<WorkbenchAction[]>(()=>[
 {label:"discover relevant files",status:Object.keys(repo).length===4?"done":"active"},
 {label:"patch confirmation text",status:Object.keys(patch).length===4?"done":Object.keys(repo).length===4?"active":"pending"},
 {label:"run unit test",status:testState==="fail"?"error":testState==="pass"?"done":Object.keys(patch).length===4?"active":"pending"},
 {label:"start app in sandbox",status:Object.keys(sandbox).length===4?"done":"pending"},
 {label:"browser verify",status:verified?"done":testState==="pass"?"active":"pending"},
 ],[repo,patch,testState,sandbox,verified]);
 const browserActions=useMemo<BrowserAction[]>(()=>[
 {label:"open local app",status:testState==="pass"?"done":"pending"},
 {label:"ground Book meeting",status:Object.keys(ground).length===4?"done":testState==="pass"?"active":"pending"},
 {label:"click booking button",status:clicked?"done":"pending"},
 {label:"verify status text",status:clicked&&!verified?"active":verified?"done":"pending"},
 ],[testState,ground,clicked,verified]);
 const runFirstTest=()=>{setTestState("fail");setFailureRead(true)};
 const runPassingTest=()=>{if(Object.values(patch).filter(v=>v==="minimal").length===1){setTestState("pass");progress.completeTask("m17-test")}};
 const submit=()=>{const t=explain.toLowerCase();const hits=["repo","search","patch","test","sandbox","dom","accessib","visual","verify","git","browser"].filter(w=>t.includes(w)).length;if(explain.length<155||hits<8){setFeedback("Go deeper: cover repo discovery/search, scoped patch/test feedback, sandbox, DOM/accessibility vs visual grounding, postcondition verification and Git review artifact.");return;}setFeedback("Strong. You described an end-to-end coding/browser agent as a verified tool loop spanning code and user-visible behavior.");progress.completeTask("m17-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 17 · FULL-STACK AGENT BOSS</span><h1>Fix the code. Then prove the product actually changed.</h1><p>Your agent must connect two evidence loops: <b>repo/tests</b> and <b>browser/UI postconditions</b>. Completion requires both.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><div className={styles.heroStack}><CodeAgentWorkbench files={files} activePath="src/booking.ts" actions={codeActions} testStatus={testState}/><BrowserAgentWorkbench view="page" highlight={clicked&&!verified?"notice":"book"} actions={browserActions}/></div></section>

  <LessonSection id="repo" onVisit={progress.markVisited} className={styles.scene}><h2>1. Discover the smallest useful bug surface.</h2>{repoCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["test-search","references","relevant-files","bad"].map(choice=><button key={choice} className={`${styles.button} ${repo[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(repo,setRepo,repoCases,i,choice,"m17-repo")}>{choice}</button>)}</div>)}<CodeAgentWorkbench files={files} activePath="tests/booking.test.ts" actions={codeActions} testStatus={testState}/></LessonSection>

  <LessonSection id="patch" onVisit={progress.markVisited} className={styles.scene}><h2>2. Apply one minimal, reviewable change.</h2>{patchCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["minimal","bad"].map(choice=><button key={choice} className={`${styles.button} ${patch[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(patch,setPatch,patchCases,i,choice,"m17-patch")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="test" onVisit={progress.markVisited} className={styles.scene}><h2>3. Use failure feedback instead of self-confidence.</h2><div className={styles.controls}><button className={styles.button} onClick={runFirstTest}>Run test before fix</button><button className={styles.primary} disabled={!failureRead||Object.values(patch).filter(v=>v==="minimal").length!==1} onClick={runPassingTest}>Run test after patch</button></div>{testState==="fail"&&<div className={styles.failure}><b>FAIL</b><code>Expected “Meeting booked”; received “Booking complete”.</code></div>}{testState==="pass"&&<p className={styles.success}>✓ Unit test passes. This is necessary, but not sufficient for completion.</p>}<CodeAgentWorkbench files={files} activePath="src/booking.ts" actions={codeActions} testStatus={testState}/></LessonSection>

  <LessonSection id="sandbox" onVisit={progress.markVisited} className={styles.scene}><h2>4. Start the app without giving the agent your whole machine.</h2>{sandboxCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["allow","deny"].map(choice=><button key={choice} className={`${styles.button} ${sandbox[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(sandbox,setSandbox,sandboxCases,i,choice,"m17-sandbox")}>{choice}</button>)}</div>)}<p>Production coding agents need workspace, process, credential and network boundaries even when they are operating on code you trust.</p></LessonSection>

  <LessonSection id="ground" onVisit={progress.markVisited} className={styles.scene}><h2>5. Ground the UI target using the strongest available representation.</h2><BrowserAgentWorkbench view="a11y" actions={browserActions}/>{groundCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["semantic","visual","fragile"].map(choice=><button key={choice} className={`${styles.button} ${ground[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(ground,setGround,groundCases,i,choice,"m17-ground")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="verify" onVisit={progress.markVisited} className={styles.scene}><h2>6. Click, then prove the postcondition.</h2><BrowserAgentWorkbench view="page" highlight={clicked&&!verified?"notice":"book"} actions={browserActions}/><div className={styles.controls}><button className={styles.primary} disabled={testState!=="pass"||Object.keys(ground).length!==4} onClick={()=>{setClicked(true);setVerified(false)}}>Click Book meeting</button><button className={styles.primary} disabled={!clicked} onClick={()=>{setVerified(true);progress.completeTask("m17-verify")}}>Observe status = Meeting booked</button></div>{verifyCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["postcondition","not-enough"].map(choice=><button key={choice} className={`${styles.button} ${verify[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(verify,setVerify,verifyCases,i,choice,"m17-verify")}>{choice}</button>)}</div>)}{verified&&<p className={styles.success}>✓ The user-visible behavior is verified, not merely inferred from a passing test.</p>}</LessonSection>

  <LessonSection id="git" onVisit={progress.markVisited} className={styles.scene}><h2>7. Leave a reviewable artifact for a human or another agent.</h2>{gitCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","bad"].map(choice=><button key={choice} className={`${styles.button} ${git[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(git,setGit,gitCases,i,choice,"m17-git")}>{choice}</button>)}</div>)}<div className={styles.pr}><b>PR SUMMARY</b><p>Bug: confirmation string did not match expected product state.</p><p>Verification: unit test ✓ · browser postcondition ✓ · diff scope ✓</p></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the whole coding + browser agent loop.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain repo discovery/search, minimal patch/test feedback, sandbox, DOM/a11y vs visual grounding, browser action verification and Git review artifact."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.success}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 17 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selectedAnswer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit · {quizScore}/12</button>{quizDone&&<p className={styles.success}>{quizScore>=10?"★ CODING + COMPUTER USE MASTERED":"Pass is 10/12. Revisit evidence loops and UI verification."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/browser-computer-use-lab">← Browser Lab</Link><Link href="/lessons/multimodal-room">Multimodal AI →</Link></div>
 </main>
}
