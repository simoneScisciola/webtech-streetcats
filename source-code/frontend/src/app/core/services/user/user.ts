import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { UserResponse, UserPayload } from '#types/user';

@Injectable({
  providedIn: 'root',
})
export class User {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackend = inject(RestBackend);

  // -- CRUD ------------------------------------------------------------------

  /**
   * Get one user by username
   * GET /users/:username
   */
  getOne(username: string): Observable<UserResponse> {
    return this.restBackend.request(
      `/users/${username}`,
      'GET'
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
    );
  }

}