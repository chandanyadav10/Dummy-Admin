import { create } from "zustand";

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
  setTokens: (accessToken, refreshToken) =>
    set(() => ({
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
    })),
  clear: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
}));
