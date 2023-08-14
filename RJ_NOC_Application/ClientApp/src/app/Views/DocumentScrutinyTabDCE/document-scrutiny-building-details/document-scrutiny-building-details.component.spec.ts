import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyBuildingDetailsComponent } from './document-scrutiny-building-details.component';

describe('DocumentScrutinyBuildingDetailsComponent', () => {
  let component: DocumentScrutinyBuildingDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyBuildingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyBuildingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyBuildingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
