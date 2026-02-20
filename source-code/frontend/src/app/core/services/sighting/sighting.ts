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

  // Create sighting function
  create(payload: SightingPayload): Observable<SightingResponse> {
    return this.restBackend.request("/sightings", "POST", payload);
  }

  // Get one sighting function
  getOne(id: number): Observable<SightingResponse> {
    return this.restBackend.request(`/sightings/${id}`, "GET");
  }

  // Get all sightings function
  getAll(): Observable<PaginatedResponse<SightingResponse>> {
    return this.restBackend.request("/sightings", "GET");
  }

  // Update sighting function
  update(payload: Partial<SightingPayload>): Observable<SightingResponse> {
    return this.restBackend.request("/sightings", "PATCH", payload);
  }

  // Delete sighting function
  delete(id: number): Observable<SightingResponse> {
    return this.restBackend.request(`/sightings/${id}`, "DELETE");
  }
}