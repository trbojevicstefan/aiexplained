"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./tool-call-inspector.module.css";

export type ToolCallInspectorData = {
  definition: string;
  proposal: string;
  validation: string;
  execution: string;
  result: string;
};

export function ToolCallInspector({ activeStep=0, accent="#70c9ff", data, label="TOOL" }: { activeStep?:number; accent?:string; data:ToolCallInspectorData; label?:string }){
  const reduced=useReducedMotion();
  const items=[
    ["1 · DEFINITION","TOOL SCHEMA",data.definition],
    ["2 · MODEL","PROPOSED CALL",data.proposal],
    ["3 · RUNTIME","VALIDATION",data.validation],
    ["4 · OUTSIDE MODEL","EXECUTION",data.execution],
    ["5 · CONTEXT","RESULT",data.result],
  ] as const;
  const current=Math.max(0,Math.min(4,activeStep));
  return <div className={styles.wrap} style={{"--accent":accent} as CSSProperties}>
    <div className={styles.head}><div><strong>Tool-call lifecycle</strong><div className={styles.status}><span className={styles.pulse}/>step {current+1}/5</div></div><div className={styles.mascot}><AiMascot variant="tile" accent={accent} mood={current===3?"excited":current===4?"happy":"thinking"} size={64} label={label}/></div></div>
    <div className={styles.flow}>{items.map((item,i)=><motion.div key={item[0]} className={`${styles.step} ${i===current?styles.active:""}`} animate={!reduced&&i===current?{y:[-5,-8,-5]}:undefined} transition={{duration:.8,repeat:i===current?Infinity:0}}><small>{item[0]}</small><b>{item[1]}</b><div className={styles.code}>{item[2]}</div>{i<items.length-1&&<span className={styles.arrow}>→</span>}</motion.div>)}</div>
  </div>
}
