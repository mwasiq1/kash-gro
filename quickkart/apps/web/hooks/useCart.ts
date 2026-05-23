"use client";

import { useEffect, useState } from "react";
import { useCartStore, CartItem } from "../stores/cart.store";

/**
 * Hydration-safe cart hook.
 *
 * Zustand's `persist` middleware reads from localStorage, which doesn't exist
 * on the server. Without this guard, the server renders `items = []` but the
 * client immediately gets the persisted cart, causing React to throw:
 *   "Hydration failed because the initial UI does not match the server."
 *
 * This hook returns safe defaults (empty cart) until after the first client
 * render, at which point it switches to the real Zustand store values.
 * Every component uses this single hook — no per-component useEffect needed.
 */
export function useCart() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kashgro-cart") {
        useCartStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Always subscribe so components re-render when cart changes after mount
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const promoCode = useCartStore((s) => s.promoCode);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);
  const _cartTotal = useCartStore((s) => s.cartTotal);
  const _itemCount = useCartStore((s) => s.itemCount);

  if (!isMounted) {
    // Safe defaults — identical to what the server renders
    return {
      isMounted: false,
      items: [] as CartItem[],
      isOpen: false,
      promoCode: null,
      addItem,       // actions are always safe to call (they don't render)
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      applyPromo,
      removePromo,
      cartTotal: 0,
      itemCount: 0,
    };
  }

  const subtotal = _cartTotal();
  let promoCodeWithDynamicDiscount = null;
  if (promoCode) {
    let dynamicDiscount = promoCode.discount;
    if (promoCode.discountType === "PERCENTAGE") {
      dynamicDiscount = (promoCode.discountValue / 100) * subtotal;
      if (promoCode.maxDiscountAmount) {
        dynamicDiscount = Math.min(dynamicDiscount, promoCode.maxDiscountAmount);
      }
    } else {
      dynamicDiscount = promoCode.discountValue;
    }
    dynamicDiscount = Math.round(dynamicDiscount * 100) / 100;
    
    promoCodeWithDynamicDiscount = {
      ...promoCode,
      discount: dynamicDiscount,
    };
  }

  return {
    isMounted: true,
    items,
    isOpen,
    promoCode: promoCodeWithDynamicDiscount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    applyPromo,
    removePromo,
    cartTotal: subtotal,
    itemCount: _itemCount(),
  };
}
