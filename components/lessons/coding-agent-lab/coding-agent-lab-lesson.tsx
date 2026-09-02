"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { CodeAgentWorkbench, WorkbenchAction, WorkbenchFile } from "@/components/visualizations/code-agent-workbench";
import styles from "./coding-agent-lab.module.css";

type Props={progress:LessonProgressApi};
const baseFiles:WorkbenchFile[]=[
{path:"src/cart.ts",kind:"code",content:`export function calculateTotal(items: Item[], discount: number) {\n  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);\n  return subtotal - discount * 100; // BUG: discount already uses currency units\n}`},
{path:"src/checkout.ts",kind:"code",content:`import { calculateTotal } from "./cart";\n\nexport function checkout(cart: Cart) {\n  const total = calculateTotal(cart.items, cart.discount);\n  return { total, status: total > 0 ? "ready" : "invalid" };\n}`},
{path:"tests/cart.test.ts",kind:"test",content:`it("subtracts a $10 discount", () => {\n  expect(calculateTotal([{price:50, qty:2}], 10)).toBe(90);\n});\n\nit("never returns negative total", () => {\n  expect(calculateTotal([{price:5, qty:1}], 10)).toBe(0);\n});`},
{path:"package.json",kind:"config",content:`{\n  "scripts": { "test": "vitest run" }\n}`},
];
const contextCases=[
["README + package.json + relevant source/test files for the bug","use"],["Entire node_modules directory","skip"],["Generated build output with 20,000 files","skip"],["Recent failing test output","use"],
] as const;
const discoveryCases=[
["Find calculateTotal definition","code-search"],["Find who calls calculateTotal","references"],["Inspect all repository files blindly","bad"],["Find tests mentioning discount","test-search"],
] as const;
const astCases=[
["Function declaration calculateTotal","FunctionDeclaration"],["Call calculateTotal(cart.items, cart.discount)","CallExpression"],["import { calculateTotal } from './cart'","ImportDeclaration"],["return subtotal - discount * 100","ReturnStatement"],
] as const;
const shellCases=[
["git status","allow"],["npm test -- cart.test.ts","allow"],["cat ~/.ssh/id_rsa","deny"],["rm -rf /","deny"],["git diff -- src/cart.ts","allow"],
] as const;
const patchOptions=[
{id:"wrong",label:"return subtotal - discount * 10;",kind:"wrong"},
{id:"first",label:"return subtotal - discount;",kind:"partial"},
{id:"final",label:"return Math.max(0, subtotal - discount);",kind:"correct"},
] as const;
const planning=["inspect","search","patch","test","repair","verify","commit"];
const gitCases=[
["git diff shows only intended cart.ts change","good"],["npm test passes","good"],["git status contains unrelated .env secrets","bad"],["PR summary explains bug, fix and verification","good"],
] as const;
const quiz=[
["A coding agent needs repository context because…",["It must discover project structure, relevant code and constraints before editing","LLMs automatically know every private repo","Context removes need for tests","Git stores model weights"],0],
["Code search is useful because…",["It narrows context to definitions/references/tests relevant to the task","It guarantees the bug is fixed","It replaces parsing","It runs tests"],0],
["An AST represents…",["Source code as structured syntax nodes/relationships","A Git commit only","A browser screenshot","A model checkpoint"],0],
["A dependency/import graph helps an agent reason about…",["Which files/modules rely on other code and what changes may affect","Only CSS colors","Only token counts","User memory"],0],
["Why sandbox shell access?",["Commands can have powerful side effects and should be constrained to allowed workspace/resources","Shell commands are always harmless","Sandboxes improve model weights","Tests cannot run otherwise"],0],
["A patch should ideally be…",["Minimal, reviewable and scoped to the intended change","A rewrite of every related file","Applied without reading code","Committed before tests"],0],
["When a test fails after a patch, the agent should…",["Read the failure, update its hypothesis, repair and rerun relevant tests","Declare success anyway","Delete the test","Increase temperature"],0],
["Verification before completion should include…",["Tests plus diff/status and task-specific checks","Only model confidence","Only a commit message","No checks"],0],
["A checkpoint in a coding-agent run can preserve…",["Plan/progress/changed files/test state so work can resume safely","Only token IDs","Only model weights","Only screenshots"],0],
["Git commit/PR is useful because…",["It creates a reviewable artifact/history around the code change","It guarantees code correctness","It replaces tests","It trains the model"],0],
] as const;

export function CodingAgentLabLesson({progress}:Props){
 const [context,setContext]=useState<Record<number,string>>({}),[discovery,setDiscovery]=useState<Record<number,string>>({}),[activePath,setActivePath]=useState("src/cart.ts"),[ast,setAst]=useState<Record<number,string>>({}),[shell,setShell]=useState<Record<number,string>>({}),[patch,setPatch]=useState(""),[testStatus,setTestStatus]=useState<"idle"|"running"|"pass"|"fail">("idle"),[failureRead,setFailureRead]=useState(false),[repaired,setRepaired]=useState(false),[plan,setPlan]=useState<string[]>([]),[checkpoint,setCheckpoint]=useState(false),[git,setGit]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["code-context","code-discovery","code-ast","code-shell","code-patch","code-tests","code-repair","code-checkpoint","code-git","code-explain"],sections=["context","discovery","ast","shell","patch","tests","repair","checkpoint","git","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const files=useMemo<WorkbenchFile[]>(()=>baseFiles.map(file=>file.path!=="src/cart.ts"?file:{...file,content:patch==="final"?`export function calculateTotal(items: Item[], discount: number) {\n  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);\n  return Math.max(0, subtotal - discount);\n}`:patch==="first"?`export function calculateTotal(items: Item[], discount: number) {\n  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);\n  return subtotal - discount;\n}`:file.content}),[patch]);
 const actions=useMemo<WorkbenchAction[]>(()=>[
 {label:"discover relevant files",status:Object.keys(discovery).length===4?"done":"active"},
 {label:"inspect syntax/dependencies",status:Object.keys(ast).length===4?"done":Object.keys(discovery).length===4?"active":"pending"},
 {label:"apply patch",status:patch?"done":Object.keys(ast).length===4?"active":"pending"},
 {label:"run tests",status:testStatus==="fail"?"error":testStatus==="pass"?"done":patch?"active":"pending"},
 {label:"repair from failure",status:repaired?"done":testStatus==="fail"?"active":"pending"},
 {label:"verify + Git artifact",status:Object.keys(git).length===4?"done":repaired?"active":"pending"},
 ],[discovery,ast,patch,testStatus,repaired,git]);
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const runTests=()=>{setTestStatus("running");setTimeout(()=>{if(patch==="final"){setTestStatus("pass");setRepaired(true);progress.completeTask("code-repair")}else{setTestStatus("fail");progress.completeTask("code-tests")}},550)};
 const submit=()=>{const t=explain.toLowerCase();const hits=["repo","search","ast","depend","patch","test","failure","sandbox","git","verify"].filter(w=>t.includes(w)).length;if(explain.length<140||hits<7){setFeedback("Go deeper: explain repository discovery/search, syntax/dependencies, scoped edits, shell sandbox, test-feedback repair loop and Git/diff verification.");return;}setFeedback("Strong. You described a coding agent as an iterative software-engineering runtime around a model, not as autocomplete with shell access.");progress.completeTask("code-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 17 · CODING AGENT LAB</span><h1>Give a model a repo and shell access and you still do not have a reliable coding agent.</h1><p>A useful coding agent must <b>discover, inspect, edit, execute, observe failures, repair and verify</b> inside controlled boundaries. You are going to run that loop on a tiny bug.</p><TaskStamp done={done===10}>{done}/10 coding missions complete</TaskStamp></div><div className={styles.mini}><CodeAgentWorkbench files={files} activePath={activePath} actions={actions} testStatus={testStatus} onSelect={setActivePath}/></div></section>

  <LessonSection id="context" onVisit={progress.markVisited} className={styles.scene}><h2>1. Decide what belongs in repository context.</h2>{contextCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["use","skip"].map(choice=><button key={choice} className={`${styles.button} ${context[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(context,setContext,contextCases,i,choice,"code-context")}>{choice}</button>)}</div>)}<p>Context is scarce. Good agents discover relevant files and fetch them on demand instead of dumping the whole repository into every model turn.</p></LessonSection>

  <LessonSection id="discovery" onVisit={progress.markVisited} className={styles.scene}><h2>2. Search the codebase like an engineer.</h2>{discoveryCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["code-search","references","test-search","bad"].map(choice=><button key={choice} className={`${styles.button} ${discovery[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(discovery,setDiscovery,discoveryCases,i,choice,"code-discovery")}>{choice}</button>)}</div>)}<CodeAgentWorkbench files={files} activePath={activePath} actions={actions} testStatus={testStatus} onSelect={setActivePath}/></LessonSection>

  <LessonSection id="ast" onVisit={progress.markVisited} className={styles.scene}><h2>3. AST intuition: code is structure, not just text.</h2>{astCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["FunctionDeclaration","CallExpression","ImportDeclaration","ReturnStatement"].map(choice=><button key={choice} className={`${styles.button} ${ast[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(ast,setAst,astCases,i,choice,"code-ast")}>{choice}</button>)}</div>)}<div className={styles.graph}><span>checkout.ts</span><b>imports / calls →</b><span>cart.ts · calculateTotal()</span><b>tested by →</b><span>cart.test.ts</span></div></LessonSection>

  <LessonSection id="shell" onVisit={progress.markVisited} className={styles.scene}><h2>4. Shell access should be useful and boringly constrained.</h2>{shellCases.map((c,i)=><div className={styles.card} key={c[0]}><code>$ {c[0]}</code>{["allow","deny"].map(choice=><button key={choice} className={`${styles.button} ${shell[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(shell,setShell,shellCases,i,choice,"code-shell")}>{choice}</button>)}</div>)}<p>A coding-agent sandbox can restrict workspace paths, network, commands, credentials, CPU/memory/time and process privileges while still allowing tests/build tools.</p></LessonSection>

  <LessonSection id="patch" onVisit={progress.markVisited} className={styles.scene}><h2>5. Apply a small patch instead of rewriting the world.</h2><div className={styles.patchOptions}>{patchOptions.map(option=><button key={option.id} className={patch===option.id?styles.active:""} onClick={()=>{setPatch(option.id);setTestStatus("idle");setRepaired(false);if(option.id==="first")progress.completeTask("code-patch")}}><code>{option.label}</code><small>{option.id==="wrong"?"guess":option.id==="first"?"fix obvious unit bug":"fix unit bug + domain constraint"}</small></button>)}</div><CodeAgentWorkbench files={files} activePath="src/cart.ts" actions={actions} testStatus={testStatus}/><p>Start with the obvious fix: <b>subtract discount directly</b>. We deliberately leave a second edge-case bug for the test suite to teach us.</p></LessonSection>

  <LessonSection id="tests" onVisit={progress.markVisited} className={styles.scene}><h2>6. Run tests. The failing assertion becomes new evidence.</h2><button className={styles.primary} disabled={!patch} onClick={runTests}>npm test -- cart.test.ts</button>{testStatus==="fail"&&<div className={styles.failure}><b>FAIL · never returns negative total</b><code>Expected: 0 · Received: -5</code><button className={styles.button} onClick={()=>{setFailureRead(true);progress.completeTask("code-tests")}}>Read failure into next agent turn</button></div>}<CodeAgentWorkbench files={files} activePath="tests/cart.test.ts" actions={actions} testStatus={testStatus}/></LessonSection>

  <LessonSection id="repair" onVisit={progress.markVisited} className={styles.scene}><h2>7. Update the hypothesis, repair, rerun.</h2><p>Observed failure: a discount larger than subtotal can produce a negative total. Choose the repair that encodes the required behavior.</p><div className={styles.patchOptions}>{patchOptions.slice(1).map(option=><button disabled={!failureRead} key={option.id} className={patch===option.id?styles.active:""} onClick={()=>{setPatch(option.id);setTestStatus("idle")}}><code>{option.label}</code></button>)}</div><button className={styles.primary} disabled={!failureRead||patch!=="final"} onClick={runTests}>Run tests again</button>{testStatus==="pass"&&<p className={styles.success}>✓ 2 tests passed. The feedback loop produced a better patch than the first guess.</p>}</LessonSection>

  <LessonSection id="checkpoint" onVisit={progress.markVisited} className={styles.scene}><h2>8. Plan and checkpoint the run.</h2><div className={styles.plan}>{planning.map((step,i)=><button key={step} className={plan.includes(step)?styles.active:""} onClick={()=>{const next=[...new Set([...plan,step])];setPlan(next);if(planning.every(x=>next.includes(x))&&checkpoint)progress.completeTask("code-checkpoint")}}><span>{i+1}</span>{step}</button>)}</div><button className={styles.primary} onClick={()=>{setCheckpoint(true);if(planning.every(x=>plan.includes(x)))progress.completeTask("code-checkpoint")}}>Save run checkpoint</button>{checkpoint&&<pre className={styles.checkpoint}>{JSON.stringify({goal:"fix discount calculation",changed:["src/cart.ts"],tests:testStatus,planCompleted:plan},null,2)}</pre>}</LessonSection>

  <LessonSection id="git" onVisit={progress.markVisited} className={styles.scene}><h2>9. “Tests pass” is not the last line.</h2>{gitCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["good","bad"].map(choice=><button key={choice} className={`${styles.button} ${git[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(git,setGit,gitCases,i,choice,"code-git")}>{choice}</button>)}</div>)}<div className={styles.gitArtifact}><b>COMMIT</b><code>fix(cart): clamp discounted total at zero</code><p>PR: explain reproduction → patch → tests → scope of diff.</p></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain the coding-agent loop.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain repository context/discovery, code search/AST/dependencies, sandboxed shell, patch, test-failure feedback, repair, checkpoint and Git verification."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.success}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Coding Agent Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selectedAnswer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.success}>{quizScore>=9?"★ CODING AGENT LOOP MASTERED":"Pass is 9/10. Revisit search, feedback and verification."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-16-capstone">← Model Routing</Link><Link href="/lessons/browser-computer-use-lab">Browser & Computer Use →</Link></div>
 </main>
}
