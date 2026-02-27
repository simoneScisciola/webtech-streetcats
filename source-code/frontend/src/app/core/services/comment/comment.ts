import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { CommentResponse, CommentPayload} from '#shared/types/comment';
import { PaginatedResponse } from '#shared/types/pagination';

@Injectable({
  providedIn: 'root',
})
export class Comment {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackend = inject(RestBackend);

  // -- Mapping ---------------------------------------------------------------
    
  /**
   * Normalises a single raw API object into a fully-typed `CommentResponse`.
   * @param raw Untyped object straight from the HTTP layer
   */
  parseRawResponse(raw: any): CommentResponse {
    return {
      ...raw,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    }
  }

  // -- CRUD ------------------------------------------------------------------

  /**
   * Create a comment
   * POST /comments
   */
  create(payload: CommentPayload): Observable<CommentResponse> {
    return this.restBackend.request(
      '/comments',
      'POST',
      payload
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Get all comments (optionally filtered by sightingId)
   * GET /comments?sightingId=...
   */
  getAll(params?: { sightingId?: number }): Observable<PaginatedResponse<CommentResponse>> {
    return this.restBackend.request<PaginatedResponse<CommentResponse>>(
      '/comments',
      'GET',
      null,
      params
    ).pipe(
      map(raw => ({
        ...raw,
        data: raw.data.map(item => this.parseRawResponse(item))
      }))
    );
  }

  /**
   * Partial update of a comment
   * PATCH /comments/:id
   */
  update(id: number, payload: Partial<CommentPayload>): Observable<CommentResponse> {
    return this.restBackend.request(
      `/comments/${id}`,
      'PATCH',
      payload
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Delete a comment
   * DELETE /comments/:id
   */
  delete(id: number): Observable<void> {
    return this.restBackend.request(
      `/comments/${id}`,
      'DELETE'
    );
  }

}