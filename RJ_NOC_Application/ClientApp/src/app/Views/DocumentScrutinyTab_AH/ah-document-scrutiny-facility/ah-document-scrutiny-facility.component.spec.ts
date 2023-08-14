import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyFacilityComponent } from './ah-document-scrutiny-facility.component';

describe('AhDocumentScrutinyFacilityComponent', () => {
  let component: AhDocumentScrutinyFacilityComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
