import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardDragAndDropImage } from '#shared/components/form-card/image-drag-and-drop/image-drag-and-drop';

describe('FormCardDragAndDropImage', () => {
  let component: FormCardDragAndDropImage;
  let fixture: ComponentFixture<FormCardDragAndDropImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardDragAndDropImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardDragAndDropImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
