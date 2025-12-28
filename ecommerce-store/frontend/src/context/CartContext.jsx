import React, { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], summary: { itemCount: 0, total: 0 } });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      // User not logged in or error fetching cart
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addItem(productId, quantity);
      if (response.success) {
        setCart(response.data);
        toast.success('Item added to cart');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await cartService.updateItem(cartItemId, quantity);
      if (response.success) {
        setCart(response.data);
        return true;
      }
    } catch (error) {
      toast.error('Failed to update cart');
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartService.removeItem(cartItemId);
      if (response.success) {
        setCart(response.data);
        toast.success('Item removed from cart');
        return true;
      }
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], summary: { itemCount: 0, total: 0 } });
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
