import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { MarkdownModule } from 'ngx-markdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation, faCalendar, faChevronUp, faChevronDown, faLocationCrosshairs, faPen, faFloppyDisk, faXmark, faTag, faAlignLeft, faImage } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '#core/services/auth/auth';
import { Sighting } from '#core/services/sighting/sighting';
import { SightingDetailsMap } from './sighting-details-map/sighting-details-map';
import { SightingComments } from './sighting-comments/sighting-comments';
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { RestBackend } from '#core/services/rest-backend/rest-backend';
import { initial } from '#shared/utils/text';
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
  });

  /** Validation error messages */
  titleErrors = {
    required: 'Title required.'
  };
  photoErrors = {
    required: 'Photo required.'
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
    const sightingVM = this.sightingVM();
    if (!sightingVM)
      return;

    // Fill editable fields with the existing data
    this.editForm.patchValue({
      title: sightingVM.title,
      description: sightingVM.description ?? '',
    });

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
   * Validates and submits the edit form.
   * Only dirty fields are included in the payload.
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
      const { title, description, photo } = this.editForm.getRawValue();
      const payload = new FormData();
      if (this.editTitle.dirty) payload.append('title', title!);
      if (this.editDescription.dirty) payload.append('description', description ?? '');
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