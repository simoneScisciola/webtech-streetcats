export interface CommentPayload {
  content: string;
  username: string;
  sightingId: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  username: string;
  sightingId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentViewModel extends CommentResponse {
  formattedCreatedAt: string | null;
  formattedUpdatedAt: string | null;
}