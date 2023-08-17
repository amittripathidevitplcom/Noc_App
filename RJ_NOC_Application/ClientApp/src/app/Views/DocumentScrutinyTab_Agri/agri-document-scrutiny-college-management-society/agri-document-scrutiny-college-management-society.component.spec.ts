import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyCollegeManagementSocietyComponent } from './agri-document-scrutiny-college-management-society.component';

describe('AgriDocumentScrutinyCollegeManagementSocietyComponent', () => {
  let component: AgriDocumentScrutinyCollegeManagementSocietyComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyCollegeManagementSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyCollegeManagementSocietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyCollegeManagementSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
