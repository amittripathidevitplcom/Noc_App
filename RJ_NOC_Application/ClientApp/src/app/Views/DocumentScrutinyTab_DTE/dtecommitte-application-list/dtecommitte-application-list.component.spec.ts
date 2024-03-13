import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTECommitteApplicationListComponent } from './dtecommitte-application-list.component';

describe('DTECommitteApplicationListComponent', () => {
  let component: DTECommitteApplicationListComponent;
  let fixture: ComponentFixture<DTECommitteApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTECommitteApplicationListComponent]
    });
    fixture = TestBed.createComponent(DTECommitteApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
