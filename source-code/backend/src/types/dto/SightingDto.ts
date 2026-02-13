export interface SightingDto {
    id?: number;
    photoUrl: string;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    address?: string;
    username: string;
}