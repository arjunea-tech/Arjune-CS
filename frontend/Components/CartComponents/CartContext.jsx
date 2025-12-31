import React, { createContext, useContext, useMemo, useState } from 'react';
import productsData from '../../testing/ProductsTestData.json';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // seed with some items for demo purposes
  // seed with some items for demo purposes
  const initial = [
    { product: productsData[0], quantity: 1 },
  ].filter(item => item.product); // Filter out any undefined products just in case

  const [cartItems, setCartItems] = useState(initial);

  const addItem = (product, qty = 1) => {
    setCartItems(prev => {
      const found = prev.find(i => String(i.product.id) === String(product.id));
      if (found) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeItem = (productId) => {
    setCartItems(prev => prev.filter(i => String(i.product.id) !== String(productId)));
  };

  const setQuantity = (productId, quantity) => {
    setCartItems(prev => prev.map(i => String(i.product.id) === String(productId) ? { ...i, quantity: Math.max(0, quantity) } : i));
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, it) => s + (it.product.price || 0) * it.quantity, 0);
    // simple discount: 10% if subtotal >= 200
    const discount = subtotal >= 200 ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal > 0 ? (subtotal >= 100 ? 0 : 20) : 0; // free over 100
    const grandTotal = Math.round(subtotal - discount + shipping);
    return { subtotal, discount, shipping, grandTotal };
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, setQuantity, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
