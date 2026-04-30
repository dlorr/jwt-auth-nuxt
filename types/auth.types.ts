export interface User {
  _id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  verificationCode: string;
}

export type RegisterResponse = User;

export interface LoginResponse {
  message: string;
}

export interface MessageResponse {
  message: string;
}

export type UserResponse = User;

export type SessionsResponse = Session[];

export interface Session {
  _id: string;
  userAgent?: string;
  createdAt: string;
  isCurrent?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
