import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyRequiredDocumentComponent } from './mg1-document-scrutiny-required-document.component';

describe('MG1DocumentScrutinyRequiredDocumentComponent', () => {
  let component: MG1DocumentScrutinyRequiredDocumentComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyRequiredDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyRequiredDocumentComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
