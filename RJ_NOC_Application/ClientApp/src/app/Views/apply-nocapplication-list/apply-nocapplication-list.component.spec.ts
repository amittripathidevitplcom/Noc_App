import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCApplicationListComponent } from './apply-nocapplication-list.component';

describe('ApplyNOCApplicationListComponent', () => {
  let component: ApplyNOCApplicationListComponent;
  let fixture: ComponentFixture<ApplyNOCApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
