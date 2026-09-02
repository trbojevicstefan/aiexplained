"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonProgressApi } from "@/components/course/lesson-shell";
import { LessonSection, TaskStamp } from "@/components/course/lesson-primitives";
import { VoicePipeline } from "@/components/visualizations/voice-pipeline";
import styles from "./voice-agent-lab.module.css";

type Props={progress:LessonProgressApi};
const asrCases=[
["Audio speech → text transcript","asr"],["Text response → synthetic audio","tts"],["Detect whether someone is speaking","vad"],["Identify which speaker owns each segment","diarization"],
] as const;
const vadCases=[
["Quiet room, no speech","silence"],["User begins saying 'Can you…'","speech"],["Keyboard noise only","non-speech"],["User pauses briefly mid-sentence","maybe-hold"],
] as const;
const diarizationCases=[
["00:00–00:04 'Welcome everyone'","speaker-a"],["00:04–00:08 'Thanks, I have a question'","speaker-b"],["00:08–00:11 'Go ahead'","speaker-a"],
] as const;
const streamingCases=[
["Wait for whole 60-second recording before transcribing","batch"],["Emit partial transcript chunks while audio arrives","stream"],["Start TTS only after full 2-minute answer is generated","batch"],["Generate/synthesize response incrementally","stream"],
] as const;
const ttsCases=[
["Text tokens → acoustic/speech representation → audio waveform","tts"],["Audio → transcript","asr"],["Change prosody/rate/voice where supported","tts-control"],["TTS output proves the factual answer is correct","false"],
] as const;
const cloneCases=[
["User explicitly consents to clone their own voice for their assistant","consent"],["Clone a colleague's voice secretly from meeting recordings","reject"],["Clearly disclose synthetic voice in a sensitive automated call","disclose"],["Treat voice biometric-like data as non-sensitive public text","reject"],
] as const;
const turnCases=[
["User stops speaking and remains silent past threshold","end-turn"],["User says 'uh…' and pauses 150ms","hold"],["Semantic model predicts utterance likely incomplete","hold"],["Push-to-talk button released","end-turn"],
] as const;
const interruptionCases=[
["Agent speaks; user starts talking","barge-in"],["Agent speaks; room fan makes noise","ignore-noise"],["User interrupts with 'stop'","barge-in"],["TTS finishes naturally","normal-end"],
] as const;
const architectureCases=[
["Mic stream enters first","input"],["VAD/turn detector decides speech boundaries","turn"],["ASR/audio model extracts content","perception"],["Agent/model decides response/tools","agent"],["TTS renders response audio","output"],["Barge-in can cancel/duck current TTS","interrupt"],
] as const;
const quiz=[
["ASR stands for a system that…",["Recognizes/transcribes speech from audio","Synthesizes speech from text","Detects browser DOM","Routes models"],0],
["VAD is mainly used to…",["Detect speech activity vs silence/non-speech","Identify exact speaker identity only","Generate images","Store memory"],0],
["Speaker diarization answers…",["Who spoke when?","What model weights changed?","Which DOM selector to click?","What image style to use?"],0],
["Streaming speech systems can reduce perceived latency because…",["They process/emit partial information before the entire utterance/response finishes","They train the model faster","They eliminate networking","They always use fewer tokens"],0],
["TTS converts…",["Text/linguistic representation into synthesized speech audio","Audio into text","Pixels into vectors","Tools into JSON"],0],
["Voice cloning should consider…",["Consent, disclosure, identity/impersonation and sensitive voice-data risks","Only sampling temperature","Only tokenization","Only CSS"],0],
["Turn detection is trivial because silence always means the user is done.",["True","False"],1],
["Barge-in handling may require…",["Stopping/ducking TTS and immediately capturing a new user turn","Deleting memory","Retraining ASR","Ignoring the user"],0],
["A real-time voice agent can use either transcript-based or more direct audio-model pathways depending on architecture.",["True","False"],0],
["Good voice-agent UX depends heavily on latency and interruption behavior.",["True","False"],0],
] as const;

export function VoiceAgentLabLesson({progress}:Props){
 const [stage,setStage]=useState(0),[asr,setAsr]=useState<Record<number,string>>({}),[vad,setVad]=useState<Record<number,string>>({}),[threshold,setThreshold]=useState(420),[diarization,setDiarization]=useState<Record<number,string>>({}),[streaming,setStreaming]=useState<Record<number,string>>({}),[chunkMs,setChunkMs]=useState(160),[tts,setTts]=useState<Record<number,string>>({}),[clone,setClone]=useState<Record<number,string>>({}),[turns,setTurns]=useState<Record<number,string>>({}),[interruptions,setInterruptions]=useState<Record<number,string>>({}),[interrupted,setInterrupted]=useState(false),[architecture,setArchitecture]=useState<Record<number,string>>({}),[explain,setExplain]=useState(""),[feedback,setFeedback]=useState(""),[answers,setAnswers]=useState<Record<number,number>>({});
 const tasks=["voice-asr","voice-vad","voice-diarization","voice-streaming","voice-tts","voice-cloning","voice-turns","voice-interruptions","voice-architecture","voice-explain"],sections=["asr","vad","diarization","streaming","tts","voice","turns","interruptions","architecture","explain"];
 const done=tasks.filter(t=>progress.completedTasks[t]).length,read=sections.filter(s=>progress.visitedSections.has(s)).length,unlocked=done===10&&read===10;
 const quizScore=quiz.reduce((sum,q,i)=>sum+(answers[i]===q[2]?1:0),0),quizDone=Object.keys(answers).length===quiz.length;
 const solve=(current:Record<number,string>,setter:(next:Record<number,string>)=>void,cases:readonly (readonly [string,string])[],i:number,choice:string,task:string)=>{const next={...current,[i]:choice};setter(next);if(cases.every((x,j)=>next[j]===x[1]))progress.completeTask(task)};
 const latency=useMemo(()=>Math.round(chunkMs+threshold*.35+180+120),[chunkMs,threshold]);
 const submit=()=>{const t=explain.toLowerCase();const hits=["asr","vad","diar","stream","tts","turn","interrupt","barge","latency","audio"].filter(w=>t.includes(w)).length;if(explain.length<145||hits<7){setFeedback("Go deeper: explain ASR/VAD/diarization, streaming, TTS, turn detection, interruption/barge-in and the real-time latency pipeline.");return;}setFeedback("Strong. You described a real-time voice agent as a latency-sensitive streaming control loop, not just three offline APIs glued together.");progress.completeTask("voice-explain")};
 return <main className={styles.root}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>MODULE 18 · REAL-TIME VOICE AGENT LAB</span><h1>Conversation is a race against awkward silence.</h1><p>A voice agent must hear speech boundaries, understand content, decide and act, speak back quickly, and stop itself the instant the user interrupts.</p><TaskStamp done={done===10}>{done}/10 voice missions complete</TaskStamp></div><div><VoicePipeline active={stage} interrupted={interrupted}/></div></section>

  <LessonSection id="asr" onVisit={progress.markVisited} className={styles.scene}><h2>1. Separate ASR, TTS, VAD and diarization.</h2><VoicePipeline active={2}/>{asrCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["asr","tts","vad","diarization"].map(choice=><button key={choice} className={`${styles.button} ${asr[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>{setStage(2);solve(asr,setAsr,asrCases,i,choice,"voice-asr")}}>{choice}</button>)}</div>)}<div className={styles.transcript}><span>AUDIO</span><b>→ ASR →</b><code>“Can you move my meeting to Friday?”</code></div></LessonSection>

  <LessonSection id="vad" onVisit={progress.markVisited} className={styles.scene}><h2>2. VAD answers: is speech happening now?</h2><label className={styles.slider}>End-of-speech silence threshold <b>{threshold} ms</b><input type="range" min="150" max="1200" step="30" value={threshold} onChange={e=>{setThreshold(+e.target.value);setStage(1);progress.completeTask("voice-vad")}}/></label>{vadCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["speech","silence","non-speech","maybe-hold"].map(choice=><button key={choice} className={`${styles.button} ${vad[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(vad,setVad,vadCases,i,choice,"voice-vad")}>{choice}</button>)}</div>)}<p>A shorter threshold feels faster but may cut off thoughtful pauses. A longer one is safer but makes the agent feel sluggish.</p></LessonSection>

  <LessonSection id="diarization" onVisit={progress.markVisited} className={styles.scene}><h2>3. Diarization: who spoke when?</h2>{diarizationCases.map((c,i)=><div className={styles.speakerRow} key={c[0]}><code>{c[0]}</code>{["speaker-a","speaker-b"].map(choice=><button key={choice} className={`${styles.button} ${diarization[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(diarization,setDiarization,diarizationCases,i,choice,"voice-diarization")}>{choice}</button>)}</div>)}<p>Diarization groups/labels speaker turns; speaker verification/identity is a different problem with its own privacy and security concerns.</p></LessonSection>

  <LessonSection id="streaming" onVisit={progress.markVisited} className={styles.scene}><h2>4. Stream early instead of waiting for everything.</h2><label className={styles.slider}>Audio chunk size <b>{chunkMs} ms</b><input type="range" min="40" max="1000" step="20" value={chunkMs} onChange={e=>{setChunkMs(+e.target.value);setStage(2);progress.completeTask("voice-streaming")}}/></label><div className={styles.metrics}><div><span>toy response latency</span><b>~{latency} ms</b></div><div><span>chunk</span><b>{chunkMs} ms</b></div><div><span>mode</span><b>{chunkMs<400?"responsive":"chunky"}</b></div></div>{streamingCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["batch","stream"].map(choice=><button key={choice} className={`${styles.button} ${streaming[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(streaming,setStreaming,streamingCases,i,choice,"voice-streaming")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="tts" onVisit={progress.markVisited} className={styles.scene}><h2>5. TTS turns the answer back into speech.</h2><VoicePipeline active={5}/>{ttsCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["tts","asr","tts-control","false"].map(choice=><button key={choice} className={`${styles.button} ${tts[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>{setStage(5);solve(tts,setTts,ttsCases,i,choice,"voice-tts")}}>{choice}</button>)}</div>)}<div className={styles.voiceBubble}>“Done — I moved the meeting to Friday at 10:30.” <span>synthetic speech output</span></div></LessonSection>

  <LessonSection id="voice" onVisit={progress.markVisited} className={styles.scene}><h2>6. Voice cloning is a capability with identity implications.</h2>{cloneCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["consent","reject","disclose"].map(choice=><button key={choice} className={`${styles.button} ${clone[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(clone,setClone,cloneCases,i,choice,"voice-cloning")}>{choice}</button>)}</div>)}<p>Voice synthesis can create strong impersonation effects. Product design should address consent, authorization, disclosure where appropriate, and secure handling of voice samples/identity signals.</p></LessonSection>

  <LessonSection id="turns" onVisit={progress.markVisited} className={styles.scene}><h2>7. “Is the user done?” is not the same as “is there silence?”</h2>{turnCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["end-turn","hold"].map(choice=><button key={choice} className={`${styles.button} ${turns[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(turns,setTurns,turnCases,i,choice,"voice-turns")}>{choice}</button>)}</div>)}<p>Turn detection may combine acoustic silence, timing, push-to-talk state, endpointing heuristics and semantic prediction of whether an utterance sounds complete.</p></LessonSection>

  <LessonSection id="interruptions" onVisit={progress.markVisited} className={styles.scene}><h2>8. Let the user interrupt the machine.</h2><VoicePipeline active={5} interrupted={interrupted}/><button className={styles.primary} onClick={()=>{setInterrupted(true);setStage(1);progress.completeTask("voice-interruptions")}}>🎙 User starts speaking during TTS</button><button className={styles.button} onClick={()=>setInterrupted(false)}>Reset turn</button>{interruptionCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["barge-in","ignore-noise","normal-end"].map(choice=><button key={choice} className={`${styles.button} ${interruptions[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>solve(interruptions,setInterruptions,interruptionCases,i,choice,"voice-interruptions")}>{choice}</button>)}</div>)}</LessonSection>

  <LessonSection id="architecture" onVisit={progress.markVisited} className={styles.scene}><h2>9. Assemble the full real-time architecture.</h2><VoicePipeline active={stage} interrupted={interrupted}/>{architectureCases.map((c,i)=><div className={styles.card} key={c[0]}><p>{c[0]}</p>{["input","turn","perception","agent","output","interrupt"].map(choice=><button key={choice} className={`${styles.button} ${architecture[i]===choice?(choice===c[1]?styles.good:styles.bad):""}`} onClick={()=>{setStage(i>=4?5:i);solve(architecture,setArchitecture,architectureCases,i,choice,"voice-architecture")}}>{choice}</button>)}</div>)}<p>Some systems use explicit ASR→text→LLM→TTS stages; others use models that accept/generate audio more directly. The control problems — streaming, timing, tools, state and interruption — still matter.</p></LessonSection>

  <LessonSection id="explain" onVisit={progress.markVisited} className={styles.scene}><h2>10. Explain why a voice agent can feel bad even when its answers are smart.</h2><textarea className={styles.textarea} value={explain} onChange={e=>setExplain(e.target.value)} placeholder="Explain ASR, VAD, diarization, streaming, TTS, turn detection, barge-in, latency and real-time voice architecture."/><button className={styles.primary} onClick={submit}>Check explanation</button>{feedback&&<p className={styles.feedback}>{feedback}</p>}</LessonSection>

  <section className={styles.quiz}><h2>Real-Time Voice Agent quiz</h2>{!unlocked?<div className={styles.locked}>🔒 Complete all 10 rooms. {done}/10 tasks · {read}/10 sections.</div>:<>{quiz.map((q,i)=><div className={styles.question} key={q[0]}><strong>{i+1}. {q[0]}</strong>{q[1].map((option,oi)=><button key={option} className={answers[i]===oi?styles.selected:""} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}>{option}</button>)}{answers[i]!==undefined&&<small>{answers[i]===q[2]?"✓ Correct":`Correct: ${q[1][q[2]]}`}</small>}</div>)}<button className={styles.primary} disabled={!quizDone} onClick={()=>progress.saveQuiz(quizScore,quizScore>=9)}>Submit · {quizScore}/10</button>{quizDone&&<p className={styles.feedback}>{quizScore>=9?"★ REAL-TIME VOICE PIPELINE MASTERED":"Pass is 9/10. Revisit turn timing and interruption behavior."}</p>}</>}</section>
  <div className={styles.footer}><Link href="/lessons/image-generation-lab">← Image Generation</Link><Link href="/lessons/module-18-capstone">Multimodal Boss Lab →</Link></div>
 </main>
}
