import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyRoomDetailsComponent } from './ah-document-scrutiny-room-details.component';

describe('AhDocumentScrutinyRoomDetailsComponent', () => {
  let component: AhDocumentScrutinyRoomDetailsComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyRoomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyRoomDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
