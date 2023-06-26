import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GNMSchoolOfNursingComponent } from './gnmschool-of-nursing.component';

describe('GNMSchoolOfNursingComponent', () => {
  let component: GNMSchoolOfNursingComponent;
  let fixture: ComponentFixture<GNMSchoolOfNursingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GNMSchoolOfNursingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GNMSchoolOfNursingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
