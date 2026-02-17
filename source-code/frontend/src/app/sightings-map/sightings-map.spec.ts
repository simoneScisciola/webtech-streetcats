import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingsMap } from './sightings-map';

describe('SightingsMap', () => {
  let component: SightingsMap;
  let fixture: ComponentFixture<SightingsMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingsMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingsMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
