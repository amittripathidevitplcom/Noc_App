import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewOtherInformationComponent } from './preview-other-information.component';

describe('PreviewOtherInformationComponent', () => {
  let component: PreviewOtherInformationComponent;
  let fixture: ComponentFixture<PreviewOtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewOtherInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewOtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
