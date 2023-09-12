import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewApplyNocDetailComponent } from './preview-apply-noc-detail.component';

describe('PreviewApplyNocDetailComponent', () => {
  let component: PreviewApplyNocDetailComponent;
  let fixture: ComponentFixture<PreviewApplyNocDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewApplyNocDetailComponent]
    });
    fixture = TestBed.createComponent(PreviewApplyNocDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
