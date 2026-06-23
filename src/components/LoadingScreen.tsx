import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading");

  // Stable ref so the effect never re-triggers when the parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    // Progress bar animation — runs exactly once on mount
    const duration = 2200;
    const steps = 60;
    const increment = 100 / steps;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(currentStep * increment, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        setPhase("reveal");

        // After reveal animation, transition to exit
        const revealTimeout = setTimeout(() => {
          setPhase("exit");
          const exitTimeout = setTimeout(() => {
            onCompleteRef.current();
          }, 700);
          return () => clearTimeout(exitTimeout);
        }, 900);
        return () => clearTimeout(revealTimeout);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []); // empty deps — intentionally runs once

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="loader"
          className="loader-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated background particles */}
          <div className="loader-particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="loader-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  opacity: 0.15 + Math.random() * 0.25,
                }}
              />
            ))}
          </div>

          {/* Radial glow behind avatar */}
          <div className="loader-glow" />

          {/* Center content */}
          <div className="loader-center">

            {/* Avatar image with ring animation */}
            <motion.div
              className="loader-avatar-wrapper"
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              {/* Spinning outer ring */}
              <div className="loader-ring loader-ring--outer" />
              {/* Pulsing inner ring */}
              <div className="loader-ring loader-ring--inner" />

              <img
                src="/sean-logo.jpg"
                alt="Sean"
                className="loader-avatar"
              />
            </motion.div>

            {/* Name reveal */}
            <motion.div
              className="loader-name-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              <p className="loader-label">crafted by</p>
              <h1 className="loader-name">
                {"Sean".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.6 + i * 0.08,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
              <p className="loader-tagline">altitude beverages</p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="loader-progress-wrap"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="loader-progress-track">
                <motion.div
                  className="loader-progress-fill"
                  style={{ width: `${progress}%` }}
                />
                <div className="loader-progress-glow" style={{ left: `${progress}%` }} />
              </div>
              <div className="loader-progress-label">
                <span className="loader-progress-percent">{Math.round(progress)}%</span>
                <span className="loader-progress-status">
                  {progress < 40 ? "initialising" : progress < 75 ? "loading assets" : progress < 99 ? "almost ready" : "welcome"}
                </span>
              </div>
            </motion.div>

          </div>

          {/* Bottom branding */}
          <motion.div
            className="loader-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="loader-footer-text">ALTITUDE MONOCHROME — EST. 2026</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
