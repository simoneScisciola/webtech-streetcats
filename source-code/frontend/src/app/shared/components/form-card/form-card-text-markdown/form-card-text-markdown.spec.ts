import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardTextMarkdown } from './form-card-text-markdown';

describe('FormCardTextMarkdown', () => {
  let component: FormCardTextMarkdown;
  let fixture: ComponentFixture<FormCardTextMarkdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardTextMarkdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardTextMarkdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
