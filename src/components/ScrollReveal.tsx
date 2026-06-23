import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  text: string;
  subtitle?: string;
  className?: string;
  stagger?: number; // ms between each word
  threshold?: number; // 0–1, how far in view before triggering
}

export default function ScrollReveal({
  text,
  subtitle,
  className = "",
  stagger = 35,
  threshold = 0.15,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [isInView, setIsInView] = useState(false);

  const words = text.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Subtitle above or below - let's render subtitle first or keep it elegant */}
      {subtitle && (
        <div
          className="mb-8 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-white/40 select-none transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(-12px)",
            filter: isInView ? "blur(0)" : "blur(4px)",
            transitionDelay: "150ms",
          }}
        >
          {subtitle}
        </div>
      )}

      <p ref={containerRef} className={`leading-relaxed select-none ${className}`}>
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block mr-[0.25em] transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
              filter: isInView ? "blur(0px)" : "blur(8px)",
              transitionDelay: `${i * stagger + 300}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
