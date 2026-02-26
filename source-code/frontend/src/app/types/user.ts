export interface UserPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: Date,
  updatedAt: Date
}