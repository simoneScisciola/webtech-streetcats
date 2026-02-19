import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelFooter } from './side-panel-footer';

describe('SidePanelFooter', () => {
  let component: SidePanelFooter;
  let fixture: ComponentFixture<SidePanelFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
