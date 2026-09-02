"use client";

import { motion } from "motion/react";
import styles from "./knowledge-graph-viewer.module.css";

export type GraphNode={id:string;label:string;type:string;x:number;y:number};
export type GraphEdge={from:string;to:string;label:string};

export function KnowledgeGraphViewer({nodes,edges,activePath=[],onNode}:{nodes:GraphNode[];edges:GraphEdge[];activePath?:string[];onNode?:(id:string)=>void}){
 return <div className={styles.wrap}>
  <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{edges.map(edge=>{const a=nodes.find(n=>n.id===edge.from),b=nodes.find(n=>n.id===edge.to);if(!a||!b)return null;const active=activePath.includes(edge.from)&&activePath.includes(edge.to);return <g key={`${edge.from}-${edge.to}-${edge.label}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={active?styles.activeLine:""}/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-1}>{edge.label}</text></g>})}</svg>
  {nodes.map(node=><motion.button type="button" key={node.id} className={`${styles.node} ${activePath.includes(node.id)?styles.active:""}`} style={{left:`${node.x}%`,top:`${node.y}%`}} whileHover={{scale:1.07}} whileTap={{scale:.96}} animate={activePath.includes(node.id)?{y:[0,-5,0]}:{}} transition={{duration:1.2,repeat:activePath.includes(node.id)?Infinity:0}} onClick={()=>onNode?.(node.id)}><span>{node.type}</span><b>{node.label}</b></motion.button>)}
 </div>
}
