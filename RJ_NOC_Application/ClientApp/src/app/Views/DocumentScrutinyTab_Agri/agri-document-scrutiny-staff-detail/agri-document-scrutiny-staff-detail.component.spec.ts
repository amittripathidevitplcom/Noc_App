import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyStaffDetailComponent } from './agri-document-scrutiny-staff-detail.component';

describe('AgriDocumentScrutinyStaffDetailComponent', () => {
  let component: AgriDocumentScrutinyStaffDetailComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyStaffDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyStaffDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyStaffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
