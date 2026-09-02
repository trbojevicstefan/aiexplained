"use client";

import { motion } from "motion/react";
import { ReactNode, useEffect } from "react";
import { ExplanationDepth } from "@/lib/course-progress";

const labels: Record<ExplanationDepth, string> = {
  simple: "Simple",
  real: "Real",
  expert: "Expert",
};

export function LessonSection({
  id,
  onVisit,
  children,
  className = "",
}: {
  id: string;
  onVisit: (id: string) => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.4)) onVisit(id);
    }, { threshold: [0.4, 0.65] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, onVisit]);

  return (
    <motion.section
      id={id}
      className={`lesson-scene ${className}`}
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.section>
  );
}

export function DepthSwitch({ value, onChange }: { value: ExplanationDepth; onChange: (depth: ExplanationDepth) => void }) {
  return (
    <div className="depth-switch" role="group" aria-label="Explanation depth">
      {(Object.keys(labels) as ExplanationDepth[]).map((depth) => (
        <button key={depth} className={value === depth ? "active" : ""} onClick={() => onChange(depth)}>
          {labels[depth]}
        </button>
      ))}
    </div>
  );
}

export function TaskStamp({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <motion.div
      className={`task-stamp ${done ? "done" : ""}`}
      animate={done ? { rotate: [0, -2, 1, 0], scale: [1, 1.08, 1] } : undefined}
    >
      <span>{done ? "✓" : "◆"}</span>{children}
    </motion.div>
  );
}
