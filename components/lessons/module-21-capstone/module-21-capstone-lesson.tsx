"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { ModelMemoryEstimator, Precision } from "@/components/visualizations/model-memory-estimator";
import styles from "./module-21-capstone.module.css";

type Props={progress:LessonProgressApi};
const accessCases=[
["Fast prototype, no GPU ops team","hosted-api"],["Air-gapped plant assistant","open-weight-self-host"],["Managed GPU endpoint serving our chosen open-weight checkpoint","managed-open-weight"],["Assume 'open-weight' means no license obligations","bad"],
] as const;
const artifactCases=[
["Framework/server checkpoint in sharded tensor files","safetensors"],["Quantized local llama.cpp-oriented artifact","gguf"],["Tokenizer/config/model card are still relevant artifacts","metadata"],["A GGUF file is automatically an API provider","false"],
] as const;
const precisionCases=[
["70B FP16 on 16GB VRAM","bad-fit"],["7B INT4 on modest local hardware","reasonable"],["BF16/FP16 for accelerator serving where memory allows","reasonable"],["Quantization has zero possible quality/performance trade-offs","false"],
] as const;
const hardwareCases=[
["NVIDIA workstation/server","CUDA"],["Supported AMD GPU environment","ROCm"],["Apple Silicon laptop","Metal"],["CPU-only small quantized experiment","CPU"],
] as const;
const runtimeCases=[
["Simple laptop/local GGUF experiment","llama.cpp"],["Convenient local model management/run UX","Ollama"],["High-throughput multi-request GPU serving","vLLM"],["NVIDIA-optimized deployment stack","TensorRT-LLM"],
] as const;
const deployCases=[
["MacBook / 16GB unified memory / local private assistant","small-quantized-local"],["24GB NVIDIA workstation / single-user quality-first dev","mid-quantized-cuda"],["8× NVIDIA server / multi-user throughput service","server-vllm-tensorrt"],
] as const;
const quiz=[
["Provider and model are different because…",["Provider is the organization/platform; model is the trained artifact/family/version","They are always the same string","Provider is a tensor","Model is only an API key"],0],
["Open-weight primarily tells you…",["Weights are accessible under stated terms/license","Training data is always public domain","No restrictions exist","Inference is always free"],0],
["Safetensors and GGUF are…",["Model/tensor artifact formats used in different ecosystems/workflows","GPU backends","Provider companies","OAuth modes"],0],
["A 7B FP16 model needs roughly how many GB for weights alone in the simple decimal estimate?",["14 GB","7 GB","3.5 GB","28 GB"],0],
["INT4 reduces simple weight storage roughly to…",["One quarter of FP16 weight bytes","Twice FP16","Same as FP32","Zero"],0],
["KV cache/runtime memory means…",["Checkpoint size alone is not the whole inference memory requirement","Weights need no memory","Context length never matters","Concurrency never matters"],0],
["CUDA is mainly associated with…",["NVIDIA GPUs","Apple Metal","AMD ROCm","CPU-only inference"],0],
["Ollama is best described as…",["A local model runner/management experience","A training dataset","A provider-neutral GPU driver","A vector DB"],0],
["vLLM targets…",["Efficient accelerator model serving/high throughput","Only image editing","Only CPU spreadsheets","Only OAuth"],0],
["TensorRT-LLM is especially associated with…",["NVIDIA-optimized LLM inference","Apple audio synthesis","Browser DOM","Knowledge graphs"],0],
["Self-hosting shifts more operations/capacity responsibility to you.",["True","False"],0],
["Production model access/license/runtime choices should be checked against current model/provider documentation.",["True","False"],0],
] as const;

export function Module21CapstoneLesson({progress}:Props){
 const [access,setAccess]=useState<Record<number,string>>({}),[artifact,setArtifact]=useState<Record<number,string>>({}),[precisionCasesState,setPrecisionCasesState]=useState<Record<number,string>>({}),[precision,setPrecision]=useState<Precision>("INT4"),[hardware,setHardware]=useState<Record<number,string>>({}),[runtime,setRuntime]=useState<Record<number,string>>({}),[paramsB,setParamsB]=useState(14),[vram,setVram]=useState(24),[contextK,setContextK]=useState(8),[streams,setStreams]=useState(1),[fitLocked,setFitLocked]=useState(false),[deploy,setDeploy]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m21-access","m21-artifact","m21-precision","m21-hardware","m21-runtime","m21-fit","m21-deploy","m21-explain"],sections=["access","artifact","precision","hardware","runtime","fit","deploy","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const bits=precision==="FP32"?32:precision==="FP16"||precision==="BF16"?16:precision==="INT8"?8:4;const weights=paramsB*bits/8;const toyTotal=weights+Math.max(.2,paramsB*.0125*contextK*streams)+Math.max(.6,weights*.12);const fits=toyTotal<=vram;
 const submit=()=>{const t=explain.toLowerCase();const hits=["provider","open-weight","license","safetensors","gguf","quant","vram","kv","cuda","rocm","metal","ollama","llama.cpp","vllm"].filter(w=>t.includes(w)).length;if(explain.length<170||hits<10){setFeedback("Go deeper: explain access/license, artifact format, quantization, weight+KV/runtime memory, hardware backend and runtime/server choice.");return;}setFeedback("Strong. You can now decompose local model deployment into artifact, precision, hardware, backend, runtime and operations instead of asking only 'can my GPU run it?'.");progress.completeTask("m21-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 21 · DEPLOYMENT GARAGE BOSS</span><h1>Choose the model stack that actually fits the machine.</h1><p>Access model, license, checkpoint format, precision, memory, hardware backend and runtime all have to line up. Build three different deployments without treating “local AI” as one configuration.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><ModelMemoryEstimator paramsB={paramsB} precision={precision} contextK={contextK} concurrency={streams} availableVram={vram}/></section>

  <LessonSection id="access" onVisit={progress.markVisited} className={styles.scene}><h2>1. Choose hosted, self-hosted or managed open-weight access.</h2>{accessCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["hosted-api","open-weight-self-host","managed-open-weight","bad"].map(answer=><button key={answer} className={`${styles.button} ${access[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(access,setAccess,accessCases,i,answer,"m21-access")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="artifact" onVisit={progress.markVisited} className={styles.scene}><h2>2. Choose the artifact format by runtime workflow.</h2>{artifactCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["safetensors","gguf","metadata","false"].map(answer=><button key={answer} className={`${styles.button} ${artifact[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(artifact,setArtifact,artifactCases,i,answer,"m21-artifact")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="precision" onVisit={progress.markVisited} className={styles.scene}><h2>3. Pick precision with memory and quality trade-offs in view.</h2>{precisionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["bad-fit","reasonable","false"].map(answer=><button key={answer} className={`${styles.button} ${precisionCasesState[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(precisionCasesState,setPrecisionCasesState,precisionCases,i,answer,"m21-precision")}>{answer}</button>)}</div>)}<div className={styles.precisions}>{(["FP32","FP16","BF16","INT8","INT4"] as Precision[]).map(p=><button key={p} className={precision===p?styles.active:""} onClick={()=>{setPrecision(p);progress.completeTask("m21-precision")}}>{p}</button>)}</div></LessonSection>

  <LessonSection id="hardware" onVisit={progress.markVisited} className={styles.scene}><h2>4. Match hardware to software backend.</h2>{hardwareCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["CUDA","ROCm","Metal","CPU"].map(answer=><button key={answer} className={`${styles.button} ${hardware[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(hardware,setHardware,hardwareCases,i,answer,"m21-hardware")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="runtime" onVisit={progress.markVisited} className={styles.scene}><h2>5. Choose runtime by job, not popularity.</h2>{runtimeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["llama.cpp","Ollama","vLLM","TensorRT-LLM"].map(answer=><button key={answer} className={`${styles.button} ${runtime[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(runtime,setRuntime,runtimeCases,i,answer,"m21-runtime")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="fit" onVisit={progress.markVisited} className={styles.scene}><h2>6. Fit the selected model under a simplified memory budget.</h2><div className={styles.sliders}><label>Parameters <b>{paramsB}B</b><input type="range" min="1" max="70" value={paramsB} onChange={e=>{setParamsB(+e.target.value);setFitLocked(false)}}/></label><label>VRAM <b>{vram}GB</b><input type="range" min="4" max="80" step="2" value={vram} onChange={e=>{setVram(+e.target.value);setFitLocked(false)}}/></label><label>Context <b>{contextK}k</b><input type="range" min="2" max="64" step="2" value={contextK} onChange={e=>{setContextK(+e.target.value);setFitLocked(false)}}/></label><label>Concurrent streams <b>{streams}</b><input type="range" min="1" max="8" value={streams} onChange={e=>{setStreams(+e.target.value);setFitLocked(false)}}/></label></div><ModelMemoryEstimator paramsB={paramsB} precision={precision} contextK={contextK} concurrency={streams} availableVram={vram}/><button className={styles.primary} disabled={!fits} onClick={()=>{setFitLocked(true);progress.completeTask("m21-fit")}}>Lock fitting configuration</button>{fitLocked&&<p className={styles.feedback}>✓ Simplified budget fits. Real deployment still needs actual runtime measurements, KV architecture details and throughput testing.</p>}</LessonSection>

  <LessonSection id="deploy" onVisit={progress.markVisited} className={styles.scene}><h2>7. Match three machines to three sane deployment patterns.</h2>{deployCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["small-quantized-local","mid-quantized-cuda","server-vllm-tensorrt"].map(answer=><button key={answer} className={`${styles.button} ${deploy[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(deploy,setDeploy,deployCases,i,answer,"m21-deploy")}>{answer}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the complete local deployment stack.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain provider/access/license, Safetensors/GGUF, precision/quantization, VRAM+KV/runtime memory, CUDA/ROCm/Metal and local vs server runtimes."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 21 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ LOCAL MODEL DEPLOYMENT MASTERED":"Pass is 10/12. Revisit artifact, memory and runtime choices."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/local-model-garage">← Local Model Garage</Link><Link href="/lessons/inference-factory">Inference Infrastructure →</Link></div>
 </main>
}
