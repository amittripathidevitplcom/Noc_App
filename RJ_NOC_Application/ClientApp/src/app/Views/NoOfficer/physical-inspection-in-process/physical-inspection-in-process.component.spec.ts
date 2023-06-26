import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalInspectionInProcessComponent } from './physical-inspection-in-process.component';

describe('PhysicalInspectionInProcessComponent', () => {
  let component: PhysicalInspectionInProcessComponent;
  let fixture: ComponentFixture<PhysicalInspectionInProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalInspectionInProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalInspectionInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
