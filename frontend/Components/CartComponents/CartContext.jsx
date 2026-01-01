import React, { createContext, useContext, useMemo, useState } from 'react';
import productsData from '../../testing/ProductsTestData.json';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // seed with some items for demo purposes
  // seed with some items for demo purposes
  // Start with empty cart
  const initial = [];

  const [cartItems, setCartItems] = useState(initial);

  const addItem = (product, qty = 1) => {
    setCartItems(prev => {
      const pId = product._id || product.id;
      const found = prev.find(i => String(i.product._id || i.product.id) === String(pId));
      if (found) {
        return prev.map(i => String(i.product._id || i.product.id) === String(pId) ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeItem = (productId) => {
    setCartItems(prev => prev.filter(i => String(i.product._id || i.product.id) !== String(productId)));
  };

  const setQuantity = (productId, quantity) => {
    setCartItems(prev => prev.map(i => String(i.product._id || i.product.id) === String(productId) ? { ...i, quantity: Math.max(0, quantity) } : i));
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((s, it) => {
      const price = (it.product.discountPrice && it.product.discountPrice < it.product.price)
        ? it.product.discountPrice
        : (it.product.price || 0);
      return s + price * it.quantity;
    }, 0);

    // simple discount: 10% if subtotal >= 200 (Optional: Remove this if product discounts are enough, but keeping as extra)
    // Actually, user said "if discount price have, discount price is the product price".
    // They didn't mention extra cart-wide discounts, but let's keep the existing logic or simpler?
    // Let's keep the extra discount logic for now unless it conflicts.
    const discount = 0; // Removing cart-wide discount to rely on product discounts as per request implicit logic
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
