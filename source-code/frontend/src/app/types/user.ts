export interface UserPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}