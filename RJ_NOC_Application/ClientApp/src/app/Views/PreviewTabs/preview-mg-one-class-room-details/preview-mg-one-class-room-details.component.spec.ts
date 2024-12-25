import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMgOneClassRoomDetailsComponent } from './preview-mg-one-class-room-details.component';

describe('PreviewMgOneClassRoomDetailsComponent', () => {
  let component: PreviewMgOneClassRoomDetailsComponent;
  let fixture: ComponentFixture<PreviewMgOneClassRoomDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewMgOneClassRoomDetailsComponent]
    });
    fixture = TestBed.createComponent(PreviewMgOneClassRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
