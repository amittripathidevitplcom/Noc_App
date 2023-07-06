import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeMasterComponent } from './committee-master.component';

describe('CommitteeMasterComponent', () => {
  let component: CommitteeMasterComponent;
  let fixture: ComponentFixture<CommitteeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
