"use client";

import { motion } from "motion/react";
import styles from "./state-machine-viewer.module.css";

export type StateNode={id:string;label:string;detail?:string};
export type StateEdge={from:string;to:string;event:string};

export function StateMachineViewer({nodes,edges,active,onSelect}:{nodes:StateNode[];edges:StateEdge[];active:string;onSelect?:(id:string)=>void}){
 return <div className={styles.wrap}>
  <div className={styles.nodes}>{nodes.map((node,index)=><motion.button key={node.id} type="button" className={`${styles.node} ${active===node.id?styles.active:""}`} onClick={()=>onSelect?.(node.id)} animate={active===node.id?{y:[0,-5,0],scale:[1,1.025,1]}:{}} transition={{duration:1.2,repeat:active===node.id?Infinity:0}}><span>{String(index+1).padStart(2,"0")}</span><b>{node.label}</b>{node.detail&&<small>{node.detail}</small>}</motion.button>)}</div>
  <div className={styles.edges}>{edges.map(edge=><div key={`${edge.from}-${edge.to}-${edge.event}`} className={styles.edge}><code>{edge.from}</code><span>— {edge.event} →</span><code>{edge.to}</code></div>)}</div>
 </div>
}
