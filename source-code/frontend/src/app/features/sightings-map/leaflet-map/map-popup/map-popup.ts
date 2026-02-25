import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'ngx-sonner';

import { Auth } from '#core/services/auth/auth';

@Component({
  selector: 'app-map-popup',
  imports: [FontAwesomeModule],
  templateUrl: './map-popup.html',
  styleUrl: './map-popup.scss',
})
export class MapPopup {

  @Output() addSightingClick = new EventEmitter<void>();

  protected readonly auth = inject(Auth);

  readonly icons = {
    add: faPlus
  };

  onAddSightingClick(): void {
    if (!this.auth.isAuthenticated()) {
      toast.error('You must be logged in to add a sighting.');
      return;
    }

    this.addSightingClick.emit();
  }

}