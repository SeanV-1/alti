import React, { useState, useEffect, useRef } from "react";
import { Plus, Check, Volume2, Award, Zap, Heart, X, Sparkles, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Beverage, CartItem } from "../types";
import TextReveal, { FadeUp, ScaleReveal } from "./TextReveal";


const PRODUCTS_CATALOG: Beverage[] = [
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
    imageUrl: "/images/hero-small-img2.png"
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
    imageUrl: "/images/hero-small-img3.png"
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
    imageUrl: "/images/hero-small-img.png"
  }
];

const PRODUCT_EXTRA_DETAILS: Record<string, {
  ingredientsDeck: string;
  sensorySliders: { label: string; value: number }[];
  benefitMap: Record<string, string>;
}> = {
  margarita: {
    ingredientsDeck: "Purified Carbonated Water, Organic Agave Nectar, Key Lime Juice Concentrate, Red Prickly Pear Puree, Organic Flavors, L-Theanine, Organic Lion's Mane Extract, Magnesium Citrate.",
    sensorySliders: [
      { label: "Sweetness", value: 40 },
      { label: "Acidity / Sourness", value: 80 },
      { label: "Herbaceousness", value: 30 },
      { label: "Bitterness", value: 15 },
      { label: "Effervescence", value: 70 }
    ],
    benefitMap: {
      "L-Theanine": "Effortless flow state and cognitive calm without drowsiness or artificial crashes.",
      "Lion's Mane": "Nootropic cell stimulation to clear mental fatigue and fuel creativity.",
      "Magnesium": "Somatic muscle relief and neural balance to actively downregulate stress response."
    }
  },
  lilikoi: {
    ingredientsDeck: "Carbonated Spring Water, Pineapple Juice Concentrate, Lili'koi (Yellow Passionfruit) Puree, Lime Juice, Organic Cane Sugar, Real Almond Orgeat Extract, L-Theanine, Lion's Mane, Magnesium Citrate.",
    sensorySliders: [
      { label: "Sweetness", value: 65 },
      { label: "Acidity / Sourness", value: 60 },
      { label: "Herbaceousness", value: 15 },
      { label: "Bitterness", value: 20 },
      { label: "Effervescence", value: 65 }
    ],
    benefitMap: {
      "L-Theanine": "Provides clean, jitter-free focus and mental fatigue resolution.",
      "Lion's Mane": "Promotes synthesis of Nerve Growth Factor, powering clear retention.",
      "Magnesium": "Soothes systemic muscle fibers and supports cognitive tranquility."
    }
  },
  rosemary: {
    ingredientsDeck: "Pure Carbonated Spring Water, Steam-Distilled Rosemary needle oil hydrosol, Gentian Root bark, Wild Mountain Honey, Organic Grapefruit Peel oils, L-Theanine, Lion's Mane Extract, Magnesium Citrate.",
    sensorySliders: [
      { label: "Sweetness", value: 25 },
      { label: "Acidity / Sourness", value: 45 },
      { label: "Herbaceousness", value: 90 },
      { label: "Bitterness", value: 60 },
      { label: "Effervescence", value: 75 }
    ],
    benefitMap: {
      "L-Theanine": "Pairs dynamically with herbal terpenes for grounded calm and anxiety mitigation.",
      "Lion's Mane": "Nootropic brain support for active flow state and environmental presence.",
      "Magnesium": "Restores biological rest states and provides grounded muscular relaxation."
    }
  }
};

interface ProductCardProps {
  key?: string;
  bev: Beverage;
  index: number;
  imageLoaded: boolean;
  onImageLoad: () => void;
  onAdd: (bev: Beverage) => void;
  isSuccess: boolean;
  onSelect: (bev: Beverage) => void;
}

const DRINK_METADATA: Record<string, { initials: string; coords: string; pills: string[] }> = {
  margarita: {
    initials: "ppm",
    coords: "20.6595° N, 103.3494° W",
    pills: ["L-Theanine", "Magnesium", "Lion's Mane"]
  },
  lilikoi: {
    initials: "lmt",
    coords: "20.6881° N, 156.4309° W",
    pills: ["L-Theanine", "Magnesium", "Lion's Mane"]
  },
  rosemary: {
    initials: "rms",
    coords: "44.1461° N, 9.6439° E",
    pills: ["L-Theanine", "Magnesium", "Lion's Mane"]
  }
};

const getCardBg = (id: string, hovered: boolean) => {
  if (!hovered) return "#3e4654";
  switch (id) {
    case "margarita":
      return "linear-gradient(180deg, #1e2433 0%, #3d2b38 45%, #6a2441 100%)";
    case "lilikoi":
      return "linear-gradient(180deg, #1e2433 0%, #343c30 45%, #76812e 100%)";
    case "rosemary":
      return "linear-gradient(180deg, #1e2433 0%, #3e302b 45%, #7b3d22 100%)";
    default:
      return "#3e4654";
  }
};

function ProductCard({
  bev,
  index,
  imageLoaded,
  onImageLoad,
  onAdd,
  isSuccess,
  onSelect,
}: ProductCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const meta = DRINK_METADATA[bev.id] || { initials: "alt", coords: "0.00° N, 0.00° E", pills: ["Adaptogens"] };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1], // easeOutQuart
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      onClick={() => onSelect(bev)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background: getCardBg(bev.id, isHovered) }}
      className="rounded-[44px] border border-white/5 overflow-hidden flex flex-col justify-between p-6 md:p-8 transition-all duration-500 ease-out group shadow-xl relative cursor-pointer snap-center scroll-my-20 min-w-[85vw] sm:min-w-[340px] md:min-w-0 md:w-auto shrink-0 md:shrink"
    >
      {/* Dynamic Ambient Glow Spotting Follower (only visible in default state) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-0"
        style={{
          opacity: isHovered ? 0 : 1,
          background: `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, ${bev.colorAccent}25, transparent 100%)`
        }}
      />

      {/* Inside Glassmorphic Border Accent Frame (only fully visible in hover state) */}
      <div 
        className={`absolute inset-[14px] border border-white/10 rounded-[30px] pointer-events-none z-15 transition-all duration-500 ease-out ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
        }`} 
      />

      {/* FRONT SIDE (Can presentation view) */}
      <div 
        className={`flex flex-col justify-between h-full w-full transition-all duration-500 ease-out z-10 ${
          isHovered ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Product Card Image Container */}
        <div 
          className="relative aspect-square w-full flex items-center justify-center group/img overflow-hidden"
        >
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Bottle Silhouette Pulse */}
              <div className="w-16 h-48 bg-white/5 animate-pulse rounded-[24px] flex flex-col items-center justify-between p-3">
                <div className="w-6 h-5 bg-white/10 rounded-sm" />
                <div className="w-10 h-32 bg-white/10 rounded-xl flex-1 mt-2.5" />
              </div>
            </div>
          )}

          <img
            src={bev.imageUrl}
            alt={bev.name}
            onLoad={onImageLoad}
            referrerPolicy="no-referrer"
            className={`h-[110%] w-auto object-contain object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.25,1)] group-hover/img:scale-105 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
          
          {/* Subtle overlay indicator on hover */}
          <div className={`absolute inset-0 bg-black/15 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-center justify-center ${
            imageLoaded ? "visible" : "invisible"
          }`}>
            <span className="bg-white/95 backdrop-blur-md text-[#07060b] font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-full font-bold shadow-lg">
              Quick View Specs
            </span>
          </div>
        </div>

        {/* Product Descriptions and Actions */}
        <div className="mt-6 flex-1 flex flex-col justify-between" id={`product-info-${bev.id}`}>
          <div className="space-y-1.5 text-center">
            <h3 className="font-display font-semibold text-lg md:text-xl tracking-wide uppercase text-white leading-tight">
              {bev.name}
            </h3>

            <p className="font-serif italic text-white/70 text-xs md:text-[13px] tracking-wide">
              {bev.flavorGroup}
            </p>
          </div>

          {/* Adding to Cart Button with graceful slide up hover reveal only on desktop */}
          <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(bev);
              }}
              className="flex-1 cursor-pointer bg-[#fafafa] hover:bg-white text-[#07060b] font-mono text-[11px] uppercase font-bold tracking-[0.05em] py-3.5 rounded-full transition-all duration-[400ms] flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-95 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0"
            >
              {isSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD TO CART — $15</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* BACK SIDE (Futuristic detail view on hover) */}
      <div 
        className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between transition-all duration-500 ease-out z-20 ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Top brand header */}
        <div className="flex flex-col items-center mt-3">
          <span className="font-sans font-bold text-[34px] tracking-widest text-[#a5f3fc] leading-none select-none">
            Λ
          </span>
          <span className="font-mono text-[9px] tracking-widest text-white/50 mt-1 select-none">
            {meta.coords}
          </span>
        </div>

        {/* Center content */}
        <div className="relative flex-1 flex flex-col items-center justify-center py-4 my-auto select-none">
          {/* Huge translucent letters initials watermark */}
          <span className="absolute font-sans font-black italic text-[115px] md:text-[135px] text-white/[0.08] leading-none select-none tracking-tighter uppercase blur-[0.2px] z-0">
            {meta.initials}
          </span>
          
          <h3 className="font-display font-medium text-base md:text-[19px] tracking-wider uppercase text-white leading-tight text-center z-10 max-w-[220px]">
            {bev.name}
          </h3>
          
          <p className="font-serif italic text-white/90 text-xs md:text-[13px] tracking-wide mt-2 text-center z-10 max-w-[200px]">
            {bev.flavorGroup}
          </p>

          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-6 z-10">
            {meta.pills.map((pill) => (
              <span 
                key={pill} 
                className="border border-white/25 px-3 py-1 rounded-full text-[8px] font-mono tracking-wider text-white/85 bg-white/[0.02] uppercase"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Action shop CTA */}
        <div className="w-full mt-auto mb-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(bev);
            }}
            className="w-full cursor-pointer bg-white hover:bg-[#fafafa] text-[#07060b] font-mono text-[11px] uppercase font-bold tracking-[0.2em] py-4 rounded-full transition-all duration-300 transform active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-xl"
          >
            {isSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>ADDED TO CART</span>
              </>
            ) : (
              <span>SHOP</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ProductCollectionProps {
  onAddToCart: (item: CartItem) => void;
  onExploreDetails: (id: string) => void;
  onSelectProduct: (bev: Beverage) => void;
  cartCount?: number;
}

export default function ProductCollection({ onAddToCart, onExploreDetails, onSelectProduct, cartCount = 0 }: ProductCollectionProps) {
  const [successId, setSuccessId] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // States and refs for premium elastic rubber-band snapping
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bounceX, setBounceX] = useState(0);
  const touchStartX = useRef<number | null>(null);


  // Premium liquid/elastic bounce back spring animation
  useEffect(() => {
    if (bounceX !== 0) {
      const springBack = () => {
        setBounceX((prev) => {
          if (Math.abs(prev) < 0.25) return 0;
          return prev * 0.82; // quick spring-damping factor for ultra premium snappiness
        });
      };
      const rafId = requestAnimationFrame(springBack);
      return () => cancelAnimationFrame(rafId);
    }
  }, [bounceX]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    // We only apply horizontal rubber banding on scroll list if horizontally scrollable (on mobile/tablet)
    const isScrollable = el.scrollWidth > el.clientWidth;
    if (!isScrollable) return;

    const isAtLeft = el.scrollLeft <= 1;
    const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    // Apply reduced resistance when trying to scroll past limits
    if (isAtLeft && e.deltaX < 0) {
      setBounceX((prev) => Math.min(prev - e.deltaX * 0.18, 55));
    } else if (isAtRight && e.deltaX > 0) {
      setBounceX((prev) => Math.max(prev - e.deltaX * 0.18, -55));
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const el = scrollRef.current;
    if (!el) return;

    const isScrollable = el.scrollWidth > el.clientWidth;
    if (!isScrollable) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;
    const isAtLeft = el.scrollLeft <= 1;
    const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    if (isAtLeft && deltaX > 0) {
      setBounceX(Math.min(deltaX * 0.22, 65));
    } else if (isAtRight && deltaX < 0) {
      setBounceX(Math.max(deltaX * 0.22, -65));
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const handleAdd = (bev: Beverage) => {
    onAddToCart({
      id: bev.id,
      name: bev.name,
      price: bev.price,
      quantity: 1,
      flavorGroup: bev.flavorGroup,
      isCustom: false
    });
    setSuccessId(bev.id);
    setTimeout(() => setSuccessId(null), 1500);
  };

  const handleImageLoad = (id: string) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="products-section" className="w-full py-36 md:py-48 bg-[#1c2331] border-t border-white/[0.04] snap-start">
      <div className="max-w-7xl mx-auto px-6 md:px-12" id="products-inner-wrap">
        
        {/* Title row */}
        <div className="text-center mb-24 md:mb-32 space-y-4" id="products-heading-block">
          <FadeUp delay={0} duration={0.7}>
            <p className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-white/50">
              OUR PRODUCTS
            </p>
          </FadeUp>

          <h2 className="font-serif font-extralight text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            <TextReveal
              text="The Flagships"
              delay={0.1}
              stagger={0.1}
              duration={0.9}
              wrapClass="text-white"
            />
          </h2>

          <FadeUp delay={0.4} duration={0.8}>
            <p className="font-serif italic text-sm text-white/35 max-w-xs mx-auto">
              Three signatures. No compromise.
            </p>
          </FadeUp>

          <ScaleReveal
            className="w-16 h-[1px] bg-white/15 mx-auto mt-4"
            delay={0.5}
          />
        </div>

        {/* 3 Grid layout on desktop, horizontal snap scroll shelf on mobile/tablet */}
        <div 
          ref={scrollRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex md:grid md:grid-cols-3 gap-8 md:gap-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none pb-6 md:pb-0 scroll-smooth no-scrollbar"
          style={{
            transform: `translateX(${bounceX}px)`,
            transition: bounceX === 0 ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
          }}
        >
          {PRODUCTS_CATALOG.map((bev, index) => (
            <ProductCard
              key={bev.id}
              bev={bev}
              index={index}
              imageLoaded={!!imagesLoaded[bev.id]}
              onImageLoad={() => handleImageLoad(bev.id)}
              onAdd={handleAdd}
              isSuccess={successId === bev.id}
              onSelect={(item) => onSelectProduct(item)}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
