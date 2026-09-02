"use client";

import { motion } from "motion/react";
import { AiMascot } from "@/components/mascots/ai-mascot";
import styles from "./memory-shelf.module.css";

export type MemoryItem = {
  id: string;
  type: "episodic" | "semantic" | "procedural" | "preference" | "working";
  title: string;
  detail: string;
  score?: number;
  selected?: boolean;
  stale?: boolean;
};

const accents: Record<MemoryItem["type"], string> = {
  episodic: "#8ca6ff",
  semantic: "#75dfb2",
  procedural: "#ffd66e",
  preference: "#ff9bc4",
  working: "#a998ff",
};

export function MemoryShelf({ items, query = "", label = "MEMORY", onSelect }: { items: MemoryItem[]; query?: string; label?: string; onSelect?: (item: MemoryItem) => void }) {
  return <div className={styles.wrap}>
    <div className={styles.top}>
      <AiMascot variant="briefcase" accent="#8ca6ff" mood={items.some((item) => item.selected) ? "excited" : "thinking"} size={76} label={label}/>
      <div><span>RETRIEVAL QUERY</span><strong>{query || "No query yet"}</strong></div>
    </div>
    <div className={styles.shelf}>
      {items.map((item, index) => <motion.button
        type="button"
        key={item.id}
        className={`${styles.memory} ${item.selected ? styles.selected : ""} ${item.stale ? styles.stale : ""}`}
        style={{ "--memory-accent": accents[item.type] } as React.CSSProperties}
        animate={item.selected ? { y: -14, rotate: index % 2 ? 1.5 : -1.5, scale: 1.04 } : { y: 0, rotate: 0, scale: 1 }}
        whileHover={{ y: -7, rotate: index % 2 ? 1 : -1 }}
        whileTap={{ scale: .97 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        onClick={() => onSelect?.(item)}
      >
        <span className={styles.type}>{item.type}</span>
        <b>{item.title}</b>
        <small>{item.detail}</small>
        {item.score !== undefined && <i><span style={{ width: `${Math.max(0, Math.min(100, item.score * 100))}%` }}/><em>{Math.round(item.score * 100)}%</em></i>}
      </motion.button>)}
      <div className={styles.board}/>
    </div>
  </div>;
}
