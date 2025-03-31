import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResubmitApplicationlistComponent } from './resubmit-applicationlist.component';

describe('ResubmitApplicationlistComponent', () => {
  let component: ResubmitApplicationlistComponent;
  let fixture: ComponentFixture<ResubmitApplicationlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResubmitApplicationlistComponent]
    });
    fixture = TestBed.createComponent(ResubmitApplicationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
