import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        if (!currentItems.find((item) => item._id === product._id)) {
          set({ items: [...currentItems, product] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item._id !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
