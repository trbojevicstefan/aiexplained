"use client";
import { LessonShell } from "@/components/course/lesson-shell";
import { SecurityRedTeamLabLesson } from "@/components/lessons/security-red-team-lab/security-red-team-lab-lesson";
const sections=[
{id:"surface",title:"Map the agent attack surface",taskId:"sec-surface"},
{id:"direct",title:"Spot direct prompt injection",taskId:"sec-direct"},
{id:"indirect",title:"Defend against indirect injection",taskId:"sec-indirect"},
{id:"exfiltration",title:"Stop data exfiltration and credential leakage",taskId:"sec-exfiltration"},
{id:"poisoning",title:"Diagnose RAG, memory, tool and MCP poisoning",taskId:"sec-poisoning"},
{id:"agency",title:"Reduce excessive agency",taskId:"sec-agency"},
{id:"permissions",title:"Configure least-privilege gates",taskId:"sec-permissions"},
{id:"secrets",title:"Handle PII and secrets",taskId:"sec-secrets"},
{id:"threat-model",title:"Build a threat model",taskId:"sec-threat-model"},
{id:"explain",title:"Explain agent security back",taskId:"sec-explain"},
] as const;
export default function SecurityRedTeamLabPage(){return <LessonShell lessonId="security-red-team-lab" lessonTitle="Security Red-Team Control Room" sections={sections}>{progress=><SecurityRedTeamLabLesson progress={progress}/>}</LessonShell>}
