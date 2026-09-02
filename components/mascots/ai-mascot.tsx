"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ai-mascot.module.css";

export type AiMascotVariant = "bot" | "star" | "briefcase" | "tile" | "mail";
export type AiMascotMood = "neutral" | "thinking" | "happy" | "excited";

type Props = {
  variant?: AiMascotVariant;
  mood?: AiMascotMood;
  size?: number;
  accent?: string;
  label?: string;
  className?: string;
  gaze?: boolean;
};

export function AiMascot({
  variant = "bot",
  mood = "happy",
  size = 92,
  accent = "#5ab8ff",
  label,
  className = "",
  gaze = true,
}: Props) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const gazeX = useMotionValue(0);
  const gazeY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const pupilX = useSpring(gazeX, { stiffness: 430, damping: 32, mass: 0.35 });
  const pupilY = useSpring(gazeY, { stiffness: 430, damping: 32, mass: 0.35 });
  const headRotateX = useSpring(tiltX, { stiffness: 150, damping: 22, mass: 0.55 });
  const headRotateY = useSpring(tiltY, { stiffness: 150, damping: 22, mass: 0.55 });
  const [blinking, setBlinking] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!gaze || reducedMotion) return;
    const onPointerMove = (event: PointerEvent) => {
      const element = rootRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.46;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const reach = Math.min(1, distance / Math.max(90, rect.width * 2.8));
      const nx = Math.max(-1, Math.min(1, dx / Math.max(110, rect.width * 2.2)));
      const ny = Math.max(-1, Math.min(1, dy / Math.max(110, rect.height * 2.2)));
      gazeX.set((dx / distance) * 4 * reach);
      gazeY.set((dy / distance) * 3.3 * reach);
      tiltY.set(nx * 7.5);
      tiltX.set(-ny * 5.5);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gaze, gazeX, gazeY, reducedMotion, tiltX, tiltY]);

  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let blinkEnd: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        blinkEnd = setTimeout(() => {
          if (!cancelled) setBlinking(false);
          if (!cancelled) schedule();
        }, 110);
      }, 2100 + Math.random() * 4200);
    };
    schedule();
    return () => { cancelled = true; clearTimeout(timer); clearTimeout(blinkEnd); };
  }, [reducedMotion]);

  const idle = useMemo(() => {
    if (reducedMotion) return undefined;
    if (mood === "excited") return { y: [0, -8, 0], rotate: [0, 2.2, -1.8, 0], scale: [1, 1.025, 1] };
    if (mood === "thinking") return { y: [0, -3, 0], rotate: [-1, 1.5, -1] };
    if (mood === "neutral") return { y: [0, -3, 0], rotate: [0, .6, -.6, 0] };
    return { y: [0, -5, 0], rotate: [0, 1.1, -1, 0], scale: [1, 1.012, 1] };
  }, [mood, reducedMotion]);

  const style = {
    "--mascot-size": `${size}px`,
    "--accent": accent,
  } as CSSProperties;

  return (
    <motion.div
      ref={rootRef}
      className={`${styles.wrap} ${styles[variant]} ${className}`}
      style={style}
      data-mood={mood}
      data-variant={variant}
      role="img"
      aria-label={label ? `${label}, animated AI guide` : "Animated AI guide"}
      animate={pressed ? { scale: [1, .9, 1.08, 1], rotate: [0, -3, 2, 0] } : idle}
      transition={pressed
        ? { duration: .42, ease: [0.34, 1.56, 0.64, 1] }
        : { duration: mood === "excited" ? 2.1 : 3.8, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reducedMotion ? undefined : { scale: 1.065, y: -4 }}
      whileTap={{ scale: .94 }}
      onPointerDown={() => {
        setPressed(true);
        window.setTimeout(() => setPressed(false), 460);
      }}
    >
      <motion.div className={styles.shadow} animate={reducedMotion ? undefined : { scaleX: [1, .82, 1], opacity: [.24, .13, .24] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div className={styles.antenna} animate={reducedMotion ? undefined : { rotate: [-2, 3, -2] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
        <motion.i className={styles.antennaTip} animate={mood === "excited" && !reducedMotion ? { scale: [1, 1.32, 1] } : undefined} transition={{ duration: .8, repeat: Infinity }} />
      </motion.div>

      <i className={`${styles.side} ${styles.sideLeft}`} />
      <i className={`${styles.side} ${styles.sideRight}`} />

      <motion.div
        className={styles.body}
        style={reducedMotion ? undefined : { rotateX: headRotateX, rotateY: headRotateY }}
        animate={reducedMotion ? undefined : { scaleY: [1, 1.018, 1], scaleX: [1, .992, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <i className={styles.shellHighlight} />
        <div className={styles.face}>
          <motion.i className={styles.eye} animate={{ scaleY: blinking ? .06 : mood === "excited" ? 1.1 : 1 }} transition={{ duration: .065 }}>
            <motion.span className={styles.pupil} style={{ x: pupilX, y: pupilY }} />
          </motion.i>
          <motion.i className={styles.eye} animate={{ scaleY: blinking ? .06 : mood === "excited" ? 1.1 : 1 }} transition={{ duration: .065 }}>
            <motion.span className={styles.pupil} style={{ x: pupilX, y: pupilY }} />
          </motion.i>
          <i className={`${styles.cheek} ${styles.cheekLeft}`} />
          <i className={`${styles.cheek} ${styles.cheekRight}`} />
        </div>
      </motion.div>

      <motion.i className={styles.spark} animate={mood === "excited" && !reducedMotion ? { scale: [0, 1.2, .8, 1], rotate: [0, 60, 120, 180] } : undefined} transition={{ duration: 1.4, repeat: Infinity }} />
      {label && <span className={styles.label}>{label}</span>}
    </motion.div>
  );
}

export const mascotVariants: AiMascotVariant[] = ["bot", "star", "briefcase", "tile", "mail"];
