import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhApplyNocApplicationListComponent } from './ah-apply-noc-application-list.component';

describe('AhApplyNocApplicationListComponent', () => {
  let component: AhApplyNocApplicationListComponent;
  let fixture: ComponentFixture<AhApplyNocApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhApplyNocApplicationListComponent]
    });
    fixture = TestBed.createComponent(AhApplyNocApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
