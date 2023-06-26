import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrusteeGeneralInfoComponent } from './trustee-general-info.component';

describe('TrusteeGeneralInfoComponent', () => {
  let component: TrusteeGeneralInfoComponent;
  let fixture: ComponentFixture<TrusteeGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrusteeGeneralInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrusteeGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
