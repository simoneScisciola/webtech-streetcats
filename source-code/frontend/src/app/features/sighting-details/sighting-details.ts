import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { MarkdownModule } from 'ngx-markdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation, faCalendar, faChevronUp, faChevronDown, faLocationCrosshairs, faPen, faFloppyDisk, faXmark, faTag, faAlignLeft, faImage, faLocationDot, faArrowsUpDown, faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '#core/services/auth/auth';
import { Sighting } from '#core/services/sighting/sighting';
import { SightingDetailsMap } from './sighting-details-map/sighting-details-map';
import { SightingComments } from './sighting-comments/sighting-comments';
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { initial } from '#shared/utils/text';
import { GeoCoords } from '#shared/types/coordinates';
import { FormCardField } from '#shared/components/form-card/form-card-field/form-card-field';
import { FormCardTextMarkdown } from '#shared/components/form-card/form-card-text-markdown/form-card-text-markdown';
import { FormCardDragAndDropImage } from '#shared/components/form-card/form-card-drag-and-drop-image/form-card-drag-and-drop-image';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';

@Component({
  selector: 'app-sighting-details',
  imports: [SightingDetailsMap, SightingComments, MarkdownModule, FontAwesomeModule, ReactiveFormsModule, FormCardField, FormCardTextMarkdown, FormCardDragAndDropImage],
  providers: [ObservableToast],
  templateUrl: './sighting-details.html',
  styleUrl: './sighting-details.scss',
})
export class SightingDetails implements OnInit {

  // -- Dependency Injection --------------------------------------------------

  private readonly route = inject(ActivatedRoute);
  private readonly sightingService = inject(Sighting);
  protected readonly restBackendService = inject(RestBackend);
  private readonly authService = inject(Auth);
  private readonly observableToastService = inject(ObservableToast);

  // -- State and Signals -----------------------------------------------------

  /** Retrieved sighting */
  sighting = signal<SightingResponse | null>(null);

  /** Manages "loading data" state */
  loading = signal(true);

  /** Manages "error in data retrieve" state */
  error = signal(false);

  /** Controls whether the description card is fully expanded or clamped */
  isDescriptionExpanded = signal(false);

  /** Controls whether the page is in edit mode */
  isEditMode = signal(false);

  /**
   * Snapshot of the original values taken when edit mode is activated.
   * Used to detect real changes and avoid sending unchanged fields.
   */
  private originalValues = {
    title: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0
  };

  // Details icons
  icons = {
    // View mode
    error: faCircleExclamation,
    calendar: faCalendar,
    readLess: faChevronUp,
    readMore: faChevronDown,
    coordinates: faLocationCrosshairs,
    edit: faPen,

    // Edit mode
    save: faFloppyDisk,
    cancel: faXmark,
    title: faTag,
    description: faAlignLeft,
    photo: faImage,
    address: faLocationDot,
    latitude: faArrowsUpDown,
    longitude: faArrowsLeftRight,
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

  // -- Form ------------------------------------------------------------------

  /** Reactive form used in edit mode */
  editForm = new FormGroup({
    title: new FormControl('', [
      Validators.required]),
    description: new FormControl(''),

    /** Photo is left null when user wants to keep the existing one */
    photo: new FormControl<File | null>(null),

    address: new FormControl(''),
    latitude: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(-90),
      Validators.max(90),
    ]),
    longitude: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(-180),
      Validators.max(180),
    ]),
  });

  /** Validation error messages */
  titleErrors = {
    required: 'Title required.'
  };
  photoErrors = {
    required: 'Photo required.'
  };
  latitudeErrors = {
    required: 'Latitude required.',
    min: 'Latitude must be greater than -90.',
    max: 'Latitude must be less than 90.',
  };
  longitudeErrors = {
    required: 'Longitude required.',
    min: 'Longitude must be greater than -180.',
    max: 'Longitude must be less than 180.',
  };

  /** Getters */
  get editTitle() {
    return this.editForm.controls.title;
  }
  get editDescription() {
    return this.editForm.controls.description;
  }
  get editPhoto() {
    return this.editForm.controls.photo;
  }
  get editAddress() {
    return this.editForm.controls.address;
  }
  get editLatitude() {
    return this.editForm.controls.latitude;
  }
  get editLongitude() {
    return this.editForm.controls.longitude;
  }

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

  /**
   * Activates edit mode, pre-populating the form with the current sighting values.
   */
  onFabClick(): void {
    const sighting = this.sighting()!;
    if (!sighting)
      return;

    // Snapshot original values for change comparison on save
    this.originalValues = {
      title: sighting.title,
      description: sighting.description ?? '',
      address: sighting.address ?? '',
      latitude: sighting.latitude,
      longitude: sighting.longitude,
    };

    // Fill editable fields with the existing data
    this.editForm.patchValue(this.originalValues);

    // Photo starts null: the control is dirty only when the user removes or replaces it
    this.editPhoto.setValue(null);

    // Reset dirty/touched
    this.editForm.markAsUntouched();
    this.editForm.markAsPristine();

    this.isEditMode.set(true);
  }

  /**
   * Exits edit mode without saving.
   */
  onCancelEdit(): void {
    this.isEditMode.set(false);
  }

  /** True when the form can be submitted */
  get canSubmit(): boolean {
    return this.editForm.valid;
  }

  /**
   * Updates latitude and longitude form controls when the map marker is dragged.
   * @param coords New coordinates emitted by the map component.
   */
  onCoordinatesPicked(coords: GeoCoords): void {
    this.editLatitude.setValue(coords.latitude);
    this.editLongitude.setValue(coords.longitude);
  }

  /**
   * Validates and submits the edit form.
   * Only fields whose value actually changed are included in the payload.
   */
  onSaveEdit(): void {
    // Guard: Photo was removed but no replacement was provided
    if (this.editPhoto.dirty && !this.editPhoto.value) {
      this.editPhoto.setErrors({ required: true });
      this.editPhoto.markAsTouched();
      return;
    }

    if (this.canSubmit) {
      if (!this.authService.isAuthenticated()) {
        console.error('User not authenticated.');
        return;
      } else if (!this.isOwner) {
        console.error('User not authorized.');
        return;
      }

      // Build payload
      const { title, description, photo, address, latitude, longitude } = this.editForm.getRawValue();
      const payload = new FormData();
      if (title !== this.originalValues.title) payload.append('title', title!);
      if (description !== this.originalValues.description) payload.append('description', description ?? '');
      if (address !== this.originalValues.address) payload.append('address', address ?? '');
      if (latitude !== this.originalValues.latitude) payload.append('latitude', String(latitude!));
      if (longitude !== this.originalValues.longitude) payload.append('longitude', String(longitude!));
      if (this.editPhoto.dirty && photo) payload.append('photo', photo);

      // Update sighting
      this.observableToastService.trigger(
        this.sightingService.update(this.sighting()!.id, payload),
        {
          loading: "Updating sighting...",
          success: "Sighting updated successfully.",
          error: "Failed to update sighting. Please, try again.",
          onSuccess: (res) => {
            console.log("Response:", res);

            this.sighting.set(res);
            this.isEditMode.set(false);
          },
          onError: (err) => console.error('Update sighting failed.', err),
          onRetry: () => this.sightingService.update(this.sighting()!.id, payload)
        }
      )
    } else {
      this.editForm.markAllAsTouched();
    }
  }

}