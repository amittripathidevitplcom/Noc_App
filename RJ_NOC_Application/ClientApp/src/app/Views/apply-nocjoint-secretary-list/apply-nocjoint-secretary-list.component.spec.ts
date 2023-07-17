import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCJointSecretaryListComponent } from './apply-nocjoint-secretary-list.component';

describe('ApplyNOCJointSecretaryListComponent', () => {
  let component: ApplyNOCJointSecretaryListComponent;
  let fixture: ComponentFixture<ApplyNOCJointSecretaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCJointSecretaryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCJointSecretaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
