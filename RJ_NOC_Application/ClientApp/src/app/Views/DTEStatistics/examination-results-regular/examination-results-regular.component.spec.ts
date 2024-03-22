import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationResultsRegularComponent } from './examination-results-regular.component';

describe('ExaminationResultsRegularComponent', () => {
  let component: ExaminationResultsRegularComponent;
  let fixture: ComponentFixture<ExaminationResultsRegularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminationResultsRegularComponent]
    });
    fixture = TestBed.createComponent(ExaminationResultsRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
