import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyRoomDetailsComponent } from './agri-document-scrutiny-room-details.component';

describe('AgriDocumentScrutinyRoomDetailsComponent', () => {
  let component: AgriDocumentScrutinyRoomDetailsComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyRoomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyRoomDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
