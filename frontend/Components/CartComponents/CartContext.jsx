import React, { createContext, useContext, useMemo, useState } from 'react';
import productsData from '../../testing/ProductsTestData.json';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // seed with some items for demo purposes
  // seed with some items for demo purposes
  // Start with empty cart
  const initial = [];

  const [cartItems, setCartItems] = useState(initial);

  const addItem = React.useCallback((product, qty = 1) => {
    setCartItems(prev => {
      const pId = product._id || product.id;
      const found = prev.find(i => String(i.product._id || i.product.id) === String(pId));
      if (found) {
        return prev.map(i => String(i.product._id || i.product.id) === String(pId) ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeItem = React.useCallback((productId) => {
    setCartItems(prev => prev.filter(i => String(i.product._id || i.product.id) !== String(productId)));
  }, []);

  const setQuantity = React.useCallback((productId, quantity) => {
    setCartItems(prev => prev.map(i => String(i.product._id || i.product.id) === String(productId) ? { ...i, quantity: Math.max(0, quantity) } : i));
  }, []);

  const clearCart = React.useCallback(() => setCartItems([]), []);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, it) => {
      const price = (it.product.discountPrice && it.product.discountPrice < it.product.price)
        ? it.product.discountPrice
        : (it.product.price || 0);
      return s + price * it.quantity;
    }, 0);

    const discount = 0;
    const shipping = subtotal > 0 ? (subtotal >= 100 ? 0 : 20) : 0;
    const grandTotal = Math.round(subtotal - discount + shipping);
    return { subtotal, discount, shipping, grandTotal };
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
