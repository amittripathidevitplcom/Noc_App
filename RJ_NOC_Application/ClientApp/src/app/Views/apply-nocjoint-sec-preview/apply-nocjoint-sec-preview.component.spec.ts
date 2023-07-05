import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCJointSecPreviewComponent } from './apply-nocjoint-sec-preview.component';

describe('ApplyNOCJointSecPreviewComponent', () => {
  let component: ApplyNOCJointSecPreviewComponent;
  let fixture: ComponentFixture<ApplyNOCJointSecPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCJointSecPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCJointSecPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
