import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevoiusYearApplicationsComponent } from './prevoius-year-applications.component';

describe('PrevoiusYearApplicationsComponent', () => {
  let component: PrevoiusYearApplicationsComponent;
  let fixture: ComponentFixture<PrevoiusYearApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrevoiusYearApplicationsComponent]
    });
    fixture = TestBed.createComponent(PrevoiusYearApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
