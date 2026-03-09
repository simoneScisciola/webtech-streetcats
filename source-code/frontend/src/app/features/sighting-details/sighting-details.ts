import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Sighting } from '#core/services/sighting/sighting';
import { SightingDetailsMap } from './sighting-details-map/sighting-details-map';
import { SightingComments } from './sighting-comments/sighting-comments';
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { initial } from '#shared/utils/text';

@Component({
  selector: 'app-sighting-details',
  imports: [SightingDetailsMap, SightingComments],
  templateUrl: './sighting-details.html',
  styleUrl: './sighting-details.scss',
})
export class SightingDetails implements OnInit {

  // -- Dependency Injection --------------------------------------------------

  private readonly route = inject(ActivatedRoute);
  private readonly sightingService = inject(Sighting);
  protected readonly restBackendService = inject(RestBackend)

  // -- State and Signals -----------------------------------------------------

  sighting = signal<SightingResponse | null>(null);
  loading = signal(true);
  error = signal(false);

  // -- Computed signals ------------------------------------------------------

  /** UI-ready sighiting derived from raw API data. */
  readonly sightingVM = computed<SightingViewModel | null>(
    () => {
      if (!this.sighting())
        return null;

      return this.sightingService.toSightingViewModel(this.sighting()!)
    }
  );

  // -- Utils -----------------------------------------------------------------
  
  protected readonly initial = initial;

  // -- Lifecycle -------------------------------------------------------------

  ngOnInit(): void {
    // Read :id from the route, then fetch the matching sighting
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.sightingService.getOne(Number(params.get('id')))
        )
      )
      .subscribe({
        next: data => {
          this.sighting.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

}