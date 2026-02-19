export interface AuthState {
  username: string | null,
  authToken: string | null,
  isAuthenticated: boolean
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
  user: {
    username: string;
  };
}