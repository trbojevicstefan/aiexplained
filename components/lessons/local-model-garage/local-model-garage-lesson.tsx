"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { estimateWeightGb, ModelMemoryEstimator, Precision } from "@/components/visualizations/model-memory-estimator";
import styles from "./local-model-garage.module.css";

type Props={progress:LessonProgressApi};
const formatCases=[
["Sharded tensor checkpoint commonly used with transformer frameworks","safetensors"],["Single/few-file quantized format popular in llama.cpp ecosystem","gguf"],["A file format itself is the inference engine","false"],["Tokenizer/config/license may be separate artifacts from weight files","true"],
] as const;
const precisionCases=[
["FP32","32"],["FP16","16"],["BF16","16"],["INT8","8"],["INT4","4"],
] as const;
const memoryCases=[
["GPU memory used by model weights/KV/runtime buffers","vram"],["System memory used by CPU/offload/runtime/file cache","ram"],["A 70B FP16 model needs only 7 GB for weights","false"],["Quantization can reduce weight memory","true"],
] as const;
const computeCases=[
["Fast matrix operations on compatible GPU hardware","gpu"],["Run small/quantized models without discrete GPU","cpu"],["GPU always required for any local LLM","false"],["CPU/GPU split/offload is possible in some runtimes","true"],
] as const;
const backendCases=[
["NVIDIA GPU software/compute ecosystem","CUDA"],["AMD GPU compute ecosystem on supported hardware/platforms","ROCm"],["Apple GPU/accelerator framework on macOS/iOS ecosystem","Metal"],["One backend automatically runs unchanged on every vendor GPU","false"],
] as const;
const llamaCases=[
["Portable C/C++ inference ecosystem focused on efficient local LLM execution","llama.cpp"],["GGUF is commonly associated with this runtime ecosystem","llama.cpp"],["It is a model provider company","false"],
] as const;
const ollamaCases=[
["Convenient local model runner/manager wrapping local inference workflows","ollama"],["Pull/run models through a simple local CLI/service experience","ollama"],["Ollama means the model weights are trained by Ollama","false"],
] as const;
const serverCases=[
["High-throughput GPU-oriented LLM serving engine with continuous batching focus","vllm"],["NVIDIA-optimized LLM inference stack for NVIDIA GPUs","tensorrt-llm"],["Laptop-first one-command local model manager","ollama"],["Portable CPU/GPU local inference ecosystem","llama.cpp"],
] as const;
const fitCases=[
["8 GB laptop, simple local chat","3B INT4"],["16 GB VRAM workstation, stronger local model","14B INT4"],["24 GB VRAM workstation, quality-first local experiment","32B INT4-ish/offload-aware"],["8 GB VRAM, choose 70B FP16","bad"],
] as const;
const quiz=[
["Safetensors is primarily…",["A tensor/weight serialization format","A GPU backend","An API provider","A prompt format"],0],
["GGUF is strongly associated with…",["Quantized/local inference workflows such as llama.cpp ecosystem","OAuth","Browser DOM","Vector databases"],0],
["INT4 weights use roughly how many bits per stored weight value in the simple mental model?",["4","8","16","32"],0],
["Weight memory roughly scales with…",["Parameter count × bits per parameter","Only prompt length","Only number of users","Only model name"],0],
["KV cache memory tends to grow with…",["Sequence/context length and concurrent decoding, architecture dependent","Only weight file name","Only provider","Only CSS"],0],
["VRAM is…",["Memory directly available to the GPU/device for model/runtime data","A model license","A tokenizer","A webhook"],0],
["CUDA primarily targets…",["NVIDIA GPU compute","Apple Metal only","AMD ROCm only","CPU-only JavaScript"],0],
["llama.cpp is best thought of as…",["A local inference/runtime ecosystem","A hosted model provider only","A model checkpoint","A vector DB"],0],
["vLLM is oriented toward…",["Efficient/high-throughput model serving on supported accelerators","Image editing only","OAuth","Git commits"],0],
["TensorRT-LLM is associated with…",["NVIDIA-optimized LLM inference","Apple CPU-only execution","Browser automation","Knowledge graphs"],0],
["Self-hosted model memory needs include more than just weight bytes.",["True","False"],0],
["Quantization can reduce memory but may introduce quality/performance trade-offs depending on method/hardware/runtime.",["True","False"],0],
] as const;

export function LocalModelGarageLesson({progress}:Props){
 const [formats,setFormats]=useState<Record<number,string>>({}),[precisionAnswers,setPrecisionAnswers]=useState<Record<number,string>>({}),[precision,setPrecision]=useState<Precision>("INT4"),[paramsB,setParamsB]=useState(7),[contextK,setContextK]=useState(8),[streams,setStreams]=useState(1),[vram,setVram]=useState(16),[memory,setMemory]=useState<Record<number,string>>({}),[compute,setCompute]=useState<Record<number,string>>({}),[backends,setBackends]=useState<Record<number,string>>({}),[llama,setLlama]=useState<Record<number,string>>({}),[ollama,setOllama]=useState<Record<number,string>>({}),[servers,setServers]=useState<Record<number,string>>({}),[fit,setFit]=useState<Record<number,string>>({}),[fitTouched,setFitTouched]=useState(false),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["garage-formats","garage-precision","garage-memory","garage-compute","garage-backends","garage-llamacpp","garage-ollama","garage-servers","garage-fit","garage-explain"],sections=["formats","precision","memory","compute","backends","llamacpp","ollama","servers","fit","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const score=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,answer:string,task:string)=>{const next={...current,[i]:answer};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const weightGb=estimateWeightGb(paramsB,precision);const toyKv=Math.max(.2,paramsB*.0125*contextK*streams);const toyTotal=weightGb+toyKv+Math.max(.6,weightGb*.12);const fits=toyTotal<=vram;
 const precisionWeight=useMemo(()=>({FP32:32,FP16:16,BF16:16,INT8:8,INT4:4})[precision],[precision]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["safetensors","gguf","quant","vram","ram","gpu","cpu","cuda","rocm","metal","llama.cpp","ollama","vllm"].filter(w=>t.includes(w)).length;if(explain.length<165||hits<9){setFeedback("Go deeper: explain model formats, quantization/precision, VRAM/RAM, CPU/GPU backends and how llama.cpp/Ollama differ from production serving engines such as vLLM/TensorRT-LLM.");return;}setFeedback("Strong. You described local inference as weights + format + precision + hardware backend + runtime, with memory beyond just checkpoint bytes.");progress.completeTask("garage-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 21 · LOCAL MODEL GARAGE</span><h1>Pick a model. Pick a precision. See if it fits before you download 40 GB.</h1><p>Open the hood: checkpoint formats, quantization, RAM/VRAM, CPU/GPU backends and the local/serving runtimes that actually execute the weights.</p><TaskStamp done={done===10}>{done}/10 garage missions complete</TaskStamp></div><ModelMemoryEstimator paramsB={paramsB} precision={precision} contextK={contextK} concurrency={streams} availableVram={vram}/></section>

  <LessonSection id="formats" onVisit={progress.markVisited} className={styles.scene}><h2>1. Weight format is not the same thing as inference runtime.</h2>{formatCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["safetensors","gguf","true","false"].map(answer=><button key={answer} className={`${styles.button} ${formats[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(formats,setFormats,formatCases,i,answer,"garage-formats")}>{answer}</button>)}</div>)}<div className={styles.formatCompare}><div><b>SAFETENSORS</b><span>tensor serialization commonly used for framework/model-hub checkpoints, often sharded</span></div><div><b>GGUF</b><span>format optimized for llama.cpp-style local deployment/quantized model ecosystems</span></div></div></LessonSection>

  <LessonSection id="precision" onVisit={progress.markVisited} className={styles.scene}><h2>2. Precision changes how many bits represent weights.</h2>{precisionCases.map((c,i)=><div className={styles.card} key={c[0]}><b>{c[0]}</b>{["32","16","8","4"].map(answer=><button key={answer} className={`${styles.button} ${precisionAnswers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(precisionAnswers,setPrecisionAnswers,precisionCases,i,answer,"garage-precision")}>{answer} bits</button>)}</div>)}<div className={styles.controls}><label>Live precision<select value={precision} onChange={e=>{setPrecision(e.target.value as Precision);progress.completeTask("garage-precision")}}>{(["FP32","FP16","BF16","INT8","INT4"] as Precision[]).map(p=><option key={p}>{p}</option>)}</select></label><div><span>Current</span><b>{precisionWeight} bits / weight</b></div></div><p>Quantization is more sophisticated than simply chopping bits off. Methods differ in scaling, grouping/calibration and quality/performance characteristics.</p></LessonSection>

  <LessonSection id="memory" onVisit={progress.markVisited} className={styles.scene}><h2>3. Weights are only the first memory bill.</h2>{memoryCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["vram","ram","true","false"].map(answer=><button key={answer} className={`${styles.button} ${memory[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(memory,setMemory,memoryCases,i,answer,"garage-memory")}>{answer}</button>)}</div>)}<ModelMemoryEstimator paramsB={paramsB} precision={precision} contextK={contextK} concurrency={streams} availableVram={vram}/></LessonSection>

  <LessonSection id="compute" onVisit={progress.markVisited} className={styles.scene}><h2>4. CPU and GPU are execution targets with different strengths.</h2>{computeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["gpu","cpu","true","false"].map(answer=><button key={answer} className={`${styles.button} ${compute[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(compute,setCompute,computeCases,i,answer,"garage-compute")}>{answer}</button>)}</div>)}<div className={styles.computeCompare}><div><b>CPU</b><span>ubiquitous, large system RAM possible, lower matrix throughput for many LLM workloads</span></div><div><b>GPU / ACCELERATOR</b><span>high parallel math throughput and memory bandwidth, but VRAM capacity is a hard practical constraint</span></div></div></LessonSection>

  <LessonSection id="backends" onVisit={progress.markVisited} className={styles.scene}><h2>5. Hardware needs a compatible software backend.</h2>{backendCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["CUDA","ROCm","Metal","false"].map(answer=><button key={answer} className={`${styles.button} ${backends[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(backends,setBackends,backendCases,i,answer,"garage-backends")}>{answer}</button>)}</div>)}<div className={styles.backendRow}><span>NVIDIA → CUDA</span><span>AMD → ROCm (supported environments)</span><span>Apple → Metal</span></div></LessonSection>

  <LessonSection id="llamacpp" onVisit={progress.markVisited} className={styles.scene}><h2>6. llama.cpp: portable local inference, especially famous for quantized GGUF workflows.</h2>{llamaCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["llama.cpp","false"].map(answer=><button key={answer} className={`${styles.button} ${llama[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(llama,setLlama,llamaCases,i,answer,"garage-llamacpp")}>{answer}</button>)}</div>)}<pre className={styles.terminal}>$ llama-cli -m model.gguf -p "Explain KV cache"</pre></LessonSection>

  <LessonSection id="ollama" onVisit={progress.markVisited} className={styles.scene}><h2>7. Ollama: a convenient local model-management/run experience.</h2>{ollamaCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["ollama","false"].map(answer=><button key={answer} className={`${styles.button} ${ollama[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(ollama,setOllama,ollamaCases,i,answer,"garage-ollama")}>{answer}</button>)}</div>)}<pre className={styles.terminal}>$ ollama run some-local-model</pre><p>Ollama is a runtime/management experience, not a statement about who trained the underlying model.</p></LessonSection>

  <LessonSection id="servers" onVisit={progress.markVisited} className={styles.scene}><h2>8. Laptop runner and production inference server are different jobs.</h2>{serverCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["vllm","tensorrt-llm","ollama","llama.cpp"].map(answer=><button key={answer} className={`${styles.button} ${servers[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(servers,setServers,serverCases,i,answer,"garage-servers")}>{answer}</button>)}</div>)}<div className={styles.serverScale}><span>LOCAL DEV</span><b>llama.cpp / Ollama</b><i>↔</i><span>GPU SERVING</span><b>vLLM / TensorRT-LLM-style stacks</b></div></LessonSection>

  <LessonSection id="fit" onVisit={progress.markVisited} className={styles.scene}><h2>9. Configure the garage and make it fit.</h2><div className={styles.sliders}><label>Model size <b>{paramsB}B</b><input type="range" min="1" max="70" step="1" value={paramsB} onChange={e=>{setParamsB(+e.target.value);setFitTouched(true)}}/></label><label>VRAM <b>{vram} GB</b><input type="range" min="4" max="48" step="2" value={vram} onChange={e=>{setVram(+e.target.value);setFitTouched(true)}}/></label><label>Context <b>{contextK}k</b><input type="range" min="2" max="64" step="2" value={contextK} onChange={e=>{setContextK(+e.target.value);setFitTouched(true)}}/></label><label>Concurrent streams <b>{streams}</b><input type="range" min="1" max="8" value={streams} onChange={e=>{setStreams(+e.target.value);setFitTouched(true)}}/></label></div><ModelMemoryEstimator paramsB={paramsB} precision={precision} contextK={contextK} concurrency={streams} availableVram={vram}/>{fitCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["3B INT4","14B INT4","32B INT4-ish/offload-aware","bad"].map(answer=><button key={answer} className={`${styles.button} ${fit[i]===answer?(answer===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(fit,setFit,fitCases,i,answer,"garage-fit")}>{answer}</button>)}</div>)}<button className={styles.primary} disabled={!fitTouched||!fits} onClick={()=>progress.completeTask("garage-fit")}>Park this model in {vram} GB VRAM</button><p>Current simplified total: <b>{toyTotal.toFixed(1)} GB</b>. The estimator is educational; real architecture/runtime measurements decide production fit.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain what actually runs a local model.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain Safetensors/GGUF, FP16/BF16/INT8/INT4, VRAM/RAM/KV, CPU/GPU, CUDA/ROCm/Metal, llama.cpp/Ollama/vLLM/TensorRT-LLM."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Local Model Garage quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(score,score>=10)}>Submit · {score}/12</button>{quizDone&&<p className={styles.feedback}>{score>=10?"★ LOCAL MODEL STACK MASTERED":"Pass is 10/12. Revisit memory math and runtimes/backends."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/model-provider-map">← Provider Map</Link><Link href="/lessons/module-21-capstone">Model Garage Boss →</Link></div>
 </main>
}
