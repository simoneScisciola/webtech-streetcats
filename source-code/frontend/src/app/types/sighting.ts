export interface SightingPayload {
  photo: File;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  username: string;
}

export interface SightingResponse {
  id: number;
  photo: File;
  title: string;
  description: string | null;
  latitude: string;
  longitude: string;
  address: string | null;
  username: string;
  createdAt: string;
  updatedAt: string;
}