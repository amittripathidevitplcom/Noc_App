import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCollegeManagementSocietyComponent } from './document-scrutiny-college-management-society.component';

describe('DocumentScrutinyCollegeManagementSocietyComponent', () => {
  let component: DocumentScrutinyCollegeManagementSocietyComponent;
  let fixture: ComponentFixture<DocumentScrutinyCollegeManagementSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyCollegeManagementSocietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyCollegeManagementSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
