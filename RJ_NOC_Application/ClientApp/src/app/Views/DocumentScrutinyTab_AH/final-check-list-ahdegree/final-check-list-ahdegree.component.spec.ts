import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalCheckListAHDegreeComponent } from './final-check-list-ahdegree.component';

describe('FinalCheckListAHDegreeComponent', () => {
  let component: FinalCheckListAHDegreeComponent;
  let fixture: ComponentFixture<FinalCheckListAHDegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalCheckListAHDegreeComponent]
    });
    fixture = TestBed.createComponent(FinalCheckListAHDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
