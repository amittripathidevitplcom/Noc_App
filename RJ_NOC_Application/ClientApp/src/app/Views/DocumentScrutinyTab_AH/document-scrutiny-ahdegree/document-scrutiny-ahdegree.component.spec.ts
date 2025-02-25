import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyAHDegreeComponent } from './document-scrutiny-ahdegree.component';

describe('DocumentScrutinyAHDegreeComponent', () => {
  let component: DocumentScrutinyAHDegreeComponent;
  let fixture: ComponentFixture<DocumentScrutinyAHDegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyAHDegreeComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyAHDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
