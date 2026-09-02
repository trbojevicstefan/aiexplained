"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {FrameworkAtlasLesson} from "@/components/lessons/framework-atlas/framework-atlas-lesson";
const sections=[
{id:"abstractions",title:"Stable framework abstractions",taskId:"atlas-abstractions"},
{id:"langgraph",title:"LangGraph conceptual map",taskId:"atlas-langgraph"},
{id:"langchain",title:"LangChain conceptual map",taskId:"atlas-langchain"},
{id:"llamaindex",title:"LlamaIndex conceptual map",taskId:"atlas-llamaindex"},
{id:"semantic-kernel",title:"Semantic Kernel conceptual map",taskId:"atlas-sk"},
{id:"multi-agent",title:"AutoGen and CrewAI map",taskId:"atlas-multi-agent"},
{id:"typed-sdks",title:"Agents SDK PydanticAI Google ADK",taskId:"atlas-typed"},
{id:"choose",title:"Choose abstractions not hype",taskId:"atlas-choose"},
{id:"explain",title:"Explain framework role",taskId:"atlas-explain"},
] as const;
export default function FrameworkAtlasPage(){return <LessonShell lessonId="framework-atlas" lessonTitle="Agent Framework Atlas" sections={sections}>{progress=><FrameworkAtlasLesson progress={progress}/>}</LessonShell>}
