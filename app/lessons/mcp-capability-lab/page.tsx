"use client";
import {LessonShell} from "@/components/course/lesson-shell";
import {McpCapabilityLabLesson} from "@/components/lessons/mcp-capability-lab/mcp-capability-lab-lesson";
const sections=[
{id:"roles",title:"Host client server roles",taskId:"mcp-roles"},
{id:"connect",title:"Connect an MCP server",taskId:"mcp-connect"},
{id:"discover",title:"Discover tools resources prompts",taskId:"mcp-discover"},
{id:"transport",title:"stdio vs remote HTTP transport",taskId:"mcp-transport"},
{id:"auth",title:"Authentication authorization scope",taskId:"mcp-auth"},
{id:"local-remote",title:"Local vs remote trust boundary",taskId:"mcp-local-remote"},
{id:"security",title:"Defend against malicious capabilities",taskId:"mcp-security"},
{id:"api-tool",title:"API vs tool vs MCP server",taskId:"mcp-api-tool"},
{id:"explain",title:"Explain MCP back",taskId:"mcp-explain"},
] as const;
export default function McpCapabilityLabPage(){return <LessonShell lessonId="mcp-capability-lab" lessonTitle="MCP Capability Lab" sections={sections}>{progress=><McpCapabilityLabLesson progress={progress}/>}</LessonShell>}
