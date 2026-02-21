export interface SightingResponse {
  id: number;
  photoUrl: string; // Public URL, e.g. "https://host/uploads/sightings/xyz.jpg"
  title: string;
  description: string | null;
  latitude: string;
  longitude: string;
  address: string | null;
  username: string;
  createdAt: string;
  updatedAt: string;
}