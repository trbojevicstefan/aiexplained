"use client";

import { motion } from "motion/react";
import { AgentIdentityCard } from "@/components/mascots/agent-identity-card";
import styles from "./voice-pipeline.module.css";

const stages=["MIC","VAD / TURN","ASR / AUDIO","AGENT","TOOLS","TTS","SPEAKER"] as const;
export function VoicePipeline({active=0,interrupted=false}:{active?:number;interrupted?:boolean}){
 const normalized=Math.max(0,Math.min(stages.length-1,active));
 return <div className={styles.wrap}>
  <div className={styles.wave}>{Array.from({length:32},(_,i)=><motion.i key={i} animate={{height:[8,10+((i*17)%42),8]}} transition={{duration:.7+(i%5)*.08,repeat:Infinity,delay:(i%7)*.04}}/>)}</div>
  <div className={styles.stages}>{stages.map((stage,index)=><motion.div key={stage} className={`${styles.stage} ${index===normalized?styles.active:""}`} animate={index===normalized?{y:[0,-4,0]}:{}} transition={{duration:.9,repeat:index===normalized?Infinity:0}}><span>{index+1}</span><b>{stage}</b></motion.div>)}</div>
  <div className={styles.agent}>
   <AgentIdentityCard name="Echo" role="VOICE AGENT" status={interrupted?"BARGE-IN":"REAL-TIME TURN"} detail={interrupted?"TTS ducked. Capturing the new user turn now.":`active stage: ${stages[normalized]}`} variant="bot" accent={interrupted?"#ff8a91":"#7ee0d0"} mood={interrupted?"thinking":"happy"} active={normalized>=1&&normalized<=5} compact/>
  </div>
 </div>
}
