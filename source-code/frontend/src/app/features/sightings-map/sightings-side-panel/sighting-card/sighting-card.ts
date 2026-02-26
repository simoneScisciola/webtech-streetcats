import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faClock, faEye } from '@fortawesome/free-solid-svg-icons';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-sighting-card',
  imports: [FontAwesomeModule, MarkdownModule],
  templateUrl: './sighting-card.html',
  styleUrl: './sighting-card.scss',
})
export class SightingCard {

  @Input() title = '';
  @Input() lastSeen = '';
  @Input() description = '';
  @Input() accentColor: string = '#000000';

  @Output() cardClick = new EventEmitter<void>();
  @Output() detailsClick = new EventEmitter<void>();

  // Icons
  icons = {
    title: faMapMarkerAlt,
    date: faClock,
    details: faEye,
  };

  onCardClick(): void {
    this.cardClick.emit();
  }

  onDetailsClick(): void {
    this.detailsClick.emit();
  }

}
