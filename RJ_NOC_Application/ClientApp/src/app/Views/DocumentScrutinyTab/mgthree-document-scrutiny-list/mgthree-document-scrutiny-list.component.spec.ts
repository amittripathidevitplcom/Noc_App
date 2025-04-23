import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGThreeDocumentScrutinyListComponent } from './mgthree-document-scrutiny-list.component';

describe('MGThreeDocumentScrutinyListComponent', () => {
  let component: MGThreeDocumentScrutinyListComponent;
  let fixture: ComponentFixture<MGThreeDocumentScrutinyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGThreeDocumentScrutinyListComponent]
    });
    fixture = TestBed.createComponent(MGThreeDocumentScrutinyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
