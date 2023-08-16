import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyStaffDetailComponent } from './ah-document-scrutiny-staff-detail.component';

describe('AhDocumentScrutinyStaffDetailComponent', () => {
  let component: AhDocumentScrutinyStaffDetailComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyStaffDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyStaffDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyStaffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
