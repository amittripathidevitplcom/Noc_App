import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NOCIssuedComponent } from './nocissued.component';

describe('NOCIssuedComponent', () => {
  let component: NOCIssuedComponent;
  let fixture: ComponentFixture<NOCIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NOCIssuedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NOCIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
