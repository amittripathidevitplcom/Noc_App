import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalChairsMgoneNocComponent } from './dental-chairs-mgone-noc.component';

describe('DentalChairsMgoneNocComponent', () => {
  let component: DentalChairsMgoneNocComponent;
  let fixture: ComponentFixture<DentalChairsMgoneNocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DentalChairsMgoneNocComponent]
    });
    fixture = TestBed.createComponent(DentalChairsMgoneNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
