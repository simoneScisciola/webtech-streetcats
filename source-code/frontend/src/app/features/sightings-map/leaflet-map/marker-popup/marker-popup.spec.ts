import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerPopup } from './marker-popup';

describe('MarkerPopup', () => {
  let component: MarkerPopup;
  let fixture: ComponentFixture<MarkerPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkerPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
