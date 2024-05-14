import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BEDApplicationEntryComponent } from './bedapplication-entry.component';

describe('BEDApplicationEntryComponent', () => {
  let component: BEDApplicationEntryComponent;
  let fixture: ComponentFixture<BEDApplicationEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BEDApplicationEntryComponent]
    });
    fixture = TestBed.createComponent(BEDApplicationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
