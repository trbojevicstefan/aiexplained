"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { VoiceAgentLabLesson } from "@/components/lessons/voice-agent-lab/voice-agent-lab-lesson";
const sections=[
{id:"asr",title:"ASR and speech-to-text",taskId:"voice-asr"},
{id:"vad",title:"Voice activity detection",taskId:"voice-vad"},
{id:"diarization",title:"Speaker diarization",taskId:"voice-diarization"},
{id:"streaming",title:"Streaming audio",taskId:"voice-streaming"},
{id:"tts",title:"Text-to-speech",taskId:"voice-tts"},
{id:"voice",title:"Voice cloning and safety",taskId:"voice-cloning"},
{id:"turns",title:"Turn detection",taskId:"voice-turns"},
{id:"interruptions",title:"Interruptions and barge-in",taskId:"voice-interruptions"},
{id:"architecture",title:"Real-time voice architecture",taskId:"voice-architecture"},
{id:"explain",title:"Explain voice agents",taskId:"voice-explain"},
] as const;
export default function VoiceAgentLabPage(){return <LessonShell lessonId="voice-agent-lab" lessonTitle="Real-Time Voice Agent Lab" sections={sections}>{progress=><VoiceAgentLabLesson progress={progress}/>}</LessonShell>}
