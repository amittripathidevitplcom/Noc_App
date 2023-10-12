import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDsForwardToCommiteeListComponent } from './agri-ds-forward-to-commitee-list.component';

describe('AgriDsForwardToCommiteeListComponent', () => {
  let component: AgriDsForwardToCommiteeListComponent;
  let fixture: ComponentFixture<AgriDsForwardToCommiteeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriDsForwardToCommiteeListComponent]
    });
    fixture = TestBed.createComponent(AgriDsForwardToCommiteeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
