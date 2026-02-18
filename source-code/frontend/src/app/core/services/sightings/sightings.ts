import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SightingFormValue } from '#features/sighting-form/sighting-form';

export interface SightingModel extends SightingFormValue {
  id: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class Sightings {
  private http = inject(HttpClient);
  private base = '/api/sightings';

  create(payload: SightingFormValue): Observable<SightingModel> {
    return this.http.post<SightingModel>(this.base, payload);
  }

  getAll(): Observable<SightingModel[]> {
    return this.http.get<SightingModel[]>(this.base);
  }
}