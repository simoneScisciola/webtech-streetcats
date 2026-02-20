import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSightingForm } from './add-sighting-form';

describe('AddSightingForm', () => {
  let component: AddSightingForm;
  let fixture: ComponentFixture<AddSightingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSightingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSightingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
