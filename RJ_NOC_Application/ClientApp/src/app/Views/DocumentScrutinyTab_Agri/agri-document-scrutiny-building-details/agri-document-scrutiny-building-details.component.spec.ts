import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyBuildingDetailsComponent } from './agri-document-scrutiny-building-details.component';

describe('AgriDocumentScrutinyBuildingDetailsComponent', () => {
  let component: AgriDocumentScrutinyBuildingDetailsComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyBuildingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyBuildingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyBuildingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
