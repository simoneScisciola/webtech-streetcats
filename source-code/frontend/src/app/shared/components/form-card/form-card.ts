import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-form-card',
  imports: [FontAwesomeModule],
  templateUrl: './form-card.html',
  styleUrl: './form-card.scss',
})
export class FormCard {
  title    = input.required<string>();
  subtitle = input<string>('');
  icon     = input<IconDefinition | null>(null);
}