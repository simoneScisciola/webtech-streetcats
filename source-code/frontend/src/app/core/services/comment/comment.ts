import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { CommentResponse, CommentPayload} from '#types/comment';
import { PaginatedResponse } from '#shared/types/pagination';

@Injectable({
  providedIn: 'root',
})
export class Comment {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackend = inject(RestBackend);

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
    );
  }

  /**
   * Get all comments (optionally filtered by sightingId)
   * GET /comments?sightingId=...
   */
  getAll(params?: { sightingId?: number }): Observable<PaginatedResponse<CommentResponse>> {
    return this.restBackend.request(
      '/comments',
      'GET',
      null,
      params
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