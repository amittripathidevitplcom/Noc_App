import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyCollegeDetailComponent } from './mg1-document-scrutiny-college-detail.component';

describe('MG1DocumentScrutinyCollegeDetailComponent', () => {
  let component: MG1DocumentScrutinyCollegeDetailComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyCollegeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyCollegeDetailComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyCollegeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
