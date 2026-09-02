"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./sandbox-boundary.module.css";

export function SandboxBoundary({
  network = "restricted",
  filesystem = "workspace",
  shell = "allowlist",
  cpu = 60,
  memory = 1024,
  timeout = 60,
  active = false,
  accent = "#7c8cff",
}: {
  network?: "none" | "restricted" | "open";
  filesystem?: "none" | "workspace" | "host";
  shell?: "none" | "allowlist" | "unrestricted";
  cpu?: number;
  memory?: number;
  timeout?: number;
  active?: boolean;
  accent?: string;
}) {
  const reduced = useReducedMotion();
  const risk = [network === "open", filesystem === "host", shell === "unrestricted"].filter(Boolean).length;
  return <div className={styles.wrap} style={{ "--sandbox-accent": accent } as CSSProperties} data-risk={risk}>
    <div className={styles.outer}><span>HOST</span><i className={styles.hostGlow}/>
      <div className={styles.sandbox}><span>SANDBOX</span>
        <motion.div className={styles.agent} animate={active&&!reduced?{y:[0,-5,0]}:undefined} transition={{duration:1.5,repeat:active?Infinity:0}}><AiMascot variant="tile" accent={accent} mood={active?"excited":"happy"} size={88} label="RUN"/></motion.div>
        <div className={styles.limits}><b>{cpu}% CPU</b><b>{memory} MB</b><b>{timeout}s</b></div>
      </div>
      <div className={`${styles.port} ${styles.network}`}><small>NETWORK</small><b>{network}</b></div>
      <div className={`${styles.port} ${styles.filesystem}`}><small>FILES</small><b>{filesystem}</b></div>
      <div className={`${styles.port} ${styles.shell}`}><small>SHELL</small><b>{shell}</b></div>
    </div>
    <div className={styles.risk}><i/><span>{risk===0?"TIGHT BOUNDARY":risk===1?"ONE BROAD EDGE":risk===2?"HIGH BLAST RADIUS":"HOST-LIKE ACCESS"}</span></div>
  </div>;
}
