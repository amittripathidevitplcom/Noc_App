import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowFormat3Component } from './work-flow-format3.component';

describe('WorkFlowFormat3Component', () => {
  let component: WorkFlowFormat3Component;
  let fixture: ComponentFixture<WorkFlowFormat3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkFlowFormat3Component]
    });
    fixture = TestBed.createComponent(WorkFlowFormat3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
