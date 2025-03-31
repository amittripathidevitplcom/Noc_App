import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertotherdetailsapplicationComponent } from './revertotherdetailsapplication.component';

describe('RevertotherdetailsapplicationComponent', () => {
  let component: RevertotherdetailsapplicationComponent;
  let fixture: ComponentFixture<RevertotherdetailsapplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertotherdetailsapplicationComponent]
    });
    fixture = TestBed.createComponent(RevertotherdetailsapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
