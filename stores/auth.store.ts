import { defineStore } from "pinia";
import type { User } from "~/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
  }),

  getters: {
    currentUser: (state): User | null => state.user,

    isVerified: (state): boolean => state.user?.verified ?? false,
  },

  actions: {
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
      this.isInitialized = true;
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
      this.isInitialized = true;
    },

    setInitialized() {
      this.isInitialized = true;
    },
  },
});
