import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDTEAffiliationOtherDetailsComponent } from './preview-dteaffiliation-other-details.component';

describe('PreviewDTEAffiliationOtherDetailsComponent', () => {
  let component: PreviewDTEAffiliationOtherDetailsComponent;
  let fixture: ComponentFixture<PreviewDTEAffiliationOtherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewDTEAffiliationOtherDetailsComponent]
    });
    fixture = TestBed.createComponent(PreviewDTEAffiliationOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
