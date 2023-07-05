import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCollegeComponent } from './preview-college.component';

describe('PreviewCollegeComponent', () => {
  let component: PreviewCollegeComponent;
  let fixture: ComponentFixture<PreviewCollegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewCollegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
