export interface SightingPayload {
  title: string;
  description?: string;
  photoUrl: string;
  address?: string;
  latitude: number;
  longitude: number;
}

export interface SightingResponse {
  id: number;
  photoUrl: string;
  title: string;
  description: string | null;
  address: string | null;
  latitude: string;
  longitude: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}