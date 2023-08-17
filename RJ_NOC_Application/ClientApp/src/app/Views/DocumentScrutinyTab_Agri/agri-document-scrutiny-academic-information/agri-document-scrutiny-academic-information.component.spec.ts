import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyAcademicInformationComponent } from './agri-document-scrutiny-academic-information.component';

describe('AgriDocumentScrutinyAcademicInformationComponent', () => {
  let component: AgriDocumentScrutinyAcademicInformationComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyAcademicInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyAcademicInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyAcademicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
