import {create} from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Cart,  addToCart, updateCartItem, removeCartItem, createCart, getCart } from '@/lib/shopify';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  setCart: (cart: Cart) => void;
}

const customStorage: PersistStorage<CartStore> = {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      return str ? JSON.parse(str) : null;
    },
    setItem: (name, value) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  };

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      initializeCart: async () => {
        set({ isLoading: true });
        try {
          const storedCart = localStorage.getItem('shopify-cart');
          if (storedCart) {
            const cart = JSON.parse(storedCart);
            const updatedCart = await getCart(cart.id);
            set({ cart: updatedCart, isLoading: false });
          } else {
            const newCart = await createCart();
            set({ cart: newCart, isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing cart:', error);
          set({ isLoading: false });
        }
      },
      addItem: async (variantId: string, quantity: number) => {
        set({ isLoading: true });
        try {
          const { cart } = get();
          if (!cart) {
            const newCart = await createCart();
            const updatedCart = await addToCart(newCart.id, variantId, quantity);
            set({ cart: updatedCart, isLoading: false });
          } else {
            const updatedCart = await addToCart(cart.id, variantId, quantity);
            set({ cart: updatedCart, isLoading: false });
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          set({ isLoading: false });
        }
      },
      updateItem: async (id: string, quantity: number) => {
        set({ isLoading: true });
        try {
          const { cart } = get();
          if (cart) {
            const lineItem = cart.lines.edges.find(edge => 
              edge.node.id === id || edge.node.merchandise.id === id
            );
            if (lineItem) {
              const updatedCart = await updateCartItem(cart.id, lineItem.node.id, quantity);
              set({ cart: updatedCart, isLoading: false });
            } else {
              throw new Error('Line item not found');
            }
          }
        } catch (error) {
          console.error('Error updating item in cart:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      removeItem: async (lineId: string) => {
        set({ isLoading: true });
        try {
          const { cart } = get();
          if (cart) {
            const updatedCart = await removeCartItem(cart.id, lineId);
            set({ cart: updatedCart, isLoading: false });
          }
        } catch (error) {
          console.error('Error removing item from cart:', error);
          set({ isLoading: false });
        }
      },
      setCart: (cart: Cart) => set({ cart }),
    }),
    {
      name: 'shopify-cart',
      storage: typeof window !== 'undefined' ? customStorage : undefined,
    }
  )
);

