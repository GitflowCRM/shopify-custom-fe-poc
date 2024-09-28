import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, createCart, addToCart as addToCartApi, getCart } from './shopify';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage?.getItem('cartId');
      if (storedCartId) {
        try {
          const fetchedCart = await getCart(storedCartId);
          setCart(fetchedCart);
        } catch (error) {
          console.error('Error fetching cart:', error);
          const newCart = await createCart();
          setCart(newCart);
          localStorage?.setItem('cartId', newCart?.id ?? '');
        }
      } else {
        const newCart = await createCart();
        setCart(newCart);
        localStorage?.setItem('cartId', newCart?.id ?? '');
      }
      setLoading(false);
    };

    initializeCart();
  }, []);

  const addToCart = async (variantId: string, quantity: number) => {
    if (!cart?.id) return;
    try {
      const updatedCart = await addToCartApi(cart.id, variantId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};