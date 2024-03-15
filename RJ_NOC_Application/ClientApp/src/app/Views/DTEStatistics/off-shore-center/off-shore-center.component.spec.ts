import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffShoreCenterComponent } from './off-shore-center.component';

describe('OffShoreCenterComponent', () => {
  let component: OffShoreCenterComponent;
  let fixture: ComponentFixture<OffShoreCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffShoreCenterComponent]
    });
    fixture = TestBed.createComponent(OffShoreCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
