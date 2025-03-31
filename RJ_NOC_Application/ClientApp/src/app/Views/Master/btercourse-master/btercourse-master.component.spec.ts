import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERCourseMasterComponent } from './btercourse-master.component';

describe('BTERCourseMasterComponent', () => {
  let component: BTERCourseMasterComponent;
  let fixture: ComponentFixture<BTERCourseMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERCourseMasterComponent]
    });
    fixture = TestBed.createComponent(BTERCourseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
