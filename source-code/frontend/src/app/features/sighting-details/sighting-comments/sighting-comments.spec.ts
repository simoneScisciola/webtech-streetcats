import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingComments } from './sighting-comments';

describe('SightingComments', () => {
  let component: SightingComments;
  let fixture: ComponentFixture<SightingComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
