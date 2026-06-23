import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowUpRight, Plus, Sliders, Sparkles, Check } from "lucide-react";
import { Beverage, CartItem } from "../types";
import TextReveal, { FadeUp } from "./TextReveal";

// Asset URLs mapped from generated images
const PRODUCTS_DATA: Beverage[] = [
  {
    id: "margarita",
    name: "PRICKLY PEAR MARGARITA",
    flavorGroup: "Citrus | Crisp | Invigorating",
    tagline: "An Invigorated Classic Prickly Pear Margarita",
    price: 15.00,
    volume: "12 FL OZ (355 ML)",
    description: "A sharp, botanical twist on the coastal standard. Made with fresh-pressed red prickly pear cactus fruit, real Key lime pulp, and organic agave nectar, supercharged with our foundational adaptogen stack.",
    activeIngredients: ["L-Theanine (200mg)", "Lion's Mane (150mg)", "Magnesium (100mg)"],
    sensoryNotes: "Bright, tart lime skin, wild watermelon flesh, subtle earthy desert cactus bloom.",
    colorAccent: "#38bdf8",
    imageUrl: "/images/hero-img2.png"
  },
  {
    id: "rosemary",
    name: "ROSEMARY SPRITZ",
    flavorGroup: "Herbal | Bittersweet | Refreshing",
    tagline: "Low-Key Sophisticated Rosemary Spritz",
    price: 15.00,
    volume: "12 FL OZ (355 ML)",
    description: "A contemplative forest-to-glass botanical draft. Blending carbonated spring water, fresh rosemary needles oil distillations, gentian root bitters, and a touch of wild mountain honey.",
    activeIngredients: ["L-Theanine (200mg)", "Lion's Mane (150mg)", "Magnesium (100mg)"],
    sensoryNotes: "Pine resin, crisp pine needles, wet clay, bittersweet orange peel.",
    colorAccent: "#fb923c",
    imageUrl: "/images/hero-img1.png"
  },
  {
    id: "lilikoi",
    name: "LILI'KOI MAI TAI",
    flavorGroup: "Bold | Lush | Smooth",
    tagline: "Just Bold Enough Lili'Koi Mai Tai",
    price: 15.00,
    volume: "12 FL OZ (355 ML)",
    description: "An exotic, sunset-drenched tropical escape. Formulated with authentic Hawaiian yellow passion fruit (lili'koi), sweet almond orgeat syrup, and a squeeze of dark lime to anchor notes.",
    activeIngredients: ["L-Theanine (200mg)", "Lion's Mane (150mg)", "Magnesium (100mg)"],
    sensoryNotes: "Tart passionfruit punch, roasted marzipan, caramelized sugar cane.",
    colorAccent: "#e11d48",
    imageUrl: "/images/hero-img3.png"
  }
];

interface HeroProps {
  onAddToCart: (item: CartItem) => void;
}

export default function Hero({ onAddToCart }: HeroProps) {
  // Initialize with "rosemary" active to match original first screenshot instantly!
  const [activeId, setActiveId] = useState<string>("rosemary");
  const [successId, setSuccessId] = useState<string | null>(null);

  const { scrollY } = useScroll();

  // Subtle scroll-driven transformations for high-end editorial feel
  const yText = useTransform(scrollY, [0, 800], [0, -110]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0.15]);
  const yBento = useTransform(scrollY, [0, 800], [0, -160]);
  const scaleBento = useTransform(scrollY, [0, 800], [1, 0.96]);
  const yImgScroll = useTransform(scrollY, [0, 1000], [0, 80]);

  const handleAddProduct = (bev: Beverage, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart({
      id: bev.id,
      name: bev.name,
      price: bev.price,
      quantity: 1,
      flavorGroup: bev.flavorGroup,
      isCustom: false
    });
    setSuccessId(bev.id);
    setTimeout(() => setSuccessId(null), 1800);
  };

  // Maps custom dark hues for the bottom right bento thumbnail overlay inside the active beverage block
  const getFloatingCardBg = (id: string) => {
    switch (id) {
      case "margarita":
        return "rgba(22, 38, 48, 0.4)"; // deep steel blue translucent
      case "lilikoi":
        return "rgba(61, 15, 20, 0.4)";  // deep dark cherry/crimson translucent
      case "rosemary":
      default:
        return "rgba(110, 68, 38, 0.4)";  // luxurious deep amber brown translucent
    }
  };

  const getFloatingCardBorder = (id: string) => {
    switch (id) {
      case "margarita":
        return "border-white/10";
      case "lilikoi":
        return "border-white/10";
      case "rosemary":
      default:
        return "border-white/10";
    }
  };

  const getDisplayTitle = (id: string) => {
    switch (id) {
      case "margarita":
        return (
          <>
            An Invigorated Classic<br />Prickly Pear Margarita
          </>
        );
      case "lilikoi":
        return (
          <>
            Just Bold Enough<br />Lili'koi Mai Tai
          </>
        );
      case "rosemary":
      default:
        return (
          <>
            Low-Key Sophisticated<br />Rosemary Spritz
          </>
        );
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[680px] bg-[#07060b] p-3 flex flex-col justify-between overflow-hidden">
      
      {/* Decorative taglines aligned perfectly below the fixed header elements */}
      <div className="absolute top-20 left-6 md:left-12 z-30 pointer-events-none transition-opacity duration-500 hidden sm:block">
        <span className="font-serif italic font-light text-[11px] sm:text-[13px] text-[#fafafa]/70 block ml-4">
          Non-Alcoholic Refresher
        </span>
      </div>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-35 pointer-events-none text-center hidden sm:block">
        <span className="font-serif italic font-light text-[11px] sm:text-[13px] text-[#fafafa]/80 block">
          Non-Alcoholic Refresher
        </span>
      </div>
      <div className="absolute top-20 right-6 md:right-12 z-30 pointer-events-none text-right transition-opacity duration-500 hidden sm:block">
        <span className="font-serif italic font-light text-[11px] sm:text-[13px] text-[#fafafa]/70 block mr-4">
          Non-Alcoholic Refresher
        </span>
      </div>

      {/* Three Column Full-Bleed Split Interactive View Frame */}
      <div className="flex-1 w-full h-full flex flex-row gap-3 items-stretch">
        {PRODUCTS_DATA.map((prod) => {
          const isActive = prod.id === activeId;
          
          return (
            <motion.div
              key={prod.id}
              id={`panel-${prod.id}`}
              onClick={() => setActiveId(prod.id)}
              onMouseEnter={() => setActiveId(prod.id)}
              style={{
                flexBasis: "0%",
                flexShrink: 1,
              }}
              animate={{
                flexGrow: isActive ? 4 : 1 // dynamic flex width stretching active, compressing side narrow strips
              }}
              transition={{
                duration: 1.85,
                ease: [0.16, 1, 0.25, 1]
              }}
              className="relative rounded-[32px] md:rounded-[44px] overflow-hidden cursor-pointer bg-[#07060b] flex flex-col justify-between p-6 md:p-10 select-none group transition-shadow duration-[1000ms]"
            >
              {/* Card Product Photography Backing with smooth scroll parallax */}
              <motion.img
                src={prod.imageUrl}
                alt={prod.name}
                referrerPolicy="no-referrer"
                style={{ y: isActive ? yImgScroll : 0 }}
                className="absolute inset-0 w-full h-full object-cover filter grayscale-[4%] brightness-[92%] transition-[filter,brightness] duration-1000 ease-out"
              />

              {/* Text Protection Vignette / Gradient Overlay */}
              <div 
                className={`absolute inset-0 transition-all duration-1000 z-10 ${
                  isActive 
                    ? "bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-100" 
                    : "bg-black/50 group-hover:bg-black/35"
                }`} 
              />

              {/* Active Column Layout Contents always rendered but transitioned smoothly */}
              <div 
                className={`relative z-20 w-full h-full flex flex-col justify-between transition-all duration-[1850ms] ease-[cubic-bezier(0.16,1,0.25,1)] ${
                  isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8 pointer-events-none"
                }`}
              >
                
                {/* Top-aligned placeholder spacing for fixed header navbar alignment */}
                <div className="h-24" />

                {/* Floating Title Content (Bottom Left section) */}
                <motion.div 
                  style={{ y: yText, opacity: opacityText }}
                  className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mr-0 md:mr-[240px]"
                >
                  <div className="space-y-3 text-left">
                    {/* Animated eyebrow label — fades in fresh on each switch */}
                    <motion.span
                      key={`eyebrow-${prod.id}`}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#fafafa]/85 block select-none"
                    >
                      NON-ALCOHOLIC PAIRINGS FOR PERFECT VIBES
                    </motion.span>

                    {/* Kinetic title — word-by-word clip reveal, re-fires on every product change */}
                    <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-[4vw] lg:text-[4.2vw] leading-[1.0] text-white tracking-[-0.03em] max-w-2xl block select-none">
                      <TextReveal
                        text={prod.id === "margarita"
                          ? "An Invigorated Classic Prickly Pear Margarita"
                          : prod.id === "lilikoi"
                          ? "Just Bold Enough Lili'koi Mai Tai"
                          : "Low-Key Sophisticated Rosemary Spritz"
                        }
                        motionKey={prod.id}
                        inView={false}
                        delay={0.15}
                        stagger={0.055}
                        duration={0.65}
                        wrapClass="text-white"
                      />
                    </h1>

                    <motion.button
                      key={`btn-${prod.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                      onClick={(e) => handleAddProduct(prod, e)}
                      className="bg-[#fafafa] hover:bg-white text-[#07060b] px-8 py-3 rounded-full font-mono text-[11px] font-bold tracking-[0.05em] uppercase transition-all duration-300 shadow-md active:scale-95 cursor-pointer mt-4"
                    >
                      {successId === prod.id ? "ADDED!" : "SHOP"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Overlapping Floating Small Miniature Bento Card (Bottom Right section) */}
                <motion.div 
                  onClick={(e) => {
                    e.stopPropagation(); // prevent collapsing
                    setActiveId(prod.id);
                  }}
                  style={{ 
                    y: yBento,
                    scale: scaleBento,
                    backgroundColor: getFloatingCardBg(prod.id)
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`absolute bottom-10 right-10 z-30 hidden lg:flex flex-col items-center p-5 rounded-[32px] w-[206px] shadow-2xl border ${getFloatingCardBorder(prod.id)} backdrop-blur-md cursor-pointer`}
                >
                  <div className="relative w-full aspect-[3/4] mb-4 bg-black/20 rounded-[20px] overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        prod.id === "rosemary" ? "/images/hero-small-img.png" :
                        prod.id === "margarita" ? "/images/hero-small-img2.png" :
                        prod.id === "lilikoi" ? "/images/hero-small-img3.png" :
                        prod.imageUrl
                      }
                      alt={prod.name}
                      className="h-[120px] w-auto object-contain object-center scale-[1.12]"
                    />
                  </div>
                  <h4 className="font-display font-extrabold text-[12px] text-white uppercase tracking-wider text-center line-clamp-1">
                    {prod.name}
                  </h4>
                  <p className="font-mono text-[8px] text-white/70 uppercase tracking-tight mt-1 text-center font-bold">
                    {prod.flavorGroup}
                  </p>
                </motion.div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}

