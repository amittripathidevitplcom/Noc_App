import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtcoursemasterComponent } from './dtcoursemaster.component';

describe('DtcoursemasterComponent', () => {
  let component: DtcoursemasterComponent;
  let fixture: ComponentFixture<DtcoursemasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DtcoursemasterComponent]
    });
    fixture = TestBed.createComponent(DtcoursemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
