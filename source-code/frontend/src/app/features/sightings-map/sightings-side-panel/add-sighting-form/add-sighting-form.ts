import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faTag, faAlignLeft, faLocationDot, faLocationCrosshairs, faPlus, faImage } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '#core/services/auth/auth';
import { FormCard } from '#shared/components/form-card/form-card';
import { FormCardHeader } from '#shared/components/form-card/form-card-header/form-card-header';
import { FormCardBody } from '#shared/components/form-card/form-card-body/form-card-body';
import { FormCardField } from '#shared/components/form-card/form-card-field/form-card-field';
import { FormCardDragAndDropImage } from '#shared/components/form-card/form-card-drag-and-drop-image/form-card-drag-and-drop-image';

@Component({
  selector: 'app-add-sighting-form',
  imports: [ReactiveFormsModule, FormCard, FormCardHeader, FormCardBody, FormCardField, FontAwesomeModule, FormCardDragAndDropImage],
  templateUrl: './add-sighting-form.html',
  styleUrl: './add-sighting-form.scss',
})
export class AddSightingForm {

  @Output() formSubmitted = new EventEmitter<FormData>();
  @Output() cancelButtonClick = new EventEmitter<void>();

  private readonly auth = inject(Auth);

  // Field labels
  icons = {
    binoculars: faBinoculars,
    title: faTag,
    photo: faImage,
    description: faAlignLeft,
    latitude: faLocationCrosshairs,
    longitude: faLocationCrosshairs,
    location: faLocationDot,
    add: faPlus
  };

  // Form
  sightingForm = new FormGroup({
    title: new FormControl('', [
      Validators.required]),
    description: new FormControl(''),
    photo: new FormControl<File | null>(null, [
      Validators.required]),
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

  // Error messages
  titleErrors = {
    required: 'Title required.',
  };
  photoErrors = {
    required: 'Photo required.',
  };
  latitudeErrors = {
    required: 'Latitude required.',
    min: 'Latitude must be greater then -90.',
    max: 'Latitude must be less then 90.',
  };
  longitudeErrors = {
    required: 'Longitude required.',
    min: 'Longitude must be greater then -180.',
    max: 'Longitude must be less then 180.',
  };

  // Getters
  get title() {
    return this.sightingForm.controls.title;
  }
  get description() {
    return this.sightingForm.controls.description;
  }
  get photo() {
    return this.sightingForm.controls.photo;
  }
  get address() {
    return this.sightingForm.controls.address;
  }
  get latitude() {
    return this.sightingForm.controls.latitude;
  }
  get longitude() {
    return this.sightingForm.controls.longitude;
  }

  /**
   * Manages form submit.
   */
  onSubmit(): void {
    if (this.sightingForm.valid) {
      const username = this.auth.username();
      if (!username) {
        console.error('User not authenticated.');
        return;
      }

      // Send fields to upper component
      const { photo, title, description, latitude, longitude, address } = this.sightingForm.getRawValue();

      const payload = new FormData();
      payload.append('photo', photo!);
      payload.append('title', title!);
      if (description) payload.append('description', description);
      payload.append('latitude', String(latitude!));
      payload.append('longitude', String(longitude!));
      if (address) payload.append('address', address);
      payload.append('username', username);

      this.formSubmitted.emit(payload);
    } else {
      this.sightingForm.markAllAsTouched();
    }
  }

  /**
   * Manages cancel button click event propagation.
   */
  onCancelClick(): void {
    this.cancelButtonClick.emit();
  }

}