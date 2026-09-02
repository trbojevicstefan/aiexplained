"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { Modality, ModalityPipeline } from "@/components/visualizations/modality-pipeline";
import styles from "./multimodal-room.module.css";

type Props={progress:LessonProgressApi};
const textCases=[
["'red bicycle' → tokenizer → token IDs → embeddings","token-pipeline"],["Token ID 8123 has semantic magnitude 8123","false"],["Text position/order matters to sequence models","true"],
] as const;
const visionCases=[
["Image split into patches/regions then encoded","patches"],["Pixel color values are already language tokens","false"],["Spatial layout matters for visual reasoning","true"],["Small text inside image can challenge perception","true"],
] as const;
const vlmCases=[
["Question: 'What color is the bicycle?' + image","vision-language"],["Pure text completion with no image","text-only"],["Compare two charts embedded as images and explain difference","vision-language"],["Generate a random photo from noise","image-generation"],
] as const;
const audioCases=[
["Raw waveform","signal"],["Spectrogram/time-frequency representation","representation"],["Transcript from ASR","text-derived"],["Speaker identity/timing cues","audio-derived"],
] as const;
const videoCases=[
["Single sampled frame","spatial-only"],["Sequence of frames","temporal"],["Audio track","audio"],["Action 'person opens door' requires order across frames","temporal"],
] as const;
const jointPairs=[
{image:"🐶 on grass",text:"a dog outdoors",score:.94},{image:"🚗 city street",text:"a dog outdoors",score:.18},{image:"🍕 plate",text:"pizza for dinner",score:.91},{image:"🌊 beach",text:"pizza for dinner",score:.09},
];
const fusionCases=[
["Image shows invoice; text asks 'What is total?'","image+text"],["Voice asks question while camera shows broken device","audio+image"],["Video meeting plus transcript plus speaker turns","video+audio+text"],["Plain paragraph summarization","text"],
] as const;
const limitCases=[
["Model misreads tiny serial number in blurry image","perception"],["Model confidently invents object not visible","hallucination"],["Video sampling misses one brief event between frames","temporal-sampling"],["Audio transcription confuses two speakers","diarization/asr"],["Image and prompt conflict; system uses wrong source","fusion/conflict"],
] as const;
const quiz=[
["A multimodal model works directly on human meaning with no representations.",["True","False"],1],
["Image models commonly transform pixels/patches into…",["Learned visual representations/tokens","Only English words","Model weights every request","Cookies"],0],
["A VLM combines…",["Visual and language information/representations","Only audio","Only code","Only diffusion noise"],0],
["Joint embeddings can make…",["Semantically matching image/text representations close in a shared space","Every image identical","Token IDs equal pixel values","ASR unnecessary"],0],
["Video adds an important dimension beyond a single image:…",["Time/order across frames","Only higher resolution","Only text","Only more colors"],0],
["Audio can preserve information that a transcript may lose, such as…",["Speaker/timing/prosody cues","All model weights","DOM selectors","Git history"],0],
["Multimodal fusion means…",["Combining evidence from more than one modality for the task","Turning every modality into a database row only","Always using four models","Only image generation"],0],
["A model can hallucinate in multimodal settings too.",["True","False"],0],
["Visual quality/resolution/cropping can affect model performance.",["True","False"],0],
["The best representation architecture is identical across every multimodal model.",["True","False"],1],
] as const;

export function MultimodalRoomLesson({progress}:Props){
 const [active,setActive]=useState<Modality>("text"),[seen,setSeen]=useState<Modality[]>([]),[text,setText]=useState<Record<number,string>>({}),[vision,setVision]=useState<Record<number,string>>({}),[vlm,setVlm]=useState<Record<number,string>>({}),[audio,setAudio]=useState<Record<number,string>>({}),[video,setVideo]=useState<Record<number,string>>({}),[pairSeen,setPairSeen]=useState<number[]>([]),[fusion,setFusion]=useState<Record<number,string>>({}),[limits,setLimits]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["mm-sensors","mm-text","mm-vision","mm-vlm","mm-audio","mm-video","mm-joint","mm-fusion","mm-limits","mm-explain"],sections=["sensors","text","vision","vlm","audio","video","joint","fusion","limits","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const inspect=(modality:Modality)=>{setActive(modality);const next=[...new Set([...seen,modality])];setSeen(next);if(next.length===4)progress.completeTask("mm-sensors")};
 const bestPair=useMemo(()=>jointPairs.filter(pair=>pair.score>.8),[]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["text","token","image","patch","vision","audio","video","representation","embed","fusion","time"].filter(w=>t.includes(w)).length;if(explain.length<145||hits<8){setFeedback("Go deeper: explain modality-specific inputs/encoders, visual patches, audio/video time, shared/joint representations and multimodal fusion/failure modes.");return;}setFeedback("Strong. You described multimodal AI as representation + fusion machinery, not as one model literally experiencing the world like a human.");progress.completeTask("mm-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 18 · MULTIMODAL SENSOR ROOM</span><h1>Text, pixels, sound and video enter through different doors.</h1><p>The model needs representations it can compute over. Explore how each modality is encoded, how modalities can meet in shared spaces, and why multimodal errors can begin at perception before reasoning even starts.</p><TaskStamp done={done===10}>{done}/10 sensor missions complete</TaskStamp></div><div className={styles.pipeline}><ModalityPipeline active={active} seen={seen} onSelect={inspect}/></div></section>

  <LessonSection id="sensors" onVisit={progress.markVisited} className={styles.scene}><h2>1. Inspect all four sensors.</h2><ModalityPipeline active={active} seen={seen} onSelect={inspect}/><p>Inspect text, image, audio and video: {seen.length}/4. Architecture details differ between model families; the robust mental model is <b>raw modality → modality-aware representation → shared/model computation</b>.</p></LessonSection>

  <LessonSection id="text" onVisit={progress.markVisited} className={styles.scene}><h2>2. Text already taught us the representation pattern.</h2>{textCases.map((c,i)=><div className={styles.card} key={c[0]}><code>{c[0]}</code>{["token-pipeline","true","false"].map(choice=><button key={choice} className={`${styles.button} ${text[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(text,setText,textCases,i,choice,"mm-text")}>{choice}</button>)}</div>)}<div className={styles.flow}>“red bicycle” → <b>[tokens]</b> → <b>[vectors]</b> → transformer representations</div></LessonSection>

  <LessonSection id="vision" onVisit={progress.markVisited} className={styles.scene}><h2>3. Images become visual representations — often through patches/tokens.</h2><div className={styles.patchGrid}>{Array.from({length:16},(_,i)=><button key={i} onClick={()=>progress.completeTask("mm-vision")} style={{opacity:.45+(i%5)*.12}}>{i+1}</button>)}</div>{visionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["patches","true","false"].map(choice=><button key={choice} className={`${styles.button} ${vision[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(vision,setVision,visionCases,i,choice,"mm-vision")}>{choice}</button>)}</div>)}<p>Patchification is a useful transformer-era intuition, not a universal statement that every vision architecture uses identical patch sizes or exact encoding steps.</p></LessonSection>

  <LessonSection id="vlm" onVisit={progress.markVisited} className={styles.scene}><h2>4. Vision-Language Models answer language questions using visual evidence.</h2>{vlmCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["vision-language","text-only","image-generation"].map(choice=><button key={choice} className={`${styles.button} ${vlm[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(vlm,setVlm,vlmCases,i,choice,"mm-vlm")}>{choice}</button>)}</div>)}<div className={styles.vlm}><span>IMAGE REPRESENTATIONS</span><b>+</b><span>QUESTION TOKENS</span><b>→</b><span>ANSWER TOKENS</span></div></LessonSection>

  <LessonSection id="audio" onVisit={progress.markVisited} className={styles.scene}><h2>5. Audio has signal, time and information beyond words.</h2><div className={styles.wave}>{Array.from({length:48},(_,i)=><i key={i} style={{height:`${15+Math.abs(Math.sin(i*.65))*70}%`}}/>)}</div>{audioCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["signal","representation","text-derived","audio-derived"].map(choice=><button key={choice} className={`${styles.button} ${audio[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(audio,setAudio,audioCases,i,choice,"mm-audio")}>{choice}</button>)}</div>)}<p>Speech systems may use end-to-end audio models, ASR transcripts, audio embeddings or combinations. A transcript is useful, but it can discard timing, speaker and acoustic detail.</p></LessonSection>

  <LessonSection id="video" onVisit={progress.markVisited} className={styles.scene}><h2>6. Video adds time and sampling decisions.</h2><div className={styles.frames}>{["person outside door","hand reaches handle","door opens","person enters"].map((frame,i)=><button key={frame} onClick={()=>progress.completeTask("mm-video")}><span>{i+1}</span>{frame}</button>)}</div>{videoCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["spatial-only","temporal","audio"].map(choice=><button key={choice} className={`${styles.button} ${video[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(video,setVideo,videoCases,i,choice,"mm-video")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="joint" onVisit={progress.markVisited} className={styles.scene}><h2>7. Joint embeddings can put matching concepts near each other.</h2><div className={styles.pairs}>{jointPairs.map((pair,i)=><button key={`${pair.image}-${pair.text}`} className={pairSeen.includes(i)?styles.active:""} onClick={()=>{const next=[...new Set([...pairSeen,i])];setPairSeen(next);if(next.length===jointPairs.length)progress.completeTask("mm-joint")}}><b>{pair.image}</b><span>↔</span><b>“{pair.text}”</b><em>{Math.round(pair.score*100)}% toy similarity</em></button>)}</div><p>High-match examples here: {bestPair.length}. CLIP-style training is one famous family of approaches for learning related image/text spaces; architectures and objectives vary.</p></LessonSection>

  <LessonSection id="fusion" onVisit={progress.markVisited} className={styles.scene}><h2>8. Choose which modalities the task actually needs.</h2>{fusionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["text","image+text","audio+image","video+audio+text"].map(choice=><button key={choice} className={`${styles.button} ${fusion[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(fusion,setFusion,fusionCases,i,choice,"mm-fusion")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="limits" onVisit={progress.markVisited} className={styles.scene}><h2>9. Diagnose which layer failed.</h2>{limitCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["perception","hallucination","temporal-sampling","diarization/asr","fusion/conflict"].map(choice=><button key={choice} className={`${styles.button} ${limits[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(limits,setLimits,limitCases,i,choice,"mm-limits")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain multimodal AI without magical language.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain text/image/audio/video inputs, modality-specific representations, VLMs/joint embeddings, time in audio/video, fusion and multimodal failure modes."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Multimodal Sensor Room quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.feedback}>{quizScore>=9?"★ MULTIMODAL REPRESENTATIONS MASTERED":"Pass is 9/10. Revisit modality representations and fusion."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/module-17-capstone">← Applied Agents</Link><Link href="/lessons/image-generation-lab">Image Generation →</Link></div>
 </main>
}
