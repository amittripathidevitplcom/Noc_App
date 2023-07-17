import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommiteeInspectionComponent } from './commitee-inspection.component';

describe('CommiteeInspectionComponent', () => {
  let component: CommiteeInspectionComponent;
  let fixture: ComponentFixture<CommiteeInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommiteeInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommiteeInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
