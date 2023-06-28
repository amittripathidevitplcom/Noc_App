import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAcademicInformationComponent } from './preview-academic-information.component';

describe('PreviewAcademicInformationComponent', () => {
  let component: PreviewAcademicInformationComponent;
  let fixture: ComponentFixture<PreviewAcademicInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewAcademicInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAcademicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
