import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmLandDetailsComponent } from './farm-land-details.component';

describe('FarmLandDetailsComponent', () => {
  let component: FarmLandDetailsComponent;
  let fixture: ComponentFixture<FarmLandDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmLandDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmLandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
