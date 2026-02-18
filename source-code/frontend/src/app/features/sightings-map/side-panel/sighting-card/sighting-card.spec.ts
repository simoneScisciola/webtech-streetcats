import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingCard } from './sighting-card';

describe('SightingCard', () => {
  let component: SightingCard;
  let fixture: ComponentFixture<SightingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
