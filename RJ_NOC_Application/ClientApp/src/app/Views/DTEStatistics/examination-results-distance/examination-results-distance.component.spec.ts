import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationResultsDistanceComponent } from './examination-results-distance.component';

describe('ExaminationResultsDistanceComponent', () => {
  let component: ExaminationResultsDistanceComponent;
  let fixture: ComponentFixture<ExaminationResultsDistanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminationResultsDistanceComponent]
    });
    fixture = TestBed.createComponent(ExaminationResultsDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
