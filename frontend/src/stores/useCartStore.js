import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], 
      
      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((i) => i.product._id === product._id);
        
        if (existingItem) {
          set({
            items: items.map((i) => 
              i.product._id === product._id 
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          )
        });
      },
      
      removeFromCart: (productId) => {
        set({ items: get().items.filter((i) => i.product._id !== productId) });
      },
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.discountedPrice || item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
