import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOnlinepaymentDetailsDceComponent } from './document-scrutiny-onlinepayment-details-dce.component';

describe('DocumentScrutinyOnlinepaymentDetailsDceComponent', () => {
  let component: DocumentScrutinyOnlinepaymentDetailsDceComponent;
  let fixture: ComponentFixture<DocumentScrutinyOnlinepaymentDetailsDceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyOnlinepaymentDetailsDceComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyOnlinepaymentDetailsDceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
