import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faClock, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sighting-card',
  imports: [FontAwesomeModule],
  templateUrl: './sighting-card.html',
  styleUrl: './sighting-card.scss',
})
export class SightingCard {

  @Input() title = '';
  @Input() lastSeen = '';
  @Input() description = '';
  @Input() accentColor: string = '#000000';
  @Output() cardClick = new EventEmitter<void>();

  // Font Awesome icons
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faEye = faEye;

  onCardClick(): void {
    this.cardClick.emit();
  }

  onDetailsClick(): void {

  }

}
