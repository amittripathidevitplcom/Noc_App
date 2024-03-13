import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficersDetailsComponent } from './officers-details.component';

describe('OfficersDetailsComponent', () => {
  let component: OfficersDetailsComponent;
  let fixture: ComponentFixture<OfficersDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfficersDetailsComponent]
    });
    fixture = TestBed.createComponent(OfficersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
