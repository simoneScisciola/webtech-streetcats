import { Component, output } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faTag, faAlignLeft, faMapMarkerAlt, faCalendarAlt, faLayerGroup, faPlus } from '@fortawesome/free-solid-svg-icons';

import { FormCard } from '#shared/components/form-card/form-card';
import { FormCardHeader } from '#shared/components/form-card/form-card-header/form-card-header';
import { FormCardBody } from '#shared/components/form-card/form-card-body/form-card-body';
import { FormCardFooter } from '#shared/components/form-card/form-card-footer/form-card-footer';
import { FormField } from '#shared/components/form-field/form-field';

export interface SightingFormValue {
  title:       string;
  description: string;
  location:    string;
  date:        string;
  category:    string;
}

@Component({
  selector: 'app-sighting-form',
  imports: [ReactiveFormsModule, FormCard, FormCardHeader, FormCardBody, FormCardFooter, FormField, FontAwesomeModule, KeyValuePipe],
  templateUrl: './sighting-form.html',
  styleUrl: './sighting-form.scss',
})
export class SightingForm {
  formSubmit = output<SightingFormValue>();

  icons = {
    binoculars: faBinoculars,
    tag:        faTag,
    text:       faAlignLeft,
    marker:     faMapMarkerAlt,
    calendar:   faCalendarAlt,
    category:   faLayerGroup,
    add:        faPlus,
  };

  categories = ['Uccelli', 'Mammiferi', 'Rettili', 'Anfibi', 'Pesci', 'Insetti', 'Altro'];

  sightingForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)]),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10)]),
    location: new FormControl('', [
      Validators.required]),
    date: new FormControl(new Date().toISOString().substring(0, 10), [
      Validators.required]),
    category: new FormControl('', [
      Validators.required]),
  });

  titleErrors       = { required: 'Titolo obbligatorio.',       minlength: 'Minimo 3 caratteri.' };
  descriptionErrors = { required: 'Descrizione obbligatoria.',  minlength: 'Minimo 10 caratteri.' };
  locationErrors    = { required: 'Posizione obbligatoria.' };
  dateErrors        = { required: 'Data obbligatoria.' };
  categoryErrors    = { required: 'Seleziona una categoria.' };

  onSubmit(): void {
    if (this.sightingForm.valid) {
      this.formSubmit.emit(this.sightingForm.getRawValue() as SightingFormValue);
    } else {
      this.sightingForm.markAllAsTouched();
    }
  }

  get title()       { return this.sightingForm.controls.title; }
  get description() { return this.sightingForm.controls.description; }
  get location()    { return this.sightingForm.controls.location; }
  get date()        { return this.sightingForm.controls.date; }
  get category()    { return this.sightingForm.controls.category; }
}
