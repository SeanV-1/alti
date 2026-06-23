import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Sparkles, Receipt, CheckCircle2, Loader2 } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [isCheckoutFormActive, setIsCheckoutFormActive] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFees = subtotal > 45 ? 0 : 4.99;
  const estimationTaxes = subtotal * 0.0825;
  const total = subtotal + shippingFees + estimationTaxes;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc || !address) {
      alert("Please fill in all credit card details.");
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      setOrderComplete(true);
      setIsCheckingOut(false);
      setIsCheckoutFormActive(false);
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setAddress("");
    }, 1800);
  };

  const handleFinish = () => {
    onClearCart();
    setOrderComplete(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#fafafa] text-[#07060b] flex flex-col justify-between shadow-2xl relative border-l border-[#cdcdce]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#cdcdce] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#07060b]" />
                  <h3 className="font-display font-bold text-lg uppercase tracking-tight">
                    {isCheckoutFormActive ? "Credit Card Checkout" : "Shopping Cart"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    if (isCheckoutFormActive) {
                      setIsCheckoutFormActive(false);
                    } else {
                      onClose();
                    }
                  }}
                  className="bg-stone-100 hover:bg-stone-200 p-2 rounded-full text-[#07060b] transition-editorial cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Central Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {orderComplete ? (
                  // ORDER PLACED SCREEN
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-col text-center space-y-6 pt-12 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
                    <div className="space-y-2">
                      <h4 className="font-display font-black text-2xl uppercase tracking-tight text-[#07060b]">
                        Cognitive Order Placed
                      </h4>
                      <p className="font-serif italic text-sm text-stone-600 max-w-xs mx-auto">
                        Your adaptive molecules have been batched, certified, and queued for local delivery dispatch.
                      </p>
                    </div>

                    <div className="bg-[#d9d9d9]/60 p-5 rounded-2xl border border-dashed border-[#cdcdce] text-left w-full space-y-2 font-mono text-[10px] uppercase">
                      <p className="text-gray-500 font-bold">ROUTE IDENTIFICATIONS</p>
                      <p>● DISPATCH CODE: ALT-{(Math.random() * 900000 + 100000).toFixed(0)}</p>
                      <p>● COGNITIVE METADATA: CERTIFIED STANDARD</p>
                      <p>● DESTINATION CLIENT: Sean</p>
                    </div>

                    <button
                      onClick={handleFinish}
                      className="cursor-pointer w-full py-4 rounded-[100px] bg-[#07060b] hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-widest transition"
                    >
                      Acknowledge Alchemy
                    </button>
                  </motion.div>
                ) : isCheckoutFormActive ? (
                  // REAL CHECKOUT FORM SCREEN
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        Credit Card Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#cdcdce] bg-white text-xs font-mono focus:outline-none focus:border-[#07060b]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#cdcdce] bg-white text-xs font-mono focus:outline-none focus:border-[#07060b]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                          Security Code (CVC)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          maxLength={4}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#cdcdce] bg-white text-xs font-mono focus:outline-none focus:border-[#07060b]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        Billing & Shipping Address
                      </label>
                      <textarea
                        required
                        placeholder="123 Altitude Way, San Francisco, CA 94103"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#cdcdce] bg-white text-xs font-sans focus:outline-none focus:border-[#07060b] min-h-[70px] resize-none"
                      />
                    </div>

                    <div className="bg-[#d9d9d9]/40 p-4 rounded-2xl border border-[#cdcdce]/60 space-y-1">
                      <div className="flex justify-between font-mono text-[10px] text-stone-700">
                        <span>SUB-TOTAL</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-stone-700">
                        <span>SHIPPING</span>
                        <span>{shippingFees === 0 ? "FREE" : `$${shippingFees.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-stone-700">
                        <span>TAXES</span>
                        <span>${estimationTaxes.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-[#cdcdce] my-1.5" />
                      <div className="flex justify-between font-display font-black text-sm text-[#07060b]">
                        <span>DUE TODAY</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full py-4 rounded-[100px] cursor-pointer bg-[#07060b] hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>AUTHORIZING TRANSACTION...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-[#ddfcff]" />
                          <span>PAY SECURELY — ${(total).toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // CART LIST
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-[24px] border border-[#cdcdce] flex items-center justify-between gap-4 shadow-2xs relative"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.isCustom && (
                              <span className="bg-sky-100 text-sky-800 font-mono text-[8px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Sparkles className="w-2 h-2 fill-sky-800" />
                                CUSTOM
                              </span>
                            )}
                            <h4 className="font-display font-extrabold text-sm uppercase text-[#07060b] tracking-tight">
                              {item.name}
                            </h4>
                          </div>
                          
                          <p className="font-mono text-[10px] text-gray-500 uppercase leading-none">
                            {item.flavorGroup}
                          </p>
                          
                          {/* Custom Formulation Summary trigger */}
                          {item.isCustom && item.customFormula && (
                            <div className="mt-1 bg-[#fafafa] p-2 rounded-lg border border-gray-100 font-serif italic text-[10px] text-stone-500 leading-snug">
                              "{item.customFormula.tagline}"
                            </div>
                          )}

                          <div className="font-display font-medium text-xs mt-2 text-[#07060b]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity Counter Block */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#d9d9d9] rounded-full p-0.5 border border-[#cdcdce]">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-white text-black transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold px-2 text-[#07060b]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-white text-black transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Order Summary & Checkout Action */}
              {cart.length > 0 && !orderComplete && !isCheckoutFormActive && (
                <div className="bg-white border-t border-[#cdcdce] p-6 space-y-4">
                  {/* Ledger Breakdown style */}
                  <div className="bg-[#d9d9d9]/40 p-4 rounded-2xl border border-[#cdcdce]/60 space-y-2">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#07060b] font-bold flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5" />
                      ALTITUDE ADAPTIVE LEDGER BILL
                    </p>
                    <div className="border-t border-[#cdcdce]/60 my-2" />
                    
                    <div className="flex justify-between font-mono text-xs text-stone-700">
                      <span>SPEC SUB-TOTAL</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs text-stone-700">
                      <span>CARBON SHIPPING</span>
                      <span>{shippingFees === 0 ? "FREE" : `$${shippingFees.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs text-stone-700">
                      <span>ESTIMATED TAXES</span>
                      <span>${estimationTaxes.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-[#cdcdce] my-2" />
                    
                    <div className="flex justify-between font-display font-black text-base text-[#07060b]">
                      <span>TOTAL PAY</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutFormActive(true)}
                    className="w-full py-4 rounded-[100px] cursor-pointer bg-[#07060b] hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-[#ddfcff]" />
                    <span>PROCEED TO PAYMENT — ${(total).toFixed(2)}</span>
                  </button>

                  <p className="text-[10px] font-sans text-center text-gray-500">
                    Calculated for Sean. Free shipping on batches over $45.00.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
