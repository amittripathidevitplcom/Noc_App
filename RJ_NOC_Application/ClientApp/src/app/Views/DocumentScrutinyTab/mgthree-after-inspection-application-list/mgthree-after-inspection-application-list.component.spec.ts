import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGThreeAfterInspectionApplicationListComponent } from './mgthree-after-inspection-application-list.component';

describe('MGThreeAfterInspectionApplicationListComponent', () => {
  let component: MGThreeAfterInspectionApplicationListComponent;
  let fixture: ComponentFixture<MGThreeAfterInspectionApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGThreeAfterInspectionApplicationListComponent]
    });
    fixture = TestBed.createComponent(MGThreeAfterInspectionApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
