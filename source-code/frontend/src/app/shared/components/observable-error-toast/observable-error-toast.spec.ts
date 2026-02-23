import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableErrorToast } from './observable-error-toast';

describe('ObservableErrorToast', () => {
  let component: ObservableErrorToast;
  let fixture: ComponentFixture<ObservableErrorToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservableErrorToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservableErrorToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
