import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import productsData from '../data/products.json';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: productsData,

      addProduct: (newProduct) => {
        const updated = [...get().products, newProduct];
        set({ products: updated });
      },

      resetProducts: () => set({ products: productsData }),
    }),
    {
      name: 'product-storage',  
      getStorage: () => localStorage,
    }
  )
);
