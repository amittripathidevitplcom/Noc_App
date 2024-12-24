import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGOneClassRoomDetailsComponent } from './mgone-class-room-details.component';

describe('MGOneClassRoomDetailsComponent', () => {
  let component: MGOneClassRoomDetailsComponent;
  let fixture: ComponentFixture<MGOneClassRoomDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGOneClassRoomDetailsComponent]
    });
    fixture = TestBed.createComponent(MGOneClassRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
