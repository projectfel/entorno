import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { CartProduct, CartItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartProduct, marketId: string, marketNome: string, marketWhatsapp: string) => void;
  removeItem: (productId: string, marketId: string) => void;
  updateQuantity: (productId: string, marketId: string, quantidade: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CART_STORAGE_KEY = "entorno_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // Storage full or unavailable
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback(
    (product: CartProduct, marketId: string, marketNome: string, marketWhatsapp: string) => {
      setItems((prev) => {
        // Enforce single-store cart: if adding from different store, warn and replace
        if (prev.length > 0 && prev[0].marketId !== marketId) {
          // Clear old items and start fresh with new store
          return [{ ...product, quantidade: 1, marketId, marketNome, marketWhatsapp }];
        }

        const existing = prev.find((i) => i.id === product.id && i.marketId === marketId);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id && i.marketId === marketId
              ? { ...i, quantidade: i.quantidade + 1 }
              : i
          );
        }
        return [...prev, { ...product, quantidade: 1, marketId, marketNome, marketWhatsapp }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, marketId: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === productId && i.marketId === marketId)));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, marketId: string, quantidade: number) => {
      if (quantidade <= 0) {
        removeItem(productId, marketId);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === productId && i.marketId === marketId ? { ...i, quantidade } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.preco * i.quantidade, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantidade, 0), [items]);

  const value = useMemo<CartContextType>(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isOpen, setIsOpen }),
    [items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
