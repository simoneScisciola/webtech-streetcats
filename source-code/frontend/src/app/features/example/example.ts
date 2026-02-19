import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faApplePay } from '@fortawesome/free-brands-svg-icons'

import { SightingForm } from '#features/sighting-form/sighting-form';

@Component({
  selector: 'app-example',
  imports: [FontAwesomeModule, SightingForm],
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
