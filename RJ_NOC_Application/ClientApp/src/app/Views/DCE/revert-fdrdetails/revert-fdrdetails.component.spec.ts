import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertFDRDetailsComponent } from './revert-fdrdetails.component';

describe('RevertFDRDetailsComponent', () => {
  let component: RevertFDRDetailsComponent;
  let fixture: ComponentFixture<RevertFDRDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertFDRDetailsComponent]
    });
    fixture = TestBed.createComponent(RevertFDRDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
