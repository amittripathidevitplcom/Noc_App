import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTrusteeGeneralInfoComponent } from './preview-trustee-general-info.component';

describe('PreviewTrusteeGeneralInfoComponent', () => {
  let component: PreviewTrusteeGeneralInfoComponent;
  let fixture: ComponentFixture<PreviewTrusteeGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewTrusteeGeneralInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTrusteeGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
