import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCSecretaryListComponent } from './apply-nocsecretary-list.component';

describe('ApplyNOCSecretaryListComponent', () => {
  let component: ApplyNOCSecretaryListComponent;
  let fixture: ComponentFixture<ApplyNOCSecretaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCSecretaryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCSecretaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
