import { create } from "zustand";
import { apiFetch } from "@/lib/apiClient";

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: number;
  thumbnail: string;
  images: string[];
  description: string;
};

type ProductsState = {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  // simple cache: key = `${q}-${skip}-${limit}-${category}`
  cache: Record<string, { products: Product[]; total: number }>;
  fetchProducts: (params: {
    q?: string;
    limit: number;
    skip: number;
    category?: string;
  }) => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},

  // Caching strategy:
  // - For each combination of search query, page (skip), limit and category,
  //   we store the result in `cache`.
  // - If the same combination is requested again, we reuse the cached data
  //   and avoid another network request.
  fetchProducts: async ({ q = "", limit, skip, category }) => {
    const key = `${q}-${skip}-${limit}-${category || "all"}`;
    const cached = get().cache[key];

    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });

    try {
      let url: string;

      if (q) {
        url = `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
      } else if (category && category !== "all") {
        url = `/products/category/${encodeURIComponent(
          category
        )}?limit=${limit}&skip=${skip}`;
      } else {
        url = `/products?limit=${limit}&skip=${skip}`;
      }

      const data = await apiFetch<{ products: Product[]; total: number }>(url);

      set((state) => ({
        products: data.products,
        total: data.total,
        cache: {
          ...state.cache,
          [key]: { products: data.products, total: data.total },
        },
      }));
    } catch (err: any) {
      set({
        error: err?.message || "Failed to load products",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
