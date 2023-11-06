import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedApplicationListComponent } from './forwarded-application-list.component';

describe('ForwardedApplicationListComponent', () => {
  let component: ForwardedApplicationListComponent;
  let fixture: ComponentFixture<ForwardedApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForwardedApplicationListComponent]
    });
    fixture = TestBed.createComponent(ForwardedApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
