import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  initTokenLoading: true,
  setToken: (value) => set({ token: value }),
  initToken: () => {
    set({ initTokenLoading: true });
    try {
      const notSafeAuthToken = JSON.parse(
        localStorage.getItem("notSafeAuthToken")
      );
      if (notSafeAuthToken) {
        set({ token: notSafeAuthToken });
      }
    } catch (error) {
      console.error("Failed to parse token from localStorage", error);
    } finally {
      set({ initTokenLoading: false });
    }
  },
  removeToken: () => {
    set({ token: null });
    localStorage.removeItem("notSafeAuthToken");
  },
}));
