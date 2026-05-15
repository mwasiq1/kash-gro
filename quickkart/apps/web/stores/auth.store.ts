import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  role: string;
}

interface AuthStore {
  user: UserProfile | null;
  token: string | null;
  setAuth: (user: UserProfile | null, token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: "kashgro-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
