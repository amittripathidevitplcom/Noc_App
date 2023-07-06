import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyAcademicInformationComponent } from './document-scrutiny-academic-information.component';

describe('DocumentScrutinyAcademicInformationComponent', () => {
  let component: DocumentScrutinyAcademicInformationComponent;
  let fixture: ComponentFixture<DocumentScrutinyAcademicInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyAcademicInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyAcademicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
