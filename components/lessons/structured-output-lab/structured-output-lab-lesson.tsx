"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { BookingOutput, SchemaValidator, validateBooking } from "@/components/visualizations/schema-validator";
import styles from "./structured-output-lab.module.css";

type Props={progress:LessonProgressApi};
const syntaxCases=[
["{\"status\":\"booked\"}","valid"],["{'status':'booked'}","invalid"],["{\"duration\":30,}","invalid"],["[\"a\",\"b\"]","valid"],
] as const;
const jsonModeCases=[
["Output must be syntactically valid JSON","json-mode"],["Output must contain exact required fields/types","not-guaranteed"],["Output can still be semantically wrong","not-guaranteed"],
] as const;
const schemaCases=[
["status required string","constraint"],["duration_minutes required number","constraint"],["event_id optional string","constraint"],["'Friday' must be a good business decision","not-schema"],
] as const;
const typeCases=[
["duration_minutes: 30","valid"],["duration_minutes: \"thirty\"","invalid"],["start: \"2026-09-04T10:00:00+02:00\"","valid"],["status: null","invalid"],
] as const;
const constrainedCases=[
["Decoder is restricted so emitted structure follows a grammar/schema","constrained"],["Model freely emits text then parser hopes it matches","post-validate"],["Constrained decoding guarantees business truth","false"],
] as const;
const parseCases=[
["Parse JSON string into application object","parse"],["Validate parsed fields/types","validate"],["Map validated object into typed application model","type"],["Execute destructive side effect before validation","bad"],
] as const;
const retryCases=[
["JSON syntax invalid due transient generation issue","retry-repair"],["Required field missing","retry-repair"],["Provider authentication failed 401","fix-auth"],["Business rule rejects date in the past","fix-input-or-logic"],
] as const;
const toolCases=[
["Return {status,event_id} as final machine-readable answer","structured-output"],["Ask runtime to call calendar.create_event","tool-call"],["Return extracted invoice fields","structured-output"],["Send an email through external system","tool-call"],
] as const;
const quiz=[
["Valid JSON means…",["The syntax is valid JSON","It matches every desired schema","The business decision is correct","It called a tool"],0],
["JSON mode alone may still allow…",["Wrong/missing fields even though output parses as JSON","Invalid JSON syntax always","No strings","Only tool calls"],0],
["JSON Schema can specify…",["Required fields, types and structural constraints","Truth of every claim","Provider auth","GPU memory"],0],
["Application validation should occur…",["Before trusting/using structured data for consequential logic","After destructive action","Only during training","Never"],0],
["Constrained decoding can…",["Restrict generation toward allowed structural grammar/schema","Guarantee semantic truth","Replace auth","Replace business validation"],0],
["Parsing is…",["Turning serialized output into a data structure","Model training","Tool execution","Vector search"],0],
["A schema validation failure can trigger…",["Repair/retry or controlled failure path","Automatic success","Credential rotation always","Model fine-tuning"],0],
["A 401 auth error should be fixed by asking model to reformat JSON repeatedly.",["True","False"],1],
["Structured output and tool calling are…",["Related structured interfaces but different intents: return data vs request external action","Exactly identical","Both tokenizers","Both databases"],0],
["Schema correctness does not guarantee business/domain correctness.",["True","False"],0],
] as const;

export function StructuredOutputLabLesson({progress}:Props){
 const [syntax,setSyntax]=useState<Record<number,string>>({}),[jsonMode,setJsonMode]=useState<Record<number,string>>({}),[schema,setSchema]=useState<Record<number,string>>({}),[types,setTypes]=useState<Record<number,string>>({}),[output,setOutput]=useState<BookingOutput>({status:"booked",start:"2026-09-04T10:00:00+02:00",duration_minutes:"30"}),[constrained,setConstrained]=useState<Record<number,string>>({}),[parse,setParse]=useState<Record<number,string>>({}),[retry,setRetry]=useState<Record<number,string>>({}),[repairCount,setRepairCount]=useState(0),[tools,setTools]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["so-syntax","so-json-mode","so-schema","so-types","so-constrained","so-parse","so-retry","so-repair","so-tools","so-explain"],sections=["syntax","json-mode","schema","types","constrained","parse","retry","repair","tools","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const errors=useMemo(()=>validateBooking(output),[output]);
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const repair=()=>{setRepairCount(c=>c+1);setOutput({status:"booked",event_id:"evt_123",start:"2026-09-04T10:00:00+02:00",duration_minutes:30});progress.completeTask("so-repair")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["json","schema","type","validate","constrained","parse","retry","repair","tool"].filter(w=>t.includes(w)).length;if(explain.length<145||hits<7){setFeedback("Go deeper: distinguish JSON syntax/mode from JSON Schema and typed validation, then explain constrained decoding, parsing, validation/retry/repair and tool-call distinction.");return;}setFeedback("Strong. You described structured output as a contract + validation pipeline rather than assuming 'JSON-looking text' is safe application data.");progress.completeTask("so-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 20 · STRUCTURED OUTPUT LAB</span><h1>“It returned JSON” is not the finish line.</h1><p>Learn the ladder: <b>valid syntax → desired schema → typed validation → business validation</b>. Then use constrained decoding, parsing and repair loops without confusing structured data with tool execution.</p><TaskStamp done={done===10}>{done}/10 structured-output missions complete</TaskStamp></div><SchemaValidator value={output}/></section>

  <LessonSection id="syntax" onVisit={progress.markVisited} className={styles.scene}><h2>1. First gate: does the text parse as JSON at all?</h2>{syntaxCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["valid","invalid"].map(choice=><button key={choice} className={`${styles.button} ${syntax[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(syntax,setSyntax,syntaxCases,i,choice,"so-syntax")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="json-mode" onVisit={progress.markVisited} className={styles.scene}><h2>2. JSON mode can guarantee syntax without guaranteeing your contract.</h2>{jsonModeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["json-mode","not-guaranteed"].map(choice=><button key={choice} className={`${styles.button} ${jsonMode[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(jsonMode,setJsonMode,jsonModeCases,i,choice,"so-json-mode")}>{choice}</button>)}</div>)}<div className={styles.example}><code>{`{"banana": true}`}</code><span>Valid JSON. Terrible booking result.</span></div></LessonSection>

  <LessonSection id="schema" onVisit={progress.markVisited} className={styles.scene}><h2>3. JSON Schema describes structural constraints.</h2>{schemaCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["constraint","not-schema"].map(choice=><button key={choice} className={`${styles.button} ${schema[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(schema,setSchema,schemaCases,i,choice,"so-schema")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="types" onVisit={progress.markVisited} className={styles.scene}><h2>4. Type validation catches values that are valid JSON but wrong for the field.</h2>{typeCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["valid","invalid"].map(choice=><button key={choice} className={`${styles.button} ${types[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(types,setTypes,typeCases,i,choice,"so-types")}>{choice}</button>)}</div>)}<SchemaValidator value={output}/></LessonSection>

  <LessonSection id="constrained" onVisit={progress.markVisited} className={styles.scene}><h2>5. Constrained decoding moves some structure enforcement into generation itself.</h2>{constrainedCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["constrained","post-validate","false"].map(choice=><button key={choice} className={`${styles.button} ${constrained[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(constrained,setConstrained,constrainedCases,i,choice,"so-constrained")}>{choice}</button>)}</div>)}<p>Exact implementation differs by provider/runtime: grammar constraints, token masking or provider-native structured output systems can improve structural reliability. Domain/business validation still remains.</p></LessonSection>

  <LessonSection id="parse" onVisit={progress.markVisited} className={styles.scene}><h2>6. Parse → validate → map to typed application data.</h2>{parseCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["parse","validate","type","bad"].map(choice=><button key={choice} className={`${styles.button} ${parse[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(parse,setParse,parseCases,i,choice,"so-parse")}>{choice}</button>)}</div>)}<div className={styles.pipeline}><span>MODEL TEXT</span><b>JSON.parse</b><span>UNKNOWN OBJECT</span><b>schema validate</b><span>TYPED RESULT</span><b>business rules</b><span>SAFE TO USE</span></div></LessonSection>

  <LessonSection id="retry" onVisit={progress.markVisited} className={styles.scene}><h2>7. Route failures by class.</h2>{retryCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["retry-repair","fix-auth","fix-input-or-logic"].map(choice=><button key={choice} className={`${styles.button} ${retry[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(retry,setRetry,retryCases,i,choice,"so-retry")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="repair" onVisit={progress.markVisited} className={styles.scene}><h2>8. Repair malformed structured output under a bounded retry policy.</h2><SchemaValidator value={output}/><div className={styles.controls}><button className={styles.button} onClick={()=>setOutput({status:"booked",start:"Friday morning",duration_minutes:"30"})}>Generate malformed typed output</button><button className={styles.primary} disabled={errors.length===0} onClick={repair}>Repair / regenerate to schema</button></div>{repairCount>0&&errors.length===0&&<p className={styles.feedback}>✓ Repaired. Production code should cap attempts and surface a controlled error instead of looping forever.</p>}</LessonSection>

  <LessonSection id="tools" onVisit={progress.markVisited} className={styles.scene}><h2>9. Returning data and requesting an action are different contracts.</h2>{toolCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["structured-output","tool-call"].map(choice=><button key={choice} className={`${styles.button} ${tools[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(tools,setTools,toolCases,i,choice,"so-tools")}>{choice}</button>)}</div>)}<div className={styles.split}><div><b>STRUCTURED OUTPUT</b><span>“Here is machine-readable data.”</span></div><div><b>TOOL CALL</b><span>“Runtime, please execute this external action.”</span></div></div></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain the structured-output safety ladder.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain JSON syntax/mode, JSON Schema, types, constrained decoding, parsing, validation, retry/repair and structured-output vs tool-call intent."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Structured Output Lab quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.feedback}>{quizScore>=9?"★ STRUCTURED OUTPUTS MASTERED":"Pass is 9/10. Revisit schema vs semantic/business validity."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/ai-api-request-builder">← AI API Builder</Link><Link href="/lessons/module-20-capstone">API Boss Lab →</Link></div>
 </main>
}
