import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedApplicationComponent } from './submitted-application.component';

describe('SubmittedApplicationComponent', () => {
  let component: SubmittedApplicationComponent;
  let fixture: ComponentFixture<SubmittedApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittedApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
