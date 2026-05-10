"use client";

import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  email: string | null;
  setAuth: (accessToken: string, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  email: null,
  setAuth: (accessToken, email) => set({ accessToken, email }),
  clearAuth: () => set({ accessToken: null, email: null }),
}));
