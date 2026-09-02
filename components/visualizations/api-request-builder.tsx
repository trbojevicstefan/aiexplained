"use client";

import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./api-request-builder.module.css";

export type ApiRequestConfig={model:string;stream:boolean;temperature:number;tools:boolean;structured:boolean};
export function ApiRequestBuilder({config,phase="request"}:{config:ApiRequestConfig;phase?:"request"|"stream"|"done"}){
 const body={model:config.model,messages:[{role:"system",content:"Answer clearly."},{role:"user",content:"Book a 30 minute call Friday morning."}],...(config.tools?{tools:[{name:"calendar.create_event",parameters:{type:"object",properties:{start:{type:"string"},duration_minutes:{type:"number"}},required:["start","duration_minutes"]}}]}:{}),temperature:config.temperature,stream:config.stream,...(config.structured?{response_format:{type:"json_schema",name:"booking_result",schema:{type:"object",properties:{status:{type:"string"},event_id:{type:"string"}},required:["status"]}}}: {})};
 return <div className={styles.wrap}>
  <div className={styles.request}><header><span>POST</span><code>/v1/responses</code></header><div className={styles.headers}><b>Authorization</b><span>Bearer ••••••••</span><b>Content-Type</b><span>application/json</span></div><pre>{JSON.stringify(body,null,2)}</pre></div>
  <div className={styles.pipe}><AiMascot variant="tile" accent="#74a7ff" mood={phase==="stream"?"excited":"thinking"} size={70} label="API"/><motion.i animate={phase==="stream"?{x:[0,70,0]}:{x:phase==="done"?70:0}} transition={{duration:1.2,repeat:phase==="stream"?Infinity:0}}/><span>{config.stream?"SSE stream":"HTTP response"}</span></div>
  <div className={styles.response}><header>RESPONSE</header>{phase==="stream"?<div className={styles.chunks}>{["event: output_text.delta","data: {\"delta\":\"Booked\"}","event: output_text.delta","data: {\"delta\":\" Friday\"}"].map((line,i)=><motion.code key={line+i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.15}}>{line}</motion.code>)}</div>:<pre>{config.structured?`{\n  "status": "booked",\n  "event_id": "evt_123"\n}`:`{\n  "output_text": "Booked Friday morning."\n}`}</pre>}</div>
 </div>
}
