import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertApplyNOCApplicationListComponent } from './revert-apply-nocapplication-list.component';

describe('RevertApplyNOCApplicationListComponent', () => {
  let component: RevertApplyNOCApplicationListComponent;
  let fixture: ComponentFixture<RevertApplyNOCApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevertApplyNOCApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertApplyNOCApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
