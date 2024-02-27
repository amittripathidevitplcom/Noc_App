import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JDACCEApplicationListDCEComponent } from './jdacceapplication-list-dce.component';

describe('JDACCEApplicationListDCEComponent', () => {
  let component: JDACCEApplicationListDCEComponent;
  let fixture: ComponentFixture<JDACCEApplicationListDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JDACCEApplicationListDCEComponent]
    });
    fixture = TestBed.createComponent(JDACCEApplicationListDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
