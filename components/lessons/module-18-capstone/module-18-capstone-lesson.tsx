"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { Modality, ModalityPipeline } from "@/components/visualizations/modality-pipeline";
import { VoicePipeline } from "@/components/visualizations/voice-pipeline";
import styles from "./module-18-capstone.module.css";

type Props={progress:LessonProgressApi};
const routeCases=[
["User types: 'summarize this policy'","text"],["User uploads screenshot of damaged product","image"],["User asks question through microphone","audio"],["User uploads 8-second clip showing when device fails","video"],
] as const;
const groundCases=[
["Screenshot shows error code E42; spoken question asks 'what does this mean?'","image+audio"],["Video shows failure only after third button press","video-temporal"],["Transcript says 'red cable' but image clearly shows blue cable","conflict"],["Tiny serial number is unreadable due to blur","perception-limit"],
] as const;
const generationCases=[
["Create a brand-new product concept image from prompt","generate"],["Replace scratched area inside existing photo","inpaint"],["Extend background to make image wider","outpaint"],["Transform photo toward illustration while keeping composition","img2img"],
] as const;
const conditioningCases=[
["Keep person's pose while changing outfit","pose"],["Keep room geometry/layout","depth"],["Preserve drawing edges while changing materials","edge"],["Only specify concept/style in natural language","text"],
] as const;
const failureCases=[
["ASR transcript says 'fifteen' instead of 'fifty'","asr"],["Image model misses small warning icon","vision"],["Video sampler skips the frame containing spark","temporal"],["Generated edit changes unmasked face region","generation-control"],["Voice agent talks over user after interruption","turn-control"],
] as const;
const quiz=[
["Multimodal systems typically convert raw modality inputs into…",["Representations the model/system can compute over","Human sensations","Only database rows","Git commits"],0],
["A VLM is designed to combine…",["Visual and language information","Only TTS and ASR","Only diffusion noise","Only SQL"],0],
["Video reasoning can fail if…",["Temporal sampling misses a brief important event","The image has a stable DOM id","The tokenizer uses BPE","A tool returns JSON"],0],
["Latent diffusion commonly performs denoising…",["In a learned compressed latent representation","Only on browser pixels","Only in model routing","Only in user memory"],0],
["Inpainting and outpainting differ because…",["Inpainting edits masked interior regions; outpainting extends beyond existing boundaries","They are identical","One is ASR","One is routing"],0],
["Structural conditioning can help preserve…",["Pose/edges/depth/layout","Cookies","Git history","Token IDs"],0],
["ASR and TTS are inverse-ish speech pipeline directions: audio→text vs text→audio.",["True","False"],0],
["Diarization mainly answers…",["Who spoke when?","What was said exactly?","Which model to route?","Which image mask?"],0],
["Barge-in handling should…",["Stop/duck current speech output and accept new user input","Ignore the user","Delete memory","Restart training"],0],
["A multimodal failure can occur before reasoning, at perception/grounding stage.",["True","False"],0],
["Voice cloning raises…",["Consent/identity/impersonation concerns","Only CSS concerns","No new product risk","Only model-cost issues"],0],
["The exact multimodal architecture is identical across all modern systems.",["True","False"],1],
] as const;

export function Module18CapstoneLesson({progress}:Props){
 const [active,setActive]=useState<Modality>("text"),[seen,setSeen]=useState<Modality[]>([]),[route,setRoute]=useState<Record<number,string>>({}),[ground,setGround]=useState<Record<number,string>>({}),[generate,setGenerate]=useState<Record<number,string>>({}),[condition,setCondition]=useState<Record<number,string>>({}),[voiceParts,setVoiceParts]=useState<string[]>([]),[interrupted,setInterrupted]=useState(false),[failures,setFailures]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["m18-route","m18-ground","m18-generate","m18-condition","m18-voice","m18-interrupt","m18-failures","m18-explain"],sections=["route","ground","generate","condition","voice","interrupt","failures","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===8&&read===8;
 const quizScore=quiz.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const inspect=(m:Modality)=>{setActive(m);setSeen(s=>[...new Set([...s,m])])};
 const voiceRequired=["mic","vad","asr","agent","tools","tts","speaker"];
 const collectVoice=(part:string)=>{const next=[...new Set([...voiceParts,part])];setVoiceParts(next);if(voiceRequired.every(x=>next.includes(x)))progress.completeTask("m18-voice")};
 const submit=()=>{const t=explain.toLowerCase();const hits=["text","image","audio","video","representation","vlm","diffusion","condition","asr","tts","turn","interrupt"].filter(w=>t.includes(w)).length;if(explain.length<160||hits<9){setFeedback("Go deeper: cover modality representations/fusion, vision-language grounding, diffusion/edit conditioning and the streaming ASR/VAD/agent/TTS/barge-in voice loop.");return;}setFeedback("Strong. You connected perception, generation and real-time voice control into one multimodal system without collapsing their distinct failure modes.");progress.completeTask("m18-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 18 · MULTIMODAL BOSS LAB</span><h1>One assistant. Four senses. Three different kinds of failure.</h1><p>Route modalities, ground evidence, edit images under structure constraints and run a real-time voice loop that knows how to be interrupted.</p><TaskStamp done={done===8}>{done}/8 boss missions complete</TaskStamp></div><div><ModalityPipeline active={active} seen={seen} onSelect={inspect}/></div></section>

  <LessonSection id="route" onVisit={progress.markVisited} className={styles.scene}><h2>1. Route raw inputs to the right perception path.</h2>{routeCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["text","image","audio","video"].map(choice=><button key={choice} className={`${styles.button} ${route[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>{setActive(choice as Modality);solve(route,setRoute,routeCases,i,choice,"m18-route")}}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="ground" onVisit={progress.markVisited} className={styles.scene}><h2>2. Ground the answer in cross-modal evidence.</h2>{groundCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["image+audio","video-temporal","conflict","perception-limit"].map(choice=><button key={choice} className={`${styles.button} ${ground[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(ground,setGround,groundCases,i,choice,"m18-ground")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="generate" onVisit={progress.markVisited} className={styles.scene}><h2>3. Choose generation or editing mode.</h2>{generationCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["generate","inpaint","outpaint","img2img"].map(choice=><button key={choice} className={`${styles.button} ${generate[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(generate,setGenerate,generationCases,i,choice,"m18-generate")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="condition" onVisit={progress.markVisited} className={styles.scene}><h2>4. Select the condition that protects important structure.</h2>{conditioningCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["pose","depth","edge","text"].map(choice=><button key={choice} className={`${styles.button} ${condition[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(condition,setCondition,conditioningCases,i,choice,"m18-condition")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="voice" onVisit={progress.markVisited} className={styles.scene}><h2>5. Assemble the streaming voice path.</h2><VoicePipeline active={voiceParts.length>=6?5:Math.min(5,voiceParts.length)} interrupted={interrupted}/><div className={styles.chips}>{voiceRequired.map(part=><button key={part} className={voiceParts.includes(part)?styles.active:""} onClick={()=>collectVoice(part)}>{part}</button>)}</div><p>Assemble all seven stages. Depending on architecture, ASR may be an explicit service or audio can flow more directly into/from multimodal models — but real-time state/turn/tool controls remain.</p></LessonSection>

  <LessonSection id="interrupt" onVisit={progress.markVisited} className={styles.scene}><h2>6. User interrupts during TTS. Do not make them fight the robot.</h2><VoicePipeline active={interrupted?1:5} interrupted={interrupted}/><button className={styles.primary} onClick={()=>{setInterrupted(true);progress.completeTask("m18-interrupt")}}>🎙 Barge in: “Wait — stop.”</button>{interrupted&&<p className={styles.feedback}>✓ Current synthetic speech is cancelled/ducked and the pipeline returns to input/turn detection.</p>}</LessonSection>

  <LessonSection id="failures" onVisit={progress.markVisited} className={styles.scene}><h2>7. Diagnose the failing layer before blaming “the model.”</h2>{failureCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["asr","vision","temporal","generation-control","turn-control"].map(choice=><button key={choice} className={`${styles.button} ${failures[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(failures,setFailures,failureCases,i,choice,"m18-failures")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>8. Explain the complete multimodal system.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain modality representations/fusion, VLM grounding, diffusion/edit conditioning, ASR/VAD/diarization/TTS and turn/barge-in control."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Module 18 mastery exam</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all eight boss rooms. {done}/8 tasks · {read}/8 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=10)}>Submit · {quizScore}/12</button>{quizDone&&<p className={styles.feedback}>{quizScore>=10?"★ MULTIMODAL AI MASTERED":"Pass is 10/12. Revisit modality grounding, generation control and voice timing."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/voice-agent-lab">← Voice Agents</Link><Link href="/lessons/knowledge-search-lab">Knowledge & Search →</Link></div>
 </main>
}
