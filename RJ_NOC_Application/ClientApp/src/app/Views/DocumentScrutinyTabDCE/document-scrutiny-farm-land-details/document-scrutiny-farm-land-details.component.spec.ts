import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyFarmLandDetailsComponent } from './document-scrutiny-farm-land-details.component';

describe('DocumentScrutinyFarmLandDetailsComponent', () => {
  let component: DocumentScrutinyFarmLandDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyFarmLandDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyFarmLandDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyFarmLandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
