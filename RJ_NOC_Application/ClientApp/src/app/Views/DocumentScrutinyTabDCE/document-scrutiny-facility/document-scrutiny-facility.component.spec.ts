import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyFacilityComponent } from './document-scrutiny-facility.component';

describe('DocumentScrutinyFacilityComponent', () => {
  let component: DocumentScrutinyFacilityComponent;
  let fixture: ComponentFixture<DocumentScrutinyFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
