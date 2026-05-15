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

  return {
    isMounted: true,
    items,
    isOpen,
    promoCode,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    applyPromo,
    removePromo,
    cartTotal: _cartTotal(),
    itemCount: _itemCount(),
  };
}
