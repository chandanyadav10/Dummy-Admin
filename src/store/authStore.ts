import { create } from "zustand";

/**
 * Zustand is used instead of Redux because:
 * - Very small API surface and almost zero boilerplate.
 * - Perfect for small–medium apps where Redux Toolkit would be overkill.
 * - Async actions are simple, no thunks/slices/actions needed.
 * - Store updates are extremely fast and predictable.
 */

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  // Save NextAuth JWT tokens into Zustand for easy client-side access
  setTokens: (accessToken, refreshToken) =>
    set(() => ({
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
    })),

    // Clear session on logout
  clear: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
}));
