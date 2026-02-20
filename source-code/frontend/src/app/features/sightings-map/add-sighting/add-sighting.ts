import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Sightings } from '#core/services/sightings/sightings';
import { SightingPayload } from '#types/sighting';
import { AddSightingForm } from './add-sighting-form/add-sighting-form';

@Component({
  selector: 'app-add-sighting',
  imports: [AddSightingForm],
  templateUrl: './add-sighting.html',
  styleUrl: './add-sighting.scss',
})
export class AddSighting {

  private readonly sightings = inject(Sightings);
  private readonly router = inject(Router);

  /**
   * Sends create sighting request
   * @param payload submitted credetials
   */
  onAddSighting(payload: SightingPayload) {
    this.sightings.create(payload).subscribe({
      next: (res) => {
        console.log("Response:", res);

        // Redirect
        this.router.navigate(['/sightings-map']);
      },
      error: (err) => console.error('Add sighting failed.', err),
    });
  }

}