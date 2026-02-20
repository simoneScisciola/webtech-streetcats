import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { SightingPayload, SightingResponse } from '#types/sighting';
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
  create(payload: SightingPayload): Observable<SightingResponse> {
    return this.restBackend.request(
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
  update(id: number, payload: Partial<SightingPayload>): Observable<SightingResponse> {
    return this.restBackend.request(
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