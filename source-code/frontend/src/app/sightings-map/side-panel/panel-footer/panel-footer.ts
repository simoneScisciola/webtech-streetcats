import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-panel-footer',
  imports: [FontAwesomeModule],
  templateUrl: './panel-footer.html',
  styleUrl: './panel-footer.scss',
})
export class PanelFooter {

  // Font Awesome icons
  faPlus = faPlus;

  // onAddSighting(payload: SightingFormValue): void {
  // this.sightingsService.create(payload).subscribe({
  //   next:  (sighting) => {
  //     console.log('Sighting creato:', sighting);
  //     this.togglePanel();
  //   },
  //   error: (err) => console.error('Errore creazione sighting', err),
  // });
}
