import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyBuildingDetailsComponent } from './ah-document-scrutiny-building-details.component';

describe('AhDocumentScrutinyBuildingDetailsComponent', () => {
  let component: AhDocumentScrutinyBuildingDetailsComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyBuildingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyBuildingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyBuildingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
