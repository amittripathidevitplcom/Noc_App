import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyFarmLandDetailsComponent } from './agri-document-scrutiny-farm-land-details.component';

describe('AgriDocumentScrutinyFarmLandDetailsComponent', () => {
  let component: AgriDocumentScrutinyFarmLandDetailsComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyFarmLandDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyFarmLandDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyFarmLandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
