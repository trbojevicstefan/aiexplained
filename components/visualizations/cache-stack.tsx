"use client";

import { motion } from "motion/react";
import styles from "./cache-stack.module.css";

export type CacheLayer={id:string;title:string;stores:string;key:string;hit:number;accent:string};
export function CacheStack({layers,active,onSelect}:{layers:CacheLayer[];active?:string;onSelect?:(id:string)=>void}){return <div className={styles.wrap}>{layers.map((layer,index)=><motion.button type="button" key={layer.id} className={`${styles.layer} ${active===layer.id?styles.active:""}`} style={{"--accent":layer.accent} as React.CSSProperties} onClick={()=>onSelect?.(layer.id)} whileTap={{scale:.98}} animate={active===layer.id?{x:[0,5,0]}:{}} transition={{duration:1,repeat:active===layer.id?Infinity:0}}><span>{String(index+1).padStart(2,"0")}</span><div><b>{layer.title}</b><small>stores: {layer.stores}</small><em>key: {layer.key}</em></div><strong>{layer.hit}%<small> hit</small></strong><i><u style={{width:`${layer.hit}%`}}/></i></motion.button>)}</div>}
