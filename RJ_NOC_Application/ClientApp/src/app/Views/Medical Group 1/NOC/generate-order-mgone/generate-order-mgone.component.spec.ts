import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateOrderMGOneComponent } from './generate-order-mgone.component';

describe('GenerateOrderMGOneComponent', () => {
  let component: GenerateOrderMGOneComponent;
  let fixture: ComponentFixture<GenerateOrderMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateOrderMGOneComponent]
    });
    fixture = TestBed.createComponent(GenerateOrderMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
