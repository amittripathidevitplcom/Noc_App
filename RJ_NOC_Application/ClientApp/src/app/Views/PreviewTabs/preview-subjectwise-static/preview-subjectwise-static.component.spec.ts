import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSubjectwiseStaticComponent } from './preview-subjectwise-static.component';

describe('PreviewSubjectwiseStaticComponent', () => {
  let component: PreviewSubjectwiseStaticComponent;
  let fixture: ComponentFixture<PreviewSubjectwiseStaticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewSubjectwiseStaticComponent]
    });
    fixture = TestBed.createComponent(PreviewSubjectwiseStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
