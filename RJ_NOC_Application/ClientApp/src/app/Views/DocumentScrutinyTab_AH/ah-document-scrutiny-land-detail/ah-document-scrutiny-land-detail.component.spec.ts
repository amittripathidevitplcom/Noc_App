import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyLandDetailComponent } from './ah-document-scrutiny-land-detail.component';

describe('AhDocumentScrutinyLandDetailComponent', () => {
  let component: AhDocumentScrutinyLandDetailComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyLandDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyLandDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyLandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
