import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFarmLandDetailsComponent } from './preview-farm-land-details.component';

describe('PreviewFarmLandDetailsComponent', () => {
  let component: PreviewFarmLandDetailsComponent;
  let fixture: ComponentFixture<PreviewFarmLandDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewFarmLandDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewFarmLandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
