import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyOldNocdetailsComponent } from './agri-document-scrutiny-old-nocdetails.component';

describe('AgriDocumentScrutinyOldNocdetailsComponent', () => {
  let component: AgriDocumentScrutinyOldNocdetailsComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyOldNocdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyOldNocdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyOldNocdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
