import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationListAHDegreeComponent } from './application-list-ahdegree.component';

describe('ApplicationListAHDegreeComponent', () => {
  let component: ApplicationListAHDegreeComponent;
  let fixture: ComponentFixture<ApplicationListAHDegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationListAHDegreeComponent]
    });
    fixture = TestBed.createComponent(ApplicationListAHDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
