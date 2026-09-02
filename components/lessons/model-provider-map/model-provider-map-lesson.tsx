"use client";

import Link from "next/link";
import { useState } from "react";
import { AiMascot, AiMascotVariant } from "@/components/mascots/ai-mascot";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import styles from "./model-provider-map.module.css";

type Props={progress:LessonProgressApi};
type Provider={name:string;focus:string;access:string;variant:AiMascotVariant;accent:string};
const providers:Provider[]=[
{name:"OpenAI",focus:"hosted models + developer platform",access:"primarily hosted/API",variant:"bot",accent:"#77dcb4"},
{name:"Anthropic",focus:"hosted language/agent models",access:"hosted/API",variant:"mail",accent:"#f0a976"},
{name:"Google",focus:"Gemini models + cloud/consumer ecosystem",access:"hosted + selected open-weight ecosystem",variant:"star",accent:"#77a8ff"},
{name:"NVIDIA",focus:"models + NeMo / inference infrastructure",access:"hosted, downloadable and enterprise stack mix",variant:"tile",accent:"#8dda72"},
{name:"Meta / Llama",focus:"Llama open-weight model family",access:"downloadable/open-weight under model-specific licenses",variant:"briefcase",accent:"#82aaff"},
{name:"Mistral AI",focus:"hosted + open-weight model families",access:"mixed",variant:"star",accent:"#ffb368"},
{name:"DeepSeek",focus:"hosted + downloadable/open-weight models",access:"mixed",variant:"tile",accent:"#8d9dff"},
{name:"xAI",focus:"hosted Grok ecosystem",access:"primarily hosted plus selected releases",variant:"bot",accent:"#b6b1bd"},
{name:"Cohere",focus:"enterprise language/retrieval models",access:"hosted/enterprise",variant:"briefcase",accent:"#91ddb9"},
{name:"Qwen",focus:"Alibaba/Qwen model ecosystem",access:"hosted + open-weight families",variant:"mail",accent:"#ab91ff"},
];
const providerModelCases=[
["Anthropic","provider"],["A specific 70B checkpoint","model"],["OpenAI","provider"],["A quantized 7B instruction checkpoint","model"],["A cloud endpoint serving a model","service"],
] as const;
const accessCases=[
["Weights are not downloadable; inference is offered through service/API","closed-hosted"],["Weights can be downloaded under a model-specific license","open-weight"],["Weights available means training data/code/license automatically meet every open-source definition","false"],["A company can host an open-weight model for you as a managed endpoint","true"],
] as const;
const sourceCases=[
["Downloadable weights only","open-weight"],["Training/inference code openly licensed, weights accessible, but dataset rights unclear","needs-nuance"],["Marketing page says 'open' but license restricts important uses","needs-nuance"],["Hosted-only API","closed-hosted"],
] as const;
const hostingCases=[
["Need fastest start and no GPU ops team","hosted"],["Need strict on-prem/offline execution with compatible downloadable model","self-host"],["Need elastic managed GPUs but want own open-weight checkpoint","managed-self-host"],["Assume self-hosting is always cheaper","false"],
] as const;
const weightsCases=[
["Learned numeric tensors produced during training","weights"],["Prompt text stored in a config file","not-weights"],["A 4-bit quantized checkpoint contains approximated/compressed weight representation","weights"],["The model's current conversation history","not-weights"],
] as const;
const hubCases=[
["Model card / metadata / license","model-hub"],["Checkpoint shard files","model-hub"],["Tokenizer files/config","model-hub"],["A running GPU process serving requests","runtime"],
] as const;
const choiceCases=[
["Prototype this afternoon; traffic uncertain; no ML infra team","hosted-api"],["Air-gapped document assistant in factory","self-host"],["High-volume open-weight serving on GPU cluster","self-host-server"],["Laptop experiment with small quantized model","local-runtime"],
] as const;
const tradeCases=[
["Provider handles scaling/patching; pay per usage","hosted"],["You control weights/hardware/privacy boundary; you own ops burden","self-host"],["Provider can change model/service behavior/versioning","hosted-risk"],["Local hardware constrains model size/throughput/context","self-host-risk"],
] as const;
const quiz=[
["A provider is…",["An organization/platform that offers or publishes models/services","A single tensor only","A tokenizer merge","A context window"],0],
["A model is…",["A particular trained parameterized artifact/family/version","Always the company serving it","Only an API URL","Only a dataset"],0],
["Open-weight means…",["Model weights are available under some terms/license; it does not automatically imply every open-source freedom","The model is public domain","Training data is always open","No license exists"],0],
["Hosted inference means…",["Someone else operates the serving infrastructure behind an endpoint/service","Weights must be on your laptop","No network exists","The model has no parameters"],0],
["Self-hosting means…",["You/your infrastructure operate the model-serving stack","The model trains itself","No GPU can be used","Only CPU is allowed"],0],
["Model weights are…",["Learned numeric parameters/tensors","Conversation memory","API credentials","Source citations"],0],
["A model hub can distribute…",["Weights, configs, tokenizer artifacts, model cards and licenses","Only runtime GPU heat","Only webhooks","Only browser cookies"],0],
["A downloadable checkpoint can still have restrictive license terms.",["True","False"],0],
["Self-hosting is always cheaper than API use.",["True","False"],1],
["Provider/model capabilities and commercial terms can change, so production choices should be checked against current docs/licenses.",["True","False"],0],
] as const;

export function ModelProviderMapLesson({progress}:Props){
 const [providerModel,setProviderModel]=useState<Record<number,string>>({}),[seenProviders,setSeenProviders]=useState<string[]>([]),[access,setAccess]=useState<Record<number,string>>({}),[source,setSource]=useState<Record<number,string>>({}),[hosting,setHosting]=useState<Record<number,string>>({}),[weights,setWeights]=useState<Record<number,string>>({}),[hub,setHub]=useState<Record<number,string>>({}),[choice,setChoice]=useState<Record<number,string>>({}),[trade,setTrade]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["provider-model","provider-ecosystems","provider-access","provider-opensource","provider-hosting","provider-weights","provider-hub","provider-choice","provider-tradeoffs","provider-explain"],sections=["provider-model","ecosystems","closed-open","opensource","hosted","weights","hub","choice","tradeoffs","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const inspectProvider=(name:string)=>{const next=[...new Set([...seenProviders,name])];setSeenProviders(next);if(next.length===providers.length)progress.completeTask("provider-ecosystems")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["provider","model","hosted","self-host","open-weight","license","weights","checkpoint","hub","runtime"].filter(w=>t.includes(w)).length;if(explain.length<150||hits<7){setFeedback("Go deeper: separate provider from model, hosted from self-hosted, open-weight from broader open-source claims, then explain weights/checkpoints/model-hub artifacts and operational trade-offs.");return;}setFeedback("Strong. You separated company/platform, trained artifact, access/license model and serving infrastructure into distinct layers.");progress.completeTask("provider-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 21 · MODEL PROVIDER MAP</span><h1>A provider is not a model. A model is not an API. “Open” is not one binary switch.</h1><p>Map the ecosystem by layers: who publishes/serves models, which trained artifact you use, whether weights are available, what license applies, and who operates inference.</p><TaskStamp done={done===10}>{done}/10 provider-map missions complete</TaskStamp></div><div className={styles.cloud}>{providers.slice(0,6).map(item=><AiMascot key={item.name} variant={item.variant} accent={item.accent} size={72} mood={seenProviders.includes(item.name)?"excited":"happy"} label={item.name.split(" ")[0].toUpperCase()}/>)}</div></section>

  <LessonSection id="provider-model" onVisit={progress.markVisited} className={styles.scene}><h2>1. Separate provider, model and serving service.</h2>{providerModelCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["provider","model","service"].map(choice=><button key={choice} className={`${styles.button} ${providerModel[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(providerModel,setProviderModel,providerModelCases,i,choice,"provider-model")}>{choice}</button>)}</div>)}<div className={styles.stack}><span>PROVIDER / PUBLISHER</span><b>offers or releases →</b><span>MODEL / CHECKPOINT</span><b>served by →</b><span>API / RUNTIME / ENDPOINT</span></div></LessonSection>

  <LessonSection id="ecosystems" onVisit={progress.markVisited} className={styles.scene}><h2>2. Explore provider ecosystems — but do not memorize vendor names as architecture.</h2><p>This is an ecosystem snapshot, not a permanent product catalog. Model names, access terms and features evolve; always re-check current provider documentation/licenses for production decisions.</p><div className={styles.providers}>{providers.map(item=><button key={item.name} className={seenProviders.includes(item.name)?styles.active:""} onClick={()=>inspectProvider(item.name)}><AiMascot variant={item.variant} accent={item.accent} size={62}/><b>{item.name}</b><span>{item.focus}</span><small>{item.access}</small></button>)}</div><p>Inspect all providers: {seenProviders.length}/{providers.length}.</p></LessonSection>

  <LessonSection id="closed-open" onVisit={progress.markVisited} className={styles.scene}><h2>3. Closed-hosted and open-weight describe access, not intelligence level.</h2>{accessCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["closed-hosted","open-weight","true","false"].map(choice=><button key={choice} className={`${styles.button} ${access[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(access,setAccess,accessCases,i,choice,"provider-access")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="opensource" onVisit={progress.markVisited} className={styles.scene}><h2>4. “Open source AI” needs more nuance than “I can download weights.”</h2>{sourceCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["open-weight","needs-nuance","closed-hosted"].map(choice=><button key={choice} className={`${styles.button} ${source[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(source,setSource,sourceCases,i,choice,"provider-opensource")}>{choice}</button>)}</div>)}<p><b>Open-weight</b> is the safer technical term when the key fact is downloadable parameters. Broader “open source AI” claims can depend on licenses, code, data and the definition being used.</p></LessonSection>

  <LessonSection id="hosted" onVisit={progress.markVisited} className={styles.scene}><h2>5. Hosted vs self-hosted moves the operations boundary.</h2>{hostingCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hosted","self-host","managed-self-host","false"].map(choice=><button key={choice} className={`${styles.button} ${hosting[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(hosting,setHosting,hostingCases,i,choice,"provider-hosting")}>{choice}</button>)}</div>)}<div className={styles.hostCompare}><div><b>HOSTED API</b><span>provider manages model servers, scaling, GPU fleet and much operational complexity</span></div><div><b>SELF-HOST</b><span>you choose weights/runtime/hardware and inherit capacity, upgrades, observability and reliability work</span></div></div></LessonSection>

  <LessonSection id="weights" onVisit={progress.markVisited} className={styles.scene}><h2>6. Weights are the learned numeric artifact.</h2>{weightsCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["weights","not-weights"].map(choice=><button key={choice} className={`${styles.button} ${weights[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(weights,setWeights,weightsCases,i,choice,"provider-weights")}>{choice}</button>)}</div>)}<div className={styles.matrix}>{Array.from({length:36},(_,i)=><i key={i}>{(((i*17)%29)-14)/10}</i>)}</div></LessonSection>

  <LessonSection id="hub" onVisit={progress.markVisited} className={styles.scene}><h2>7. A model hub stores artifacts and metadata; it is not the inference runtime.</h2>{hubCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["model-hub","runtime"].map(choice=><button key={choice} className={`${styles.button} ${hub[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(hub,setHub,hubCases,i,choice,"provider-hub")}>{choice}</button>)}</div>)}<div className={styles.files}><span>model.safetensors</span><span>config.json</span><span>tokenizer.json</span><span>LICENSE</span><span>README / model card</span></div></LessonSection>

  <LessonSection id="choice" onVisit={progress.markVisited} className={styles.scene}><h2>8. Choose the deployment pattern by constraints.</h2>{choiceCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hosted-api","self-host","self-host-server","local-runtime"].map(choice=><button key={choice} className={`${styles.button} ${choice[i]===choice?"":choice[i]}`} onClick={()=>solve(choice,setChoice,choiceCases,i,choice,"provider-choice")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="tradeoffs" onVisit={progress.markVisited} className={styles.scene}><h2>9. The boundary you choose changes cost, control and responsibility.</h2>{tradeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hosted","self-host","hosted-risk","self-host-risk"].map(choice=><button key={choice} className={`${styles.button} ${trade[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(trade,setTrade,tradeCases,i,choice,"provider-tradeoffs")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain the stack without vendor confusion.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain provider vs model vs endpoint, hosted vs self-hosted, open-weight/license nuance, model weights/checkpoints/model hubs and operational trade-offs."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Model Provider Map quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=9)}>Submit · {score}/10</button>{quizDone&&<p className={styles.feedback}>{score>=9?"★ PROVIDER / MODEL / HOSTING STACK MASTERED":"Pass is 9/10. Revisit access and operations boundaries."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-20-capstone">← AI APIs</Link><Link href="/lessons/local-model-garage">Local Model Garage →</Link></div>
 </main>
}
