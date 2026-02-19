import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelBody } from './side-panel-body';

describe('SidePanelBody', () => {
  let component: SidePanelBody;
  let fixture: ComponentFixture<SidePanelBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelBody]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
