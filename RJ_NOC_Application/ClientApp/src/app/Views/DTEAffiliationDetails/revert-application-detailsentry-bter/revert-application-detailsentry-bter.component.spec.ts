import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertApplicationDetailsentryBTERComponent } from './revert-application-detailsentry-bter.component';

describe('RevertApplicationDetailsentryBTERComponent', () => {
  let component: RevertApplicationDetailsentryBTERComponent;
  let fixture: ComponentFixture<RevertApplicationDetailsentryBTERComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertApplicationDetailsentryBTERComponent]
    });
    fixture = TestBed.createComponent(RevertApplicationDetailsentryBTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
