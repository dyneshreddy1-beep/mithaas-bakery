import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "./data";
import type { CartItem } from "./types";

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, weight?: string, qty?: number) => void;
  updateQty: (productId: string, weight: string, qty: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWished: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  products: any[];
}

const StoreCtx = createContext<StoreState | null>(null);

let activeProductsList = products; // Shared mutable reference for standalone helper

function priceFor(productId: string, weight: string, productsList = products): number {
  const p = productsList.find(x => x.id === productId);
  if (!p) return 0;
  const w = p.weights.find(w => w.label === weight) ?? p.weights[0];
  return Math.round(p.price * w.priceMultiplier);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>(products);

  // Sync activeProductsList with react state
  useEffect(() => {
    activeProductsList = dbProducts;
  }, [dbProducts]);

  // Fetch prices from local backend database on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge price changes from backend into frontend product models (preserving rich assets)
          const merged = products.map(p => {
            const matched = data.find((x: any) => x.id === p.id);
            return matched ? { ...p, price: matched.price } : p;
          });
          setDbProducts(merged);
        }
      })
      .catch(err => {
        console.warn("Mithaas backend not running. Defaulting to local static sweet pricing. Details:", err.message);
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const c = localStorage.getItem("mithaas:cart");
      const w = localStorage.getItem("mithaas:wishlist");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("mithaas:cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("mithaas:wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback((productId: string, weight?: string, qty = 1) => {
    const p = dbProducts.find(x => x.id === productId);
    if (!p) return;
    const w = weight ?? p.weights[0].label;
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && i.weight === w);
      if (existing) return prev.map(i => i === existing ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { productId, weight: w, quantity: qty }];
    });
  }, [dbProducts]);

  const updateQty = useCallback((productId: string, weight: string, qty: number) => {
    setCart(prev => qty <= 0
      ? prev.filter(i => !(i.productId === productId && i.weight === weight))
      : prev.map(i => (i.productId === productId && i.weight === weight) ? { ...i, quantity: qty } : i)
    );
  }, []);

  const removeFromCart = useCallback((productId: string, weight: string) => {
    setCart(prev => prev.filter(i => !(i.productId === productId && i.weight === weight)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const value = useMemo<StoreState>(() => ({
    cart, wishlist,
    addToCart, updateQty, removeFromCart, clearCart, toggleWishlist,
    isWished: (id) => wishlist.includes(id),
    cartCount: cart.reduce((s, i) => s + i.quantity, 0),
    cartSubtotal: cart.reduce((s, i) => s + priceFor(i.productId, i.weight, dbProducts) * i.quantity, 0),
    products: dbProducts,
  }), [cart, wishlist, addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, dbProducts]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function priceForItem(productId: string, weight: string) {
  return priceFor(productId, weight, activeProductsList);
}