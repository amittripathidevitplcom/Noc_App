import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyRoomDetailsComponent } from './document-scrutiny-room-details.component';

describe('DocumentScrutinyRoomDetailsComponent', () => {
  let component: DocumentScrutinyRoomDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyRoomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyRoomDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
