import React, { useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DarkSection from "./components/DarkSection";
import FAQSection from "./components/FAQSection";
import ProductCollection from "./components/ProductCollection";
import ProductDetailsView from "./components/ProductDetailsView";
import CartDrawer from "./components/CartDrawer";
import Reveal from "./components/Reveal";
import MarqueeTicker from "./components/MarqueeTicker";
import LoadingScreen from "./components/LoadingScreen";
import TextReveal, { FadeUp, ScaleReveal } from "./components/TextReveal";
import { CartItem, Beverage } from "./types";
import { ArrowUp, Shield } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Beverage | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Global Cart Event Handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // If it's a custom formula, match strictly by name to avoid grouping separate formulas
      const existingIdx = prevCart.findIndex(
        (i) => i.id === item.id || (!i.isCustom && !item.isCustom && i.id === item.id)
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += item.quantity;
        return newCart;
      }
      return [...prevCart, item];
    });
    // Open the drawer automatically to show added items
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Smooth Scroll Navigation Handler
  const handleNavigate = (sectionId: string) => {
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sectionId === "products") {
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "cinematic") {
      document.getElementById("cinematic-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Let products page scroll directly to details in the interactive Hero component
  const handleExploreDetails = (id: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Let Hero component catch it (we automatically expand matching layout indices inside Hero)
    // To do this, we lookup the corresponding clickable hero panel in the window or document
    const heroBtn = document.getElementById("logo-button");
    if (heroBtn) {
      const panel = document.getElementById(`panel-${id}`);
      if (panel) {
        panel.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-[#07060b] selection:text-white relative">

      {/* Animated Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-[#07060b] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Absolute floating floating primary navbar */}
      <Navbar
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        onNavigate={handleNavigate}
      />

      {/* Main Core Layout Sections */}
      <main className="w-full">

        {/* Section 1: Splitting portrait menus layout */}
        <div id="interactive-hero-section" className="snap-start">
          <Hero
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Section 2: Dark Atmospheric Cinematic Counterpoint Section */}
        <Reveal>
          <div id="cinematic-section" className="snap-start">
            <DarkSection />
          </div>
        </Reveal>

        {/* Section 3: Flagship Product Cards Shelf Grid shelf */}
        <Reveal>
          <ProductCollection
            onAddToCart={handleAddToCart}
            onExploreDetails={handleExploreDetails}
            onSelectProduct={setSelectedProduct}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        </Reveal>

        {/* Thin elegant horizontal divider matching the design system border */}
        <div className="w-full border-t border-white/5" />

        {/* Infinite scrolling announcement ticker under product section */}
        <MarqueeTicker />

        {/* Section 4: Clean, Minimal Editorial FAQ Section */}
        <FAQSection />

      </main>

      {/* Sliding Checkout Shopping Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Full-page Product Details View — renders on top of everything as its own page */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsView
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
            allProducts={[]}
            onAddToCart={handleAddToCart}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        )}
      </AnimatePresence>

      {/* Editorial Page Footer */}
      <footer className="bg-white border-t border-[#cdcdce] py-16 text-[#07060b] snap-start">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

          {/* L-Grid: Branding logo and description (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter overflow-hidden">
              <TextReveal
                text="altitude"
                mode="chars"
                delay={0}
                stagger={0.045}
                duration={0.6}
                wrapClass="text-[#07060b]"
              />
            </h3>

            <FadeUp delay={0.35} duration={0.8}>
              <p className="font-serif italic text-xs text-stone-600 max-w-sm leading-relaxed">
                Formulated as a high-contrast editorial tonic. We have stripped away synthetic sugar, food colorants, and botanical noise to leave only clear clinical performance.
              </p>
            </FadeUp>

            <FadeUp delay={0.5} duration={0.7}>
              <p className="font-mono text-[9px] text-stone-400">
                © 2026 ALTITUDE BEVERAGES INT. INC.
              </p>
            </FadeUp>

            {/* Creator logo — Sean */}
            <FadeUp delay={0.65} duration={0.7}>
              <div className="footer-sean-logo">
                <img
                  src="/sean-logo.jpg"
                  alt="Sean"
                  className="footer-sean-avatar"
                />
                <div className="footer-sean-label">
                  <strong>Sean</strong>
                  designed &amp; built
                </div>
              </div>
            </FadeUp>
          </div>

          {/* M-Grid Links (4 cols) */}
          <FadeUp delay={0.2} duration={0.8} className="md:col-span-4 grid grid-cols-2 gap-6 font-mono text-[11px] uppercase tracking-wider">
            <div className="space-y-3">
              <p className="font-bold text-[#07060b] text-[10px] text-gray-400">Navigation</p>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavigate("hero")} className="hover:underline cursor-pointer block text-left">Main Overview</button></li>
                <li><button onClick={() => handleNavigate("products")} className="hover:underline cursor-pointer block text-left">The Flagships</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-[#07060b] text-[10px] text-gray-400">Legal Spec</p>
              <ul className="space-y-2">
                <li className="text-gray-500 hover:text-black transition">Privacy Terms</li>
                <li className="text-gray-500 hover:text-black transition">Supply Chain</li>
                <li className="text-gray-500 hover:text-black transition">Ethics Code</li>
              </ul>
            </div>
          </FadeUp>

          {/* R-Grid: Federal compliance statements waiver (4 cols) */}
          <FadeUp delay={0.3} duration={0.9} className="md:col-span-4 space-y-3 bg-[#fafafa] p-5 rounded-2xl border border-[#cdcdce]/60 text-[#07060b]/80">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#07060b]">
              <Shield className="w-3.5 h-3.5 text-[#07060b]" />
              <span>FDA CLASSIFICATION DISCLOSURE</span>
            </div>
            <p className="font-sans text-[10px] leading-snug text-stone-500">
              *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any cognitive disorder or physical stress element. Consult medical specifications before altering active daily adaptogen volumes.
            </p>
          </FadeUp>

        </div>

        {/* Minimal return-to-top layout bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.4 }}
          className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono uppercase text-gray-400"
        >
          <span>ALTITUDE MONOCHROME — ESTABLISHED 2026</span>
          <motion.button
            whileHover={{ x: 0, color: "#07060b" }}
            onClick={() => handleNavigate("hero")}
            className="flex items-center gap-1 hover:text-black transition cursor-pointer"
          >
            <span>Back to zenith</span>
            <motion.span
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ArrowUp className="w-3 h-3" />
            </motion.span>
          </motion.button>
        </motion.div>
      </footer>

    </div>
  );
}