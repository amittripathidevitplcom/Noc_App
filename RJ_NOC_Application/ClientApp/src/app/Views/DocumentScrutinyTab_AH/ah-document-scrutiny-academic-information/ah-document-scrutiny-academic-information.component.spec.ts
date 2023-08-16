import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyAcademicInformationComponent } from './ah-document-scrutiny-academic-information.component';

describe('AhDocumentScrutinyAcademicInformationComponent', () => {
  let component: AhDocumentScrutinyAcademicInformationComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyAcademicInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyAcademicInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyAcademicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
