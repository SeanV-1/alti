import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { Beverage, CartItem } from "../types";

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: Beverage;
  allProducts: Beverage[];
  onAddToCart: (item: CartItem) => void;
  cartCount: number;
}

// ─── Product catalog with extended detail data ────────────────────────────────
const DETAIL_CATALOG = [
  {
    id: "margarita",
    name: "Prickly Pear Margarita",
    shortName: "Prickly Pear",
    tagline: "An Invigorated Classic Prickly Pear Margarita",
    description: "This classic blend of salt and lime is always right when you're in your element.",
    price: 15.0,
    activeIngredients: ["L-Theanine", "Magnesium", "Lion's Mane"],
    colorAccent: "#c0605a",
    imageUrl: "/src/assets/images/models/product2-details-img.png",
    // Gradient: deep navy top → coral-pink bottom
    gradientFrom: "#0f1c2e",
    gradientMid: "#1e2d42",
    gradientTo: "#c05a50",
    leftPhoto: "/src/assets/images/models/product2-details-img2.png",
    rightPhoto: "/src/assets/images/models/product2-details-img3.png",
  },
  {
    id: "rosemary",
    name: "Rosemary Spritz",
    shortName: "Rosemary",
    tagline: "Low-Key Sophisticated Rosemary Spritz",
    description: "A quiet walk through a sun-dappled pine forest. Clear air, damp soil, and the soothing hum of wild bees. This herbal and bittersweet companion is designed for long evenings.",
    price: 15.0,
    activeIngredients: ["L-Theanine", "Magnesium", "Lion's Mane"],
    colorAccent: "#c07840",
    imageUrl: "/src/assets/images/models/product-detail-img1.PNG",
    gradientFrom: "#0d1e14",
    gradientMid: "#1b2e1e",
    gradientTo: "#a06030",
    leftPhoto: "/src/assets/images/models/product-details-img2.PNG",
    rightPhoto: "/src/assets/images/models/product-details-img3.png",
  },
  {
    id: "lilikoi",
    name: "Lili'koi Mai Tai",
    shortName: "Lili'koi",
    tagline: "Just Bold Enough Lili'Koi Mai Tai",
    description: "Golden hour on a hidden lava-rock cove. Salt spray, warm trade winds, and the vibrant splash of tropical nectar. An intense, lush flavor profile that pairs effortlessly with warm company.",
    price: 15.0,
    activeIngredients: ["L-Theanine", "Magnesium", "Lion's Mane"],
    colorAccent: "#c04060",
    imageUrl: "/src/assets/images/models/product3-details-img.png",
    gradientFrom: "#1a0e1e",
    gradientMid: "#2a1430",
    gradientTo: "#b03060",
    leftPhoto: "/src/assets/images/models/product3-details-img2.png",
    rightPhoto: "/src/assets/images/models/product3-details-img3.png",
  },
];

// ─── Story/Ingredients view content ──────────────────────────────────────────
const STORY_CONTENT: Record<string, { fullDescription: string; ingredients: string; nutrition: { label: string; value: string }[] }> = {
  margarita: {
    fullDescription: "Anticipation and mariachi horns fill the air. You know how to dance without overdoing it. This crisp, citrus and invigorating take on a classic will always make the right impression.",
    ingredients: "Purified Carbonated Water, Organic Agave Nectar, Key Lime Juice Concentrate, Red Prickly Pear Puree, Organic Flavors, L-Theanine (200mg), Organic Lion's Mane Extract (150mg), Magnesium Citrate (100mg).",
    nutrition: [
      { label: "Calories", value: "35" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "10mg" },
      { label: "Total Carb.", value: "8g" },
      { label: "Total Sugars", value: "7g" },
      { label: "Protein", value: "0g" },
      { label: "Magnesium", value: "100mg (25% DV)" },
    ],
  },
  rosemary: {
    fullDescription: "A contemplative forest-to-glass botanical draft. Blending carbonated spring water, fresh rosemary needles oil distillations, gentian root bitters, and a touch of wild mountain honey.",
    ingredients: "Pure Carbonated Spring Water, Steam-Distilled Rosemary Needle Oil Hydrosol, Gentian Root Bark, Wild Mountain Honey, Organic Grapefruit Peel Oils, L-Theanine (200mg), Lion's Mane Extract (150mg), Magnesium Citrate (100mg).",
    nutrition: [
      { label: "Calories", value: "20" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "5mg" },
      { label: "Total Carb.", value: "5g" },
      { label: "Total Sugars", value: "4g" },
      { label: "Protein", value: "0g" },
      { label: "Magnesium", value: "100mg (25% DV)" },
    ],
  },
  lilikoi: {
    fullDescription: "An exotic, sunset-drenched tropical escape. Formulated with authentic Hawaiian yellow passion fruit (lili'koi), sweet almond orgeat syrup, and a squeeze of dark lime to anchor notes.",
    ingredients: "Carbonated Spring Water, Pineapple Juice Concentrate, Lili'koi (Yellow Passionfruit) Puree, Lime Juice, Organic Cane Sugar, Real Almond Orgeat Extract, L-Theanine (200mg), Lion's Mane (150mg), Magnesium Citrate (100mg).",
    nutrition: [
      { label: "Calories", value: "40" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "12mg" },
      { label: "Total Carb.", value: "10g" },
      { label: "Total Sugars", value: "9g" },
      { label: "Protein", value: "0g" },
      { label: "Magnesium", value: "100mg (25% DV)" },
    ],
  },
};

const INGREDIENT_DETAILS: Record<string, string> = {
  "L-Theanine": "L-Theanine delivers natural support for relaxation and balanced energy. Found in green tea and several types of mushrooms, this amino acid promotes alertness without anxiety.",
  "Magnesium": "Magnesium promotes a calm mood by supporting neurotransmitter regulation. Found in many greens, beans, and whole grains, this essential mineral can be hard to get in the recommended amount.",
  "Lion's Mane": "Lion's mane supports mental clarity, focus, and flow. This mushroom extract has been shown to deliver a host of benefits for mental health, including reducing depression.",
};

export default function ProductDetailsView({
  isOpen,
  onClose,
  product,
  onAddToCart,
  cartCount,
}: ProductDetailsProps) {
  const [activeItem, setActiveItem] = useState(
    DETAIL_CATALOG.find((d) => d.id === product.id) || DETAIL_CATALOG[0]
  );
  const [selectedPack, setSelectedPack] = useState<"6-pack" | "12-pack">("6-pack");
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscribe">("one-time");
  const [viewMode, setViewMode] = useState<0 | 1>(0); // 0 = configurator, 1 = story
  const [storyTab, setStoryTab] = useState<"description" | "ingredients" | "nutrition">("description");
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // ── Infinite gallery refs ────────────────────────────────────────────────────
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetXRef = useRef(0);          // live pixel offset (fractional)
  const velocityRef = useRef(0);         // px/frame momentum
  const isPointerDownRef = useRef(false);
  const pointerXRef = useRef(0);         // last pointer X
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerWidthRef = useRef(0);   // gallery element width

  // Sync to incoming product on open
  useEffect(() => {
    const found = DETAIL_CATALOG.find((d) => d.id === product.id);
    if (found) setActiveItem(found);
    setActiveImageIndex(0);
    offsetXRef.current = 0;
    velocityRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = "translateX(0px)";
    setViewMode(0);
    setStoryTab("description");
  }, [product.id, isOpen]);

  // Reset gallery when flavor changes
  useEffect(() => {
    setActiveImageIndex(0);
    offsetXRef.current = 0;
    velocityRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = "translateX(0px)";
  }, [activeItem.id]);

  // Measure gallery width
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      containerWidthRef.current = el.offsetWidth;
    });
    ro.observe(el);
    containerWidthRef.current = el.offsetWidth;
    return () => ro.disconnect();
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── RAF loop: apply offset + momentum + wrap ─────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const animate = (time: number) => {
      lastTimeRef.current = time;

      const W = containerWidthRef.current;
      if (W === 0) { rafRef.current = requestAnimationFrame(animate); return; }

      const IMAGES = 3; // images per set
      const imgW = W * 0.6; // 60% of viewport width
      const setWidth = imgW * IMAGES;    // width of one full set of images

      // Apply momentum when not dragging
      if (!isPointerDownRef.current) {
        velocityRef.current *= 0.92; // friction
        if (Math.abs(velocityRef.current) < 0.05) velocityRef.current = 0;
      }

      offsetXRef.current += velocityRef.current;

      // Infinite wrap: keep offset in range [0, setWidth)
      const modded = ((offsetXRef.current % setWidth) + setWidth) % setWidth;
      offsetXRef.current = modded;

      // Translate track: middle copy starts at -setWidth.
      // Subtract modded to slide left as offset increases, and center the active slide using (W - imgW) / 2
      const translateX = -setWidth - modded + (W - imgW) / 2;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${translateX}px)`;
      }

      // Update active dot
      const imgIdx = Math.round(modded / imgW) % IMAGES;
      setActiveImageIndex((imgIdx + IMAGES) % IMAGES);

      rafRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen]);

  // ── Pointer handlers ─────────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    pointerXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - pointerXRef.current;
    pointerXRef.current = e.clientX;
    // drag left (dx<0) -> increase offset -> track slides left -> next image
    // drag right (dx>0) -> decrease offset -> track slides right -> previous image
    velocityRef.current = -dx * 0.85;
    offsetXRef.current -= dx;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const computedPrice = selectedPack === "6-pack" ? 24 : 45;
  const displayPrice = purchaseType === "subscribe" ? computedPrice * 0.9 : computedPrice;

  const handleAddAction = () => {
    onAddToCart({
      id: `${activeItem.id}-${selectedPack}-${purchaseType}`,
      name: `${activeItem.name} (${selectedPack === "6-pack" ? "6-Pack" : "12-Pack"})`,
      price: displayPrice,
      quantity: 1,
      flavorGroup: "",
      isCustom: false,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1600);
  };

  if (!isOpen) return null;

  const story = STORY_CONTENT[activeItem.id] || STORY_CONTENT.margarita;
  const itemImages = [activeItem.imageUrl, activeItem.leftPhoto, activeItem.rightPhoto];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="pdv-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="pdv-root"
        >
          {/* ── Grain noise overlay ───────────────────────────────────────── */}
          <div className="pdv-grain" />

          {/* ══════════════════════════════════════════════════════════════
              CONFIGURATOR VIEW  (viewMode === 0)
          ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {viewMode === 0 ? (
              <motion.div
                key="conf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                className="pdv-scene"
              >
                {/* ── Top header bar ──────────────────────────────────── */}
                <header className="pdv-header">
                  {/* Logo / back */}
                  <button className="pdv-logo-btn" onClick={onClose}>
                    altitude
                  </button>

                  {/* Nav pill */}
                  <nav className="pdv-nav-pill">
                    <button className="pdv-nav-pill__link" onClick={onClose}>Shop</button>
                    <button className="pdv-nav-pill__link" onClick={onClose}>About</button>
                    <button className="pdv-nav-pill__link" onClick={onClose}>Find Us</button>
                    <button className="pdv-nav-pill__link">Cart ({cartCount})</button>
                  </nav>

                  {/* Λ close button */}
                  <button className="pdv-lambda-btn" onClick={onClose}>Λ</button>
                </header>

                {/* ── Infinite Gallery ────────────────────────────────── */}
                <div
                  ref={galleryRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="pdv-gallery"
                >
                  {/* Track: 3 copies of images for infinite wrap */}
                  <div ref={trackRef} className="pdv-gallery__track">
                    {[0, 1, 2].map((copy) =>
                      itemImages.map((src, i) => (
                        <div key={`${copy}-${i}`} className="pdv-gallery__slide">
                          <img
                            src={src}
                            alt={`Product view ${i + 1}`}
                            className="pdv-gallery__img"
                            draggable={false}
                          />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Subtle edge vignettes */}
                  <div className="pdv-gallery__fade pdv-gallery__fade--left" />
                  <div className="pdv-gallery__fade pdv-gallery__fade--right" />
                </div>

                {/* ── Dot pagination ──────────────────────────────────── */}
                <div className="pdv-dots z-20">
                  {itemImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`pdv-dot ${activeImageIndex === idx ? "pdv-dot--active" : ""}`}
                      onClick={() => {
                        // Jump to that image by snapping offset
                        const W = containerWidthRef.current;
                        if (W === 0) return;
                        const imgW = W * 0.6;
                        offsetXRef.current = idx * imgW;
                        velocityRef.current = 0;
                      }}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* ── Purchase panel — bottom-left stacked cards ──────── */}
                <div className="pdv-purchase-panel">
                  {/* Card 1: Product info */}
                  <div className="pdv-card pdv-card--info">
                    <h1 className="pdv-card__product-name">{activeItem.name}</h1>
                    <p className="pdv-card__desc">{activeItem.description}</p>
                    <div className="pdv-card__pills">
                      {activeItem.activeIngredients.map((ing) => (
                        <span key={ing} className="pdv-pill">{ing}</span>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Configurator controls */}
                  <div className="pdv-card pdv-card--config">
                    {/* FLAVOR */}
                    <div className="pdv-ctrl">
                      <span className="pdv-ctrl__label">Flavor</span>
                      <div className="pdv-flavor-row">
                        {DETAIL_CATALOG.map((fl) => (
                          <button
                            key={fl.id}
                            onClick={() => setActiveItem(fl)}
                            className={`pdv-flavor-thumb ${activeItem.id === fl.id ? "pdv-flavor-thumb--active" : ""}`}
                          >
                            <img src={fl.imageUrl} alt={fl.shortName} className="pdv-flavor-thumb__img" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PACK */}
                    <div className="pdv-ctrl">
                      <span className="pdv-ctrl__label">Pack</span>
                      <div className="pdv-toggle">
                        <button
                          className={`pdv-toggle__btn ${selectedPack === "6-pack" ? "pdv-toggle__btn--active" : ""}`}
                          onClick={() => setSelectedPack("6-pack")}
                        >
                          6-Pack
                        </button>
                        <button
                          className={`pdv-toggle__btn ${selectedPack === "12-pack" ? "pdv-toggle__btn--active" : ""}`}
                          onClick={() => setSelectedPack("12-pack")}
                        >
                          12-Pack
                        </button>
                      </div>
                    </div>

                    {/* PURCHASE */}
                    <div className="pdv-ctrl">
                      <span className="pdv-ctrl__label">Purchase</span>
                      <div className="pdv-toggle">
                        <button
                          className={`pdv-toggle__btn ${purchaseType === "one-time" ? "pdv-toggle__btn--active" : ""}`}
                          onClick={() => setPurchaseType("one-time")}
                        >
                          One-Time
                        </button>
                        <div className="pdv-toggle__subscribe-wrap">
                          <button
                            className={`pdv-toggle__btn pdv-toggle__btn--sub ${purchaseType === "subscribe" ? "pdv-toggle__btn--active" : ""}`}
                            onClick={() => setPurchaseType("subscribe")}
                          >
                            Subscribe Monthly
                          </button>
                          <span className="pdv-discount-badge">10% OFF</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="pdv-cta-btn" onClick={handleAddAction}>
                      {addedSuccess ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>Added to bag</span>
                        </>
                      ) : (
                        <span>
                          {activeItem.id === "margarita"
                            ? `Sold Out — $${displayPrice.toFixed(0)}`
                            : `Add to Bag — $${displayPrice.toFixed(0)}`}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ══════════════════════════════════════════════════════════════
                  STORY / DETAILS VIEW  (viewMode === 1)
              ══════════════════════════════════════════════════════════════ */
              <motion.div
                key="story"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                className="pdv-story"
                style={{
                  background: `linear-gradient(145deg, ${activeItem.gradientFrom} 0%, ${activeItem.gradientMid} 60%, ${activeItem.gradientTo}55 100%)`,
                }}
              >
                {/* Grain */}
                <div className="pdv-grain" />

                {/* Header */}
                <header className="pdv-header">
                  <button className="pdv-logo-btn" onClick={onClose}>altitude</button>
                  <nav className="pdv-nav-pill">
                    <button className="pdv-nav-pill__link" onClick={onClose}>Shop</button>
                    <button className="pdv-nav-pill__link" onClick={onClose}>About</button>
                    <button className="pdv-nav-pill__link" onClick={onClose}>Find Us</button>
                    <button className="pdv-nav-pill__link">Cart ({cartCount})</button>
                  </nav>
                  <button className="pdv-lambda-btn" onClick={onClose}>Λ</button>
                </header>

                <div className="pdv-story__body">
                  {/* Left: can card */}
                  <div className="pdv-story__left">
                    <div className="pdv-story__can-card">
                      <div className="pdv-story__can-glow" style={{ background: activeItem.colorAccent }} />
                      <motion.img
                        key={activeItem.id + "-story-can"}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        src={activeItem.imageUrl}
                        alt={activeItem.name}
                        className="pdv-story__can-img"
                      />
                    </div>
                    {/* Product name and pack selector below the card */}
                    <div className="pdv-story__can-meta">
                      <p className="pdv-story__can-product-name">{activeItem.name}</p>
                      <div className="pdv-toggle pdv-toggle--sm">
                        <button
                          className={`pdv-toggle__btn ${selectedPack === "6-pack" ? "pdv-toggle__btn--active" : ""}`}
                          onClick={() => setSelectedPack("6-pack")}
                        >6-Pack</button>
                        <button
                          className={`pdv-toggle__btn ${selectedPack === "12-pack" ? "pdv-toggle__btn--active" : ""}`}
                          onClick={() => setSelectedPack("12-pack")}
                        >12-Pack</button>
                      </div>
                      <button className="pdv-cta-btn pdv-cta-btn--sm" onClick={handleAddAction}>
                        {addedSuccess ? (
                          <><Check size={12} strokeWidth={3} /><span>Added</span></>
                        ) : (
                          <span>Add to Bag — ${displayPrice.toFixed(0)}</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right: tabbed details */}
                  <div className="pdv-story__right">
                    <h2 className="pdv-story__heading">{activeItem.name}</h2>
                    <p className="pdv-story__subheading">{activeItem.tagline}</p>

                    {/* Tabs */}
                    <div className="pdv-story__tabs">
                      {(["description", "ingredients", "nutrition"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setStoryTab(tab)}
                          className={`pdv-story__tab ${storyTab === tab ? "pdv-story__tab--active" : ""}`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={storyTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="pdv-story__tab-content"
                      >
                        {storyTab === "description" && (
                          <div className="pdv-story__desc-tab">
                            <p className="pdv-story__body-text">{story.fullDescription}</p>
                            <div className="pdv-story__divider" />
                            <div className="pdv-story__ingredients-detail">
                              {Object.entries(INGREDIENT_DETAILS).map(([name, desc]) => (
                                <div key={name} className="pdv-story__ingredient-row">
                                  <span className="pdv-story__ingredient-name">{name}</span>
                                  <span className="pdv-story__ingredient-desc">{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {storyTab === "ingredients" && (
                          <p className="pdv-story__body-text pdv-story__body-text--serif">{story.ingredients}</p>
                        )}
                        {storyTab === "nutrition" && (
                          <div className="pdv-story__nutrition">
                            {story.nutrition.map((fact) => (
                              <div key={fact.label} className="pdv-story__nutrition-row">
                                <span className="pdv-story__nutrition-label">{fact.label}</span>
                                <span className="pdv-story__nutrition-value">{fact.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Dots */}
                <div className="pdv-dots pdv-dots--story">
                  <button className={`pdv-dot ${viewMode === 0 ? "pdv-dot--active" : ""}`} onClick={() => setViewMode(0)} />
                  <button className={`pdv-dot ${viewMode === 1 ? "pdv-dot--active" : ""}`} onClick={() => setViewMode(1)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
