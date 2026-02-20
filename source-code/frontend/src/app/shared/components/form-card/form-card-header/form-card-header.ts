import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-form-card-header',
  imports: [FontAwesomeModule],
  templateUrl: './form-card-header.html',
  styleUrl: './form-card-header.scss',
})
export class FormCardHeader {

  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() icon: IconDefinition | null = null;

}