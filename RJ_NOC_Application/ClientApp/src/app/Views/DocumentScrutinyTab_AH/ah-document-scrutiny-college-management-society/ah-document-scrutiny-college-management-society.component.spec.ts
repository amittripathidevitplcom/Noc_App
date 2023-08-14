import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyCollegeManagementSocietyComponent } from './ah-document-scrutiny-college-management-society.component';

describe('AhDocumentScrutinyCollegeManagementSocietyComponent', () => {
  let component: AhDocumentScrutinyCollegeManagementSocietyComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyCollegeManagementSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyCollegeManagementSocietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyCollegeManagementSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
