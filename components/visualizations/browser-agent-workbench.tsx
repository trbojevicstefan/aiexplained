"use client";

import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./browser-agent-workbench.module.css";

export type BrowserAction={label:string;status:"done"|"active"|"pending"|"error"};

export function BrowserAgentWorkbench({view="page",highlight="",actions=[],loggedIn=true}:{view?:"page"|"dom"|"a11y";highlight?:string;actions?:BrowserAction[];loggedIn?:boolean}){
 return <div className={styles.wrap}>
  <div className={styles.chrome}><div className={styles.dots}><i/><i/><i/></div><div className={styles.url}>https://book.example/meeting</div><AiMascot variant="mail" accent="#8db4ff" mood={actions.some(a=>a.status==="error")?"wow":actions.some(a=>a.status==="active")?"thinking":"happy"} size={45}/></div>
  <div className={styles.body}>
   <aside className={styles.views}><span>GROUNDING</span>{["page","dom","a11y"].map(item=><div key={item} className={view===item?styles.current:""}>{item==="page"?"Rendered page":item==="dom"?"DOM tree":"Accessibility tree"}</div>)}</aside>
   <section className={styles.viewport}>
    {view==="page"&&<div className={styles.page}><header><b>Meetly</b><span>{loggedIn?"Ana · signed in":"Sign in"}</span></header><main><small>BOOK A CALL</small><h3>Project review</h3><label>Name<input value="Ana" readOnly/></label><label>Date<input value="2026-09-05" readOnly/></label><label>Time<select value="10:30" readOnly><option>10:30</option></select></label><motion.button className={highlight==="book"?styles.highlight:""} animate={highlight==="book"?{scale:[1,1.04,1]}:{}} transition={{duration:1.2,repeat:highlight==="book"?Infinity:0}}>Book meeting</motion.button><div className={`${styles.notice} ${highlight==="notice"?styles.highlight:""}`}>No booking created yet.</div></main></div>}
    {view==="dom"&&<pre className={styles.tree}>{`body\n ├─ header\n │   ├─ b "Meetly"\n │   └─ span "${loggedIn?"Ana · signed in":"Sign in"}"\n └─ main\n     ├─ input[name="name"]\n     ├─ input[name="date"]\n     ├─ select[name="time"]\n     ├─ button#book "Book meeting"\n     └─ div[aria-live="polite"] "No booking created yet."`}</pre>}
    {view==="a11y"&&<pre className={styles.tree}>{`document\n heading "Project review" level=3\n textbox "Name" value="Ana"\n textbox "Date" value="2026-09-05"\n combobox "Time" value="10:30"\n button "Book meeting"\n status "No booking created yet."`}</pre>}
   </section>
   <aside className={styles.actions}><span>AGENT ACTIONS</span>{actions.map((action,index)=><div key={`${action.label}-${index}`} className={styles[action.status]}><i>{action.status==="done"?"✓":action.status==="error"?"!":index+1}</i><b>{action.label}</b></div>)}</aside>
  </div>
 </div>
}
