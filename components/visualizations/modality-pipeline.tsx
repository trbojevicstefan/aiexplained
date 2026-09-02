"use client";

import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./modality-pipeline.module.css";

export type Modality="text"|"image"|"audio"|"video";
const meta:Record<Modality,{icon:string;input:string;encoder:string;accent:string}>={
 text:{icon:"Aa",input:"tokens",encoder:"text embedding / transformer",accent:"#789dff"},
 image:{icon:"▦",input:"pixels / patches",encoder:"vision encoder / visual tokens",accent:"#ff9bc7"},
 audio:{icon:"≈",input:"waveform / spectrogram",encoder:"audio/speech encoder",accent:"#77dcb4"},
 video:{icon:"▶",input:"frames + time + audio",encoder:"video/vision-temporal encoder",accent:"#ffd65e"},
};
export function ModalityPipeline({active="text",seen=[],onSelect}:{active?:Modality;seen?:Modality[];onSelect?:(m:Modality)=>void}){
 return <div className={styles.wrap}>
  <div className={styles.inputs}>{(Object.keys(meta) as Modality[]).map(modality=>{const item=meta[modality];return <motion.button type="button" key={modality} className={`${styles.sensor} ${active===modality?styles.active:""}`} style={{"--accent":item.accent} as React.CSSProperties} onClick={()=>onSelect?.(modality)} whileTap={{scale:.96}} animate={active===modality?{y:[0,-5,0]}:{}} transition={{duration:1.3,repeat:active===modality?Infinity:0}}><i>{item.icon}</i><b>{modality}</b><small>{item.input}</small><em>{seen.includes(modality)?"✓ inspected":"tap to inspect"}</em></motion.button>})}</div>
  <div className={styles.pipe}><span>{meta[active].input}</span><b>→</b><span>{meta[active].encoder}</span><b>→</b><span>model representations</span></div>
  <div className={styles.brain}><AiMascot variant="bot" accent={meta[active].accent} size={90} mood="thinking" label="MULTI"/><div><b>THE MODEL WORKS ON REPRESENTATIONS</b><small>The exact architecture varies. The important first mental model is that modality-specific inputs are transformed into representations the model can combine and reason over.</small></div></div>
 </div>
}
