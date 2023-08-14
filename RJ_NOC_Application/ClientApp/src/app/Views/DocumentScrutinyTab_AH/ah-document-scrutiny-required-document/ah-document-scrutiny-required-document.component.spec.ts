import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyRequiredDocumentComponent } from './ah-document-scrutiny-required-document.component';

describe('AhDocumentScrutinyRequiredDocumentComponent', () => {
  let component: AhDocumentScrutinyRequiredDocumentComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyRequiredDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyRequiredDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
