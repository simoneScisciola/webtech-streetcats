import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelHeader } from './side-panel-header';

describe('SidePanelHeader', () => {
  let component: SidePanelHeader;
  let fixture: ComponentFixture<SidePanelHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
