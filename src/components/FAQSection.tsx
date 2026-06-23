import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import TextReveal, { FadeUp, ScaleReveal } from "./TextReveal";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "01",
    question: "What makes Altitude distinct from typical energy drinks?",
    answer: "Altitude is formulated without synthetic caffeine, refined sugar, artificial colorants, or heavy preservatives. Instead, we stack clinical-grade forest adaptogens, fresh-distilled organic botanicals, and clean L-Theanine to stimulate neural flow states without the jittery highs and crashing lows.",
  },
  {
    id: "02",
    question: "Are your beverages completely non-alcoholic?",
    answer: "Yes, 100% non-alcoholic. Every tonic we craft is designed to replace high-proof options, morning jitter agents, or standard sugary sodas—offering a highly sophisticated, multi-layered tasting profile suitable for deep focus or late-night decompression.",
  },
  {
    id: "03",
    question: "How are cold-shipped products handled?",
    answer: "To safeguard unstable raw active enzymes and conserve the full physiological properties of our organic extracts, every case is packed fresh in climate-responsible, insulated boxes with reusable cold packs and delivered directly to your doorstep.",
  },
  {
    id: "04",
    question: "What are your core active botanical compounds?",
    answer: "Our flagship blends integrate cold-water extracted Lion's Mane and Cordyceps mushrooms, marine-sourced trace minerals for hydration, Alpha-GPC for cognitive accuracy, L-Theanine for alpha-wave stimulation, and essential botanical terpenes.",
  },
  {
    id: "05",
    question: "What is your recommended daily intake limit?",
    answer: "While formulated with clean, food-safe adaptogenic extracts, we recommend introducing one can into your morning flow or late-afternoon reset first to observe how your neural pathways respond. For sustained balance, we suggest a limit of three cans daily.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative w-full py-36 md:py-48 bg-[#0c0c14] border-t border-white/5 text-white overflow-hidden snap-start">
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-10 right-10 opacity-5 font-mono text-[10vw] font-bold select-none pointer-events-none tracking-tighter">
        FAQ
      </div>
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-28 md:mb-32">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#a5f3fc] font-semibold"
          >
            NATIVE RESOLUTION
          </motion.p>

          <h2 className="font-serif font-extralight text-3xl md:text-4xl lg:text-5xl text-[#fafafa] tracking-tight">
            <TextReveal
              text="Frequently Answered Questions"
              delay={0.1}
              stagger={0.065}
              duration={0.8}
              wrapClass="text-[#fafafa]"
            />
          </h2>

          <ScaleReveal
            className="w-12 h-[1px] bg-white/20 mx-auto mt-6"
            delay={0.6}
          />
        </div>

        {/* Minimal Accordion List */}
        <div className="border-t border-white/5 division-y divide-white/5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="border-b border-white/5"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full py-8 md:py-10 flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-6 md:gap-8 flex-1 pr-4">
                    {/* Monospace number index */}
                    <span className="font-mono text-xs text-white/30 group-hover:text-[#a5f3fc] transition-colors duration-300">
                      [{item.id}]
                    </span>
                    
                    {/* The Question — kinetic underline slide on hover */}
                    <h3 className="relative font-serif font-light text-base md:text-lg lg:text-xl text-white/80 group-hover:text-white transition-colors duration-300 tracking-tight">
                      {item.question}
                      <motion.span
                        className="absolute bottom-0 left-0 h-[1px] bg-white/40"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileInView={{ scaleX: 0 }}
                        style={{ width: "100%" }}
                        variants={{
                          hover: { scaleX: 1 },
                          rest: { scaleX: 0 },
                        }}
                      />
                    </h3>
                  </div>

                  {/* Styled circular chevron icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-350 ${
                      isOpen 
                        ? "bg-white border-white text-black" 
                        : "border-white/10 text-white/60 group-hover:border-white/30 group-hover:text-white bg-white/2"
                    }`}
                  >
                    <ChevronDown size={14} className="stroke-[1.5]" />
                  </motion.div>
                </button>

                {/* Smooth Expandable Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pb-10 pl-16 md:pl-20 pr-4 md:pr-12">
                        <p className="font-sans text-[13px] md:text-[14px] leading-relaxed text-stone-300 tracking-wide font-light">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Botom Editorial Disclaimer */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center font-mono text-[9px] tracking-[0.2em] uppercase text-stone-400 mt-16 max-w-lg mx-auto leading-relaxed"
        >
          * These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, or cure any condition.
        </motion.p>

      </div>
    </section>
  );
}
