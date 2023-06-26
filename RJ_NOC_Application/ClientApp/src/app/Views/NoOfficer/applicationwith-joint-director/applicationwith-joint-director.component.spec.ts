import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationwithJointDirectorComponent } from './applicationwith-joint-director.component';

describe('ApplicationwithJointDirectorComponent', () => {
  let component: ApplicationwithJointDirectorComponent;
  let fixture: ComponentFixture<ApplicationwithJointDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationwithJointDirectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationwithJointDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
