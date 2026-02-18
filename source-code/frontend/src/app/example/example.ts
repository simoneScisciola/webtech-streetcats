import { Component } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faApplePay } from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-example',
  imports: [FontAwesomeModule],
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class Example {
  faUser = faUser;
  faApplePay = faApplePay;
}
