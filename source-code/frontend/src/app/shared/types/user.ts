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

export interface UserViewModel extends UserResponse {
  formattedCreatedAt: string | null;
  formattedUpdatedAt: string | null;
  relativeCreatedAt: string | null;
  relativeUpdatedAt: string | null;
}