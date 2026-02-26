export interface SightingResponse {
  id: number;
  photoUrl: string; // Resource URL, e.g. "/uploads/sightings/xyz.jpg"
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SightingViewModel extends SightingResponse {
  formattedCreatedAt: string | null;
  formattedUpdatedAt: string | null;
  relativeCreatedAt: string | null;
  relativeUpdatedAt: string | null;
}