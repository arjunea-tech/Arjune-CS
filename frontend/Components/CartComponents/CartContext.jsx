import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // seed with some items for demo purposes
  // seed with some items for demo purposes
  // Start with empty cart
  const initial = [];

  const [cartItems, setCartItems] = useState(initial);

  const addItem = React.useCallback((product, qty = 1) => {
    if (!product) return;
    setCartItems(prev => {
      const pId = product._id || product.id;
      if (!pId) return prev;

      const found = prev.find(i => {
        const itemId = i.product?._id || i.product?.id;
        return String(itemId) === String(pId);
      });

      if (found) {
        return prev.map(i => {
          const itemId = i.product?._id || i.product?.id;
          return String(itemId) === String(pId) ? { ...i, quantity: i.quantity + qty } : i;
        });
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeItem = React.useCallback((productId) => {
    setCartItems(prev => prev.filter(i => String(i.product._id || i.product.id) !== String(productId)));
  }, []);

  const setQuantity = React.useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setCartItems(prev => prev.map(i => String(i.product._id || i.product.id) === String(productId) ? { ...i, quantity } : i));
    }
  }, [removeItem]);

  const clearCart = React.useCallback(() => setCartItems([]), []);

  const totals = useMemo(() => {
    // 1. Original Item Total (using full price)
    const itemsTotal = cartItems.reduce((s, it) => {
      if (!it.product) return s;
      return s + (it.product.price || 0) * it.quantity;
    }, 0);

    // 2. Discounted Item Total (using discountPrice where applicable)
    const discountedTotal = cartItems.reduce((s, it) => {
      if (!it.product) return s;
      const price = (it.product.discountPrice && it.product.discountPrice < it.product.price)
        ? it.product.discountPrice
        : (it.product.price || 0);
      return s + price * it.quantity;
    }, 0);

    const discount = itemsTotal - discountedTotal;
    const shipping = discountedTotal > 0 ? (discountedTotal >= 500 ? 0 : 50) : 0;
    const grandTotal = Math.round(discountedTotal + shipping);

    return {
      itemsTotal,
      subtotal: itemsTotal, // Displayed as Items Total
      discount,
      shipping,
      grandTotal
    };
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    totals
  }), [cartItems, addItem, removeItem, setQuantity, clearCart, totals]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
