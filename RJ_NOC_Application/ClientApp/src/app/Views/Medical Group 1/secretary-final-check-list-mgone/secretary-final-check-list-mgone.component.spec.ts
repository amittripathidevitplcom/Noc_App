import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryFinalCheckListMGOneComponent } from './secretary-final-check-list-mgone.component';

describe('SecretaryFinalCheckListMGOneComponent', () => {
  let component: SecretaryFinalCheckListMGOneComponent;
  let fixture: ComponentFixture<SecretaryFinalCheckListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretaryFinalCheckListMGOneComponent]
    });
    fixture = TestBed.createComponent(SecretaryFinalCheckListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
