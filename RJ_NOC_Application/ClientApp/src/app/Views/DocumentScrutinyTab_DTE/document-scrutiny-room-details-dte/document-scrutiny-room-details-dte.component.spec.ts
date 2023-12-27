import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyRoomDetailsDTEComponent } from './document-scrutiny-room-details-dte.component';

describe('DocumentScrutinyRoomDetailsDTEComponent', () => {
  let component: DocumentScrutinyRoomDetailsDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyRoomDetailsDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyRoomDetailsDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyRoomDetailsDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
