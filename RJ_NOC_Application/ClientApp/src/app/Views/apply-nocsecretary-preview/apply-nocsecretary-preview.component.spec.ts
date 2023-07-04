import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCSecretaryPreviewComponent } from './apply-nocsecretary-preview.component';

describe('ApplyNOCSecretaryPreviewComponent', () => {
  let component: ApplyNOCSecretaryPreviewComponent;
  let fixture: ComponentFixture<ApplyNOCSecretaryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCSecretaryPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCSecretaryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
