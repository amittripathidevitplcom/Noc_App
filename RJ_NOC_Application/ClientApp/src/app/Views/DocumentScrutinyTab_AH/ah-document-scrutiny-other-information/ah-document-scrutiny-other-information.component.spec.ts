import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyOtherInformationComponent } from './ah-document-scrutiny-other-information.component';

describe('AhDocumentScrutinyOtherInformationComponent', () => {
  let component: AhDocumentScrutinyOtherInformationComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyOtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyOtherInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyOtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
