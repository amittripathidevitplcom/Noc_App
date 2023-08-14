import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOldNOCDetailsComponent } from './document-scrutiny-old-nocdetails.component';

describe('DocumentScrutinyOldNOCDetailsComponent', () => {
  let component: DocumentScrutinyOldNOCDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyOldNOCDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyOldNOCDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyOldNOCDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
