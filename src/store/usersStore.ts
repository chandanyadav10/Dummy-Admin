import { create } from "zustand";
import { apiFetch } from "@/lib/apiClient";

/**
 * Simple client-side caching strategy:
 *
 * - The key `${q}-${skip}-${limit}` uniquely identifies each API call
 *   (search query + pagination).
 *
 * - If the same combination is requested again, we serve data from cache
 *   instead of calling DummyJSON again.
 *
 * Benefits:
 * ✔️ Avoids unnecessary API calls
 * ✔️ Makes "back" navigation instant
 * ✔️ Reduces flickering/loading states
 */

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  company: { name: string };
};

type UsersState = {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  // simple in-memory cache: key = `${q}-${skip}-${limit}`
  cache: Record<string, { users: User[]; total: number }>;
  fetchUsers: (params: { q?: string; limit: number; skip: number }) => Promise<void>;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},
  fetchUsers: async ({ q = "", limit, skip }) => {
    const key = `${q}-${skip}-${limit}`;
    const cached = get().cache[key];

    // Caching to avoid repeat API calls for same query/page
    if (cached) {
      set({ users: cached.users, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      // DummyJSON supports API-side pagination:
    // This prevents loading large data sets and improves performance.
      const url = q
        ? `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
        : `/users?limit=${limit}&skip=${skip}`;
      const data = await apiFetch<{ users: User[]; total: number }>(url);

      set((state) => ({
        users: data.users,
        total: data.total,
        cache: { ...state.cache, [key]: { users: data.users, total: data.total } },
      }));
    } catch (err: any) {
      set({ error: err.message || "Failed to load users" });
    } finally {
      set({ loading: false });
    }
  },
}));
