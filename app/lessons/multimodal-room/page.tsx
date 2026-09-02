"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { MultimodalRoomLesson } from "@/components/lessons/multimodal-room/multimodal-room-lesson";
const sections=[
{id:"sensors",title:"Four modality sensors",taskId:"mm-sensors"},
{id:"text",title:"Text representations",taskId:"mm-text"},
{id:"vision",title:"Image patches and vision representations",taskId:"mm-vision"},
{id:"vlm",title:"Vision-language models",taskId:"mm-vlm"},
{id:"audio",title:"Audio and speech representations",taskId:"mm-audio"},
{id:"video",title:"Video adds time",taskId:"mm-video"},
{id:"joint",title:"Joint multimodal embeddings",taskId:"mm-joint"},
{id:"fusion",title:"Combine modalities",taskId:"mm-fusion"},
{id:"limits",title:"Multimodal failure modes",taskId:"mm-limits"},
{id:"explain",title:"Explain multimodal AI",taskId:"mm-explain"},
] as const;
export default function MultimodalRoomPage(){return <LessonShell lessonId="multimodal-room" lessonTitle="Multimodal Sensor Room" sections={sections}>{progress=><MultimodalRoomLesson progress={progress}/>}</LessonShell>}
