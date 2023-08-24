import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyForwardCommetteComponent } from './ah-document-scrutiny-forward-commette.component';

describe('AhDocumentScrutinyForwardCommetteComponent', () => {
  let component: AhDocumentScrutinyForwardCommetteComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyForwardCommetteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhDocumentScrutinyForwardCommetteComponent]
    });
    fixture = TestBed.createComponent(AhDocumentScrutinyForwardCommetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
