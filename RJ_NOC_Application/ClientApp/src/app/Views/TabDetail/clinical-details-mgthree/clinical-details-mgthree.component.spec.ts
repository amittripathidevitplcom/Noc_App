import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalDetailsMGThreeComponent } from './clinical-details-mgthree.component';

describe('ClinicalDetailsMGThreeComponent', () => {
  let component: ClinicalDetailsMGThreeComponent;
  let fixture: ComponentFixture<ClinicalDetailsMGThreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicalDetailsMGThreeComponent]
    });
    fixture = TestBed.createComponent(ClinicalDetailsMGThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
