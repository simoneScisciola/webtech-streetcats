import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardHeader } from './form-card-header';

describe('FormCardHeader', () => {
  let component: FormCardHeader;
  let fixture: ComponentFixture<FormCardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
