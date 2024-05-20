import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedRoomDetailComponent } from './bed-room-detail.component';

describe('BedRoomDetailComponent', () => {
  let component: BedRoomDetailComponent;
  let fixture: ComponentFixture<BedRoomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BedRoomDetailComponent]
    });
    fixture = TestBed.createComponent(BedRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
