import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingDetails } from './sighting-details';

describe('SightingDetails', () => {
  let component: SightingDetails;
  let fixture: ComponentFixture<SightingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
