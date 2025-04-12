import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignSuccessComponent } from './esign-success.component';

describe('EsignSuccessComponent', () => {
  let component: EsignSuccessComponent;
  let fixture: ComponentFixture<EsignSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsignSuccessComponent]
    });
    fixture = TestBed.createComponent(EsignSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
