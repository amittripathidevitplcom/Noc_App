import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEStatisticsNonTeachingComponent } from './dtestatistics-non-teaching.component';

describe('DTEStatisticsNonTeachingComponent', () => {
  let component: DTEStatisticsNonTeachingComponent;
  let fixture: ComponentFixture<DTEStatisticsNonTeachingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEStatisticsNonTeachingComponent]
    });
    fixture = TestBed.createComponent(DTEStatisticsNonTeachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
