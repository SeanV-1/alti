import React from "react";
import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────────
   TextReveal — cinematic word-by-word clip-path entrance
   Each word slides up from a masked clip, like a premium editorial title card.
   ───────────────────────────────────────────────────────────────────────────── */

interface TextRevealProps {
  text: string;
  /** Tailwind / CSS class applied to every word span */
  className?: string;
  /** Extra class wrapping the whole block */
  wrapClass?: string;
  /** Delay before the first word starts (seconds) */
  delay?: number;
  /** Stagger between each word (seconds) */
  stagger?: number;
  /** Duration per word (seconds) */
  duration?: number;
  /** If true, use whileInView. If false, animate on mount */
  inView?: boolean;
  /** Trigger a re-animation when this key changes */
  motionKey?: string | number;
  /** 'words' = word-by-word | 'chars' = letter-by-letter | 'lines' = whole block */
  mode?: "words" | "chars" | "lines";
}

const EASE = [0.16, 1, 0.3, 1];

export default function TextReveal({
  text,
  className = "",
  wrapClass = "",
  delay = 0,
  stagger = 0.06,
  duration = 0.75,
  inView = true,
  motionKey,
  mode = "words",
}: TextRevealProps) {
  const tokens =
    mode === "chars"
      ? text.split("")
      : mode === "lines"
      ? [text]
      : text.split(" ");

  const viewportProps = inView
    ? { viewport: { once: true, margin: "-60px" } }
    : {};

  return (
    <span className={`inline ${wrapClass}`} aria-label={text}>
      {tokens.map((token, i) => (
        <span
          key={`${motionKey ?? ""}${i}`}
          className="inline-block overflow-hidden leading-[1.15]"
          style={{ marginRight: mode === "chars" ? "0" : "0.28em" }}
        >
          <motion.span
            key={`${motionKey ?? ""}inner-${i}`}
            className={`inline-block ${className}`}
            initial={{ y: "110%", opacity: 0 }}
            {...(inView
              ? {
                  whileInView: { y: "0%", opacity: 1 },
                  ...viewportProps,
                }
              : {
                  animate: { y: "0%", opacity: 1 },
                })}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {token === "" ? "\u00a0" : token}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FadeUp — simpler whole-block fade + lift, for supporting copy
   ───────────────────────────────────────────────────────────────────────────── */
interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  inView?: boolean;
  y?: number;
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  inView = true,
  y = 22,
}: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(inView
        ? {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
          }
        : { animate: { opacity: 1, y: 0 } })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ScaleReveal — horizontal line / divider that scales from 0
   ───────────────────────────────────────────────────────────────────────────── */
interface ScaleRevealProps {
  className?: string;
  delay?: number;
  duration?: number;
  axis?: "x" | "y";
}

export function ScaleReveal({
  className = "",
  delay = 0,
  duration = 1.0,
  axis = "x",
}: ScaleRevealProps) {
  return (
    <motion.div
      className={className}
      style={{ originX: axis === "x" ? 0 : "50%", originY: axis === "y" ? 0 : "50%" }}
      initial={{ scaleX: axis === "x" ? 0 : 1, scaleY: axis === "y" ? 0 : 1 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
}
