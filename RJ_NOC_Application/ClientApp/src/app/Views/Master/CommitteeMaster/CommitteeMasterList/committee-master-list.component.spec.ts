import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowMasterListComponent } from './work-flow-master-list.component';

describe('WorkFlowMasterListComponent', () => {
  let component: WorkFlowMasterListComponent;
  let fixture: ComponentFixture<WorkFlowMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
