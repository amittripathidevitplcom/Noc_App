import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MScNursingProgrammeComponent } from './msc-nursing-programme.component';

describe('MScNursingProgrammeComponent', () => {
  let component: MScNursingProgrammeComponent;
  let fixture: ComponentFixture<MScNursingProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MScNursingProgrammeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MScNursingProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
