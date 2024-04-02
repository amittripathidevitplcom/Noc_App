import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulatoryInformationComponent } from './regulatory-information.component';

describe('RegulatoryInformationComponent', () => {
  let component: RegulatoryInformationComponent;
  let fixture: ComponentFixture<RegulatoryInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegulatoryInformationComponent]
    });
    fixture = TestBed.createComponent(RegulatoryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
