import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { CommentResponse, CommentPayload, CommentViewModel} from '#shared/types/comment';
import { PaginatedResponse } from '#shared/types/pagination';
import { formatDate, formatRelativeTime } from '#shared/utils/date';
import { Sort } from '#shared/types/query-params';

@Injectable({
  providedIn: 'root',
})
export class Comment {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackend = inject(RestBackend);

  // -- Utils -----------------------------------------------------------------
  
  private readonly formatDate = formatDate;
  private readonly formatRelativeTime = formatRelativeTime;

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

  /**
   * Maps a `CommentResponse` (already normalised) to a UI-ready `CommentViewModel`.
   */
  toCommentViewModel(response: CommentResponse): CommentViewModel {
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
  getAll(sort: Sort, params?: { sightingId?: number }): Observable<PaginatedResponse<CommentResponse>> {
    return this.restBackend.request<PaginatedResponse<CommentResponse>>(
      `/comments?sort=${sort.field},${sort.direction}`,
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