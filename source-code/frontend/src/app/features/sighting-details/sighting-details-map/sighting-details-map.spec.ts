import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingDetailsMap } from './sighting-details-map';

describe('SightingDetailsMap', () => {
  let component: SightingDetailsMap;
  let fixture: ComponentFixture<SightingDetailsMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingDetailsMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingDetailsMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
