import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyLandDetailComponent } from './agri-document-scrutiny-land-detail.component';

describe('AgriDocumentScrutinyLandDetailComponent', () => {
  let component: AgriDocumentScrutinyLandDetailComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyLandDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyLandDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyLandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
