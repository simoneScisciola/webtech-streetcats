import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHeader } from './panel-header';

describe('PanelHeader', () => {
  let component: PanelHeader;
  let fixture: ComponentFixture<PanelHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
