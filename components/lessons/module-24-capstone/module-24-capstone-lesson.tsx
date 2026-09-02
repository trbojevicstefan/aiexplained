"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AgentIdentityCard } from "@/components/mascots/agent-identity-card";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { DepthSwitch, LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { TraceSpan, TraceTimeline } from "@/components/visualizations/trace-timeline";
import styles from "./module-24-capstone.module.css";

type Props={progress:LessonProgressApi};
const tasks=["m24-incident","m24-trace","m24-eval-suite","m24-judges","m24-metrics","m24-grounding","m24-privacy","m24-gate","m24-replay","m24-explain"] as const;
const sections=["incident","trace","eval-suite","judges","metrics","grounding","privacy","gate","replay","explain"] as const;
const beforeSpans:TraceSpan[]=[
 {id:"run",kind:"agent",name:"support-agent.run",start:0,duration:1480,status:"warning",tokens:0,cost:.0000,detail:"Customer asks whether a cancelled booking is refundable."},
 {id:"retrieve",parent:"run",kind:"retrieval",name:"retrieve.policy",start:65,duration:310,status:"warning",tokens:0,cost:.0002,detail:"Top result is an OLD 2025 policy. Current 2026 policy ranked second."},
 {id:"llm",parent:"run",kind:"llm",name:"llm.answer",start:405,duration:690,status:"ok",tokens:820,cost:.0094,detail:"Model writes a fluent answer using the retrieved old policy."},
 {id:"tool",parent:"run",kind:"tool",name:"crm.add_note",start:1130,duration:190,status:"ok",tokens:0,cost:.0001,detail:"Incorrect refund statement is saved to CRM note."},
 {id:"ground",parent:"run",kind:"guardrail",name:"grounding.check",start:1340,duration:110,status:"error",tokens:60,cost:.0004,detail:"Answer cites policy language not supported by the current source of truth."},
];
const afterSpans:TraceSpan[]=[
 {id:"run2",kind:"agent",name:"support-agent.run",start:0,duration:1310,status:"ok",tokens:0,cost:0,detail:"Same customer question after retrieval + regression fix."},
 {id:"retrieve2",parent:"run2",kind:"retrieval",name:"retrieve.policy",start:60,duration:245,status:"ok",tokens:0,cost:.0002,detail:"Current 2026 policy is top-ranked after version filter/rerank."},
 {id:"llm2",parent:"run2",kind:"llm",name:"llm.answer",start:335,duration:610,status:"ok",tokens:760,cost:.0087,detail:"Answer is generated from the current policy context."},
 {id:"ground2",parent:"run2",kind:"guardrail",name:"grounding.check",start:970,duration:120,status:"ok",tokens:55,cost:.0004,detail:"Claims are supported by retrieved evidence."},
 {id:"tool2",parent:"run2",kind:"tool",name:"crm.add_note",start:1110,duration:170,status:"ok",tokens:0,cost:.0001,detail:"Verified answer is written to CRM."},
];
const evalMissions=[
 ["golden","Known refund questions with expert-approved expected behavior","◆"],
 ["adversarial","Edge cases: expired policy, ambiguous cancellation reason, missing source","⚠"],
 ["agent","Tool-selection + write-safety checks for the CRM action","⌁"],
 ["efficiency","Latency and cost budget per successful support case","$"],
] as const;
const judgeCases=[
 ["Is the cited refund rule factually supported by the retrieved policy?","human"],
 ["Compare answer A vs B on a repeatable style rubric across 5,000 cases.","llm"],
 ["High-stakes exception where policy interpretation is disputed.","human"],
 ["Choose which of two candidate summaries better follows a fixed format.","pairwise"],
] as const;
const groundingCases=[
 ["Retriever returned the current policy, but answer invents a 48-hour exception.","generation"],
 ["Answer faithfully quotes the chunk, but retriever selected last year's policy.","retrieval"],
 ["Correct evidence and supported answer, but citation points to the wrong document ID.","citation"],
] as const;
const privacyCases=[
 ["trace_id = 8f13…","keep"],["user_email = ana@example.com","redact"],["authorization = Bearer sk-secret…","drop"],["model = reasoning-large","keep"],["full raw customer medical note","redact"],
] as const;
const quiz=[
 ["An eval suite is primarily for…",["Measuring whether the system meets defined quality/behavior requirements","Making the UI prettier","Training every request","Replacing observability"],0],
 ["A trace is especially useful because it…",["Shows the ordered spans/steps inside one run","Guarantees accuracy","Replaces logs and metrics","Stores model weights"],0],
 ["High retrieval recall but low groundedness means…",["Evidence may be present but the generated claims are not sufficiently supported by it","Retrieval found nothing","Latency is zero","The model is deterministic"],0],
 ["Precision asks…",["Of predicted positives, how many were actually positive?","Of actual positives, how many did we find?","How long did inference take?","How much did the run cost?"],0],
 ["Recall asks…",["Of actual positives, how many did we find?","Of predicted positives, how many were correct?","How many tokens were cached?","How many spans exist?"],0],
 ["LLM-as-a-judge should…",["Use explicit rubrics and be validated because judge bias/errors are possible","Always replace humans","See secret production credentials","Be treated as ground truth"],0],
 ["A regression gate should block a release when…",["Required quality/safety thresholds regress beyond policy","Any metric changes at all","The UI color changes","One trace has more spans"],0],
 ["Prompt/context telemetry may require redaction because…",["It can contain PII, secrets or sensitive customer data","Tracing cannot store text","Tokens are illegal","OpenTelemetry forbids metadata"],0],
 ["If a tool call is slow, the best first debugging artifact is often…",["Its trace/span timing plus logs/metadata","A new training dataset","A different tokenizer","A random screenshot"],0],
 ["Cost and latency belong in evals when…",["They are product requirements alongside quality","Never","Only for images","Only during pretraining"],0],
 ["Replay helps because it…",["Lets you compare behavior after a fix under a controlled recorded case","Automatically proves causality","Retrains the model","Deletes production data"],0],
 ["Evals and observability complement each other because…",["Evals define/measure desired behavior; observability helps explain what happened inside real runs","They are identical","Only observability matters","Only offline evals matter"],0],
] as const;

export function Module24CapstoneLesson({progress}:Props){
 const [opened,setOpened]=useState(false),[activeSpan,setActiveSpan]=useState(""),[evals,setEvals]=useState<string[]>([]),[judges,setJudges]=useState<Record<number,string>>({}),[threshold,setThreshold]=useState(.62),[metricTouched,setMetricTouched]=useState(false),[grounding,setGrounding]=useState<Record<number,string>>({}),[privacy,setPrivacy]=useState<Record<number,string>>({}),[qualityGate,setQualityGate]=useState(88),[groundGate,setGroundGate]=useState(94),[latencyGate,setLatencyGate]=useState(1600),[gateChecked,setGateChecked]=useState(false),[replayed,setReplayed]=useState(false),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===tasks.length&&read===sections.length;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const metrics=useMemo(()=>{const tp=Math.max(12,Math.round(42*(1-threshold*.42))),fp=Math.max(1,Math.round(24*(1-threshold))),fn=Math.max(1,42-tp);const precision=tp/(tp+fp),recall=tp/(tp+fn),f1=2*precision*recall/(precision+recall);return{tp,fp,fn,precision,recall,f1}},[threshold]);
 const gatePass=qualityGate<=91&&groundGate<=96&&latencyGate>=1310;
 const selectEval=(id:string)=>{const next=[...new Set([...evals,id])];setEvals(next);if(next.length===evalMissions.length)progress.completeTask("m24-eval-suite")};
 const chooseJudge=(i:number,value:string)=>{const next={...judges,[i]:value};setJudges(next);if(judgeCases.every((c,index)=>next[index]===c[1]))progress.completeTask("m24-judges")};
 const chooseGround=(i:number,value:string)=>{const next={...grounding,[i]:value};setGrounding(next);if(groundingCases.every((c,index)=>next[index]===c[1]))progress.completeTask("m24-grounding")};
 const choosePrivacy=(i:number,value:string)=>{const next={...privacy,[i]:value};setPrivacy(next);if(privacyCases.every((c,index)=>next[index]===c[1]))progress.completeTask("m24-privacy")};
 const checkGate=()=>{setGateChecked(true);if(gatePass)progress.completeTask("m24-gate")};
 const submitExplain=()=>{const t=explain.toLowerCase();const hits=["eval","trace","metric","span","ground","precision","recall","regression","privacy","replay"].filter(w=>t.includes(w)).length;if(explain.length<130||hits<6){setFeedback("Go deeper: connect evals to measurable requirements and traces/spans to debugging real runs. Mention grounding, regression gates and telemetry privacy.");return}setFeedback("Strong. You explained why measurement without traces is hard to debug, and traces without eval criteria do not tell you whether the product is good enough.");progress.completeTask("m24-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 24 · BOSS LAB</span><h1>The answer looked perfect. Production was wrong.</h1><p>A support agent gave a fluent refund answer, wrote it to CRM and still failed the business. Your job is to use <b>evals to define the failure</b> and <b>observability to locate its cause</b>, then prove the fix does not regress.</p><DepthSwitch value={progress.depth} onChange={progress.setDepth}/><TaskStamp done={done===10}>{done}/10 incident missions complete</TaskStamp></div><div className={styles.heroRight}><AgentIdentityCard name="Iris" role="TRACE DETECTIVE" status={done===10?"INCIDENT CLOSED":opened?"INVESTIGATING":"ON CALL"} detail="Iris watches quality gates, traces and evidence — not just whether the final text sounds convincing." variant="bot" accent="#56b7ff" active={opened&&done<10}/><div className={styles.grid3}><div className={styles.card}><b>quality</b><p>91%</p></div><div className={styles.card}><b>grounded</b><p>78%</p></div><div className={styles.card}><b>p95</b><p>1480ms</p></div></div></div></section>

  <LessonSection id="incident" onVisit={progress.markVisited} className={styles.scene}><h2>1. Open the production incident.</h2><p>Symptom: customers get a confident answer citing an old cancellation policy. The final request returned HTTP 200, so “request succeeded” is not a meaningful product eval.</p><button className={styles.primary} onClick={()=>{setOpened(true);progress.completeTask("m24-incident")}}>Open incident #REFUND-204</button>{opened&&<div className={styles.feedback}>Incident loaded: quality regression + evidence mismatch. Now find where it happened.</div>}</LessonSection>

  <LessonSection id="trace" onVisit={progress.markVisited} className={styles.scene}><h2>2. Find the failing span instead of blaming “the model.”</h2><TraceTimeline spans={beforeSpans} active={activeSpan} onSelect={span=>{setActiveSpan(span.id);if(span.id==="retrieve")progress.completeTask("m24-trace")}}/>{activeSpan&&<div className={styles.traceDetail}>{beforeSpans.find(s=>s.id===activeSpan)?.detail}</div>}<p>Hint: the generation span is fluent and internally successful. The key causal clue appears earlier in the retrieval span.</p></LessonSection>

  <LessonSection id="eval-suite" onVisit={progress.markVisited} className={styles.scene}><h2>3. Build an eval suite that catches more than “did the model answer?”</h2><div className={styles.missionRack}>{evalMissions.map(([id,text,icon])=><button key={id} className={`${styles.mission} ${evals.includes(id)?styles.missionOn:""}`} onClick={()=>selectEval(id)}><span>{icon}</span><b>{id}</b><p>{text}</p></button>)}</div></LessonSection>

  <LessonSection id="judges" onVisit={progress.markVisited} className={styles.scene}><h2>4. Pick the right judge for the evaluation risk.</h2>{judgeCases.map((c,i)=><div className={styles.judgeRow} key={c[0]}><p>{c[0]}</p>{["human","llm","pairwise"].map(choice=><button className={`${styles.button} ${judges[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>chooseJudge(i,choice)}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="metrics" onVisit={progress.markVisited} className={styles.scene}><h2>5. Move the classification threshold and watch precision/recall trade places.</h2><div className={styles.metricPanel}><div className={styles.sliderBox}><label>flag-as-unsafe threshold <b>{threshold.toFixed(2)}</b></label><input type="range" min="0.2" max="0.9" step="0.02" value={threshold} onChange={e=>{setThreshold(+e.target.value);setMetricTouched(true)}}/><p>Higher threshold is stricter about calling something positive: false positives often fall, but missed positives can rise.</p></div><div className={styles.stats}><div className={styles.stat}><span>precision</span><b>{Math.round(metrics.precision*100)}%</b></div><div className={styles.stat}><span>recall</span><b>{Math.round(metrics.recall*100)}%</b></div><div className={styles.stat}><span>F1</span><b>{Math.round(metrics.f1*100)}%</b></div><div className={styles.stat}><span>FN</span><b>{metrics.fn}</b></div></div></div><button className={styles.primary} disabled={!metricTouched} onClick={()=>progress.completeTask("m24-metrics")}>Lock the precision/recall mental model</button></LessonSection>

  <LessonSection id="grounding" onVisit={progress.markVisited} className={styles.scene}><h2>6. Retrieval success, grounded generation and citation correctness are three different checks.</h2>{groundingCases.map((c,i)=><div className={styles.judgeRow} key={c[0]}><p>{c[0]}</p>{["retrieval","generation","citation"].map(choice=><button className={`${styles.button} ${grounding[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>chooseGround(i,choice)}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="privacy" onVisit={progress.markVisited} className={styles.scene}><h2>7. Observability must not become a secret-copying machine.</h2><p>Decide what to keep, redact or completely drop from telemetry.</p>{privacyCases.map((c,i)=><div className={styles.privacyRow} key={c[0]}><code>{c[0]}</code>{["keep","redact","drop"].map(choice=><button className={`${styles.button} ${privacy[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} key={choice} onClick={()=>choosePrivacy(i,choice)}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="gate" onVisit={progress.markVisited} className={styles.scene}><h2>8. Configure a regression gate that the fixed candidate can actually pass.</h2><div className={styles.gateGrid}><div className={styles.gateCard}><label>minimum task success <b>{qualityGate}%</b></label><input type="range" min="80" max="96" value={qualityGate} onChange={e=>setQualityGate(+e.target.value)}/></div><div className={styles.gateCard}><label>minimum groundedness <b>{groundGate}%</b></label><input type="range" min="85" max="99" value={groundGate} onChange={e=>setGroundGate(+e.target.value)}/></div><div className={styles.gateCard}><label>maximum p95 latency <b>{latencyGate}ms</b></label><input type="range" min="1000" max="2200" step="50" value={latencyGate} onChange={e=>setLatencyGate(+e.target.value)}/></div></div><button className={styles.primary} onClick={checkGate}>Run regression gate</button>{gateChecked&&<div className={`${styles.gateState} ${gatePass?styles.pass:styles.fail}`}>{gatePass?"PASS · candidate meets the selected requirements":"BLOCK RELEASE · at least one requirement is stricter than candidate performance"}</div>}</LessonSection>

  <LessonSection id="replay" onVisit={progress.markVisited} className={styles.scene}><h2>9. Replay the same case after the fix.</h2><div className={styles.compare}><div className={styles.run}><h3>BEFORE</h3><ul><li>old policy ranked #1</li><li>grounding check error</li><li>incorrect CRM note</li></ul></div><span className={styles.arrow}>→</span><div className={styles.run}><h3>AFTER</h3><ul><li>version filter + rerank</li><li>grounding check passes</li><li>verified CRM note</li></ul></div></div><button className={styles.primary} onClick={()=>{setReplayed(true);progress.completeTask("m24-replay")}}>Replay controlled incident</button>{replayed&&<><TraceTimeline spans={afterSpans}/><p className={styles.feedback}>✓ Same case, new implementation: groundedness moved from 78% incident behavior to a passing evidence path while latency/cost remain visible.</p></>}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={`${styles.scene} ${styles.explain}`}><h2>10. Explain why a team needs both evals and observability.</h2><textarea value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain what evals tell you, what traces/logs/metrics tell you, how groundedness differs from retrieval, how regression gates work, and why telemetry privacy matters."/><button className={styles.primary} onClick={submitExplain}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 24 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Close the incident first. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.answer:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ MODULE 24 MASTERED — you can measure the system and debug the run.":"Pass is 10/12. Revisit metric trade-offs, grounding and regression gates."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/observability-trace-lab">← Trace Lab</Link><Link href="/">Return to AI Explained →</Link></div>
 </main>
}
