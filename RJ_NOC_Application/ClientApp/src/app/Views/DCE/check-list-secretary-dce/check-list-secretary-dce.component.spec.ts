import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListSecretaryDCEComponent } from './check-list-secretary-dce.component';

describe('CheckListSecretaryDCEComponent', () => {
  let component: CheckListSecretaryDCEComponent;
  let fixture: ComponentFixture<CheckListSecretaryDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckListSecretaryDCEComponent]
    });
    fixture = TestBed.createComponent(CheckListSecretaryDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
