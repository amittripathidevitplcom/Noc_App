import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyLandDetailComponent } from './document-scrutiny-land-detail.component';

describe('DocumentScrutinyLandDetailComponent', () => {
  let component: DocumentScrutinyLandDetailComponent;
  let fixture: ComponentFixture<DocumentScrutinyLandDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyLandDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyLandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
