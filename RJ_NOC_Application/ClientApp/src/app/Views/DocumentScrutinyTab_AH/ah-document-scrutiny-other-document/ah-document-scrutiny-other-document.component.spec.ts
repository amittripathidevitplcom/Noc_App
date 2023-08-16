import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyOtherDocumentComponent } from './ah-document-scrutiny-other-document.component';

describe('AhDocumentScrutinyOtherDocumentComponent', () => {
  let component: AhDocumentScrutinyOtherDocumentComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyOtherDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyOtherDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyOtherDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
