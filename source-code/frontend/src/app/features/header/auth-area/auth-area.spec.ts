import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthArea } from './auth-area';

describe('AuthArea', () => {
  let component: AuthArea;
  let fixture: ComponentFixture<AuthArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
