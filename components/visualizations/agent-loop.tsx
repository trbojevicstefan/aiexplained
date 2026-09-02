"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { AiMascot, AiMascotVariant } from "@/components/mascots/ai-mascot";
import styles from "./agent-loop.module.css";

export type AgentLoopStep = { title: string; detail: string };

const defaultSteps: AgentLoopStep[] = [
  { title: "OBSERVE", detail: "goal + current context" },
  { title: "DECIDE", detail: "choose next action" },
  { title: "ACT", detail: "emit tool/action request" },
  { title: "ENVIRONMENT", detail: "external execution" },
  { title: "RESULT", detail: "tool/output comes back" },
  { title: "UPDATE", detail: "context/state → repeat or stop" },
];

export function AgentLoop({
  activeStep = 0,
  steps = defaultSteps,
  accent = "#70c9ff",
  variant = "bot",
  label = "AGENT",
}: {
  activeStep?: number;
  steps?: AgentLoopStep[];
  accent?: string;
  variant?: AiMascotVariant;
  label?: string;
}) {
  const reduced = useReducedMotion();
  const safeSteps = steps.length ? steps : defaultSteps;
  const normalized = ((activeStep % safeSteps.length) + safeSteps.length) % safeSteps.length;
  const angle = normalized / safeSteps.length * 360 - 90;
  return (
    <div className={styles.wrap} style={{ "--accent": accent } as CSSProperties}>
      <div className={styles.path} />
      <div className={styles.ring} />
      {safeSteps.map((step,index)=><motion.div key={`${step.title}-${index}`} className={`${styles.node} ${styles[`n${index}`] ?? ""} ${index===normalized?styles.active:""}`} animate={index===normalized&&!reduced?{y:[0,-4,0]}:undefined} transition={{duration:.8,repeat:index===normalized?Infinity:0}}><span>{step.title}</span><small>{step.detail}</small></motion.div>)}
      <motion.div className={styles.dot} animate={reduced?undefined:{left:`calc(50% + ${Math.cos(angle*Math.PI/180)*39}%)`,top:`calc(50% + ${Math.sin(angle*Math.PI/180)*39}%)`}} transition={{type:"spring",stiffness:160,damping:22}} />
      <div className={styles.center}><AiMascot variant={variant} mood={normalized===2||normalized===3?"excited":"happy"} size={100} accent={accent} label={label}/></div>
      <div className={styles.caption}>{normalized+1}/{safeSteps.length} · {safeSteps[normalized].title}</div>
    </div>
  );
}
