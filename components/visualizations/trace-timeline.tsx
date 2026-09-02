"use client";

import { motion } from "motion/react";
import styles from "./trace-timeline.module.css";

export type TraceSpan={id:string;parent?:string;kind:"agent"|"llm"|"retrieval"|"tool"|"guardrail";name:string;start:number;duration:number;status:"ok"|"error"|"warning";tokens?:number;cost?:number;detail:string};
export function TraceTimeline({spans,active,onSelect}:{spans:TraceSpan[];active?:string;onSelect?:(span:TraceSpan)=>void}){const end=Math.max(...spans.map(s=>s.start+s.duration),1);return <div className={styles.wrap}><div className={styles.axis}><span>0 ms</span><span>{end} ms</span></div>{spans.map((span,index)=><button type="button" key={span.id} className={`${styles.row} ${active===span.id?styles.active:""}`} onClick={()=>onSelect?.(span)}><span className={styles.label}><i data-kind={span.kind}/><b>{span.name}</b><small>{span.kind} · {span.status}</small></span><span className={styles.track}><motion.i className={styles.bar} data-status={span.status} style={{left:`${span.start/end*100}%`,width:`${Math.max(3,span.duration/end*100)}%`}} initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:index*.04}}/></span><span className={styles.meta}><b>{span.duration}ms</b><small>{span.tokens??0} tok · ${(span.cost??0).toFixed(4)}</small></span></button>)}</div>}
