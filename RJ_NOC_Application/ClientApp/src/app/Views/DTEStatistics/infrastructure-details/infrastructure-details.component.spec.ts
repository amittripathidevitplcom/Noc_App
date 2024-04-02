import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureDetailsComponent } from './infrastructure-details.component';

describe('InfrastructureDetailsComponent', () => {
  let component: InfrastructureDetailsComponent;
  let fixture: ComponentFixture<InfrastructureDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfrastructureDetailsComponent]
    });
    fixture = TestBed.createComponent(InfrastructureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
