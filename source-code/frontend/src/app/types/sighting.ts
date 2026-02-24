export interface SightingResponse {
  id: number;
  photoUrl: string; // Resource URL, e.g. "/uploads/sightings/xyz.jpg"
  title: string;
  description: string | null;
  latitude: string;
  longitude: string;
  address: string | null;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface SightingItem {
  id: number;
  photoUrl: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  formattedCreatedAt: string | null;
  formattedUpdatedAt: string | null;
}