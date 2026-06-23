import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  onNavigate: (section: string) => void;
}

export default function Navbar({ cart, setIsCartOpen, onNavigate }: NavbarProps) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header 
      className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 max-w-[1440px] mx-auto flex items-center justify-between pointer-events-none"
      animate={{
        scale: isScrolled ? 1.03 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 22
      }}
    >
      {/* Unified Background Glass Capsule */}
      <motion.div
        className="absolute inset-x-4 md:inset-x-8 -inset-y-3 bg-neutral-950/45 backdrop-blur-md border border-white/[0.08] rounded-full z-0 pointer-events-none shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0, 
          scale: isScrolled ? 1.02 : 0.96 
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* Brand logo (Left side independently) */}
      <button 
        onClick={() => onNavigate("hero")}
        className="pointer-events-auto flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white px-6 py-2.5 rounded-full border border-white/10 transition-all cursor-pointer z-10 relative"
        id="logo-button"
      >
        <span className="font-sans font-bold tracking-[0.02em] text-xs lowercase text-white/95">altitude</span>
      </button>

      {/* Floating Center Pill Navigation */}
      <nav className="pointer-events-auto bg-neutral-900/40 border border-white/5 backdrop-blur-xl rounded-[100px] flex items-center p-1.5 shadow-lg z-10 relative">
        <ul className="flex items-center gap-0.5">
          <li>
            <button
              onClick={() => onNavigate("products")}
              className="px-5 py-2 text-[10px] font-mono tracking-[0.1em] uppercase font-bold text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              Shop
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate("cinematic")}
              className="px-5 py-2 text-[10px] font-mono tracking-[0.1em] uppercase font-bold text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2 text-[10px] font-mono tracking-[0.1em] uppercase font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              Cart ({totalItems})
            </button>
          </li>
        </ul>
      </nav>

      {/* 40px Circular Icon Button (Right side independently) */}
      <div className="pointer-events-auto flex items-center z-10 relative">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="w-10 h-10 rounded-full bg-[#801c1e] text-white flex items-center justify-center text-[15px] font-sans font-normal hover:bg-[#942023] transition-all cursor-pointer border border-white/10 shadow-lg"
        >
          Λ
        </button>
      </div>
    </motion.header>
  );
}
