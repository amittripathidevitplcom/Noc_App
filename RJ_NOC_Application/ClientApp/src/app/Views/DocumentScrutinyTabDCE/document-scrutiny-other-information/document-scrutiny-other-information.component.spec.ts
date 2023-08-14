import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOtherInformationComponent } from './document-scrutiny-other-information.component';

describe('DocumentScrutinyOtherInformationComponent', () => {
  let component: DocumentScrutinyOtherInformationComponent;
  let fixture: ComponentFixture<DocumentScrutinyOtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyOtherInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyOtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
