import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { PaginatedResponse } from '#shared/types/pagination';
import { formatDate, formatRelativeTime } from '#shared/utils/date';
import { Sort } from '#shared/types/query-params';

@Injectable({
  providedIn: 'root',
})
export class Sighting {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackendService = inject(RestBackend);

  // -- Utils -----------------------------------------------------------------

  private readonly formatDate = formatDate;
  private readonly formatRelativeTime = formatRelativeTime;

  // -- Mapping ---------------------------------------------------------------

  /**
   * Normalises a single raw API object into a fully-typed `SightingResponse`.
   * @param raw Untyped object straight from the HTTP layer
   */
  parseRawResponse(raw: any): SightingResponse {
    return {
      ...raw,
      latitude: Number.parseFloat(raw.latitude),
      longitude: Number.parseFloat(raw.longitude),
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    }
  }

  /**
   * Maps a `SightingResponse` (already normalised) to a UI-ready `SightingViewModel`.
   */
  toSightingViewModel(response: SightingResponse): SightingViewModel {
    return {
      ...response,
      formattedCreatedAt: this.formatDate(response.createdAt),
      formattedUpdatedAt: this.formatDate(response.updatedAt),
      relativeCreatedAt: this.formatRelativeTime(response.createdAt),
      relativeUpdatedAt: this.formatRelativeTime(response.updatedAt),
    };
  }

  // -- CRUD ------------------------------------------------------------------

  /**
   * Create a sighting
   * POST /sightings
   */
  create(payload: FormData): Observable<SightingResponse> {
    return this.restBackendService.uploadForm(
      `/sightings`,
      'POST',
      payload
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Get one sighting by id
   * GET /sightings/:id
   */
  getOne(id: number): Observable<SightingResponse> {
    return this.restBackendService.request(
      `/sightings/${id}`,
      'GET'
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Returns the full URL of a sighting photo from its relative path.
   * @param photoUrl relative URL (e.g. /uploads/sightings/photo.jpg)
   */
  getRequestPhotoUrl(photoUrl: string): string {
    return `${this.restBackendService.baseUrl}${photoUrl}`;
  }

  /**
   * Get a paginated list of sightings
   * GET /sightings?page=:page&size=:size
   */
  getAll(sort: Sort, page = 0, size = 20): Observable<PaginatedResponse<SightingResponse>> {
    return this.restBackendService.request<PaginatedResponse<SightingResponse>>(
      `/sightings?page=${page}&size=${size}&sort=${sort.field},${sort.direction}`,
      'GET'
    ).pipe(
      map(raw => ({
        ...raw,
        data: raw.data.map(item => this.parseRawResponse(item))
      }))
    );
  }

  /**
   * Partial update of a sighting
   * PATCH /sightings/:id
   */
  update(id: number, payload: FormData): Observable<SightingResponse> {
    return this.restBackendService.uploadForm(
      `/sightings/${id}`,
      'PATCH',
      payload
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Delete a sighting
   * DELETE /sightings/:id
   */
  delete(id: number): Observable<void> {
    return this.restBackendService.request(
      `/sightings/${id}`,
      'DELETE'
    );
  }

}