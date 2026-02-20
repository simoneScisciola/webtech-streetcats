import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faApplePay } from '@fortawesome/free-brands-svg-icons'

import { AddSightingForm } from '#features/sightings-map/sightings-side-panel/add-sighting-form/add-sighting-form';

@Component({
  selector: 'app-example',
  imports: [FontAwesomeModule, AddSightingForm],
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class Example {
  faUser = faUser;
  faApplePay = faApplePay;

  onAddSighting(event: any) {
    console.log("ADD SIGHTING")
  }
}
