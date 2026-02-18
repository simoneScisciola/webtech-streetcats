import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-panel-footer',
  imports: [FontAwesomeModule],
  templateUrl: './side-panel-footer.html',
  styleUrl: './side-panel-footer.scss',
})
export class SidePanelFooter {

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
