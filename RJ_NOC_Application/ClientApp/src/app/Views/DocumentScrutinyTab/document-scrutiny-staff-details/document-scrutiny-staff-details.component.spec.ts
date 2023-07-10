import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyStaffDetailsComponent } from './document-scrutiny-staff-details.component';

describe('DocumentScrutinyStaffDetailsComponent', () => {
  let component: DocumentScrutinyStaffDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyStaffDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyStaffDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyStaffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
