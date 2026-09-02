"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { AiMascot, AiMascotMood, AiMascotVariant } from "./ai-mascot";
import styles from "./agent-identity-card.module.css";

export function AgentIdentityCard({
  name,
  role,
  status = "READY",
  detail,
  accent = "#70c9ff",
  variant = "bot",
  mood = "happy",
  active = false,
  compact = false,
}: {
  name: string;
  role: string;
  status?: string;
  detail?: string;
  accent?: string;
  variant?: AiMascotVariant;
  mood?: AiMascotMood;
  active?: boolean;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`${styles.card} ${active ? styles.active : ""} ${compact ? styles.compact : ""}`}
      style={{ "--agent-accent": accent } as CSSProperties}
      animate={active && !reduced ? { y: [0, -3, 0] } : undefined}
      transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: "easeInOut" }}
    >
      <div className={styles.mascot}><AiMascot variant={variant} accent={accent} mood={active ? "excited" : mood} size={compact ? 62 : 82} /></div>
      <div className={styles.copy}>
        <div className={styles.meta}><span className={styles.status}><i />{status}</span><small>{role}</small></div>
        <strong>{name}</strong>
        {detail && <p>{detail}</p>}
      </div>
      <span className={styles.signal} aria-hidden="true"><i /><i /><i /></span>
    </motion.div>
  );
}
