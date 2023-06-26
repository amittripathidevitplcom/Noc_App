import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowMasterComponent } from './work-flow-master.component';

describe('WorkFlowMasterComponent', () => {
  let component: WorkFlowMasterComponent;
  let fixture: ComponentFixture<WorkFlowMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
