import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardBody } from './form-card-body';

describe('FormCardBody', () => {
  let component: FormCardBody;
  let fixture: ComponentFixture<FormCardBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardBody]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
