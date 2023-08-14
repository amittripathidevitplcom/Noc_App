import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyOldNocdetailsComponent } from './ah-document-scrutiny-old-nocdetails.component';

describe('AhDocumentScrutinyOldNocdetailsComponent', () => {
  let component: AhDocumentScrutinyOldNocdetailsComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyOldNocdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyOldNocdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyOldNocdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
