import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriPSNocApplicationListComponent } from './agri-psnoc-application-list.component';

describe('AgriPSNocApplicationListComponent', () => {
  let component: AgriPSNocApplicationListComponent;
  let fixture: ComponentFixture<AgriPSNocApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriPSNocApplicationListComponent]
    });
    fixture = TestBed.createComponent(AgriPSNocApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
