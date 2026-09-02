"use client";

import { motion } from "motion/react";
import { AiMascot, AiMascotVariant } from "@/components/mascots/ai-mascot";
import styles from "./queue-visualizer.module.css";

export type QueueJob={id:string;label:string;status:"queued"|"running"|"done"|"retry"|"dead";worker?:string};
export type QueueWorker={id:string;label:string;variant?:AiMascotVariant;accent:string;busy?:boolean};

export function QueueVisualizer({jobs,workers}:{jobs:QueueJob[];workers:QueueWorker[]}){
 return <div className={styles.wrap}>
  <div className={styles.queue}><span>JOB QUEUE</span>{jobs.filter(j=>j.status==="queued"||j.status==="retry").map((job,index)=><motion.div key={job.id} className={`${styles.job} ${job.status===`retry`?styles.retry:""}`} initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:index*.05}}><b>{job.label}</b><small>{job.status}</small></motion.div>)}{!jobs.some(j=>j.status==="queued"||j.status==="retry")&&<i>queue empty</i>}</div>
  <div className={styles.workers}>{workers.map(worker=>{const job=jobs.find(j=>j.worker===worker.id&&j.status==="running");return <div className={`${styles.worker} ${job?styles.busy:""}`} key={worker.id}><AiMascot variant={worker.variant??"bot"} accent={worker.accent} mood={job?"excited":"happy"} size={76} label={worker.label}/><div><b>{worker.label}</b><small>{job?`running: ${job.label}`:"idle"}</small></div>{job&&<motion.span className={styles.packet} animate={{x:[-12,12,-12],rotate:[-4,4,-4]}} transition={{duration:1.4,repeat:Infinity}}>{job.id}</motion.span>}</div>})}</div>
  <div className={styles.outcomes}><div><span>DONE</span>{jobs.filter(j=>j.status==="done").map(j=><b key={j.id}>{j.id}</b>)}</div><div className={styles.dead}><span>DEAD LETTER</span>{jobs.filter(j=>j.status==="dead").map(j=><b key={j.id}>{j.id}</b>)}</div></div>
 </div>
}
