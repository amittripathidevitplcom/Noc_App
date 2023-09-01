import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhFinalNocApplicationListComponent } from './ah-final-noc-application-list.component';

describe('AhFinalNocApplicationListComponent', () => {
  let component: AhFinalNocApplicationListComponent;
  let fixture: ComponentFixture<AhFinalNocApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhFinalNocApplicationListComponent]
    });
    fixture = TestBed.createComponent(AhFinalNocApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
