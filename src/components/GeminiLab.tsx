import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Sparkles, Loader2, Plus, Info, RefreshCw, Layers, Check, Trophy } from "lucide-react";
import { CustomFormula, CartItem } from "../types";

interface GeminiLabProps {
  onAddToCart: (item: CartItem) => void;
}

const LIQUID_BASES = [
  "Carbonated Glacier Water",
  "Cold-Brewed White Tea Tonic",
  "Bergamot Hydra-Infusion",
  "Charred Birch Wood Extract"
];

const BOTANICAL_OPTIONS = [
  { id: "rosemary", label: "Fresh Rosemary oil" },
  { id: "prickly_pear", label: "Prickly Pear purée" },
  { id: "lilikoi", label: "Lili'koi yellow nectar" },
  { id: "smudge_cedar", label: "Smoked Cedar bark extract" },
  { id: "elderberry", label: "Elderberry berry distillate" },
  { id: "mint_hydro", label: "Mint hydrosol oils" }
];

const ADAPTOGEN_OPTIONS = [
  { id: "theanine", label: "L-Theanine (Alpha-focus)", detail: "Green tea isolate triggers calming neural waves" },
  { id: "lions_mane", label: "Lion's Mane (NGF Synthesis)", detail: "Cognitive protector & neuron synthesiser" },
  { id: "magnesium", label: "Magnesium (Nerve Calm)", detail: "Sympathetic blocker for physical relaxation" },
  { id: "ashwagandha", label: "Ashwagandha (Stress Dimmer)", detail: "Cortisol modulator & systemic calmer" }
];

const MOODS_VIBES = [
  "High-Frequency Creative Focus",
  "Desert Sunset Wind-down",
  "Minimalist Quiet Gallery Study",
  "Cinematic Cosmic Slumber"
];

export default function GeminiLab({ onAddToCart }: GeminiLabProps) {
  const [base, setBase] = useState(LIQUID_BASES[0]);
  const [selectedBotanicals, setSelectedBotanicals] = useState<string[]>(["Fresh Rosemary oil"]);
  const [selectedAdaptogens, setSelectedAdaptogens] = useState<string[]>(["L-Theanine (Alpha-focus)", "Magnesium (Nerve Calm)"]);
  const [intensity, setIntensity] = useState("Vibrant Sparkle");
  const [vibe, setVibe] = useState(MOODS_VIBES[0]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomFormula | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleBotanical = (label: string) => {
    if (selectedBotanicals.includes(label)) {
      setSelectedBotanicals(selectedBotanicals.filter((b) => b !== label));
    } else {
      if (selectedBotanicals.length < 3) {
        setSelectedBotanicals([...selectedBotanicals, label]);
      }
    }
  };

  const toggleAdaptogen = (label: string) => {
    if (selectedAdaptogens.includes(label)) {
      setSelectedAdaptogens(selectedAdaptogens.filter((a) => a !== label));
    } else {
      if (selectedAdaptogens.length < 3) {
        setSelectedAdaptogens([...selectedAdaptogens, label]);
      }
    }
  };

  const handleFormulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/formulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base,
          botanicals: selectedBotanicals,
          adaptogens: selectedAdaptogens,
          intensity,
          vibe,
        }),
      });

      if (!response.ok) {
        throw new Error("Formulation server rejected custom blend. Triggering fallback.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.warn("API Error:", err);
      // Fallback data mapping to elegant defaults
      setResult({
        name: `${base.split(" ")[0]} ${vibe.split(" ")[0]} Infusion`,
        tagline: "A customized tonic designed to anchor focus and smooth physical friction.",
        sensoryDescription: "Fresh herbaceous rosemary oil structures the top notes, blending into a warm bergamot wood finish. A crisp, dry citrus wash on the palate, carrying zero artificial sugar and an extremely minimal botanical profile.",
        adaptationReport: `Fortified with ${selectedAdaptogens.join(" and ")} to immediately support neurological relaxation and quiet busy environmental noise.`,
        compositionMetrics: {
          earthiness: 4,
          citrus: 3,
          herbal: 5,
          sweetness: 1
        },
        foodPairing: "Accompanies high-end single-estate green tea courses and fresh wild honeycomb slices."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomToCart = () => {
    if (!result) return;
    onAddToCart({
      id: `custom_${Date.now()}`,
      name: `${result.name.toUpperCase()}`,
      price: 18.00, // custom cases are premium priced
      quantity: 1,
      flavorGroup: `Custom Formula | ${vibe}`,
      isCustom: true,
      customFormula: result
    });
  };

  return (
    <section id="alchemy-section" className="w-full py-28 md:py-36 bg-[#fafafa] border-t border-[#cdcdce]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Block */}
        <div className="text-left mb-20 space-y-4 max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#07060b] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#07060b]" />
            AI COGNITIVE FORMULATOR DIRECTIVE
          </p>
          <h2 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.05em] text-[#07060b] leading-[0.95]">
            MOLECULAR LAB
          </h2>
          <p className="font-serif font-extralight text-2xl md:text-3xl text-[#07060b] max-w-2xl leading-tight">
            Tune the exact dials of your environment. Choose organic liquids, standardized herbal extracts, and clinical amino stacks.
          </p>
        </div>

        {/* Master Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* L-Column: Configurator Controls Form (5 cols) */}
          <div className="lg:col-span-12 xl:col-span-5 bg-[#fafafa] rounded-[44px] p-6 md:p-10 border border-[#cdcdce] space-y-8">
            
            {/* Step 1: Base */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase text-[#07060b] font-bold tracking-widest block">
                1. Select Liquid Base hydration
              </label>
              <div className="grid grid-cols-1 gap-2">
                {LIQUID_BASES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBase(b)}
                    className={`text-left p-4 rounded-2xl font-mono text-xs border cursor-pointer transition-editorial flex justify-between items-center ${
                      base === b
                        ? "border-[#07060b] bg-[#07060b] text-white"
                        : "border-[#cdcdce]/60 hover:bg-[#d9d9d9]/30 text-stone-700"
                    }`}
                  >
                    <span>{b}</span>
                    {base === b && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Botanicals */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="font-mono text-[10px] uppercase text-[#07060b] font-bold tracking-widest">
                  2. Select Botanic Profiles (Max 3)
                </label>
                <span className="font-mono text-[9px] text-gray-400">
                  {selectedBotanicals.length}/3 SELECTED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BOTANICAL_OPTIONS.map((bot) => {
                  const selected = selectedBotanicals.includes(bot.label);
                  return (
                    <button
                      key={bot.id}
                      onClick={() => toggleBotanical(bot.label)}
                      disabled={!selected && selectedBotanicals.length >= 3}
                      className={`text-left p-3 rounded-2xl text-xs font-mono transition-editorial cursor-pointer flex justify-between items-center border ${
                        selected
                          ? "border-[#07060b] bg-[#d9d9d9]/70 text-[#07060b] font-semibold"
                          : "border-[#cdcdce]/60 hover:bg-[#d9d9d9]/20 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      <span className="truncate">{bot.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Adaptogens */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="font-mono text-[10px] uppercase text-[#07060b] font-bold tracking-widest">
                  3. Active Adaptogen Molecules (Max 3)
                </label>
                <span className="font-mono text-[9px] text-gray-400">
                  {selectedAdaptogens.length}/3 SELECTED
                </span>
              </div>
              <div className="space-y-2">
                {ADAPTOGEN_OPTIONS.map((ad) => {
                  const selected = selectedAdaptogens.includes(ad.label);
                  return (
                    <button
                      key={ad.id}
                      onClick={() => toggleAdaptogen(ad.label)}
                      disabled={!selected && selectedAdaptogens.length >= 3}
                      className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-editorial flex gap-3 ${
                        selected
                          ? "border-[#07060b] bg-[#ddfcff]/40 text-[#07060b]"
                          : "border-[#cdcdce]/60 hover:bg-[#d9d9d9]/20 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-black border-black text-white" : "border-gray-400 bg-white"
                      }`}>
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-mono font-bold">{ad.label}</p>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5 leading-none">{ad.detail}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Carbonation */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase text-[#07060b] font-bold tracking-widest block">
                4. Carbonation Draft intensity
              </label>
              <div className="flex gap-2">
                {["Still Flat", "Ethereal Sparkle", "Vibrant Draft", "Midnight Storm"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setIntensity(v)}
                    className={`flex-1 py-2.5 rounded-xl text-center font-mono text-[10px] uppercase tracking-[-0.071em] border transition-editorial cursor-pointer ${
                      intensity === v
                        ? "border-[#07060b] bg-[#07060b] text-white"
                        : "border-[#cdcdce]/60 hover:bg-[#d9d9d9]/20 text-stone-600"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Vibe Target */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] uppercase text-[#07060b] font-bold tracking-widest block">
                5. Target Cognitive State / Vibe
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#cdcdce] text-stone-800 py-3 px-4 rounded-2xl font-mono text-xs focus:outline-none focus:border-[#07060b] cursor-pointer"
              >
                {MOODS_VIBES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Formulate Button */}
            <button
              onClick={handleFormulate}
              disabled={loading || selectedAdaptogens.length === 0}
              className="w-full py-4 rounded-[100px] cursor-pointer bg-[#0c0c14] hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-widest text-[#fafafa] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Molecules...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ddfcff]" />
                  <span>FORMULATE CUSTOM BLEND</span>
                </>
              )}
            </button>
          </div>

          {/* R-Column: Generated Output Screen (7 cols) */}
          <div className="lg:col-span-7 bg-[#d9d9d9] rounded-[44px] p-6 md:p-12 border border-[#cdcdce] min-h-[550px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Subtle icy background glow if result exists */}
            {result && (
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#ddfcff] rounded-full filter blur-[100px] opacity-40 mix-blend-multiply pointer-events-none" />
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                // LOADING SCREEN
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-16"
                >
                  <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-[#07060b] flex items-center justify-center animate-spin">
                    <Sparkles className="w-6 h-6 text-cyan-800" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#07060b] font-bold">
                      Querying Adaptive Chemistry Core
                    </p>
                    <p className="font-serif italic text-sm text-stone-600 max-w-sm">
                      Aligning adaptogens, configuring custom taste density, and building your personalized molecular ad.
                    </p>
                  </div>
                  <div className="bg-white/40 border border-black/5 p-4 rounded-xl max-w-xs font-mono text-[9px] uppercase tracking-wider text-gray-500">
                    <span className="block animate-pulse mb-1">● EXTRACTING ROSEMARY ESSENTIAL WATER</span>
                    <span className="block animate-pulse delay-75">● MOLECULAR LION'S MANE DISPERSION</span>
                  </div>
                </motion.div>
              ) : result ? (
                // EXTRACTED COMPRESSION OUTPUT
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#07060b] bg-white/70 px-3 py-1 rounded-full uppercase">
                        YOUR INDIVIDUAL FORMULA • BATCH #261
                      </span>
                      <h4 className="font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-[-3px] text-[#07060b] leading-none mt-4">
                        {result.name}
                      </h4>
                    </div>

                    <blockquote className="font-serif italic font-light text-xl md:text-2xl text-stone-800 border-l-2 border-[#07060b] pl-5">
                      "{result.tagline}"
                    </blockquote>

                    {/* Sensory Notes */}
                    <div className="space-y-2">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[#07060b] font-bold">
                        Sensory Tasting Profile
                      </p>
                      <p className="font-serif font-light text-stone-800 text-sm leading-relaxed max-w-xl">
                        {result.sensoryDescription}
                      </p>
                    </div>

                    {/* Chemistry Report */}
                    <div className="space-y-2 bg-white/60 rounded-3xl p-5 border border-[#cdcdce]/60">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-cyan-800 font-bold">
                        Adaptation Matrix Report
                      </p>
                      <p className="font-sans text-xs text-stone-700 leading-relaxed">
                        {result.adaptationReport}
                      </p>
                    </div>

                    {/* Composition meters bento block */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(result.compositionMetrics).map(([metric, value]) => (
                        <div key={metric} className="bg-white/40 p-3 rounded-2xl border border-black/5 text-center">
                          <p className="font-mono text-[9px] uppercase text-stone-500">{metric}</p>
                          <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden mt-2">
                            <div 
                              className="bg-[#07060b] h-full rounded-full" 
                              style={{ width: `${((value as number) / 5) * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-[#07060b] block mt-1 font-bold">
                            {value}/5
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Food Pairing */}
                    <div className="mt-2 text-xs text-stone-700 font-serif leading-tight">
                      <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-gray-500 mr-2 block sm:inline">
                        PAIRING:
                      </span>
                      {result.foodPairing}
                    </div>
                  </div>

                  {/* Pricing / Cart add block */}
                  <div className="border-t border-[#cdcdce] pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8">
                    <div>
                      <span className="font-mono text-[9px] text-stone-500 uppercase">PREMIUM CASE SPEC</span>
                      <p className="font-mono text-xs text-stone-800 font-bold leading-none">12pk • Custom Cans • 12 fl oz</p>
                    </div>
                    <button
                      onClick={handleAddCustomToCart}
                      className="cursor-pointer bg-[#07060b] hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-[-0.071em] px-8 py-3.5 rounded-[100px] transition-all"
                    >
                      ADD CASE TO CART — $18.00
                    </button>
                  </div>
                </motion.div>
              ) : (
                // INITIAL DEFAULT INVITATION SCREEN
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-[#cdcdce]/60 shadow-xs">
                    <Sliders className="w-6 h-6 text-[#07060b]" />
                  </div>
                  <div className="max-w-md space-y-2">
                    <h4 className="font-display font-medium text-lg text-[#07060b] uppercase tracking-tight">
                      Adjust your cognitive parameters
                    </h4>
                    <p className="font-serif font-light text-stone-600 text-sm">
                      Turn the sliders on the left, pick botanicals and target adaptogens, and click "Formulate Custom Blend" to generate your private edition batch directly from the Gemini alchemy engine.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
