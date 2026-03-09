import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Sighting } from '#core/services/sighting/sighting';
import { SightingDetailsMap } from './sighting-details-map/sighting-details-map';
import { SightingComments } from './sighting-comments/sighting-comments';
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';

@Component({
  selector: 'app-sighting-details',
  imports: [SightingDetailsMap, SightingComments],
  templateUrl: './sighting-details.html',
  styleUrl: './sighting-details.scss',
})
export class SightingDetails implements OnInit {

  private readonly route           = inject(ActivatedRoute);
  private readonly sightingService = inject(Sighting);

  sighting = signal<SightingResponse | null>(null);
  loading  = signal(true);
  error    = signal(false);

  /** UI-ready sighiting derived from raw API data. */
  readonly sightingVM = computed<SightingViewModel | null>(
    () => {
      if (!this.sighting())
        return null;

      return this.sightingService.toSightingViewModel(this.sighting()!)
    }
  );

  ngOnInit(): void {
    // Read :id from the route, then fetch the matching sighting
    this.route.paramMap
      .pipe(switchMap(params => this.sightingService.getOne(Number(params.get('id')))))
      .subscribe({
        next:  data => { this.sighting.set(data); this.loading.set(false); },
        error: ()   => { this.error.set(true);    this.loading.set(false); },
      });
  }

  /** Prepends the API base URL to resource-relative paths (e.g. /uploads/…) */
  resolveUrl(url: string): string {
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  }

  /** First letter of the username, uppercased – used for the avatar placeholder */
  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

}