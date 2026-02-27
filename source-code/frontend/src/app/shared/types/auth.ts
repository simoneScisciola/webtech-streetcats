import { UserResponse } from "./user";

export interface AuthState {
  authToken: string | null;
  isAuthenticated: boolean;
  user: UserResponse | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  authToken: string;
  // refreshToken: string, // TODO: implement refresh token
  expiresIn: number;
  user: UserResponse;
}