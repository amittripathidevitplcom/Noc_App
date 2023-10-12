import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriApplyNocApplicationListComponent } from './agri-apply-noc-application-list.component';

describe('AgriApplyNocApplicationListComponent', () => {
  let component: AgriApplyNocApplicationListComponent;
  let fixture: ComponentFixture<AgriApplyNocApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriApplyNocApplicationListComponent]
    });
    fixture = TestBed.createComponent(AgriApplyNocApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
