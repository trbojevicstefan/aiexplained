"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./permission-gate.module.css";

export type PermissionDecision = "allow" | "deny" | "approval";
export type PermissionRisk = "low" | "medium" | "high" | "critical";

export function PermissionGate({
  action,
  scope,
  reason,
  risk = "medium",
  decision = "approval",
  accent = "#ff8c72",
  onDecision,
  compact = false,
}: {
  action: string;
  scope: string;
  reason: string;
  risk?: PermissionRisk;
  decision?: PermissionDecision;
  accent?: string;
  onDecision?: (decision: PermissionDecision) => void;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  const dangerous = risk === "high" || risk === "critical";
  const mood = decision === "deny" ? "thinking" : decision === "allow" && !dangerous ? "happy" : "excited";
  const choices: { id: PermissionDecision; label: string }[] = [
    { id: "allow", label: "ALLOW" },
    { id: "approval", label: "REQUIRE APPROVAL" },
    { id: "deny", label: "DENY" },
  ];
  return (
    <div className={`${styles.gate} ${compact ? styles.compact : ""}`} style={{ "--gate-accent": accent } as CSSProperties} data-risk={risk}>
      <div className={styles.guardian}>
        <motion.div animate={!reduced && dangerous ? { x: [0, -2, 2, 0] } : undefined} transition={{ duration: .55, repeat: dangerous ? Infinity : 0, repeatDelay: 1.8 }}>
          <AiMascot variant="bot" accent={accent} mood={mood} size={compact ? 64 : 94} label="GUARD" />
        </motion.div>
        <span className={styles.risk}>{risk.toUpperCase()} RISK</span>
      </div>
      <div className={styles.request}>
        <small>REQUESTED ACTION</small>
        <strong>{action}</strong>
        <div className={styles.meta}><span><b>SCOPE</b>{scope}</span><span><b>WHY</b>{reason}</span></div>
      </div>
      <div className={styles.decisions}>
        {choices.map(choice => <button key={choice.id} type="button" className={`${styles.choice} ${styles[choice.id]} ${decision === choice.id ? styles.selected : ""}`} onClick={() => onDecision?.(choice.id)} aria-pressed={decision === choice.id}><i />{choice.label}</button>)}
      </div>
      <motion.div className={styles.barrier} animate={!reduced && decision === "approval" ? { opacity: [.45, 1, .45] } : undefined} transition={{ duration: 1.5, repeat: Infinity }}><i /><i /><i /><i /></motion.div>
    </div>
  );
}
