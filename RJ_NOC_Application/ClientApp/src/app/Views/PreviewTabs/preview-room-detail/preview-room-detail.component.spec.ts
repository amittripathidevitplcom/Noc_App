import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRoomDetailComponent } from './preview-room-detail.component';

describe('PreviewRoomDetailComponent', () => {
  let component: PreviewRoomDetailComponent;
  let fixture: ComponentFixture<PreviewRoomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewRoomDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
