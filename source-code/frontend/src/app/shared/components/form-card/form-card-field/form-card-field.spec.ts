import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardField } from './form-card-field';

describe('FormCardField', () => {
  let component: FormCardField;
  let fixture: ComponentFixture<FormCardField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
