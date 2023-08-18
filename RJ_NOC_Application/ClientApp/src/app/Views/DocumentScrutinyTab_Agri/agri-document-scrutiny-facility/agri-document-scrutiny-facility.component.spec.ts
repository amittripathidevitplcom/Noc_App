import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyFacilityComponent } from './agri-document-scrutiny-facility.component';

describe('AgriDocumentScrutinyFacilityComponent', () => {
  let component: AgriDocumentScrutinyFacilityComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
