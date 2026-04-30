import { useAxios } from "~/plugins/1.axios";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
  UserResponse,
  SessionsResponse,
} from "~/types/auth.types";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  register(payload: RegisterPayload): Promise<RegisterResponse> {
    return useAxios().post("/auth/register", payload);
  },

  login(payload: LoginPayload): Promise<LoginResponse> {
    return useAxios().post("/auth/login", payload);
  },

  logout(): Promise<MessageResponse> {
    return useAxios().get("/auth/logout");
  },

  refresh(): Promise<MessageResponse> {
    return useAxios().get("/auth/refresh");
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
    return useAxios().post("/auth/password/forgot", payload);
  },

  resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
    return useAxios().post("/auth/password/reset", payload);
  },

  verifyEmail(code: string): Promise<MessageResponse> {
    return useAxios().get(`/auth/email/verify/${code}`);
  },
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const userService = {
  getMe(): Promise<UserResponse> {
    return useAxios().get("/user");
  },

  resendVerification(): Promise<MessageResponse> {
    return useAxios().post("/user/resend-verification");
  },
};

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const sessionService = {
  getSessions(): Promise<SessionsResponse> {
    return useAxios().get("/session/sessions");
  },

  deleteSession(id: string): Promise<MessageResponse> {
    return useAxios().delete(`/session/${id}`);
  },
};
