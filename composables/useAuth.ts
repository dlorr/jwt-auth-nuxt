import { authService, userService } from "~/services/auth.service";
import { useAuthStore } from "~/stores/auth.store";
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "~/types/auth.types";

export function useAuth() {
  const store = useAuthStore();

  const user = computed(() => store.user);
  const isAuthenticated = computed(() => store.isAuthenticated);
  const isInitialized = computed(() => store.isInitialized);
  const isVerified = computed(() => store.isVerified);

  // ─── Boot ──────────────────────────────────────────────────────────────────

  async function initAuth(): Promise<void> {
    if (store.isInitialized) return;

    try {
      const user = await userService.getMe();
      store.setUser(user);
    } catch {
      store.setInitialized();
    }
  }

  // ─── Auth Actions ──────────────────────────────────────────────────────────

  async function login(payload: LoginPayload): Promise<void> {
    await authService.login(payload);
    const user = await userService.getMe();
    store.setUser(user);
    await navigateTo("/dashboard");
  }

  async function register(payload: RegisterPayload): Promise<void> {
    const user = await authService.register(payload);
    store.setUser(user);
    await navigateTo("/dashboard");
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout();
    } finally {
      store.clearAuth();
      await navigateTo("/login");
    }
  }

  async function forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<string> {
    const { message } = await authService.forgotPassword(payload);
    return message;
  }

  async function resetPassword(payload: ResetPasswordPayload): Promise<string> {
    const { message } = await authService.resetPassword(payload);
    store.clearAuth();
    return message;
  }

  async function verifyEmail(code: string): Promise<string> {
    const { message } = await authService.verifyEmail(code);
    const user = await userService.getMe();
    store.setUser(user);
    return message;
  }

  return {
    // State
    user,
    isAuthenticated,
    isInitialized,
    isVerified,

    // Actions
    initAuth,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };
}
