import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertotherdetailsnocapplicationComponent } from './revertotherdetailsnocapplication.component';

describe('RevertotherdetailsnocapplicationComponent', () => {
  let component: RevertotherdetailsnocapplicationComponent;
  let fixture: ComponentFixture<RevertotherdetailsnocapplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertotherdetailsnocapplicationComponent]
    });
    fixture = TestBed.createComponent(RevertotherdetailsnocapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
