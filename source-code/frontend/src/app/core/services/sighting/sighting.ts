import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { SightingResponse } from '#types/sighting';
import { PaginatedResponse } from '#shared/types/pagination';

@Injectable({
  providedIn: 'root',
})
export class Sighting {

  private readonly restBackend = inject(RestBackend);

  /**
   * Create of a sighting
   * POST /sightings
   */
  create(payload: FormData): Observable<SightingResponse> {
    return this.restBackend.uploadForm(
      `/sightings`,
      'POST',
      payload
    );
  }

  /**
   * Get one sighting by id
   * GET /sightings/:id
   */
  getOne(id: number): Observable<SightingResponse> {
    return this.restBackend.request(
      `/sightings/${id}`,
      'GET'
    );
  }

  /**
   * Get the full URL of a sighting photo from its relative URL
   * @param photoUrl relative URL of the photo (e.g. /uploads/sightings/20240601-sighting-abc123.jpg)
   * @returns full URL of the photo
   */
  getRequestPhotoUrl(photoUrl: string): string {
    return `${this.restBackend.baseUrl}${photoUrl}`;
  }

  /**
   * Get all sightings
   * GET /sightings
   */
  getAll(): Observable<PaginatedResponse<SightingResponse>> {
    return this.restBackend.request(
      `/sightings`,
      'GET'
    );
  }

  /**
   * Partial update of a sighting
   * PATCH /sightings/:id
   */
  update(id: number, payload: FormData): Observable<SightingResponse> {
    return this.restBackend.uploadForm(
      `/sightings/${id}`,
      'PATCH',
      payload
    );
  }

  /**
   * Delete of a sighting
   * DELETE /sightings/:id
   */
  delete(id: number): Observable<void> {
    return this.restBackend.request(
      `/sightings/${id}`,
      'DELETE'
    );
  }

}