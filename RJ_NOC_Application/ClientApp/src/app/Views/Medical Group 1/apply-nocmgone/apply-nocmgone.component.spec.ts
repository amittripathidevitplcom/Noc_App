import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCMGOneComponent } from './apply-nocmgone.component';

describe('ApplyNOCMGOneComponent', () => {
  let component: ApplyNOCMGOneComponent;
  let fixture: ComponentFixture<ApplyNOCMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyNOCMGOneComponent]
    });
    fixture = TestBed.createComponent(ApplyNOCMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
