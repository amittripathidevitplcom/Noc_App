import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriPIForwardToCommiteeListComponent } from './agri-piforward-to-commitee-list.component';

describe('AgriPIForwardToCommiteeListComponent', () => {
  let component: AgriPIForwardToCommiteeListComponent;
  let fixture: ComponentFixture<AgriPIForwardToCommiteeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriPIForwardToCommiteeListComponent]
    });
    fixture = TestBed.createComponent(AgriPIForwardToCommiteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
