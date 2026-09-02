"use client";

import { motion } from "motion/react";
import { AiMascot, AiMascotVariant } from "@/components/mascots/ai-mascot";
import styles from "./router-playground.module.css";

export type RoutingModel={id:string;name:string;quality:number;latency:number;cost:number;context:number;modalities:string[];provider:string;variant?:AiMascotVariant;accent:string};
export type RoutingTask={label:string;minQuality:number;maxLatency:number;maxCost:number;context:number;modality:string};

export function modelFitness(model:RoutingModel,task:RoutingTask){
 const failures:string[]=[];
 if(model.quality<task.minQuality)failures.push("quality");
 if(model.latency>task.maxLatency)failures.push("latency");
 if(model.cost>task.maxCost)failures.push("cost");
 if(model.context<task.context)failures.push("context");
 if(!model.modalities.includes(task.modality))failures.push("modality");
 const q=Math.min(1,model.quality/Math.max(1,task.minQuality));
 const l=Math.min(1,task.maxLatency/Math.max(1,model.latency));
 const c=Math.min(1,task.maxCost/Math.max(.01,model.cost));
 const score=q*.5+l*.25+c*.25-(failures.length*.5);
 return{score,failures};
}

export function RouterPlayground({models,task,selected,onSelect}:{models:RoutingModel[];task:RoutingTask;selected?:string;onSelect?:(id:string)=>void}){
 const ranked=[...models].map(model=>({model,...modelFitness(model,task)})).sort((a,b)=>b.score-a.score);
 const winner=selected??ranked[0]?.model.id;
 return <div className={styles.wrap}>
  <div className={styles.task}><span>INCOMING TASK</span><b>{task.label}</b><div><small>quality ≥ {task.minQuality}</small><small>latency ≤ {task.maxLatency}ms</small><small>cost ≤ ${task.maxCost.toFixed(2)}</small><small>ctx {task.context}k</small><small>{task.modality}</small></div></div>
  <div className={styles.models}>{ranked.map(({model,score,failures},index)=><motion.button key={model.id} type="button" className={`${styles.model} ${winner===model.id?styles.winner:""}`} onClick={()=>onSelect?.(model.id)} animate={winner===model.id?{y:[0,-5,0]}:{}} transition={{duration:1.4,repeat:winner===model.id?Infinity:0}}><AiMascot variant={model.variant??"bot"} accent={model.accent} mood={winner===model.id?"excited":failures.length?"neutral":"happy"} size={68}/><div><span>#{index+1} · {model.provider}</span><b>{model.name}</b><small>Q {model.quality} · {model.latency}ms · ${model.cost.toFixed(2)} · {model.context}k</small><em>{failures.length?`fails: ${failures.join(", ")}`:`fit score ${score.toFixed(2)}`}</em></div></motion.button>)}</div>
 </div>
}
