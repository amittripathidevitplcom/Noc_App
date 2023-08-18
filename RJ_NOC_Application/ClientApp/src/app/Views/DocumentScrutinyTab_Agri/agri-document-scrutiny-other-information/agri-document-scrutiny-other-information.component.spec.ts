import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyOtherInformationComponent } from './agri-document-scrutiny-other-information.component';

describe('AgriDocumentScrutinyOtherInformationComponent', () => {
  let component: AgriDocumentScrutinyOtherInformationComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyOtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyOtherInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyOtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
