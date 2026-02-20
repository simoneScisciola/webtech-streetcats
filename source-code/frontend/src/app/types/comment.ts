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
  createdAt: string;
  updatedAt: string;
}