import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSighting } from './add-sighting';

describe('AddSighting', () => {
  let component: AddSighting;
  let fixture: ComponentFixture<AddSighting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSighting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSighting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
