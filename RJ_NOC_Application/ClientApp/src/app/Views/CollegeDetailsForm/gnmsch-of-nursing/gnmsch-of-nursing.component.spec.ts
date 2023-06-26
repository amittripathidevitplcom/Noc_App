import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GNMSchOfNursingComponent } from './gnmsch-of-nursing.component';

describe('GNMSchOfNursingComponent', () => {
  let component: GNMSchOfNursingComponent;
  let fixture: ComponentFixture<GNMSchOfNursingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GNMSchOfNursingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GNMSchOfNursingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
