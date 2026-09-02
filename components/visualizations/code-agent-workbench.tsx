"use client";

import { motion } from "motion/react";
import { AgentIdentityCard } from "@/components/mascots/agent-identity-card";
import styles from "./code-agent-workbench.module.css";

export type WorkbenchFile={path:string;content:string;kind?:"code"|"test"|"config"};
export type WorkbenchAction={label:string;status:"done"|"active"|"pending"|"error"};

export function CodeAgentWorkbench({files,activePath,actions,testStatus="idle",onSelect}:{files:WorkbenchFile[];activePath:string;actions:WorkbenchAction[];testStatus?:"idle"|"running"|"pass"|"fail";onSelect?:(path:string)=>void}){
 const active=files.find(file=>file.path===activePath)??files[0];
 const running=actions.some(action=>action.status==="active")||testStatus==="running";
 const status=testStatus==="fail"?"TEST FAILED":testStatus==="pass"?"VERIFIED":running?"WORKING":"READY";
 return <div className={styles.wrap}>
  <aside className={styles.files}>
   <AgentIdentityCard name="Patch" role="CODING AGENT" status={status} detail={`${files.length} repo files in working context`} variant="tile" accent={testStatus==="fail"?"#ff7b72":"#79e0a8"} mood={testStatus==="fail"?"thinking":"happy"} active={running} compact/>
   {files.map(file=><button type="button" key={file.path} className={file.path===activePath?styles.activeFile:""} onClick={()=>onSelect?.(file.path)}><span>{file.kind==="test"?"◆":file.kind==="config"?"⚙":"<>"}</span>{file.path}</button>)}
  </aside>
  <section className={styles.editor}><header><b>{active?.path}</b><span>{active?.kind??"code"}</span></header><pre>{active?.content}</pre><div className={`${styles.tests} ${styles[testStatus]}`}><b>TESTS</b><span>{testStatus.toUpperCase()}</span>{testStatus==="running"&&<motion.i animate={{x:[0,70,0]}} transition={{duration:1.1,repeat:Infinity}}/>}</div></section>
  <aside className={styles.timeline}><span>AGENT RUN</span>{actions.map((action,index)=><div key={`${action.label}-${index}`} className={styles[action.status]}><i>{action.status==="done"?"✓":action.status==="error"?"!":index+1}</i><b>{action.label}</b></div>)}</aside>
 </div>
}
