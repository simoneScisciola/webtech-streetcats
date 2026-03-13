import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MarkdownModule } from 'ngx-markdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation, faCalendar, faChevronUp, faChevronDown, faLocationCrosshairs, faPen } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '#core/services/auth/auth';
import { Sighting } from '#core/services/sighting/sighting';
import { SightingDetailsMap } from './sighting-details-map/sighting-details-map';
import { SightingComments } from './sighting-comments/sighting-comments';
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { initial } from '#shared/utils/text';

@Component({
  selector: 'app-sighting-details',
  imports: [SightingDetailsMap, SightingComments, MarkdownModule, FontAwesomeModule, RouterLink],
  templateUrl: './sighting-details.html',
  styleUrl: './sighting-details.scss',
})
export class SightingDetails implements OnInit {

  // -- Dependency Injection --------------------------------------------------

  private readonly route = inject(ActivatedRoute);
  private readonly sightingService = inject(Sighting);
  protected readonly restBackendService = inject(RestBackend);
  private readonly authService = inject(Auth);

  // -- State and Signals -----------------------------------------------------

  /** Retrieved sighting */
  sighting = signal<SightingResponse | null>(null);

  /** Manages "loading data" state */
  loading = signal(true);

  /** Manages "error in data retrieve" state */
  error = signal(false);

  /** Controls whether the description card is fully expanded or clamped */
  isDescriptionExpanded = signal(false);

  // Details icons
  icons = {
    error: faCircleExclamation,
    calendar: faCalendar,
    readLess: faChevronUp,
    readMore: faChevronDown,
    coordinates: faLocationCrosshairs,
    edit: faPen,
  };

  // -- Computed signals ------------------------------------------------------

  /** UI-ready sighting derived from raw API data. */
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

  // -- Methods ---------------------------------------------------------------

  /**
   * True when the logged-in user is the owner of this sighting.
   */
  get isOwner(): boolean {
    let val = false;
    if (this.sighting() && this.authService.isAuthenticated())
      val = this.sighting()!.username === this.authService.username()

    return val;
  }

}