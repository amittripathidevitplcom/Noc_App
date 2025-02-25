import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeNOCApplicationsComponent } from './degree-nocapplications.component';

describe('DegreeNOCApplicationsComponent', () => {
  let component: DegreeNOCApplicationsComponent;
  let fixture: ComponentFixture<DegreeNOCApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreeNOCApplicationsComponent]
    });
    fixture = TestBed.createComponent(DegreeNOCApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
