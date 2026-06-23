import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldAlert, Sparkles, Brain, CheckCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function DarkSection() {
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

  return (
    <section className="relative w-full py-36 md:py-48 bg-gradient-to-b from-[#06050a] to-[#0c0c14] overflow-hidden text-white flex flex-col justify-center items-center">
      {/* Background Cinematic Monogram Watermark with a deep cinematic ease-out entrance */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
        whileInView={{ opacity: 0.05, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
      >
        <h1 className="font-display font-black uppercase text-[12vw] tracking-[-0.08em] select-none text-[#fafafa]">
          altitude
        </h1>
      </motion.div>

      {/* Main Content Container with Staggered Multi-Stage Entrance */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-12 md:space-y-16">
        
        {/* Animated Headline Cascade via Reusable State-Driven ScrollReveal */}
        <ScrollReveal
          text="Non-alcoholic refreshers crafted with elevated flavors, functional ingredients, and a balanced approach to meeting the moment."
          subtitle="You've Arrived — The Dawn of Clear Mind"
          className="font-serif font-extralight text-3xl md:text-5xl lg:text-6xl text-[#fafafa] leading-[1.25] md:leading-[1.18] max-w-3xl mx-auto tracking-[-1px]"
          stagger={45}
          threshold={0.15}
        />

        {/* CTA Button gracefully entering after context resolves with floating transition */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="pt-6"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsLedgerOpen(true)}
            className="cursor-pointer bg-[#fafafa] hover:bg-[#ffffff] text-[#07060b] font-mono text-[11px] uppercase tracking-[0.12em] px-8 py-4 rounded-full shadow-2xl relative overflow-hidden group border border-white/10"
          >
            <span className="relative z-10 transition-colors duration-300">
              Review Botanical Ledger
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-400 via-transparent to-purple-400 transition-opacity duration-500 blur-sm" />
          </motion.button>
        </motion.div>
      </div>

      {/* Slide-Up transparency Botanical Ledger */}
      <AnimatePresence>
        {isLedgerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 md:p-10 max-w-2xl w-full text-left relative"
            >
              <button
                onClick={() => setIsLedgerOpen(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#ddfcff] tracking-widest block mb-1">
                    ALTITUDE RESEARCH DIRECTIVE
                  </span>
                  <h4 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
                    Adaptive Molecule Specification
                  </h4>
                  <p className="font-serif font-light text-stone-300 text-sm mt-2">
                    Every batch of Altitude is charged with standardized clinical-grade cognitive enhancers to bypass nervous system friction without any artificial spike.
                  </p>
                </div>

                <div className="border-t border-neutral-800 pt-6 space-y-4">
                  {/* Molecule 1 */}
                  <div className="flex gap-4 items-start pb-4 border-b border-neutral-800/50">
                    <div className="p-3 bg-neutral-800 text-[#ddfcff] rounded-full">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm uppercase text-white font-bold">
                        L-Theanine — 200mg
                      </h5>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        An amino acid isolated from wild-harvested green tea leaves. It directly crosses the blood-brain barrier to promote alpha wave stimulation, generating relaxed focus without drowsiness or sluggishness.
                      </p>
                    </div>
                  </div>

                  {/* Molecule 2 */}
                  <div className="flex gap-4 items-start pb-4 border-b border-neutral-800/50">
                    <div className="p-3 bg-neutral-800 text-[#ddfcff] rounded-full">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm uppercase text-white font-bold">
                        Lion's Mane Extract — 150mg
                      </h5>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        Hericium erinaceus mycelium extract. Encourages synthesis of Nerve Growth Factor (NGF) in brain cells, improving neurological pathway optimization and environmental adaptability.
                      </p>
                    </div>
                  </div>

                  {/* Molecule 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-neutral-800 text-[#ddfcff] rounded-full">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm uppercase text-white font-bold">
                        Magnesium Carbonate — 100mg
                      </h5>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        Bioavailable cellular mineral complex. Aids in dampening the sympathetic nervous system, slowing heart-rate acceleration, and neutralizing active inflammation triggers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transparency Commitment */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-[#ddfcff]/10 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#ddfcff] shrink-0" />
                  <p className="font-mono text-[9px] text-stone-400 uppercase leading-snug">
                    Lab Authenticated • Organically Cultivated • GMO Free • Zero Added Preservatives
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsLedgerOpen(false)}
                    className="bg-white text-black font-mono text-[10px] font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-[#d9d9d9] transition"
                  >
                    Acknowledge Transparency
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
