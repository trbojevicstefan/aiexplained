"use client";

import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./inference-factory.module.css";

export type InferenceStage="queue"|"prefill"|"decode"|"stream";
export function InferenceFactory({stage="queue",queue=4,batch=2,replicas=1,gpuUtil=65,ttft=420,tps=42}:{stage?:InferenceStage;queue?:number;batch?:number;replicas?:number;gpuUtil?:number;ttft?:number;tps?:number}){
 const stages:InferenceStage[]=["queue","prefill","decode","stream"];
 return <div className={styles.wrap}>
  <div className={styles.top}><AiMascot variant="briefcase" accent="#78a7ff" mood={gpuUtil>90?"wow":"thinking"} size={72} label="SERVE"/><div className={styles.metrics}><span>queue <b>{queue}</b></span><span>batch <b>{batch}</b></span><span>replicas <b>{replicas}</b></span><span>GPU <b>{gpuUtil}%</b></span><span>TTFT <b>{ttft}ms</b></span><span>decode <b>{tps} tok/s</b></span></div></div>
  <div className={styles.line}>{stages.map((item,index)=><motion.div key={item} className={`${styles.station} ${item===stage?styles.active:""}`} animate={item===stage?{y:[0,-4,0]}:{}} transition={{duration:1,repeat:item===stage?Infinity:0}}><span>{index+1}</span><b>{item.toUpperCase()}</b><small>{item==="queue"?"waiting requests":item==="prefill"?"process prompt/context":item==="decode"?"generate token steps":"send deltas"}</small></motion.div>)}</div>
  <div className={styles.gpus}>{Array.from({length:Math.max(1,replicas)},(_,i)=><div key={i}><b>GPU REPLICA {i+1}</b><div><i style={{width:`${gpuUtil}%`}}/></div><small>model weights + runtime + KV blocks</small></div>)}</div>
 </div>
}
