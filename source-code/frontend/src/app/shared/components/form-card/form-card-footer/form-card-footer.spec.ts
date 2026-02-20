import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardFooter } from './form-card-footer';

describe('FormCardFooter', () => {
  let component: FormCardFooter;
  let fixture: ComponentFixture<FormCardFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
