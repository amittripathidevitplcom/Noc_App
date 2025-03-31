import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERDocumentScrutinyComponent } from './bterdocument-scrutiny.component';

describe('BTERDocumentScrutinyComponent', () => {
  let component: BTERDocumentScrutinyComponent;
  let fixture: ComponentFixture<BTERDocumentScrutinyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERDocumentScrutinyComponent]
    });
    fixture = TestBed.createComponent(BTERDocumentScrutinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
