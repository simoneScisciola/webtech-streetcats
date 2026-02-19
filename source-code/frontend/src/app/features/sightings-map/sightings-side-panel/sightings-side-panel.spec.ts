import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingsSidePanel } from './sightings-side-panel';

describe('SightingsSidePanel', () => {
  let component: SightingsSidePanel;
  let fixture: ComponentFixture<SightingsSidePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingsSidePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingsSidePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
