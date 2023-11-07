import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOIFeeMasterComponent } from './loifee-master.component';

describe('LOIFeeMasterComponent', () => {
  let component: LOIFeeMasterComponent;
  let fixture: ComponentFixture<LOIFeeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LOIFeeMasterComponent]
    });
    fixture = TestBed.createComponent(LOIFeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
