import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { UserResponse, UserPayload, UserViewModel } from '#shared/types/user';
import { formatDate } from '#shared/utils/date';

@Injectable({
  providedIn: 'root',
})
export class User {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackend = inject(RestBackend);

  // -- Utils -----------------------------------------------------------------

  private readonly formatDate = formatDate;

  // -- Mapping ---------------------------------------------------------------
  
  /**
   * Normalises a single raw API object into a fully-typed `UserResponse`.
   * @param raw Untyped object straight from the HTTP layer
   */
  parseRawResponse(raw: any): UserResponse {
    return {
      ...raw,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    }
  }

  /**
   * Maps a `UserResponse` (already normalised) to a UI-ready `UserViewModel`.
   */
  toUserViewModel(response: UserResponse): UserViewModel {
    return {
      ...response,
      formattedCreatedAt: this.formatDate(response.createdAt),
      formattedUpdatedAt: this.formatDate(response.updatedAt),
    };
  }

  // -- CRUD ------------------------------------------------------------------

  /**
   * Get one user by username
   * GET /users/:username
   */
  getOne(username: string): Observable<UserResponse> {
    return this.restBackend.request(
      `/users/${username}`,
      'GET'
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Partial update of a user
   * PATCH /users/:username
   */
  update(username: string, payload: Partial<UserPayload>): Observable<UserResponse> {
    return this.restBackend.request(
      `/users/${username}`,
      'PATCH',
      payload
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

}