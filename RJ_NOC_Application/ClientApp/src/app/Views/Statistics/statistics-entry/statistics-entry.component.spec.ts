import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsEntryComponent } from './statistics-entry.component';

describe('StatisticsEntryComponent', () => {
  let component: StatisticsEntryComponent;
  let fixture: ComponentFixture<StatisticsEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsEntryComponent]
    });
    fixture = TestBed.createComponent(StatisticsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
