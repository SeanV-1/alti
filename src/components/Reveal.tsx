import React from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

export default function Reveal({ children, delay = 0.15 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1.0,
        delay,
        ease: [0.16, 1, 0.3, 1], // Premium design cubic-bezier ease-out curve
      }}
    >
      {children}
    </motion.div>
  );
}
